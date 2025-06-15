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

export class ContactApi extends BaseApiClient {

  // Contact Management
  async getContacts(params?: PaginationParams & { list_id?: string; account_id?: number }): Promise<ContactsResponse> {
    const enhancedParams = { ...params };
    const accountId = await this.getCurrentAccountId();
    if (accountId && !enhancedParams.account_id) {
      enhancedParams.account_id = accountId;
    }
    
    const query = enhancedParams ? `?${new URLSearchParams(enhancedParams as any)}` : '';
    return this.makeRequest(`/contacts${query}`);
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

  // List Management with correct sort syntax
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
}
