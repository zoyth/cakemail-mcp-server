// Unified pagination types for Cakemail API

// Base pagination options that all endpoints can use
export interface BasePaginationOptions {
  limit?: number;
  maxResults?: number;
}

// Offset-based pagination (page/per_page) - most Cakemail endpoints
export interface OffsetPaginationOptions extends BasePaginationOptions {
  page?: number;
  per_page?: number;
  with_count?: boolean;
}

// Cursor-based pagination - used by logs endpoints
export interface CursorPaginationOptions extends BasePaginationOptions {
  cursor?: string;
  before?: string;
  after?: string;
}

// Token-based pagination - for future compatibility
export interface TokenPaginationOptions extends BasePaginationOptions {
  next_token?: string;
  page_token?: string;
}

// Union type for all pagination options
export type UnifiedPaginationOptions = OffsetPaginationOptions | CursorPaginationOptions | TokenPaginationOptions;

// Base response structure
export interface BasePaginationResponse {
  has_more: boolean;
  total_count?: number;
}

// Offset-based response
export interface OffsetPaginationResponse extends BasePaginationResponse {
  page: number;
  per_page: number;
  total_pages?: number;
}

// Cursor-based response
export interface CursorPaginationResponse extends BasePaginationResponse {
  cursor?: {
    previous?: string;
    next?: string;
  };
}

// Token-based response
export interface TokenPaginationResponse extends BasePaginationResponse {
  next_token?: string;
  page_token?: string;
}

// Union type for all pagination responses
export type UnifiedPaginationResponse = OffsetPaginationResponse | CursorPaginationResponse | TokenPaginationResponse;

// Unified paginated result
export interface PaginatedResult<T> {
  data: T[];
  pagination: UnifiedPaginationResponse;
  raw_response?: any;
}

// Pagination strategy enumeration
export enum PaginationStrategy {
  OFFSET = 'offset',
  CURSOR = 'cursor',
  TOKEN = 'token'
}

// Configuration for different API endpoints
export interface EndpointPaginationConfig {
  strategy: PaginationStrategy;
  default_limit: number;
  max_limit: number;
  page_param?: string;
  size_param?: string;
  cursor_param?: string;
  token_param?: string;
}

// Async iterator options
export interface IteratorOptions {
  page?: number;
  per_page?: number;
  limit?: number;
  maxResults?: number;
  with_count?: boolean;
  cursor?: string;
  before?: string;
  after?: string;
  next_token?: string;
  page_token?: string;
  batchSize?: number;
  concurrency?: number;
  retryAttempts?: number;
}
