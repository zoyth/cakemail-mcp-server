// Factory class for creating pagination managers and iterators
import { PaginationManager } from './manager.js';
import { PaginatedIterator, ConcurrentPaginatedIterator } from './iterator.js';
import { PaginationConfigRegistry } from './config.js';
export class PaginationFactory {
    /**
     * Create a pagination manager for an endpoint
     */
    static createManager(endpoint) {
        return new PaginationManager(endpoint);
    }
    /**
     * Create an async iterator for paginated results
     */
    static createIterator(endpoint, fetchFunction, options = {}) {
        return new PaginatedIterator(endpoint, fetchFunction, options);
    }
    /**
     * Create multiple iterators for concurrent processing
     */
    static createConcurrentIterator(iterators, concurrency = 3) {
        return new ConcurrentPaginatedIterator(iterators, concurrency);
    }
    /**
     * Register a new endpoint configuration
     */
    static registerEndpoint(endpoint, config) {
        PaginationConfigRegistry.registerEndpoint(endpoint, config);
    }
    /**
     * Get all registered endpoint configurations
     */
    static getAllConfigs() {
        return PaginationConfigRegistry.getAllConfigs();
    }
    /**
     * Check if an endpoint has a configuration
     */
    static hasConfig(endpoint) {
        return PaginationConfigRegistry.hasConfig(endpoint);
    }
    /**
     * Create a manager and validate options in one call
     */
    static createValidatedManager(endpoint, options) {
        const manager = new PaginationManager(endpoint);
        const validation = manager.validateOptions(options);
        return { manager, validation };
    }
    /**
     * Helper to create iterator with automatic error handling and retries
     */
    static createRobustIterator(endpoint, fetchFunction, options = {}) {
        const { onError, validateResponse, ...iteratorOptions } = options;
        const robustFetchFunction = async (params) => {
            let lastError;
            const maxAttempts = iteratorOptions.retryAttempts || 3;
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    const response = await fetchFunction(params);
                    // Validate response if validator provided
                    if (validateResponse && !validateResponse(response)) {
                        throw new Error('Response validation failed');
                    }
                    return response;
                }
                catch (error) {
                    lastError = error;
                    if (onError) {
                        onError(lastError, attempt);
                    }
                    if (attempt === maxAttempts) {
                        throw lastError;
                    }
                    // Exponential backoff with jitter
                    const baseDelay = Math.pow(2, attempt) * 1000;
                    const jitter = Math.random() * 1000;
                    await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));
                }
            }
            throw lastError;
        };
        return new PaginatedIterator(endpoint, robustFetchFunction, iteratorOptions);
    }
    /**
     * Utility to merge multiple paginated results
     */
    static async mergeResults(iterators, options = {}) {
        const { concurrency = 3, deduplicateBy, sortBy, sortOrder = 'asc' } = options;
        // Collect all results
        const allResults = [];
        if (concurrency > 1) {
            const concurrent = new ConcurrentPaginatedIterator(iterators, concurrency);
            for await (const item of concurrent) {
                allResults.push(item);
            }
        }
        else {
            for (const iterator of iterators) {
                for await (const item of iterator) {
                    allResults.push(item);
                }
            }
        }
        // Deduplicate if requested
        let finalResults = allResults;
        if (deduplicateBy) {
            const seen = new Set();
            finalResults = allResults.filter(item => {
                const key = item[deduplicateBy];
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
        }
        // Sort if requested
        if (sortBy) {
            finalResults.sort((a, b) => {
                const aVal = a[sortBy];
                const bVal = b[sortBy];
                if (aVal < bVal)
                    return sortOrder === 'asc' ? -1 : 1;
                if (aVal > bVal)
                    return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return finalResults;
    }
    /**
     * Create iterator with automatic batch processing
     */
    static createBatchProcessor(endpoint, fetchFunction, processor, options = {}) {
        const { batchSize = 50, concurrentBatches = 1, ...iteratorOptions } = options;
        return async function* () {
            const iterator = new PaginatedIterator(endpoint, fetchFunction, {
                ...iteratorOptions,
                per_page: batchSize
            });
            if (concurrentBatches > 1) {
                // Process batches concurrently
                const activeBatches = [];
                for await (const batch of iterator.batches()) {
                    activeBatches.push(processor(batch));
                    if (activeBatches.length >= concurrentBatches) {
                        const result = await Promise.race(activeBatches);
                        yield result;
                        // Remove completed promise
                        const index = activeBatches.findIndex(p => p === Promise.resolve(result));
                        if (index > -1) {
                            activeBatches.splice(index, 1);
                        }
                    }
                }
                // Process remaining batches
                for (const batchPromise of activeBatches) {
                    yield await batchPromise;
                }
            }
            else {
                // Process batches sequentially
                for await (const batch of iterator.batches()) {
                    yield await processor(batch);
                }
            }
        }();
    }
}
//# sourceMappingURL=factory.js.map