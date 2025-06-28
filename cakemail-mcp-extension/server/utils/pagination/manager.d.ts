import { PaginationStrategy, UnifiedPaginationOptions, PaginatedResult, IteratorOptions } from './types.js';
export declare class PaginationManager {
    private config;
    constructor(endpoint: string);
    /**
     * Build query parameters for the given pagination options
     */
    buildQueryParams(options?: UnifiedPaginationOptions | IteratorOptions): Record<string, any>;
    /**
     * Parse API response into unified pagination format
     */
    parseResponse<T>(response: any): PaginatedResult<T>;
    /**
     * Get next page options
     */
    getNextPageOptions(result: PaginatedResult<any>): UnifiedPaginationOptions | null;
    /**
     * Get previous page options
     */
    getPreviousPageOptions(result: PaginatedResult<any>): UnifiedPaginationOptions | null;
    /**
     * Get pagination strategy for this manager
     */
    getStrategy(): PaginationStrategy;
    /**
     * Get configuration for this manager
     */
    getConfig(): {
        strategy: PaginationStrategy;
        default_limit: number;
        max_limit: number;
        page_param?: string;
        size_param?: string;
        cursor_param?: string;
        token_param?: string;
    };
    /**
     * Validate pagination options against the strategy
     */
    validateOptions(options: UnifiedPaginationOptions): {
        valid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=manager.d.ts.map