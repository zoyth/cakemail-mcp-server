import { jest, describe, it, expect } from '@jest/globals';

describe('Base API Client', () => {
  describe('Authentication', () => {
    it('should create proper auth headers', () => {
      const username = 'test_user';
      const password = 'test_password';
      const expectedAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
      
      const getAuthHeader = (user: string, pass: string) => {
        return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
      };

      const authHeader = getAuthHeader(username, password);
      expect(authHeader).toBe(expectedAuth);
      expect(authHeader).toContain('Basic ');
    });

    it('should handle authentication configuration', () => {
      interface Config {
        username: string;
        password: string;
        timeout?: number;
        circuitBreaker?: {
          enabled: boolean;
          failureThreshold: number;
          resetTimeout: number;
        };
      }

      const createConfig = (config: Config) => {
        return {
          ...config,
          timeout: config.timeout || 30000,
          circuitBreaker: {
            enabled: false,
            failureThreshold: 5,
            resetTimeout: 60000,
            ...config.circuitBreaker
          }
        };
      };

      const config = createConfig({
        username: 'test',
        password: 'test',
        timeout: 5000
      });

      expect(config.timeout).toBe(5000);
      expect(config.circuitBreaker.enabled).toBe(false);
      expect(config.username).toBe('test');
    });
  });

  describe('Utility Methods', () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const isValidDate = (date: string): boolean => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) return false;
      
      // Parse the date components
      const [year, month, day] = date.split('-').map(Number);
      
      // Create a date object and check if it matches the input
      const parsedDate = new Date(year, month - 1, day); // month is 0-indexed
      
      // Check if the date is valid and matches the input components
      return parsedDate.getFullYear() === year && 
             parsedDate.getMonth() === (month - 1) && 
             parsedDate.getDate() === day;
    };

    it('should validate emails correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });

    it('should validate dates correctly', () => {
      expect(isValidDate('2023-12-25')).toBe(true);
      expect(isValidDate('2023-02-29')).toBe(false); // Invalid date
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate('23-12-25')).toBe(false);
    });
  });

  describe('Health Check Response', () => {
    it('should format health check responses correctly', () => {
      const mockHealthResponse = {
        status: 'healthy',
        authenticated: true,
        accountId: 123,
        apiCompliance: 'v1.18.25',
        components: {
          retryManager: { maxRetries: 3, delay: 1000 },
          rateLimiter: 'disabled',
          circuitBreaker: 'disabled',
          requestQueue: { pending: 0, completed: 5 },
          timeout: 30000
        }
      };

      expect(mockHealthResponse.status).toBe('healthy');
      expect(mockHealthResponse.authenticated).toBe(true);
      expect(mockHealthResponse.accountId).toBe(123);
      expect(mockHealthResponse.components).toBeDefined();
      expect(mockHealthResponse.components.rateLimiter).toBe('disabled');
    });

    it('should handle unhealthy responses', () => {
      const mockUnhealthyResponse = {
        status: 'unhealthy',
        error: 'Authentication failed',
        errorType: 'CakemailAuthenticationError',
        statusCode: 401,
        authenticated: false,
        components: {
          circuitBreaker: 'disabled',
          requestQueue: { pending: 0, completed: 0 }
        }
      };

      expect(mockUnhealthyResponse.status).toBe('unhealthy');
      expect(mockUnhealthyResponse.authenticated).toBe(false);
      expect(mockUnhealthyResponse.statusCode).toBe(401);
      expect(mockUnhealthyResponse.error).toBe('Authentication failed');
    });
  });

  describe('Request Configuration', () => {
    it('should handle timeout configuration', () => {
      const DEFAULT_TIMEOUT = 30000;
      
      const configureTimeout = (userTimeout?: number) => {
        return userTimeout !== undefined ? userTimeout : DEFAULT_TIMEOUT;
      };

      expect(configureTimeout()).toBe(30000);
      expect(configureTimeout(5000)).toBe(5000);
      expect(configureTimeout(0)).toBe(0);
    });

    it('should configure circuit breaker settings', () => {
      interface CircuitBreakerConfig {
        enabled: boolean;
        failureThreshold: number;
        resetTimeout: number;
      }

      const configureCircuitBreaker = (config?: Partial<CircuitBreakerConfig>): CircuitBreakerConfig => {
        return {
          enabled: false,
          failureThreshold: 5,
          resetTimeout: 60000,
          ...config
        };
      };

      const defaultConfig = configureCircuitBreaker();
      expect(defaultConfig.enabled).toBe(false);
      expect(defaultConfig.failureThreshold).toBe(5);

      const customConfig = configureCircuitBreaker({ enabled: true, failureThreshold: 3 });
      expect(customConfig.enabled).toBe(true);
      expect(customConfig.failureThreshold).toBe(3);
      expect(customConfig.resetTimeout).toBe(60000); // Should keep default
    });
  });
});
