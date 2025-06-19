// Async iterator for automatic pagination through API results

import { PaginationManager } from './manager.js';
import { UnifiedPaginationOptions, IteratorOptions } from './types.js';

export class PaginatedIterator<T> implements AsyncIterable<T> {
  private manager: PaginationManager;
  private fetchFunction: (params: Record<string, any>) => Promise<any>;
  private options: IteratorOptions;
  private maxResults: number | undefined;
  private retryAttempts: number;

  constructor(
    endpoint: string, 
    fetchFunction: (params: Record<string, any>) => Promise<any>,
    options: IteratorOptions = {}
  ) {
    this.manager = new PaginationManager(endpoint);
    this.fetchFunction = fetchFunction;
    this.options = options;
    this.maxResults = options.maxResults;
    this.retryAttempts = options.retryAttempts || 3;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    let currentOptions: IteratorOptions | null = this.options;
    let totalReturned = 0;

    while (currentOptions) {
      const params = this.manager.buildQueryParams(currentOptions as UnifiedPaginationOptions);
      let response: any;
      
      // Retry logic for failed requests
      for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
        try {
          response = await this.fetchFunction(params);
          break;
        } catch (error) {
          if (attempt === this.retryAttempts) {
            throw error;
          }
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
      
      const result = this.manager.parseResponse<T>(response);

      for (const item of result.data) {
        if (this.maxResults && totalReturned >= this.maxResults) {
          return;
        }
        yield item;
        totalReturned++;
      }

      // Check if we should continue
      if (!result.pagination.has_more) {
        break;
      }

      if (this.maxResults && totalReturned >= this.maxResults) {
        break;
      }

      const nextOptions = this.manager.getNextPageOptions(result);
      currentOptions = nextOptions as IteratorOptions | null;
    }
  }

  /**
   * Collect all items into an array
   */
  async toArray(): Promise<T[]> {
    const items: T[] = [];
    for await (const item of this) {
      items.push(item);
    }
    return items;
  }

  /**
   * Get items in batches
   */
  async *batches(): AsyncIterableIterator<T[]> {
    let currentOptions: IteratorOptions | null = this.options;
    let totalReturned = 0;

    while (currentOptions) {
      const params = this.manager.buildQueryParams(currentOptions as UnifiedPaginationOptions);
      let response: any;
      
      // Retry logic for failed requests
      for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
        try {
          response = await this.fetchFunction(params);
          break;
        } catch (error) {
          if (attempt === this.retryAttempts) {
            throw error;
          }
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
      
      const result = this.manager.parseResponse<T>(response);

      if (result.data.length > 0) {
        const remainingLimit = this.maxResults ? this.maxResults - totalReturned : result.data.length;
        const batch = result.data.slice(0, remainingLimit);
        yield batch;
        totalReturned += batch.length;
      }

      if (!result.pagination.has_more) {
        break;
      }

      if (this.maxResults && totalReturned >= this.maxResults) {
        break;
      }

      const nextOptionsForBatch = this.manager.getNextPageOptions(result);
      currentOptions = nextOptionsForBatch as IteratorOptions | null;
    }
  }

  /**
   * Process items with a callback function
   */
  async forEach(callback: (item: T, index: number) => Promise<void> | void): Promise<void> {
    let index = 0;
    for await (const item of this) {
      await callback(item, index);
      index++;
    }
  }

  /**
   * Map over items and collect results
   */
  async map<U>(mapper: (item: T, index: number) => Promise<U> | U): Promise<U[]> {
    const results: U[] = [];
    let index = 0;
    for await (const item of this) {
      const mapped = await mapper(item, index);
      results.push(mapped);
      index++;
    }
    return results;
  }

  /**
   * Filter items and collect results
   */
  async filter(predicate: (item: T, index: number) => Promise<boolean> | boolean): Promise<T[]> {
    const results: T[] = [];
    let index = 0;
    for await (const item of this) {
      const shouldInclude = await predicate(item, index);
      if (shouldInclude) {
        results.push(item);
      }
      index++;
    }
    return results;
  }

  /**
   * Find the first item matching a predicate
   */
  async find(predicate: (item: T, index: number) => Promise<boolean> | boolean): Promise<T | undefined> {
    let index = 0;
    for await (const item of this) {
      const matches = await predicate(item, index);
      if (matches) {
        return item;
      }
      index++;
    }
    return undefined;
  }

  /**
   * Count total items without loading them all into memory
   */
  async count(): Promise<number> {
    let count = 0;
    for await (const _ of this) {
      count++;
    }
    return count;
  }

  /**
   * Get statistics about the iteration
   */
  async getStats(): Promise<{
    totalItems: number;
    totalBatches: number;
    averageBatchSize: number;
    strategy: string;
  }> {
    let totalItems = 0;
    let totalBatches = 0;
    let totalBatchSize = 0;

    for await (const batch of this.batches()) {
      totalBatches++;
      totalBatchSize += batch.length;
      totalItems += batch.length;
    }

    return {
      totalItems,
      totalBatches,
      averageBatchSize: totalBatches > 0 ? totalBatchSize / totalBatches : 0,
      strategy: this.manager.getStrategy()
    };
  }
}

/**
 * Concurrent paginated iterator for parallel processing
 */
export class ConcurrentPaginatedIterator<T> {
  private iterators: PaginatedIterator<T>[];
  private concurrency: number;

  constructor(iterators: PaginatedIterator<T>[], concurrency = 3) {
    this.iterators = iterators;
    this.concurrency = concurrency;
  }

  /**
   * Process multiple iterators concurrently
   */
  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    const activeIterators = this.iterators.map(iterator => iterator[Symbol.asyncIterator]());
    const pendingPromises = new Map<number, Promise<IteratorResult<T>>>();

    // Initialize concurrent requests
    for (let i = 0; i < Math.min(this.concurrency, activeIterators.length); i++) {
      pendingPromises.set(i, activeIterators[i].next());
    }

    while (pendingPromises.size > 0) {
      // Wait for at least one iterator to complete
      // Wait for the first promise to complete
      await Promise.race(Array.from(pendingPromises.values()));
      
      // Process completed results
      for (const [index, promise] of pendingPromises.entries()) {
        try {
          const result = await promise;
          if (!result.done) {
            yield result.value;
            // Start next iteration for this iterator
            pendingPromises.set(index, activeIterators[index].next());
          } else {
            // Iterator is done, remove it
            pendingPromises.delete(index);
          }
        } catch (error) {
          // Handle error and remove failed iterator
          console.error(`Iterator ${index} failed:`, error);
          pendingPromises.delete(index);
        }
      }
    }
  }

  /**
   * Collect all results from concurrent iterators
   */
  async toArray(): Promise<T[]> {
    const results: T[] = [];
    for await (const item of this) {
      results.push(item);
    }
    return results;
  }
}
