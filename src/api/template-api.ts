// Template API operations

import { BaseApiClient } from './base-client.js';
import { 
  CreateTemplateData, 
  UpdateTemplateData,
  PaginationParams,
  TemplatesResponse,
  TemplateResponse,
  CreateTemplateResponse
} from '../types/cakemail-types.js';

export class TemplateApi extends BaseApiClient {

  async getTemplates(params?: PaginationParams & { account_id?: number }): Promise<TemplatesResponse> {
    const enhancedParams = { ...params };
    const accountId = await this.getCurrentAccountId();
    if (accountId && !enhancedParams.account_id) {
      enhancedParams.account_id = accountId;
    }
    
    const query = enhancedParams ? `?${new URLSearchParams(enhancedParams as any)}` : '';
    return this.makeRequest(`/templates${query}`);
  }

  async getTemplate(templateId: string): Promise<TemplateResponse> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/templates/${templateId}${query}`);
  }

  async createTemplate(data: CreateTemplateData): Promise<CreateTemplateResponse> {
    const templateData = {
      name: data.name,
      subject: data.subject,
      html_content: data.html_content,
      text_content: data.text_content,
      description: data.description,
    };

    // Remove undefined fields
    Object.keys(templateData).forEach(key => {
      if ((templateData as any)[key] === undefined) {
        delete (templateData as any)[key];
      }
    });

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    return this.makeRequest(`/templates${query}`, {
      method: 'POST',
      body: JSON.stringify(templateData)
    });
  }

  async updateTemplate(templateId: string, data: UpdateTemplateData): Promise<TemplateResponse> {
    const updateData: Record<string, any> = {
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

  async deleteTemplate(templateId: string): Promise<{ success: true; status: number }> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/templates/${templateId}${query}`, { 
      method: 'DELETE' 
    });
  }
}
