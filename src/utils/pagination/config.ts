// Pagination configuration registry for Cakemail API endpoints

import { PaginationStrategy, EndpointPaginationConfig } from './types.js';

// Registry of endpoint configurations
export class PaginationConfigRegistry {
  private static configs: Map<string, EndpointPaginationConfig> = new Map([
    // Offset-based pagination (most Cakemail endpoints)
    ['lists', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    ['contacts', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    ['campaigns', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 10,
      max_limit: 50,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    ['templates', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    ['senders', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    ['sub_accounts', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    // Cursor-based pagination (logs endpoints)
    ['logs', {
      strategy: PaginationStrategy.CURSOR,
      default_limit: 50,
      max_limit: 100,
      cursor_param: 'cursor'
    }],
    
    ['campaign_logs', {
      strategy: PaginationStrategy.CURSOR,
      default_limit: 50,
      max_limit: 100,
      cursor_param: 'cursor'
    }],
    
    ['email_logs', {
      strategy: PaginationStrategy.OFFSET, // Email API uses offset pagination
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    ['email_stats', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    // Actions and workflows
    ['actions', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    ['workflows', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    // Reports and exports
    ['campaign_reports', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }],
    
    ['exports', {
      strategy: PaginationStrategy.OFFSET,
      default_limit: 50,
      max_limit: 100,
      page_param: 'page',
      size_param: 'per_page'
    }]
  ]);

  static getConfig(endpoint: string): EndpointPaginationConfig {
    const config = this.configs.get(endpoint);
    if (!config) {
      // Return default offset-based configuration for unknown endpoints
      return {
        strategy: PaginationStrategy.OFFSET,
        default_limit: 50,
        max_limit: 100,
        page_param: 'page',
        size_param: 'per_page'
      };
    }
    return config;
  }

  static registerEndpoint(endpoint: string, config: EndpointPaginationConfig): void {
    this.configs.set(endpoint, config);
  }

  static getAllConfigs(): Map<string, EndpointPaginationConfig> {
    return new Map(this.configs);
  }

  static hasConfig(endpoint: string): boolean {
    return this.configs.has(endpoint);
  }

  static removeConfig(endpoint: string): boolean {
    return this.configs.delete(endpoint);
  }

  static clear(): void {
    this.configs.clear();
  }
}
