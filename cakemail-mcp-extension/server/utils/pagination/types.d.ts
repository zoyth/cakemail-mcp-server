export interface BasePaginationOptions {
    limit?: number;
    maxResults?: number;
}
export interface OffsetPaginationOptions extends BasePaginationOptions {
    page?: number;
    per_page?: number;
    with_count?: boolean;
}
export interface CursorPaginationOptions extends BasePaginationOptions {
    cursor?: string;
    before?: string;
    after?: string;
}
export interface TokenPaginationOptions extends BasePaginationOptions {
    next_token?: string;
    page_token?: string;
}
export type UnifiedPaginationOptions = OffsetPaginationOptions | CursorPaginationOptions | TokenPaginationOptions;
export interface BasePaginationResponse {
    has_more: boolean;
    total_count?: number;
}
export interface OffsetPaginationResponse extends BasePaginationResponse {
    page: number;
    per_page: number;
    total_pages?: number;
}
export interface CursorPaginationResponse extends BasePaginationResponse {
    cursor?: {
        previous?: string;
        next?: string;
    };
}
export interface TokenPaginationResponse extends BasePaginationResponse {
    next_token?: string;
    page_token?: string;
}
export type UnifiedPaginationResponse = OffsetPaginationResponse | CursorPaginationResponse | TokenPaginationResponse;
export interface PaginatedResult<T> {
    data: T[];
    pagination: UnifiedPaginationResponse;
    raw_response?: any;
}
export declare enum PaginationStrategy {
    OFFSET = "offset",
    CURSOR = "cursor",
    TOKEN = "token"
}
export interface EndpointPaginationConfig {
    strategy: PaginationStrategy;
    default_limit: number;
    max_limit: number;
    page_param?: string;
    size_param?: string;
    cursor_param?: string;
    token_param?: string;
}
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
//# sourceMappingURL=types.d.ts.map