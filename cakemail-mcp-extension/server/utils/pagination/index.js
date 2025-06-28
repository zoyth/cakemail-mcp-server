// Main export file for unified pagination system
export * from './types.js';
export * from './config.js';
export * from './manager.js';
export * from './iterator.js';
export * from './factory.js';
import { PaginationFactory } from './factory.js';
// Re-export commonly used classes and functions for convenience
export { PaginationManager } from './manager.js';
export { PaginatedIterator, ConcurrentPaginatedIterator } from './iterator.js';
export { PaginationFactory } from './factory.js';
export { PaginationConfigRegistry } from './config.js';
// Export helper function for quick pagination setup
export function createPagination(endpoint, fetchFunction) {
    return {
        manager: PaginationFactory.createManager(endpoint),
        iterator: (options) => PaginationFactory.createIterator(endpoint, fetchFunction, options),
        robustIterator: (options) => PaginationFactory.createRobustIterator(endpoint, fetchFunction, options)
    };
}
//# sourceMappingURL=index.js.map