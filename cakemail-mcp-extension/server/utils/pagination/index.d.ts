export * from './types.js';
export * from './config.js';
export * from './manager.js';
export * from './iterator.js';
export * from './factory.js';
import { IteratorOptions } from './types.js';
export { PaginationManager } from './manager.js';
export { PaginatedIterator, ConcurrentPaginatedIterator } from './iterator.js';
export { PaginationFactory } from './factory.js';
export { PaginationConfigRegistry } from './config.js';
export declare function createPagination<T>(endpoint: string, fetchFunction: (params: Record<string, any>) => Promise<any>): {
    manager: import("./manager.js").PaginationManager;
    iterator: (options?: IteratorOptions) => import("./iterator.js").PaginatedIterator<T>;
    robustIterator: (options?: IteratorOptions & {
        onError?: (error: Error, attempt: number) => void;
        validateResponse?: (response: any) => boolean;
    }) => import("./iterator.js").PaginatedIterator<T>;
};
//# sourceMappingURL=index.d.ts.map