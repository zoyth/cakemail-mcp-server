// List API operations

import { BaseApiClient } from './base-client.js';

export interface ListData {
  name: string;
  default_sender: {
    name: string;
    email: string;
  };
  language?: string;
  redirections?: {
    subscribe?: string;
    unsubscribe?: string;
    update?: string;
  };
  webhook?: {
    url?: string;
    actions?: string[];
  };
}

export interface UpdateListData {
  name?: string;
  default_sender?: {
    name: string;
    email: string;
  };
  language?: string;
  redirections?: {
    subscribe?: string;
    unsubscribe?: string;
    update?: string;
  };
  webhook?: {
    url?: string;
    actions?: string[];
  };
}

export interface ListFilters {
  page?: number;
  per_page?: number;
  status?: string;
  name?: string;
  sort?: 'name' | 'created_on' | 'updated_on' | 'status';
  order?: 'asc' | 'desc';
  with_count?: boolean;
  account_id?: number;
}

export interface ListsResponse {
  pagination: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
  data: any[];
}

export interface ListResponse {
  data: any;
}

export interface CreateListResponse {
  data: any;
}

export interface ListStatsParams {
  list_id: string;
  start_time?: number;
  end_time?: number;
  interval?: 'hour' | 'day' | 'week' | 'month';
  account_id?: number;
}

export interface ListStatsResponse {
  data: any;
}

export class ListApi extends BaseApiClient {

  async getLists(filters: ListFilters = {}): Promise<ListsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.name) params.append('name', filters.name);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);
    if (filters.with_count !== undefined) params.append('with_count', filters.with_count.toString());
    
    // Add account_id if provided or from current context
    if (filters.account_id) {
      params.append('account_id', filters.account_id.toString());
    } else {
      const accountId = await this.getCurrentAccountId();
      if (accountId) params.append('account_id', accountId.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest(`/lists${query}`);
  }

  async createList(data: ListData, options: { account_id?: number } = {}): Promise<CreateListResponse> {
    if (!this.isValidEmail(data.default_sender.email)) {
      throw new Error('Invalid email format for default sender');
    }

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
    } else {
      const accountId = await this.getCurrentAccountId();
      if (accountId) params.append('account_id', accountId.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : '';

    return this.makeRequest(`/lists${query}`, {
      method: 'POST',
      body: JSON.stringify(listData)
    });
  }

  async getList(listId: string, options: { account_id?: number } = {}): Promise<ListResponse> {
    const params = new URLSearchParams();
    
    if (options.account_id) {
      params.append('account_id', options.account_id.toString());
    } else {
      const accountId = await this.getCurrentAccountId();
      if (accountId) params.append('account_id', accountId.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.makeRequest(`/lists/${listId}${query}`);
  }

  async updateList(listId: string, data: UpdateListData, options: { account_id?: number } = {}): Promise<ListResponse> {
    if (data.default_sender?.email && !this.isValidEmail(data.default_sender.email)) {
      throw new Error('Invalid email format for default sender');
    }

    const updateData: Record<string, any> = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.default_sender !== undefined) updateData.default_sender = data.default_sender;
    if (data.language !== undefined) updateData.language = data.language;
    if (data.redirections !== undefined) updateData.redirections = data.redirections;
    if (data.webhook !== undefined) updateData.webhook = data.webhook;

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const params = new URLSearchParams();
    
    if (options.account_id) {
      params.append('account_id', options.account_id.toString());
    } else {
      const accountId = await this.getCurrentAccountId();
      if (accountId) params.append('account_id', accountId.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : '';

    return this.makeRequest(`/lists/${listId}${query}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  }

  async deleteList(listId: string, options: { account_id?: number } = {}): Promise<{ success: true; status: number }> {
    const params = new URLSearchParams();
    
    if (options.account_id) {
      params.append('account_id', options.account_id.toString());
    } else {
      const accountId = await this.getCurrentAccountId();
      if (accountId) params.append('account_id', accountId.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    
    return this.makeRequest(`/lists/${listId}${query}`, { 
      method: 'DELETE' 
    });
  }

  async archiveList(listId: string, options: { account_id?: number } = {}): Promise<{ success: true; status: number }> {
    const params = new URLSearchParams();
    
    if (options.account_id) {
      params.append('account_id', options.account_id.toString());
    } else {
      const accountId = await this.getCurrentAccountId();
      if (accountId) params.append('account_id', accountId.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    
    return this.makeRequest(`/lists/${listId}/archive${query}`, { 
      method: 'POST' 
    });
  }

  async getListStats(params: ListStatsParams): Promise<ListStatsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.start_time) queryParams.append('start_time', params.start_time.toString());
    if (params.end_time) queryParams.append('end_time', params.end_time.toString());
    if (params.interval) queryParams.append('interval', params.interval);
    
    if (params.account_id) {
      queryParams.append('account_id', params.account_id.toString());
    } else {
      const accountId = await this.getCurrentAccountId();
      if (accountId) queryParams.append('account_id', accountId.toString());
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    // Note: This endpoint might need to be adjusted based on actual API documentation
    // Using a generic stats endpoint for now
    return this.makeRequest(`/lists/${params.list_id}/stats${query}`);
  }
}
