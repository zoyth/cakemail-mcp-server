import { RequestInit } from 'node-fetch';
import { CakemailConfig, CakemailToken } from '../types/cakemail-types.js';
import { RetryManager, RateLimiter, CircuitBreaker, RequestQueue, RetryConfig, RateLimitConfig } from '../types/retry.js';
import { PaginatedIterator, UnifiedPaginationOptions, PaginatedResult, IteratorOptions } from '../utils/pagination/index.js';
export interface EnhancedCakemailConfig extends CakemailConfig {
    retry?: Partial<RetryConfig>;
    rateLimit?: Partial<RateLimitConfig>;
    timeout?: number;
    maxConcurrentRequests?: number;
    circuitBreaker?: {
        enabled: boolean;
        failureThreshold: number;
        resetTimeout: number;
    };
}
export declare class BaseApiClient {
    protected config: EnhancedCakemailConfig;
    protected token: CakemailToken | null;
    protected mockToken: CakemailToken | null;
    protected tokenExpiry: Date | null;
    protected baseUrl: string;
    protected debugMode: boolean;
    protected currentAccountId: number | null;
    protected retryManager: RetryManager;
    protected rateLimiter: RateLimiter | null;
    protected circuitBreaker: CircuitBreaker | null;
    protected requestQueue: RequestQueue;
    protected timeout: number;
    constructor(config: EnhancedCakemailConfig);
    authenticate(): Promise<void>;
    private passwordAuthenticate;
    private refreshToken;
    private parseErrorResponse;
    protected makeRequest(endpoint: string, options?: RequestInit): Promise<any>;
    private executeRequest;
    protected getCurrentAccountId(): Promise<number | undefined>;
    protected isValidEmail(email: string): boolean;
    protected isValidDate(date: string): boolean;
    getTokenStatus(): {
        hasToken: boolean;
        isExpired: boolean;
        expiresAt: Date | null;
        timeUntilExpiry: number | null;
        needsRefresh: boolean;
        tokenType: string | null;
        hasRefreshToken: boolean;
    };
    forceRefreshToken(): Promise<{
        success: boolean;
        newToken: Partial<CakemailToken> | null;
        previousExpiry: Date | null;
        newExpiry: Date | null;
        error?: string;
    }>;
    validateToken(): Promise<{
        isValid: boolean;
        statusCode?: number;
        error?: string;
        accountInfo?: any;
    }>;
    getTokenScopes(): {
        accounts: number[];
        scopes: string | null;
        permissions: string[];
    };
    private inferPermissionsFromAccounts;
    protected ensureValidToken(): Promise<void>;
    setMockToken(token: CakemailToken): void;
    healthCheck(): Promise<{
        status: string;
        authenticated: boolean;
        accountId: any;
        apiCompliance: string;
        components: {
            retryManager: RetryConfig;
            rateLimiter: string;
            circuitBreaker: string | {
                state: string;
                failures: number;
                lastFailureTime: number;
            };
            requestQueue: {
                active: number;
                queued: number;
            };
            timeout: number;
        };
        error?: never;
        errorType?: never;
        statusCode?: never;
    } | {
        status: string;
        error: string;
        errorType: string;
        statusCode: number;
        authenticated: boolean;
        components: {
            circuitBreaker: string | {
                state: string;
                failures: number;
                lastFailureTime: number;
            };
            requestQueue: {
                active: number;
                queued: number;
            };
        };
        accountId?: never;
        apiCompliance?: never;
    } | {
        status: string;
        error: string;
        errorType: string;
        authenticated: boolean;
        components: {
            circuitBreaker: string | {
                state: string;
                failures: number;
                lastFailureTime: number;
            };
            requestQueue: {
                active: number;
                queued: number;
            };
        };
        accountId?: never;
        apiCompliance?: never;
        statusCode?: never;
    }>;
    updateRetryConfig(config: Partial<RetryConfig>): void;
    getRetryConfig(): RetryConfig;
    getCircuitBreakerState(): {
        state: string;
        failures: number;
        lastFailureTime: number;
    } | null;
    getRequestQueueStats(): {
        active: number;
        queued: number;
    };
    protected fetchPaginated<T>(endpoint: string, endpointName: string, options?: UnifiedPaginationOptions, additionalParams?: Record<string, any>): Promise<PaginatedResult<T>>;
    protected createIterator<T>(endpoint: string, endpointName: string, options?: IteratorOptions, additionalParams?: Record<string, any>): PaginatedIterator<T>;
    protected createRobustIterator<T>(endpoint: string, endpointName: string, options?: IteratorOptions & {
        onError?: (error: Error, attempt: number) => void;
        validateResponse?: (response: any) => boolean;
    }, additionalParams?: Record<string, any>): PaginatedIterator<T>;
    protected getAllItems<T>(endpoint: string, endpointName: string, options?: IteratorOptions, additionalParams?: Record<string, any>): Promise<T[]>;
    protected processBatches<T>(endpoint: string, endpointName: string, processor: (batch: T[]) => Promise<void>, options?: IteratorOptions, additionalParams?: Record<string, any>): Promise<void>;
}
//# sourceMappingURL=base-client.d.ts.map