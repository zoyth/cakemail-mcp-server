// Template API operations
import { BaseApiClient } from './base-client.js';
export class TemplateApi extends BaseApiClient {
    async getTemplates(params) {
        const enhancedParams = { ...params };
        const accountId = await this.getCurrentAccountId();
        if (accountId && !enhancedParams.account_id) {
            enhancedParams.account_id = accountId;
        }
        const query = enhancedParams ? `?${new URLSearchParams(enhancedParams)}` : '';
        return this.makeRequest(`/templates${query}`);
    }
    async getTemplate(templateId) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/templates/${templateId}${query}`);
    }
    async createTemplate(data) {
        const templateData = {
            name: data.name,
            subject: data.subject,
            html_content: data.html_content,
            text_content: data.text_content,
            description: data.description,
        };
        // Remove undefined fields
        Object.keys(templateData).forEach(key => {
            if (templateData[key] === undefined) {
                delete templateData[key];
            }
        });
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/templates${query}`, {
            method: 'POST',
            body: JSON.stringify(templateData)
        });
    }
    async updateTemplate(templateId, data) {
        const updateData = {
            name: data.name,
            subject: data.subject,
            html_content: data.html_content,
            text_content: data.text_content,
            description: data.description,
        };
        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/templates/${templateId}${query}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData)
        });
    }
    async deleteTemplate(templateId) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/templates/${templateId}${query}`, {
            method: 'DELETE'
        });
    }
}
//# sourceMappingURL=template-api.js.map