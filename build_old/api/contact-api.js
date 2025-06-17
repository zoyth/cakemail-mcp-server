// Contact and List API operations
import { BaseApiClient } from './base-client.js';
export class ContactApi extends BaseApiClient {
    // Contact Management
    async getContacts(params) {
        const enhancedParams = { ...params };
        const accountId = await this.getCurrentAccountId();
        if (accountId && !enhancedParams.account_id) {
            enhancedParams.account_id = accountId;
        }
        const query = enhancedParams ? `?${new URLSearchParams(enhancedParams)}` : '';
        return this.makeRequest(`/contacts${query}`);
    }
    async createContact(data) {
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
            if (contactData[key] === undefined) {
                delete contactData[key];
            }
        });
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/lists/${data.list_id}/contacts${query}`, {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }
    async getContact(contactId) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/contacts/${contactId}${query}`);
    }
    async updateContact(contactId, data) {
        if (data.email && !this.isValidEmail(data.email)) {
            throw new Error('Invalid email format');
        }
        const updateData = {
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
    async deleteContact(contactId) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/contacts/${contactId}${query}`, {
            method: 'DELETE'
        });
    }
    // List Management with correct sort syntax
    async getLists(params) {
        const enhancedParams = {
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
    async createList(data) {
        const listData = {
            name: data.name,
            description: data.description,
            language: data.language || 'en_US',
        };
        // Remove undefined fields
        Object.keys(listData).forEach(key => {
            if (listData[key] === undefined) {
                delete listData[key];
            }
        });
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/lists${query}`, {
            method: 'POST',
            body: JSON.stringify(listData)
        });
    }
    async getList(listId) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/lists/${listId}${query}`);
    }
    async updateList(listId, data) {
        const updateData = {
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
    async deleteList(listId) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/lists/${listId}${query}`, {
            method: 'DELETE'
        });
    }
}
//# sourceMappingURL=contact-api.js.map