import { IteratorOptions } from './types.js';
export declare class PaginatedIterator<T> implements AsyncIterable<T> {
    private manager;
    private fetchFunction;
    private options;
    private maxResults;
    private retryAttempts;
    constructor(endpoint: string, fetchFunction: (params: Record<string, any>) => Promise<any>, options?: IteratorOptions);
    [Symbol.asyncIterator](): AsyncIterator<T>;
    /**
     * Collect all items into an array
     */
    toArray(): Promise<T[]>;
    /**
     * Get items in batches
     */
    batches(): AsyncIterableIterator<T[]>;
    /**
     * Process items with a callback function
     */
    forEach(callback: (item: T, index: number) => Promise<void> | void): Promise<void>;
    /**
     * Map over items and collect results
     */
    map<U>(mapper: (item: T, index: number) => Promise<U> | U): Promise<U[]>;
    /**
     * Filter items and collect results
     */
    filter(predicate: (item: T, index: number) => Promise<boolean> | boolean): Promise<T[]>;
    /**
     * Find the first item matching a predicate
     */
    find(predicate: (item: T, index: number) => Promise<boolean> | boolean): Promise<T | undefined>;
    /**
     * Count total items without loading them all into memory
     */
    count(): Promise<number>;
    /**
     * Get statistics about the iteration
     */
    getStats(): Promise<{
        totalItems: number;
        totalBatches: number;
        averageBatchSize: number;
        strategy: string;
    }>;
}
/**
 * Concurrent paginated iterator for parallel processing
 */
export declare class ConcurrentPaginatedIterator<T> {
    private iterators;
    private concurrency;
    constructor(iterators: PaginatedIterator<T>[], concurrency?: number);
    /**
     * Process multiple iterators concurrently
     */
    [Symbol.asyncIterator](): AsyncIterator<T>;
    /**
     * Collect all results from concurrent iterators
     */
    toArray(): Promise<T[]>;
}
//# sourceMappingURL=iterator.d.ts.map