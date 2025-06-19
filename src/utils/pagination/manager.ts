// Unified pagination manager for handling different pagination strategies

import { PaginationStrategy, UnifiedPaginationOptions, UnifiedPaginationResponse, PaginatedResult, OffsetPaginationOptions, CursorPaginationOptions, TokenPaginationOptions, OffsetPaginationResponse, CursorPaginationResponse, TokenPaginationResponse, IteratorOptions } from './types.js';
import { PaginationConfigRegistry } from './config.js';

export class PaginationManager {
  // private endpoint: string; // Commented out as it's declared but not used
  private config: import('./types.js').EndpointPaginationConfig;

  constructor(endpoint: string) {
    // this.endpoint = endpoint; // Not needed since we don't use it
    this.config = PaginationConfigRegistry.getConfig(endpoint);
  }

  /**
   * Build query parameters for the given pagination options
   */
  buildQueryParams(options: UnifiedPaginationOptions | IteratorOptions = {}): Record<string, any> {
    const params: Record<string, any> = {};
    
    switch (this.config.strategy) {
      case PaginationStrategy.OFFSET:
        const offsetOptions = options as OffsetPaginationOptions;
        if (offsetOptions.page !== undefined) {
          params[this.config.page_param!] = offsetOptions.page;
        }
        if (offsetOptions.per_page !== undefined) {
          const limit = Math.min(offsetOptions.per_page, this.config.max_limit);
          params[this.config.size_param!] = limit;
        } else {
          params[this.config.size_param!] = this.config.default_limit;
        }
        if (offsetOptions.with_count !== undefined) {
          params['with_count'] = offsetOptions.with_count;
        }
        break;

      case PaginationStrategy.CURSOR:
        const cursorOptions = options as CursorPaginationOptions;
        if (cursorOptions.cursor) {
          params[this.config.cursor_param!] = cursorOptions.cursor;
        }
        if (cursorOptions.before) {
          params['before'] = cursorOptions.before;
        }
        if (cursorOptions.after) {
          params['after'] = cursorOptions.after;
        }
        const cursorLimit = cursorOptions.limit || this.config.default_limit;
        params['per_page'] = Math.min(cursorLimit, this.config.max_limit);
        break;

      case PaginationStrategy.TOKEN:
        const tokenOptions = options as TokenPaginationOptions;
        if (tokenOptions.next_token) {
          params[this.config.token_param!] = tokenOptions.next_token;
        }
        if (tokenOptions.page_token) {
          params['page_token'] = tokenOptions.page_token;
        }
        const tokenLimit = tokenOptions.limit || this.config.default_limit;
        params['limit'] = Math.min(tokenLimit, this.config.max_limit);
        break;
    }

    return params;
  }

  /**
   * Parse API response into unified pagination format
   */
  parseResponse<T>(response: any): PaginatedResult<T> {
    const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
    
    let pagination: UnifiedPaginationResponse;

    switch (this.config.strategy) {
      case PaginationStrategy.OFFSET:
        const offsetPagination = response.pagination || {};
        pagination = {
          page: offsetPagination.page || 1,
          per_page: offsetPagination.per_page || this.config.default_limit,
          total_count: offsetPagination.count,
          total_pages: offsetPagination.count ? 
            Math.ceil(offsetPagination.count / (offsetPagination.per_page || this.config.default_limit)) : 
            undefined,
          has_more: offsetPagination.count ? 
            (offsetPagination.page || 1) * (offsetPagination.per_page || this.config.default_limit) < offsetPagination.count :
            data.length === (offsetPagination.per_page || this.config.default_limit)
        } as OffsetPaginationResponse;
        break;

      case PaginationStrategy.CURSOR:
        const cursorPagination = response.pagination || {};
        pagination = {
          cursor: cursorPagination.cursor || {
            previous: cursorPagination.cursor?.previous,
            next: cursorPagination.cursor?.next
          },
          total_count: cursorPagination.count,
          has_more: Boolean(cursorPagination.cursor?.next) || 
                   (data.length === (cursorPagination.per_page || this.config.default_limit))
        } as CursorPaginationResponse;
        break;

      case PaginationStrategy.TOKEN:
        pagination = {
          next_token: response.next_token || response.page_token,
          page_token: response.page_token,
          total_count: response.total_count,
          has_more: Boolean(response.next_token || response.page_token)
        } as TokenPaginationResponse;
        break;

      default:
        pagination = { has_more: false } as OffsetPaginationResponse;
    }

    return {
      data,
      pagination,
      raw_response: response
    };
  }

  /**
   * Get next page options
   */
  getNextPageOptions(result: PaginatedResult<any>): UnifiedPaginationOptions | null {
    if (!result.pagination.has_more) {
      return null;
    }

    switch (this.config.strategy) {
      case PaginationStrategy.OFFSET:
        const offsetPagination = result.pagination as OffsetPaginationResponse;
        return {
          page: offsetPagination.page + 1,
          per_page: offsetPagination.per_page
        } as OffsetPaginationOptions;

      case PaginationStrategy.CURSOR:
        const cursorPagination = result.pagination as CursorPaginationResponse;
        if (cursorPagination.cursor?.next) {
          return { cursor: cursorPagination.cursor.next } as CursorPaginationOptions;
        }
        return null;

      case PaginationStrategy.TOKEN:
        const tokenPagination = result.pagination as TokenPaginationResponse;
        if (tokenPagination.next_token) {
          return { next_token: tokenPagination.next_token } as TokenPaginationOptions;
        }
        return null;

      default:
        return null;
    }
  }

  /**
   * Get previous page options
   */
  getPreviousPageOptions(result: PaginatedResult<any>): UnifiedPaginationOptions | null {
    switch (this.config.strategy) {
      case PaginationStrategy.OFFSET:
        const offsetPagination = result.pagination as OffsetPaginationResponse;
        if (offsetPagination.page > 1) {
          return {
            page: offsetPagination.page - 1,
            per_page: offsetPagination.per_page
          } as OffsetPaginationOptions;
        }
        return null;

      case PaginationStrategy.CURSOR:
        const cursorPagination = result.pagination as CursorPaginationResponse;
        if (cursorPagination.cursor?.previous) {
          return { cursor: cursorPagination.cursor.previous } as CursorPaginationOptions;
        }
        return null;

      case PaginationStrategy.TOKEN:
        // Token pagination typically doesn't support backward navigation
        return null;

      default:
        return null;
    }
  }

  /**
   * Get pagination strategy for this manager
   */
  getStrategy(): PaginationStrategy {
    return this.config.strategy;
  }

  /**
   * Get configuration for this manager
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Validate pagination options against the strategy
   */
  validateOptions(options: UnifiedPaginationOptions): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (this.config.strategy) {
      case PaginationStrategy.OFFSET:
        const offsetOptions = options as OffsetPaginationOptions;
        if (offsetOptions.page !== undefined && offsetOptions.page < 1) {
          errors.push('Page must be >= 1');
        }
        if (offsetOptions.per_page !== undefined && offsetOptions.per_page > this.config.max_limit) {
          errors.push(`per_page cannot exceed ${this.config.max_limit}`);
        }
        if (offsetOptions.per_page !== undefined && offsetOptions.per_page < 1) {
          errors.push('per_page must be >= 1');
        }
        break;

      case PaginationStrategy.CURSOR:
        const cursorOptions = options as CursorPaginationOptions;
        if (cursorOptions.limit !== undefined && cursorOptions.limit > this.config.max_limit) {
          errors.push(`limit cannot exceed ${this.config.max_limit}`);
        }
        if (cursorOptions.limit !== undefined && cursorOptions.limit < 1) {
          errors.push('limit must be >= 1');
        }
        break;

      case PaginationStrategy.TOKEN:
        const tokenOptions = options as TokenPaginationOptions;
        if (tokenOptions.limit !== undefined && tokenOptions.limit > this.config.max_limit) {
          errors.push(`limit cannot exceed ${this.config.max_limit}`);
        }
        if (tokenOptions.limit !== undefined && tokenOptions.limit < 1) {
          errors.push('limit must be >= 1');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
