// Rate limiting and retry logic for Cakemail API
import { CakemailRateLimitError, CakemailNetworkError, CakemailError } from './errors.js';
export const DEFAULT_RETRY_CONFIG = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    exponentialBase: 2,
    jitter: true,
    retryableStatusCodes: [429, 500, 502, 503, 504],
    retryableErrors: ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT']
};
export const DEFAULT_RATE_LIMIT_CONFIG = {
    enabled: true,
    maxRequestsPerSecond: 10,
    burstLimit: 20,
    respectServerLimits: true
};
export class RateLimiter {
    tokens;
    lastRefill;
    maxTokens;
    refillRate; // tokens per millisecond
    constructor(config) {
        this.maxTokens = config.burstLimit;
        this.tokens = this.maxTokens;
        this.lastRefill = Date.now();
        this.refillRate = config.maxRequestsPerSecond / 1000; // convert to per millisecond
    }
    async acquire() {
        this.refillTokens();
        if (this.tokens >= 1) {
            this.tokens -= 1;
            return;
        }
        // Wait until we can acquire a token
        const waitTime = Math.ceil(1 / this.refillRate);
        await this.sleep(waitTime);
        return this.acquire();
    }
    refillTokens() {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        const tokensToAdd = timePassed * this.refillRate;
        this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
export class RetryManager {
    config;
    debugMode;
    constructor(config = {}, debugMode = false) {
        this.config = { ...DEFAULT_RETRY_CONFIG, ...config };
        this.debugMode = debugMode;
    }
    async executeWithRetry(operation, context = 'API request') {
        let lastError;
        for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
            try {
                if (attempt > 0 && this.debugMode) {
                    console.log(`[Retry Manager] Attempt ${attempt + 1}/${this.config.maxRetries + 1} for ${context}`);
                }
                const result = await operation();
                if (attempt > 0 && this.debugMode) {
                    console.log(`[Retry Manager] ${context} succeeded on attempt ${attempt + 1}`);
                }
                return result;
            }
            catch (error) {
                lastError = error;
                if (attempt === this.config.maxRetries) {
                    if (this.debugMode) {
                        console.log(`[Retry Manager] ${context} failed after ${this.config.maxRetries + 1} attempts`);
                    }
                    break;
                }
                if (!this.shouldRetry(error)) {
                    if (this.debugMode) {
                        console.log(`[Retry Manager] ${context} failed with non-retryable error: ${error}`);
                    }
                    throw error;
                }
                const delay = this.calculateDelay(attempt, error);
                if (this.debugMode) {
                    console.log(`[Retry Manager] ${context} failed (attempt ${attempt + 1}), retrying in ${delay}ms. Error: ${error.message}`);
                }
                await this.sleep(delay);
            }
        }
        throw this.enhanceError(lastError, this.config.maxRetries + 1);
    }
    shouldRetry(error) {
        // Check if it's a CakemailError with retryable status code
        if (error instanceof CakemailError) {
            return this.config.retryableStatusCodes.includes(error.statusCode);
        }
        // Check for network errors
        if (error instanceof CakemailNetworkError) {
            return true;
        }
        // Check for specific error codes/messages
        const errorMessage = error.message.toUpperCase();
        return this.config.retryableErrors.some(retryableError => errorMessage.includes(retryableError.toUpperCase()));
    }
    calculateDelay(attempt, error) {
        let delay;
        // If it's a rate limit error with Retry-After header, respect that
        if (error instanceof CakemailRateLimitError && error.retryAfter) {
            delay = error.retryAfter * 1000; // Convert seconds to milliseconds
        }
        else {
            // Exponential backoff
            delay = this.config.baseDelay * Math.pow(this.config.exponentialBase, attempt);
        }
        // Apply jitter to avoid thundering herd
        if (this.config.jitter) {
            delay = delay * (0.5 + Math.random() * 0.5); // 50-100% of calculated delay
        }
        // Cap at maximum delay
        return Math.min(delay, this.config.maxDelay);
    }
    enhanceError(originalError, totalAttempts) {
        if (originalError instanceof CakemailError) {
            // Create a new error with enhanced message
            const enhancedMessage = `${originalError.message} (Failed after ${totalAttempts} attempts)`;
            const newError = new originalError.constructor(enhancedMessage, originalError.statusCode, originalError.response);
            newError.stack = originalError.stack;
            return newError;
        }
        // For other errors, wrap in a network error
        return new CakemailNetworkError(`${originalError.message} (Failed after ${totalAttempts} attempts)`, originalError);
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    // Get current configuration
    getConfig() {
        return { ...this.config };
    }
}
// Circuit breaker pattern for handling persistent failures
export class CircuitBreaker {
    failureThreshold;
    resetTimeout;
    debugMode;
    failures = 0;
    lastFailureTime = 0;
    state = 'CLOSED';
    constructor(failureThreshold = 5, resetTimeout = 60000, // 1 minute
    debugMode = false) {
        this.failureThreshold = failureThreshold;
        this.resetTimeout = resetTimeout;
        this.debugMode = debugMode;
    }
    async execute(operation, context = 'operation') {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
                this.state = 'HALF_OPEN';
                if (this.debugMode) {
                    console.log(`[Circuit Breaker] Moving to HALF_OPEN state for ${context}`);
                }
            }
            else {
                throw new CakemailNetworkError(`Circuit breaker is OPEN for ${context}. Service may be unavailable.`);
            }
        }
        try {
            const result = await operation();
            if (this.state === 'HALF_OPEN') {
                this.reset();
                if (this.debugMode) {
                    console.log(`[Circuit Breaker] ${context} succeeded, circuit breaker reset to CLOSED`);
                }
            }
            return result;
        }
        catch (error) {
            this.recordFailure();
            if (this.debugMode) {
                console.log(`[Circuit Breaker] ${context} failed (${this.failures}/${this.failureThreshold} failures), state: ${this.state}`);
            }
            throw error;
        }
    }
    recordFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    reset() {
        this.failures = 0;
        this.state = 'CLOSED';
        this.lastFailureTime = 0;
    }
    getState() {
        return {
            state: this.state,
            failures: this.failures,
            lastFailureTime: this.lastFailureTime
        };
    }
}
// Request queue for managing concurrent requests
export class RequestQueue {
    maxConcurrent;
    queue = [];
    active = 0;
    constructor(maxConcurrent = 10) {
        this.maxConcurrent = maxConcurrent;
    }
    async add(operation) {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    this.active++;
                    const result = await operation();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
                finally {
                    this.active--;
                    this.processQueue();
                }
            });
            this.processQueue();
        });
    }
    processQueue() {
        if (this.active < this.maxConcurrent && this.queue.length > 0) {
            const next = this.queue.shift();
            if (next) {
                next();
            }
        }
    }
    getStats() {
        return {
            active: this.active,
            queued: this.queue.length
        };
    }
}
// Utility function to create a delay
export function createDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Utility function to timeout a promise
export function withTimeout(promise, timeoutMs, timeoutMessage) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new CakemailNetworkError(timeoutMessage || `Operation timed out after ${timeoutMs}ms`)), timeoutMs))
    ]);
}
//# sourceMappingURL=retry.js.map