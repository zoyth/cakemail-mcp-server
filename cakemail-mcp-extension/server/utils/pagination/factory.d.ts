import { PaginationManager } from './manager.js';
import { PaginatedIterator, ConcurrentPaginatedIterator } from './iterator.js';
import { UnifiedPaginationOptions, EndpointPaginationConfig, IteratorOptions } from './types.js';
export declare class PaginationFactory {
    /**
     * Create a pagination manager for an endpoint
     */
    static createManager(endpoint: string): PaginationManager;
    /**
     * Create an async iterator for paginated results
     */
    static createIterator<T>(endpoint: string, fetchFunction: (params: Record<string, any>) => Promise<any>, options?: IteratorOptions): PaginatedIterator<T>;
    /**
     * Create multiple iterators for concurrent processing
     */
    static createConcurrentIterator<T>(iterators: PaginatedIterator<T>[], concurrency?: number): ConcurrentPaginatedIterator<T>;
    /**
     * Register a new endpoint configuration
     */
    static registerEndpoint(endpoint: string, config: EndpointPaginationConfig): void;
    /**
     * Get all registered endpoint configurations
     */
    static getAllConfigs(): Map<string, EndpointPaginationConfig>;
    /**
     * Check if an endpoint has a configuration
     */
    static hasConfig(endpoint: string): boolean;
    /**
     * Create a manager and validate options in one call
     */
    static createValidatedManager(endpoint: string, options: UnifiedPaginationOptions): {
        manager: PaginationManager;
        validation: {
            valid: boolean;
            errors: string[];
        };
    };
    /**
     * Helper to create iterator with automatic error handling and retries
     */
    static createRobustIterator<T>(endpoint: string, fetchFunction: (params: Record<string, any>) => Promise<any>, options?: IteratorOptions & {
        onError?: (error: Error, attempt: number) => void;
        validateResponse?: (response: any) => boolean;
    }): PaginatedIterator<T>;
    /**
     * Utility to merge multiple paginated results
     */
    static mergeResults<T>(iterators: PaginatedIterator<T>[], options?: {
        concurrency?: number;
        deduplicateBy?: keyof T;
        sortBy?: keyof T;
        sortOrder?: 'asc' | 'desc';
    }): Promise<T[]>;
    /**
     * Create iterator with automatic batch processing
     */
    static createBatchProcessor<T, R>(endpoint: string, fetchFunction: (params: Record<string, any>) => Promise<any>, processor: (batch: T[]) => Promise<R[]>, options?: IteratorOptions & {
        batchSize?: number;
        concurrentBatches?: number;
    }): AsyncGenerator<R[], void, unknown>;
}
//# sourceMappingURL=factory.d.ts.map