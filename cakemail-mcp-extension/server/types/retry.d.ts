export interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    exponentialBase: number;
    jitter: boolean;
    retryableStatusCodes: number[];
    retryableErrors: string[];
}
export interface RateLimitConfig {
    enabled: boolean;
    maxRequestsPerSecond: number;
    burstLimit: number;
    respectServerLimits: boolean;
}
export declare const DEFAULT_RETRY_CONFIG: RetryConfig;
export declare const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig;
export declare class RateLimiter {
    private tokens;
    private lastRefill;
    private readonly maxTokens;
    private readonly refillRate;
    constructor(config: RateLimitConfig);
    acquire(): Promise<void>;
    private refillTokens;
    private sleep;
}
export declare class RetryManager {
    private config;
    private debugMode;
    constructor(config?: Partial<RetryConfig>, debugMode?: boolean);
    executeWithRetry<T>(operation: () => Promise<T>, context?: string): Promise<T>;
    private shouldRetry;
    private calculateDelay;
    private enhanceError;
    private sleep;
    updateConfig(newConfig: Partial<RetryConfig>): void;
    getConfig(): RetryConfig;
}
export declare class CircuitBreaker {
    private readonly failureThreshold;
    private readonly resetTimeout;
    private readonly debugMode;
    private failures;
    private lastFailureTime;
    private state;
    constructor(failureThreshold?: number, resetTimeout?: number, // 1 minute
    debugMode?: boolean);
    execute<T>(operation: () => Promise<T>, context?: string): Promise<T>;
    private recordFailure;
    private reset;
    getState(): {
        state: string;
        failures: number;
        lastFailureTime: number;
    };
}
export declare class RequestQueue {
    private readonly maxConcurrent;
    private queue;
    private active;
    constructor(maxConcurrent?: number);
    add<T>(operation: () => Promise<T>): Promise<T>;
    private processQueue;
    getStats(): {
        active: number;
        queued: number;
    };
}
export declare function createDelay(ms: number): Promise<void>;
export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage?: string): Promise<T>;
//# sourceMappingURL=retry.d.ts.map