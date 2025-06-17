import { RequestInit } from 'node-fetch';
import { CakemailConfig, CakemailToken } from '../types/cakemail-types.js';
import { RetryManager, RateLimiter, CircuitBreaker, RequestQueue, RetryConfig, RateLimitConfig } from '../types/retry.js';
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
    private refreshToken;
    private parseErrorResponse;
    protected makeRequest(endpoint: string, options?: RequestInit): Promise<any>;
    private executeRequest;
    protected getCurrentAccountId(): Promise<number | undefined>;
    protected isValidEmail(email: string): boolean;
    protected isValidDate(date: string): boolean;
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
}
//# sourceMappingURL=base-client.d.ts.map