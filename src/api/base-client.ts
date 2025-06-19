// Base API client with authentication and core request handling

import fetch, { RequestInit, Response } from 'node-fetch';
import { CakemailConfig, CakemailToken } from '../types/cakemail-types.js';
import { 
  CakemailError as CakemailApiError,
  CakemailAuthenticationError,
  CakemailNetworkError,
  createCakemailError
} from '../types/errors.js';
import {
  RetryManager,
  RateLimiter,
  CircuitBreaker,
  RequestQueue,
  withTimeout,
  RetryConfig,
  RateLimitConfig,
  DEFAULT_RATE_LIMIT_CONFIG
} from '../types/retry.js';

export interface EnhancedCakemailConfig extends CakemailConfig {
  retry?: Partial<RetryConfig>;
  rateLimit?: Partial<RateLimitConfig>;
  timeout?: number; // milliseconds
  maxConcurrentRequests?: number;
  circuitBreaker?: {
    enabled: boolean;
    failureThreshold: number;
    resetTimeout: number;
  };
}

export class BaseApiClient {
  protected config: EnhancedCakemailConfig;
  protected token: CakemailToken | null = null;
  protected tokenExpiry: Date | null = null;
  protected baseUrl: string;
  protected debugMode: boolean;
  protected currentAccountId: number | null = null;
  
  // Rate limiting and retry components
  protected retryManager: RetryManager;
  protected rateLimiter: RateLimiter | null = null;
  protected circuitBreaker: CircuitBreaker | null = null;
  protected requestQueue: RequestQueue;
  protected timeout: number;

  constructor(config: EnhancedCakemailConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.cakemail.dev';
    this.debugMode = config.debug || process.env.CAKEMAIL_DEBUG === 'true';
    this.timeout = config.timeout || 30000; // 30 second default timeout
    
    // Initialize retry manager
    this.retryManager = new RetryManager(config.retry, this.debugMode);
    
    // Initialize rate limiter if enabled
    const rateLimitConfig = { ...DEFAULT_RATE_LIMIT_CONFIG, ...config.rateLimit };
    if (rateLimitConfig.enabled) {
      this.rateLimiter = new RateLimiter(rateLimitConfig);
    }
    
    // Initialize circuit breaker if enabled
    const circuitBreakerConfig = {
      enabled: false, // Default to disabled unless explicitly enabled
      failureThreshold: 5,
      resetTimeout: 60000,
      ...config.circuitBreaker
    };
    if (circuitBreakerConfig.enabled) {
      this.circuitBreaker = new CircuitBreaker(
        circuitBreakerConfig.failureThreshold,
        circuitBreakerConfig.resetTimeout,
        this.debugMode
      );
    }
    
    // Initialize request queue
    this.requestQueue = new RequestQueue(config.maxConcurrentRequests || 10);
  }

  async authenticate(): Promise<void> {
    // Try refresh token first if available and not expired
    if (this.token?.refresh_token && this.tokenExpiry && new Date() < new Date(this.tokenExpiry.getTime() - 300000)) {
      try {
        await this.refreshToken();
        return;
      } catch (error) {
        if (this.debugMode) {
          console.warn('Refresh token failed, falling back to password authentication');
        }
      }
    }

    // Password authentication
    try {
      const response = await fetch(`${this.baseUrl}/token`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: this.config.username,
          password: this.config.password
        }).toString()
      });

      if (!response.ok) {
        const errorBody = await this.parseErrorResponse(response);
        throw new CakemailAuthenticationError(
          `Authentication failed (${response.status}): ${errorBody?.error_description || errorBody?.message || errorBody?.error || response.statusText}`,
          errorBody
        );
      }

      const tokenData = await response.json() as CakemailToken;
      this.token = tokenData;
      this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000) - 60000); // 1 minute buffer
    } catch (error) {
      if (error instanceof CakemailAuthenticationError) {
        throw error;
      }
      throw new CakemailNetworkError('Failed to authenticate due to network error', error as Error);
    }
  }

  private async refreshToken(): Promise<void> {
    if (!this.token?.refresh_token) {
      throw new CakemailAuthenticationError('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/token`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.token.refresh_token
        }).toString()
      });

      if (!response.ok) {
        const errorBody = await this.parseErrorResponse(response);
        throw new CakemailAuthenticationError(
          `Token refresh failed (${response.status}): ${response.statusText}`,
          errorBody
        );
      }

      const tokenData = await response.json() as CakemailToken;
      this.token = tokenData;
      this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000) - 60000);
    } catch (error) {
      if (error instanceof CakemailAuthenticationError) {
        throw error;
      }
      throw new CakemailNetworkError('Failed to refresh token due to network error', error as Error);
    }
  }

  // Helper method to parse error responses consistently
  private async parseErrorResponse(response: Response): Promise<any> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
          return { detail: text || response.statusText };
        }
      }
    } catch {
      return { detail: response.statusText };
    }
  }

  protected async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const operation = async () => {
      // Apply rate limiting
      if (this.rateLimiter) {
        await this.rateLimiter.acquire();
      }
      
      return this.executeRequest(endpoint, options);
    };
    
    // Add to request queue to manage concurrency
    return this.requestQueue.add(async () => {
      // Apply circuit breaker if enabled
      if (this.circuitBreaker) {
        return this.circuitBreaker.execute(
          () => this.retryManager.executeWithRetry(operation, `${options.method || 'GET'} ${endpoint}`),
          `API request to ${endpoint}`
        );
      } else {
        return this.retryManager.executeWithRetry(operation, `${options.method || 'GET'} ${endpoint}`);
      }
    });
  }
  
  private async executeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    await this.authenticate();

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.token!.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';

    if (this.debugMode) {
      console.log(`[Cakemail API] ${method} ${url}`);
      if (options.body) {
        console.log(`[Cakemail API] Request body:`, options.body);
      }
    }

    // Add timeout to the request
    const fetchPromise = fetch(url, {
      ...options,
      headers
    });
    
    const response = await withTimeout(
      fetchPromise, 
      this.timeout, 
      `Request to ${endpoint} timed out after ${this.timeout}ms`
    );

    if (this.debugMode) {
      console.log(`[Cakemail API] Response: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      const errorBody = await this.parseErrorResponse(response);
      
      if (this.debugMode) {
        console.error(`[Cakemail API] Error response:`, {
          status: response.status,
          statusText: response.statusText,
          endpoint: `${method} ${endpoint}`,
          errorBody
        });
      }
      
      throw createCakemailError(response, errorBody);
    }

    // Handle empty responses (like DELETE operations)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      
      if (this.debugMode) {
        console.log(`[Cakemail API] Response data:`, {
          hasData: !!(result as any).data,
          dataType: typeof (result as any).data,
          dataLength: Array.isArray((result as any).data) ? (result as any).data.length : 'N/A',
          pagination: (result as any).pagination || 'None'
        });
      }
      
      return result;
    }
    
    return { success: true, status: response.status };
  }

  // Get current account ID for proper scoping
  protected async getCurrentAccountId(): Promise<number | undefined> {
    if (this.currentAccountId) {
      return this.currentAccountId;
    }

    try {
      const account = await this.makeRequest('/accounts/self');
      this.currentAccountId = account.data?.id || null;
      return this.currentAccountId || undefined;
    } catch (error: any) {
      if (this.debugMode) {
        console.warn('[Cakemail API] Could not fetch account ID:', error.message);
      }
      return undefined;
    }
  }

  // Utility methods
  protected isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  protected isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  }

  // Enhanced health check with proper error handling and retry logic
  async healthCheck() {
    try {
      // Test account access with retry logic
      const account = await this.makeRequest('/accounts/self');
      
      // Get component status for debugging
      const componentStatus = {
        retryManager: this.retryManager.getConfig(),
        rateLimiter: this.rateLimiter ? 'enabled' : 'disabled',
        circuitBreaker: this.circuitBreaker ? this.circuitBreaker.getState() : 'disabled',
        requestQueue: this.requestQueue.getStats(),
        timeout: this.timeout
      };
      
      return { 
        status: 'healthy', 
        authenticated: true,
        accountId: account.data?.id,
        apiCompliance: 'v1.18.25',
        components: componentStatus
      };
    } catch (error: any) {
      if (error instanceof CakemailApiError) {
        return { 
          status: 'unhealthy', 
          error: error.message,
          errorType: error.name,
          statusCode: error.statusCode,
          authenticated: error.statusCode !== 401,
          components: {
            circuitBreaker: this.circuitBreaker ? this.circuitBreaker.getState() : 'disabled',
            requestQueue: this.requestQueue.getStats()
          }
        };
      }
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { 
        status: 'unhealthy', 
        error: errorMessage,
        errorType: 'UnknownError',
        authenticated: false,
        components: {
          circuitBreaker: this.circuitBreaker ? this.circuitBreaker.getState() : 'disabled',
          requestQueue: this.requestQueue.getStats()
        }
      };
    }
  }
  
  // Methods to configure retry and rate limiting at runtime
  updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryManager.updateConfig(config);
  }
  
  getRetryConfig(): RetryConfig {
    return this.retryManager.getConfig();
  }
  
  getCircuitBreakerState() {
    return this.circuitBreaker ? this.circuitBreaker.getState() : null;
  }
  
  getRequestQueueStats() {
    return this.requestQueue.getStats();
  }
}
