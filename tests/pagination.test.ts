// Tests for the unified pagination system

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { PaginationManager, PaginatedIterator, PaginationFactory, PaginationStrategy } from '../src/utils/pagination/index.js';

describe('Unified Pagination System', () => {
  describe('PaginationManager', () => {
    it('should handle offset pagination correctly', () => {
      const manager = new PaginationManager('contacts');
      const params = manager.buildQueryParams({ page: 2, per_page: 25 });
      
      expect(params).toEqual({
        page: 2,
        per_page: 25
      });
    });

    it('should handle cursor pagination correctly', () => {
      const manager = new PaginationManager('logs');
      const params = manager.buildQueryParams({ cursor: 'abc123' });
      
      expect(params).toEqual({
        cursor: 'abc123',
        per_page: 50
      });
    });

    it('should validate pagination options', () => {
      const manager = new PaginationManager('contacts');
      
      // Valid options
      const validResult = manager.validateOptions({ page: 1, per_page: 25 });
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toHaveLength(0);
      
      // Invalid options
      const invalidResult = manager.validateOptions({ page: 0, per_page: 1000 });
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should parse offset-based responses correctly', () => {
      const manager = new PaginationManager('contacts');
      const mockResponse = {
        data: [{ id: 1 }, { id: 2 }],
        pagination: { page: 1, per_page: 2, count: 4 }
      };
      
      const result = manager.parseResponse(mockResponse);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.has_more).toBe(true);
      expect(result.pagination.page).toBe(1);
    });

    it('should parse cursor-based responses correctly', () => {
      const manager = new PaginationManager('logs');
      const mockResponse = {
        data: [{ id: 1 }, { id: 2 }],
        pagination: { 
          cursor: { next: 'next_cursor', previous: null },
          count: 100
        }
      };
      
      const result = manager.parseResponse(mockResponse);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.has_more).toBe(true);
      expect(result.pagination.cursor?.next).toBe('next_cursor');
    });

    it('should get next page options correctly', () => {
      const manager = new PaginationManager('contacts');
      const result = {
        data: [{ id: 1 }],
        pagination: {
          page: 1,
          per_page: 10,
          has_more: true,
          total_count: 20
        }
      };
      
      const nextOptions = manager.getNextPageOptions(result);
      expect(nextOptions).toEqual({
        page: 2,
        per_page: 10
      });
    });
  });

  describe('PaginatedIterator', () => {
    it('should iterate through all pages correctly', async () => {
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({
          data: [{ id: 1 }, { id: 2 }],
          pagination: { page: 1, per_page: 2, count: 4 }
        })
        .mockResolvedValueOnce({
          data: [{ id: 3 }, { id: 4 }],
          pagination: { page: 2, per_page: 2, count: 4 }
        });

      const iterator = new PaginatedIterator('contacts', mockFetch, { per_page: 2 });
      const results = await iterator.toArray();

      expect(results).toHaveLength(4);
      expect(results.map(r => r.id)).toEqual([1, 2, 3, 4]);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle maxResults limit correctly', async () => {
      const mockFetch = jest.fn()
        .mockResolvedValue({
          data: [{ id: 1 }, { id: 2 }, { id: 3 }],
          pagination: { page: 1, per_page: 3, count: 100 }
        });

      const iterator = new PaginatedIterator('contacts', mockFetch, { 
        per_page: 3, 
        maxResults: 2 
      });
      
      const results = await iterator.toArray();
      expect(results).toHaveLength(2);
    });

    it('should process batches correctly', async () => {
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({
          data: [{ id: 1 }, { id: 2 }],
          pagination: { page: 1, per_page: 2, count: 4 }
        })
        .mockResolvedValueOnce({
          data: [{ id: 3 }, { id: 4 }],
          pagination: { page: 2, per_page: 2, count: 4 }
        });

      const iterator = new PaginatedIterator('contacts', mockFetch, { per_page: 2 });
      const batches = [];
      
      for await (const batch of iterator.batches()) {
        batches.push(batch);
      }

      expect(batches).toHaveLength(2);
      expect(batches[0]).toEqual([{ id: 1 }, { id: 2 }]);
      expect(batches[1]).toEqual([{ id: 3 }, { id: 4 }]);
    });

    it('should handle errors with retry logic', async () => {
      const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          data: [{ id: 1 }],
          pagination: { page: 1, per_page: 1, count: 1 }
        });

      const iterator = new PaginatedIterator('contacts', mockFetch, { 
        retryAttempts: 2 
      });
      
      const results = await iterator.toArray();
      expect(results).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should use filter method correctly', async () => {
      const mockFetch = jest.fn()
        .mockResolvedValue({
          data: [
            { id: 1, email: 'valid@example.com' },
            { id: 2, email: 'invalid-email' },
            { id: 3, email: 'another@example.com' }
          ],
          pagination: { page: 1, per_page: 3, count: 3 }
        });

      const iterator = new PaginatedIterator('contacts', mockFetch);
      const validContacts = await iterator.filter(contact => 
        contact.email.includes('@')
      );

      expect(validContacts).toHaveLength(2);
      expect(validContacts.every(c => c.email.includes('@'))).toBe(true);
    });

    it('should use map method correctly', async () => {
      const mockFetch = jest.fn()
        .mockResolvedValue({
          data: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
          pagination: { page: 1, per_page: 2, count: 2 }
        });

      const iterator = new PaginatedIterator('contacts', mockFetch);
      const names = await iterator.map(contact => contact.name);

      expect(names).toEqual(['John', 'Jane']);
    });

    it('should find items correctly', async () => {
      const mockFetch = jest.fn()
        .mockResolvedValue({
          data: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
          pagination: { page: 1, per_page: 2, count: 2 }
        });

      const iterator = new PaginatedIterator('contacts', mockFetch);
      const found = await iterator.find(contact => contact.name === 'Jane');

      expect(found).toEqual({ id: 2, name: 'Jane' });
    });

    it('should count items correctly', async () => {
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({
          data: [{ id: 1 }, { id: 2 }],
          pagination: { page: 1, per_page: 2, count: 3 }
        })
        .mockResolvedValueOnce({
          data: [{ id: 3 }],
          pagination: { page: 2, per_page: 2, count: 3 }
        });

      const iterator = new PaginatedIterator('contacts', mockFetch, { per_page: 2 });
      const count = await iterator.count();

      expect(count).toBe(3);
    });

    it('should provide statistics correctly', async () => {
      const mockFetch = jest.fn()
        .mockResolvedValueOnce({
          data: [{ id: 1 }, { id: 2 }],
          pagination: { page: 1, per_page: 2, count: 4 }
        })
        .mockResolvedValueOnce({
          data: [{ id: 3 }, { id: 4 }],
          pagination: { page: 2, per_page: 2, count: 4 }
        });

      const iterator = new PaginatedIterator('contacts', mockFetch, { per_page: 2 });
      const stats = await iterator.getStats();

      expect(stats.totalItems).toBe(4);
      expect(stats.totalBatches).toBe(2);
      expect(stats.averageBatchSize).toBe(2);
      expect(stats.strategy).toBe(PaginationStrategy.OFFSET);
    });
  });

  describe('PaginationFactory', () => {
    it('should create managers correctly', () => {
      const manager = PaginationFactory.createManager('contacts');
      expect(manager).toBeInstanceOf(PaginationManager);
      expect(manager.getStrategy()).toBe(PaginationStrategy.OFFSET);
    });

    it('should create iterators correctly', () => {
      const mockFetch = jest.fn();
      const iterator = PaginationFactory.createIterator('contacts', mockFetch);
      expect(iterator).toBeInstanceOf(PaginatedIterator);
    });

    it('should register custom endpoints', () => {
      const customConfig = {
        strategy: PaginationStrategy.CURSOR,
        default_limit: 25,
        max_limit: 100,
        cursor_param: 'next_cursor'
      };

      PaginationFactory.registerEndpoint('custom_endpoint', customConfig);
      expect(PaginationFactory.hasConfig('custom_endpoint')).toBe(true);

      const manager = PaginationFactory.createManager('custom_endpoint');
      expect(manager.getStrategy()).toBe(PaginationStrategy.CURSOR);
    });

    it('should create validated managers', () => {
      const { manager, validation } = PaginationFactory.createValidatedManager(
        'contacts',
        { page: 1, per_page: 25 }
      );

      expect(manager).toBeInstanceOf(PaginationManager);
      expect(validation.valid).toBe(true);
    });

    it('should create robust iterators with error handling', async () => {
      let errorCount = 0;
      const mockFetch = jest.fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce({
          data: [{ id: 1 }],
          pagination: { page: 1, per_page: 1, count: 1 }
        });

      const iterator = PaginationFactory.createRobustIterator(
        'contacts',
        mockFetch,
        {
          retryAttempts: 2,
          onError: (error, attempt) => {
            errorCount++;
            expect(error).toBeInstanceOf(Error);
            expect(attempt).toBe(1);
          },
          validateResponse: (response) => {
            return response && Array.isArray(response.data);
          }
        }
      );

      const results = await iterator.toArray();
      expect(results).toHaveLength(1);
      expect(errorCount).toBe(1);
    });

    it('should merge results from multiple iterators', async () => {
      const mockFetch1 = jest.fn().mockResolvedValue({
        data: [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }],
        pagination: { page: 1, per_page: 2, count: 2 }
      });

      const mockFetch2 = jest.fn().mockResolvedValue({
        data: [{ id: 3, name: 'Bob' }, { id: 1, name: 'John' }], // Duplicate ID
        pagination: { page: 1, per_page: 2, count: 2 }
      });

      const iterator1 = PaginationFactory.createIterator('contacts', mockFetch1);
      const iterator2 = PaginationFactory.createIterator('contacts', mockFetch2);

      const merged = await PaginationFactory.mergeResults(
        [iterator1, iterator2],
        {
          deduplicateBy: 'id' as keyof any,
          sortBy: 'name' as keyof any,
          sortOrder: 'asc'
        }
      );

      expect(merged).toHaveLength(3); // Deduplicated
      expect(merged.map(item => item.name)).toEqual(['Bob', 'Jane', 'John']); // Sorted
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty responses correctly', () => {
      const manager = new PaginationManager('contacts');
      const result = manager.parseResponse({ data: [] });
      
      expect(result.data).toHaveLength(0);
      expect(result.pagination.has_more).toBe(false);
    });

    it('should handle malformed responses gracefully', () => {
      const manager = new PaginationManager('contacts');
      const result = manager.parseResponse({});
      
      expect(result.data).toHaveLength(0);
      expect(result.pagination.has_more).toBe(false);
    });

    it('should handle unknown endpoint gracefully', () => {
      const manager = new PaginationManager('unknown_endpoint');
      expect(manager.getStrategy()).toBe(PaginationStrategy.OFFSET);
    });

    it('should handle cursor pagination without next cursor', () => {
      const manager = new PaginationManager('logs');
      const result = {
        data: [{ id: 1 }],
        pagination: {
          cursor: { previous: null, next: null },
          has_more: false
        }
      };
      
      const nextOptions = manager.getNextPageOptions(result);
      expect(nextOptions).toBeNull();
    });
  });
});

// Integration tests with mock API client
describe('Integration with API Client', () => {
  let mockApiClient: any;

  beforeEach(() => {
    mockApiClient = {
      debugMode: true,
      makeRequest: jest.fn(),
      getCurrentAccountId: jest.fn().mockResolvedValue(123)
    };
  });

  it('should integrate with base client pagination methods', async () => {
    mockApiClient.makeRequest.mockResolvedValue({
      data: [{ id: 1, email: 'test@example.com' }],
      pagination: { page: 1, per_page: 10, count: 1 }
    });

    // Simulate the base client method
    const fetchPaginated = async function(endpoint: string, endpointName: string, options: any = {}) {
      const manager = PaginationFactory.createManager(endpointName);
      const params = manager.buildQueryParams(options);
      const response = await mockApiClient.makeRequest(endpoint);
      return manager.parseResponse(response);
    };

    const result = await fetchPaginated('/contacts', 'contacts', { page: 1, per_page: 10 });
    
    expect(result.data).toHaveLength(1);
    expect(result.pagination.page).toBe(1);
    expect(mockApiClient.makeRequest).toHaveBeenCalledWith('/contacts');
  });
});
