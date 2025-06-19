// Contact and List API operations

import { BaseApiClient } from './base-client.js';
import { 
  CreateContactData, 
  UpdateContactData,
  CreateListData,
  UpdateListData,
  PaginationParams,
  SortParams,
  ContactsResponse,
  ContactResponse,
  CreateContactResponse,
  ListsResponse,
  ListResponse,
  CreateListResponse
} from '../types/cakemail-types.js';
import {
  UnifiedPaginationOptions,
  PaginatedResult,
  PaginatedIterator,
  IteratorOptions
} from '../utils/pagination/index.js';

export class ContactApi extends BaseApiClient {

  // Contact Management - Legacy method (deprecated)
  async getContacts(params?: PaginationParams & { list_id?: string; account_id?: number; email?: string; status?: string }): Promise<ContactsResponse> {
    const enhancedParams = { ...params };
    const accountId = await this.getCurrentAccountId();
    if (accountId && !enhancedParams.account_id) {
      enhancedParams.account_id = accountId;
    }
    
    const query = enhancedParams ? `?${new URLSearchParams(enhancedParams as any)}` : '';
    return this.makeRequest(`/contacts${query}`);
  }

  // NEW: Unified pagination method for contacts
  async getContactsPaginated(
    listId?: string, 
    options: UnifiedPaginationOptions = {},
    additionalFilters: { account_id?: number; status?: string; email?: string; list_id?: string } = {}
  ): Promise<PaginatedResult<any>> {
    const accountId = await this.getCurrentAccountId();
    const params: any = {
      ...additionalFilters,
      account_id: additionalFilters.account_id || accountId
    };
    
    if (listId) {
      params.list_id = listId;
    }
    
    const endpoint = listId ? `/lists/${listId}/contacts` : '/contacts';
    return this.fetchPaginated(endpoint, 'contacts', options, params);
  }

  // NEW: Iterator for automatic pagination through contacts
  getContactsIterator(
    listId?: string,
    options: IteratorOptions = {},
    filters: { account_id?: number; status?: string; email?: string; list_id?: string } = {}
  ): PaginatedIterator<any> {
    // We'll handle account_id synchronously in the iterator's fetch function
    const baseParams: any = {
      ...filters
    };
    
    if (listId) {
      baseParams.list_id = listId;
    }
    
    const endpoint = listId ? `/lists/${listId}/contacts` : '/contacts';
    
    return this.createRobustIterator(
      endpoint,
      'contacts',
      {
        ...options,
        validateResponse: (response) => {
          // Validate that response has expected structure
          return response && (Array.isArray(response.data) || (response.data && Array.isArray(response.data.data)));
        },
        onError: (error, attempt) => {
          if (this.debugMode) {
            console.warn(`[Contact API] Attempt ${attempt} failed:`, error.message);
          }
        }
      },
      // Pass baseParams to be used by the iterator
      baseParams
    );
  }

  // NEW: Get all contacts from a list with automatic pagination
  async getAllContacts(
    listId?: string,
    options: IteratorOptions = {},
    filters: { account_id?: number; status?: string; email?: string; list_id?: string } = {}
  ): Promise<any[]> {
    const iterator = this.getContactsIterator(listId, options, filters);
    return iterator.toArray();
  }

  // NEW: Process contacts in batches
  async processContactsInBatches(
    listId: string,
    processor: (contacts: any[]) => Promise<void>,
    options: IteratorOptions = {},
    filters: { account_id?: number; status?: string; email?: string; list_id?: string } = {}
  ): Promise<void> {
    const iterator = this.getContactsIterator(listId, options, filters);
    for await (const batch of iterator.batches()) {
      await processor(batch);
    }
  }

  async createContact(data: CreateContactData): Promise<CreateContactResponse> {
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    const contactData = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      list_id: parseInt(String(data.list_id)),
      custom_fields: data.custom_fields,
    };

    // Remove undefined fields
    Object.keys(contactData).forEach(key => {
      if ((contactData as any)[key] === undefined) {
        delete (contactData as any)[key];
      }
    });

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    return this.makeRequest(`/lists/${data.list_id}/contacts${query}`, {
      method: 'POST',
      body: JSON.stringify(contactData)
    });
  }

  async getContact(contactId: string): Promise<ContactResponse> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/contacts/${contactId}${query}`);
  }

  async updateContact(contactId: string, data: UpdateContactData): Promise<ContactResponse> {
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    const updateData: Record<string, any> = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      custom_fields: data.custom_fields,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    return this.makeRequest(`/contacts/${contactId}${query}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  }

  async deleteContact(contactId: string): Promise<{ success: true; status: number }> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/contacts/${contactId}${query}`, { 
      method: 'DELETE' 
    });
  }

  // List Management with correct sort syntax - Legacy method (deprecated)
  async getLists(params?: PaginationParams & SortParams & { account_id?: number }): Promise<ListsResponse> {
    const enhancedParams: any = {
      sort: '-created_on', // Use correct API syntax
      ...params
    };

    // Handle sorting with correct API syntax ([-|+]term)
    if (params?.sort) {
      const direction = params?.order === 'desc' ? '-' : '+';
      enhancedParams.sort = `${direction}${params.sort}`;
    }

    const accountId = await this.getCurrentAccountId();
    if (accountId && !enhancedParams.account_id) {
      enhancedParams.account_id = accountId;
    }
    
    const query = enhancedParams ? `?${new URLSearchParams(enhancedParams)}` : '';
    return this.makeRequest(`/lists${query}`);
  }

  // NEW: Unified pagination method for lists
  async getListsPaginated(
    options: UnifiedPaginationOptions = {},
    // Using inline comment to avoid unused variable error
    additionalFilters: { account_id?: number; status?: string; name?: string; sort?: string; order?: 'asc' | 'desc' } = {}
  ): Promise<PaginatedResult<any>> {
    const accountId = await this.getCurrentAccountId();
    const params: any = {
      ...additionalFilters,
      account_id: additionalFilters.account_id || accountId
    };
    
    // Handle sorting with correct API syntax ([-|+]term)
    if (additionalFilters.sort) {
      const direction = additionalFilters.order === 'desc' ? '-' : '+';
      params.sort = `${direction}${additionalFilters.sort}`;
      // Remove the separate order parameter
      delete params.order;
    } else {
      params.sort = '-created_on'; // Default sort
    }
    
    return this.fetchPaginated('/lists', 'lists', options, params);
  }

  // NEW: Iterator for automatic pagination through lists
  getListsIterator(
    options: IteratorOptions = {},
    filters: { account_id?: number; status?: string; name?: string; sort?: string; order?: 'asc' | 'desc' } = {}
  ): PaginatedIterator<any> {
    // Build base params from filters
    const queryParams = {
      ...filters
    };
    
    return this.createRobustIterator(
      '/lists',
      'lists',
      {
        ...options,
        validateResponse: (response) => {
          return response && (Array.isArray(response.data) || (response.data && Array.isArray(response.data.data)));
        },
        onError: (error, attempt) => {
          if (this.debugMode) {
            console.warn(`[Contact API] Lists iteration attempt ${attempt} failed:`, error.message);
          }
        }
      },
      // Pass queryParams to be used by the iterator
      queryParams
    );
  }

  // NEW: Get all lists with automatic pagination
  async getAllLists(
    options: IteratorOptions = {},
    filters: { account_id?: number; status?: string; name?: string; sort?: string; order?: 'asc' | 'desc' } = {}
  ): Promise<any[]> {
    const iterator = this.getListsIterator(options, filters);
    return iterator.toArray();
  }

  async createList(data: CreateListData): Promise<CreateListResponse> {
    const listData = {
      name: data.name,
      description: data.description,
      language: data.language || 'en_US',
    };

    // Remove undefined fields
    Object.keys(listData).forEach(key => {
      if ((listData as any)[key] === undefined) {
        delete (listData as any)[key];
      }
    });

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    return this.makeRequest(`/lists${query}`, {
      method: 'POST',
      body: JSON.stringify(listData)
    });
  }

  async getList(listId: string): Promise<ListResponse> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/lists/${listId}${query}`);
  }

  async updateList(listId: string, data: UpdateListData): Promise<ListResponse> {
    const updateData: Record<string, any> = {
      name: data.name,
      description: data.description,
      language: data.language,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    return this.makeRequest(`/lists/${listId}${query}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  }

  async deleteList(listId: string): Promise<{ success: true; status: number }> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/lists/${listId}${query}`, { 
      method: 'DELETE' 
    });
  }

  // Additional helper methods for tests
  async unsubscribeContact(listId: string, contactId: string): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/lists/${listId}/contacts/${contactId}/unsubscribe${query}`, {
      method: 'POST'
    });
  }

  async importContacts(listId: string, contacts: any[], updateExisting: boolean = false): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    const importData = {
      contacts,
      update_existing: updateExisting
    };
    
    return this.makeRequest(`/lists/${listId}/contacts/import${query}`, {
      method: 'POST',
      body: JSON.stringify(importData)
    });
  }

  async tagContacts(listId: string, contactIds: number[], tags: string[]): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    const tagData = {
      contact_ids: contactIds,
      tags
    };
    
    return this.makeRequest(`/lists/${listId}/contacts/tags${query}`, {
      method: 'POST',
      body: JSON.stringify(tagData)
    });
  }

  async untagContacts(listId: string, contactIds: number[], tags: string[]): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    const tagData = {
      contact_ids: contactIds,
      tags
    };
    
    return this.makeRequest(`/lists/${listId}/contacts/tags${query}`, {
      method: 'DELETE',
      body: JSON.stringify(tagData)
    });
  }

  async searchContacts(listId: string, params: { query?: string; filters?: any; page?: number; per_page?: number }): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const queryParams = new URLSearchParams();
    
    if (accountId) queryParams.append('account_id', accountId.toString());
    if (params.query) queryParams.append('query', params.query);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    
    // Handle filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    return this.makeRequest(`/lists/${listId}/contacts/search?${queryParams.toString()}`);
  }

  async findContactByEmail(email: string): Promise<any | null> {
    const response = await this.getContacts({ email });
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    return null;
  }

  async getActiveContactsInList(listId: string): Promise<any[]> {
    const response = await this.getContacts({ list_id: listId, status: 'active' });
    return response.data || [];
  }

  async ensureContactExists(listId: string, email: string): Promise<any> {
    // Check if contact exists
    const existing = await this.findContactByEmail(email);
    if (existing) {
      return existing;
    }
    
    // Create new contact
    const response = await this.createContact({
      list_id: parseInt(listId),
      email
    });
    return response.data;
  }
}
