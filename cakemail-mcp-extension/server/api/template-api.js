// Enhanced Template API operations
import { BaseApiClient } from './base-client.js';
export class TemplateApi extends BaseApiClient {
    /**
     * List all templates with filtering, sorting and pagination
     */
    async getTemplates(params) {
        const enhancedParams = { ...params };
        const accountId = await this.getCurrentAccountId();
        if (accountId && !enhancedParams.account_id) {
            enhancedParams.account_id = accountId;
        }
        const searchParams = new URLSearchParams();
        // Add pagination params
        if (enhancedParams.page)
            searchParams.append('page', enhancedParams.page.toString());
        if (enhancedParams.per_page)
            searchParams.append('per_page', enhancedParams.per_page.toString());
        if (enhancedParams.with_count)
            searchParams.append('with_count', enhancedParams.with_count.toString());
        // Add filtering and sorting
        if (enhancedParams.filter)
            searchParams.append('filter', enhancedParams.filter);
        if (enhancedParams.sort)
            searchParams.append('sort', enhancedParams.sort);
        if (enhancedParams.account_id)
            searchParams.append('account_id', enhancedParams.account_id.toString());
        const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
        return this.makeRequest(`/templates${query}`);
    }
    /**
     * Get a specific template by ID
     */
    async getTemplate(templateId, accountId) {
        const currentAccountId = accountId || await this.getCurrentAccountId();
        const query = currentAccountId ? `?account_id=${currentAccountId}` : '';
        return this.makeRequest(`/templates/${templateId}${query}`);
    }
    /**
     * Create a new template
     */
    async createTemplate(data) {
        // Handle the new template content structure from OpenAPI spec
        const templateData = {
            name: data.name,
            content: data.content || {
                type: 'html',
                subject: data.subject || '',
                html: data.html_content || '',
                text: data.text_content || ''
            }
        };
        if (data.description)
            templateData.description = data.description;
        if (data.tags)
            templateData.tags = data.tags;
        // Remove undefined fields
        Object.keys(templateData).forEach(key => {
            if (templateData[key] === undefined) {
                delete templateData[key];
            }
        });
        const accountId = data.account_id || await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/templates${query}`, {
            method: 'POST',
            body: JSON.stringify(templateData)
        });
    }
    /**
     * Update an existing template
     */
    async updateTemplate(templateId, data) {
        const updateData = {};
        if (data.name)
            updateData.name = data.name;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.tags)
            updateData.tags = data.tags;
        // Handle content updates
        if (data.content) {
            updateData.content = data.content;
        }
        else if (data.subject || data.html_content || data.text_content) {
            updateData.content = {};
            if (data.subject)
                updateData.content.subject = data.subject;
            if (data.html_content)
                updateData.content.html = data.html_content;
            if (data.text_content)
                updateData.content.text = data.text_content;
        }
        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        const accountId = data.account_id || await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/templates/${templateId}${query}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData)
        });
    }
    /**
     * Delete a template
     */
    async deleteTemplate(templateId, accountId) {
        const currentAccountId = accountId || await this.getCurrentAccountId();
        const query = currentAccountId ? `?account_id=${currentAccountId}` : '';
        return this.makeRequest(`/templates/${templateId}${query}`, {
            method: 'DELETE'
        });
    }
    /**
     * Render a template (get HTML preview)
     */
    async renderTemplate(templateId, accountId) {
        const currentAccountId = accountId || await this.getCurrentAccountId();
        const query = currentAccountId ? `?account_id=${currentAccountId}` : '';
        return this.makeRequest(`/templates/${templateId}/render${query}`, {
            headers: {
                'Accept': 'text/html'
            }
        });
    }
    /**
     * Duplicate a template (implemented as get + create operation)
     * Since there's no native duplicate endpoint, we simulate it
     */
    async duplicateTemplate(templateId, newName, options) {
        // Get the original template
        const original = await this.getTemplate(templateId, options?.accountId);
        if (!original?.data) {
            throw new Error('Template not found');
        }
        // Create duplicate data
        const duplicateData = {
            name: newName,
            content: original.data.content
        };
        if (options?.newDescription) {
            duplicateData.description = options.newDescription;
        }
        else if (original.data.description) {
            duplicateData.description = `Copy of ${original.data.description}`;
        }
        else {
            duplicateData.description = `Copy of ${original.data.name}`;
        }
        // Copy tags if they exist
        if (original.data.tags && original.data.tags.length > 0) {
            duplicateData.tags = [...original.data.tags];
        }
        return this.createTemplate({
            ...duplicateData,
            account_id: options?.accountId
        });
    }
    /**
     * Get latest templates (convenience method)
     */
    async getLatestTemplates(count = 10, accountId) {
        const params = {
            page: 1,
            per_page: count,
            sort: '-created_on'
        };
        if (accountId) {
            params.account_id = accountId;
        }
        return this.getTemplates(params);
    }
    /**
     * Search templates by name
     */
    async searchTemplatesByName(name, accountId) {
        const params = {
            filter: `name==${name}`
        };
        if (accountId) {
            params.account_id = accountId;
        }
        return this.getTemplates(params);
    }
    /**
     * Get templates by tag
     */
    async getTemplatesByTag(tag, accountId) {
        const params = {
            filter: `tag==${tag}`
        };
        if (accountId) {
            params.account_id = accountId;
        }
        return this.getTemplates(params);
    }
    /**
     * Get only user-owned templates
     */
    async getOwnedTemplates(params) {
        const enhancedParams = { ...params };
        const ownerFilter = 'is_owner==true';
        if (enhancedParams.filter) {
            enhancedParams.filter += `;${ownerFilter}`;
        }
        else {
            enhancedParams.filter = ownerFilter;
        }
        return this.getTemplates(enhancedParams);
    }
}
//# sourceMappingURL=template-api.js.map