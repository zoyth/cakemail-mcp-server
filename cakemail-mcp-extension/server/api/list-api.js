// List API operations
import { BaseApiClient } from './base-client.js';
export class ListApi extends BaseApiClient {
    async getLists(filters = {}) {
        const params = new URLSearchParams();
        if (filters.page)
            params.append('page', filters.page.toString());
        if (filters.per_page)
            params.append('per_page', filters.per_page.toString());
        if (filters.status)
            params.append('status', filters.status);
        if (filters.name)
            params.append('name', filters.name);
        if (filters.sort)
            params.append('sort', filters.sort);
        if (filters.order)
            params.append('order', filters.order);
        if (filters.with_count !== undefined)
            params.append('with_count', filters.with_count.toString());
        // Add account_id if provided or from current context
        if (filters.account_id) {
            params.append('account_id', filters.account_id.toString());
        }
        else {
            const accountId = await this.getCurrentAccountId();
            if (accountId)
                params.append('account_id', accountId.toString());
        }
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.makeRequest(`/lists${query}`);
    }
    async createList(data, options = {}) {
        const listData = {
            name: data.name,
            default_sender: data.default_sender,
            language: data.language || 'en_US',
            redirections: data.redirections || {},
            webhook: data.webhook || {}
        };
        const params = new URLSearchParams();
        if (options.account_id) {
            params.append('account_id', options.account_id.toString());
        }
        else {
            const accountId = await this.getCurrentAccountId();
            if (accountId)
                params.append('account_id', accountId.toString());
        }
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.makeRequest(`/lists${query}`, {
            method: 'POST',
            body: JSON.stringify(listData)
        });
    }
    async getList(listId, options = {}) {
        const params = new URLSearchParams();
        if (options.account_id) {
            params.append('account_id', options.account_id.toString());
        }
        else {
            const accountId = await this.getCurrentAccountId();
            if (accountId)
                params.append('account_id', accountId.toString());
        }
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.makeRequest(`/lists/${listId}${query}`);
    }
    async updateList(listId, data, options = {}) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.default_sender !== undefined)
            updateData.default_sender = data.default_sender;
        if (data.language !== undefined)
            updateData.language = data.language;
        if (data.redirections !== undefined)
            updateData.redirections = data.redirections;
        if (data.webhook !== undefined)
            updateData.webhook = data.webhook;
        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        const params = new URLSearchParams();
        if (options.account_id) {
            params.append('account_id', options.account_id.toString());
        }
        else {
            const accountId = await this.getCurrentAccountId();
            if (accountId)
                params.append('account_id', accountId.toString());
        }
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.makeRequest(`/lists/${listId}${query}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData)
        });
    }
    async deleteList(listId, options = {}) {
        const params = new URLSearchParams();
        if (options.account_id) {
            params.append('account_id', options.account_id.toString());
        }
        else {
            const accountId = await this.getCurrentAccountId();
            if (accountId)
                params.append('account_id', accountId.toString());
        }
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.makeRequest(`/lists/${listId}${query}`, {
            method: 'DELETE'
        });
    }
    async archiveList(listId, options = {}) {
        const params = new URLSearchParams();
        if (options.account_id) {
            params.append('account_id', options.account_id.toString());
        }
        else {
            const accountId = await this.getCurrentAccountId();
            if (accountId)
                params.append('account_id', accountId.toString());
        }
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.makeRequest(`/lists/${listId}/archive${query}`, {
            method: 'POST'
        });
    }
    async getListStats(listId, params) {
        const queryParams = new URLSearchParams();
        if (params?.start_time)
            queryParams.append('start_time', params.start_time.toString());
        if (params?.end_time)
            queryParams.append('end_time', params.end_time.toString());
        if (params?.interval)
            queryParams.append('interval', params.interval);
        const accountId = await this.getCurrentAccountId();
        if (accountId)
            queryParams.append('account_id', accountId.toString());
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        // Note: This endpoint might need to be adjusted based on actual API documentation
        // Using a generic stats endpoint for now
        return this.makeRequest(`/lists/${listId}/stats${query}`);
    }
    // Helper methods
    async findListByName(name) {
        const response = await this.getLists({ name, per_page: 50 });
        const list = response.data?.find(l => l.name === name);
        return list || null;
    }
    async getActiveLists() {
        const response = await this.getLists({ status: 'active', per_page: 100 });
        return response.data || [];
    }
    async getAllLists() {
        const allLists = [];
        let page = 1;
        let hasMore = true;
        while (hasMore) {
            const response = await this.getLists({ page, per_page: 100, with_count: true });
            if (response.data && response.data.length > 0) {
                allLists.push(...response.data);
            }
            hasMore = response.data?.length === 100;
            page++;
        }
        return allLists;
    }
    async processListsInBatches(processor) {
        let page = 1;
        let hasMore = true;
        while (hasMore) {
            const response = await this.getLists({ page, per_page: 100 });
            if (response.data && response.data.length > 0) {
                await processor(response.data);
            }
            hasMore = response.data?.length === 100;
            page++;
        }
    }
}
//# sourceMappingURL=list-api.js.map