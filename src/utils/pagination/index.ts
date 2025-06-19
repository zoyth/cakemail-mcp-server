// Main export file for unified pagination system

export * from './types.js';
export * from './config.js';
export * from './manager.js';
export * from './iterator.js';
export * from './factory.js';

// Import specific types for local use
import { IteratorOptions } from './types.js';
import { PaginationFactory } from './factory.js';

// Re-export commonly used classes and functions for convenience
export { PaginationManager } from './manager.js';
export { PaginatedIterator, ConcurrentPaginatedIterator } from './iterator.js';
export { PaginationFactory } from './factory.js';
export { PaginationConfigRegistry } from './config.js';

// Export helper function for quick pagination setup
export function createPagination<T>(
  endpoint: string,
  fetchFunction: (params: Record<string, any>) => Promise<any>
) {
  return {
    manager: PaginationFactory.createManager(endpoint),
    iterator: (options?: IteratorOptions) => 
      PaginationFactory.createIterator<T>(endpoint, fetchFunction, options),
    robustIterator: (options?: IteratorOptions & { 
      onError?: (error: Error, attempt: number) => void;
      validateResponse?: (response: any) => boolean;
    }) => 
      PaginationFactory.createRobustIterator<T>(endpoint, fetchFunction, options)
  };
}
