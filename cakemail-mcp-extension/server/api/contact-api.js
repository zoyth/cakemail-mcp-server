// Contact and List API operations
import { BaseApiClient } from './base-client.js';
export class ContactApi extends BaseApiClient {
    // Contact Management - Legacy method (deprecated)
    async getContacts(params) {
        const enhancedParams = { ...params };
        const accountId = await this.getCurrentAccountId();
        if (accountId && !enhancedParams.account_id) {
            enhancedParams.account_id = accountId;
        }
        const query = enhancedParams ? `?${new URLSearchParams(enhancedParams)}` : '';
        return this.makeRequest(`/contacts${query}`);
    }
    // NEW: Unified pagination method for contacts
    async getContactsPaginated(listId, options = {}, additionalFilters = {}) {
        const accountId = await this.getCurrentAccountId();
        const params = {
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
    getContactsIterator(listId, options = {}, filters = {}) {
        // We'll handle account_id synchronously in the iterator's fetch function
        const baseParams = {
            ...filters
        };
        if (listId) {
            baseParams.list_id = listId;
        }
        const endpoint = listId ? `/lists/${listId}/contacts` : '/contacts';
        return this.createRobustIterator(endpoint, 'contacts', {
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
        baseParams);
    }
    // NEW: Get all contacts from a list with automatic pagination
    async getAllContacts(listId, options = {}, filters = {}) {
        const iterator = this.getContactsIterator(listId, options, filters);
        return iterator.toArray();
    }
    // NEW: Process contacts in batches
    async processContactsInBatches(listId, processor, options = {}, filters = {}) {
        const iterator = this.getContactsIterator(listId, options, filters);
        for await (const batch of iterator.batches()) {
            await processor(batch);
        }
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
    // List Management with correct sort syntax - Legacy method (deprecated)
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
    // NEW: Unified pagination method for lists
    async getListsPaginated(options = {}, 
    // Using inline comment to avoid unused variable error
    additionalFilters = {}) {
        const accountId = await this.getCurrentAccountId();
        const params = {
            ...additionalFilters,
            account_id: additionalFilters.account_id || accountId
        };
        // Handle sorting with correct API syntax ([-|+]term)
        if (additionalFilters.sort) {
            const direction = additionalFilters.order === 'desc' ? '-' : '+';
            params.sort = `${direction}${additionalFilters.sort}`;
            // Remove the separate order parameter
            delete params.order;
        }
        else {
            params.sort = '-created_on'; // Default sort
        }
        return this.fetchPaginated('/lists', 'lists', options, params);
    }
    // NEW: Iterator for automatic pagination through lists
    getListsIterator(options = {}, filters = {}) {
        // Build base params from filters
        const queryParams = {
            ...filters
        };
        return this.createRobustIterator('/lists', 'lists', {
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
        queryParams);
    }
    // NEW: Get all lists with automatic pagination
    async getAllLists(options = {}, filters = {}) {
        const iterator = this.getListsIterator(options, filters);
        return iterator.toArray();
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
    // Additional helper methods for tests
    async unsubscribeContact(listId, contactId) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/lists/${listId}/contacts/${contactId}/unsubscribe${query}`, {
            method: 'POST'
        });
    }
    async importContacts(listId, contacts, updateExisting = false) {
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
    async tagContacts(listId, contactIds, tags) {
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
    async untagContacts(listId, contactIds, tags) {
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
    async searchContacts(listId, params) {
        const accountId = await this.getCurrentAccountId();
        const queryParams = new URLSearchParams();
        if (accountId)
            queryParams.append('account_id', accountId.toString());
        if (params.query)
            queryParams.append('query', params.query);
        if (params.page)
            queryParams.append('page', params.page.toString());
        if (params.per_page)
            queryParams.append('per_page', params.per_page.toString());
        // Handle filters
        if (params.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        queryParams.append(key, value.join(','));
                    }
                    else {
                        queryParams.append(key, String(value));
                    }
                }
            });
        }
        return this.makeRequest(`/lists/${listId}/contacts/search?${queryParams.toString()}`);
    }
    async findContactByEmail(email) {
        const response = await this.getContacts({ email });
        if (response.data && response.data.length > 0) {
            return response.data[0];
        }
        return null;
    }
    async getActiveContactsInList(listId) {
        const response = await this.getContacts({ list_id: listId, status: 'active' });
        return response.data || [];
    }
    async ensureContactExists(listId, email) {
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
//# sourceMappingURL=contact-api.js.map