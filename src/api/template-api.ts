// Enhanced Template API operations

import { BaseApiClient } from './base-client.js';
import { 
  CreateTemplateData, 
  UpdateTemplateData,
  PaginationParams,
  TemplatesResponse,
  TemplateResponse,
  CreateTemplateResponse
} from '../types/cakemail-types.js';

export interface TemplateFilters {
  tag?: string;
  name?: string;
  is_owner?: boolean;
  is_not_owner?: boolean;
}

export interface GetTemplatesParams extends PaginationParams {
  account_id?: number;
  filter?: string;
  sort?: string;
}

export interface CreateTemplateParams {
  account_id?: number;
}

export interface TemplateOperationParams {
  account_id?: number;
}

export class TemplateApi extends BaseApiClient {

  /**
   * List all templates with filtering, sorting and pagination
   */
  async getTemplates(params?: GetTemplatesParams): Promise<TemplatesResponse> {
    const enhancedParams = { ...params };
    const accountId = await this.getCurrentAccountId();
    if (accountId && !enhancedParams.account_id) {
      enhancedParams.account_id = accountId;
    }
    
    const searchParams = new URLSearchParams();
    
    // Add pagination params
    if (enhancedParams.page) searchParams.append('page', enhancedParams.page.toString());
    if (enhancedParams.per_page) searchParams.append('per_page', enhancedParams.per_page.toString());
    if (enhancedParams.with_count) searchParams.append('with_count', enhancedParams.with_count.toString());
    
    // Add filtering and sorting
    if (enhancedParams.filter) searchParams.append('filter', enhancedParams.filter);
    if (enhancedParams.sort) searchParams.append('sort', enhancedParams.sort);
    if (enhancedParams.account_id) searchParams.append('account_id', enhancedParams.account_id.toString());
    
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.makeRequest(`/templates${query}`);
  }

  /**
   * Get a specific template by ID
   */
  async getTemplate(templateId: string | number, accountId?: number): Promise<TemplateResponse> {
    const currentAccountId = accountId || await this.getCurrentAccountId();
    const query = currentAccountId ? `?account_id=${currentAccountId}` : '';
    
    return this.makeRequest(`/templates/${templateId}${query}`);
  }

  /**
   * Create a new template
   */
  async createTemplate(data: CreateTemplateData & CreateTemplateParams): Promise<CreateTemplateResponse> {
    // Handle the new template content structure from OpenAPI spec
    const templateData: any = {
      name: data.name,
      content: data.content || {
        type: 'html',
        subject: data.subject || '',
        html: data.html_content || '',
        text: data.text_content || ''
      }
    };

    if (data.description) templateData.description = data.description;
    if (data.tags) templateData.tags = data.tags;

    // Remove undefined fields
    Object.keys(templateData).forEach(key => {
      if ((templateData as any)[key] === undefined) {
        delete (templateData as any)[key];
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
  async updateTemplate(templateId: string | number, data: UpdateTemplateData & TemplateOperationParams): Promise<TemplateResponse> {
    const updateData: Record<string, any> = {};

    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.tags) updateData.tags = data.tags;
    
    // Handle content updates
    if (data.content) {
      updateData.content = data.content;
    } else if (data.subject || data.html_content || data.text_content) {
      updateData.content = {};
      if (data.subject) updateData.content.subject = data.subject;
      if (data.html_content) updateData.content.html = data.html_content;
      if (data.text_content) updateData.content.text = data.text_content;
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
  async deleteTemplate(templateId: string | number, accountId?: number): Promise<{ success: true; status: number }> {
    const currentAccountId = accountId || await this.getCurrentAccountId();
    const query = currentAccountId ? `?account_id=${currentAccountId}` : '';
    
    return this.makeRequest(`/templates/${templateId}${query}`, { 
      method: 'DELETE' 
    });
  }

  /**
   * Render a template (get HTML preview)
   */
  async renderTemplate(templateId: string | number, accountId?: number): Promise<string> {
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
  async duplicateTemplate(
    templateId: string | number, 
    newName: string, 
    options?: { 
      newDescription?: string;
      accountId?: number;
    }
  ): Promise<CreateTemplateResponse> {
    // Get the original template
    const original = await this.getTemplate(templateId, options?.accountId);
    
    if (!original?.data) {
      throw new Error('Template not found');
    }

    // Create duplicate data
    const duplicateData: any = {
      name: newName,
      content: original.data.content
    };

    if (options?.newDescription) {
      duplicateData.description = options.newDescription;
    } else if (original.data.description) {
      duplicateData.description = `Copy of ${original.data.description}`;
    } else {
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
  async getLatestTemplates(count: number = 10, accountId?: number): Promise<TemplatesResponse> {
    const params: GetTemplatesParams = {
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
  async searchTemplatesByName(name: string, accountId?: number): Promise<TemplatesResponse> {
    const params: GetTemplatesParams = {
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
  async getTemplatesByTag(tag: string, accountId?: number): Promise<TemplatesResponse> {
    const params: GetTemplatesParams = {
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
  async getOwnedTemplates(params?: GetTemplatesParams): Promise<TemplatesResponse> {
    const enhancedParams = { ...params };
    const ownerFilter = 'is_owner==true';
    
    if (enhancedParams.filter) {
      enhancedParams.filter += `;${ownerFilter}`;
    } else {
      enhancedParams.filter = ownerFilter;
    }
    
    return this.getTemplates(enhancedParams);
  }
}
