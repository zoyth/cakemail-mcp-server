// Unified pagination manager for handling different pagination strategies
import { PaginationStrategy } from './types.js';
import { PaginationConfigRegistry } from './config.js';
export class PaginationManager {
    // private endpoint: string; // Commented out as it's declared but not used
    config;
    constructor(endpoint) {
        // this.endpoint = endpoint; // Not needed since we don't use it
        this.config = PaginationConfigRegistry.getConfig(endpoint);
    }
    /**
     * Build query parameters for the given pagination options
     */
    buildQueryParams(options = {}) {
        const params = {};
        switch (this.config.strategy) {
            case PaginationStrategy.OFFSET:
                const offsetOptions = options;
                if (offsetOptions.page !== undefined) {
                    params[this.config.page_param] = offsetOptions.page;
                }
                if (offsetOptions.per_page !== undefined) {
                    const limit = Math.min(offsetOptions.per_page, this.config.max_limit);
                    params[this.config.size_param] = limit;
                }
                else {
                    params[this.config.size_param] = this.config.default_limit;
                }
                if (offsetOptions.with_count !== undefined) {
                    params['with_count'] = offsetOptions.with_count;
                }
                break;
            case PaginationStrategy.CURSOR:
                const cursorOptions = options;
                if (cursorOptions.cursor) {
                    params[this.config.cursor_param] = cursorOptions.cursor;
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
                const tokenOptions = options;
                if (tokenOptions.next_token) {
                    params[this.config.token_param] = tokenOptions.next_token;
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
    parseResponse(response) {
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        let pagination;
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
                };
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
                };
                break;
            case PaginationStrategy.TOKEN:
                pagination = {
                    next_token: response.next_token || response.page_token,
                    page_token: response.page_token,
                    total_count: response.total_count,
                    has_more: Boolean(response.next_token || response.page_token)
                };
                break;
            default:
                pagination = { has_more: false };
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
    getNextPageOptions(result) {
        if (!result.pagination.has_more) {
            return null;
        }
        switch (this.config.strategy) {
            case PaginationStrategy.OFFSET:
                const offsetPagination = result.pagination;
                return {
                    page: offsetPagination.page + 1,
                    per_page: offsetPagination.per_page
                };
            case PaginationStrategy.CURSOR:
                const cursorPagination = result.pagination;
                if (cursorPagination.cursor?.next) {
                    return { cursor: cursorPagination.cursor.next };
                }
                return null;
            case PaginationStrategy.TOKEN:
                const tokenPagination = result.pagination;
                if (tokenPagination.next_token) {
                    return { next_token: tokenPagination.next_token };
                }
                return null;
            default:
                return null;
        }
    }
    /**
     * Get previous page options
     */
    getPreviousPageOptions(result) {
        switch (this.config.strategy) {
            case PaginationStrategy.OFFSET:
                const offsetPagination = result.pagination;
                if (offsetPagination.page > 1) {
                    return {
                        page: offsetPagination.page - 1,
                        per_page: offsetPagination.per_page
                    };
                }
                return null;
            case PaginationStrategy.CURSOR:
                const cursorPagination = result.pagination;
                if (cursorPagination.cursor?.previous) {
                    return { cursor: cursorPagination.cursor.previous };
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
    getStrategy() {
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
    validateOptions(options) {
        const errors = [];
        switch (this.config.strategy) {
            case PaginationStrategy.OFFSET:
                const offsetOptions = options;
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
                const cursorOptions = options;
                if (cursorOptions.limit !== undefined && cursorOptions.limit > this.config.max_limit) {
                    errors.push(`limit cannot exceed ${this.config.max_limit}`);
                }
                if (cursorOptions.limit !== undefined && cursorOptions.limit < 1) {
                    errors.push('limit must be >= 1');
                }
                break;
            case PaginationStrategy.TOKEN:
                const tokenOptions = options;
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
//# sourceMappingURL=manager.js.map