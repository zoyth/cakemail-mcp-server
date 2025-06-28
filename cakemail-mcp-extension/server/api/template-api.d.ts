import { BaseApiClient } from './base-client.js';
import { CreateTemplateData, UpdateTemplateData, PaginationParams, TemplatesResponse, TemplateResponse, CreateTemplateResponse } from '../types/cakemail-types.js';
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
export declare class TemplateApi extends BaseApiClient {
    /**
     * List all templates with filtering, sorting and pagination
     */
    getTemplates(params?: GetTemplatesParams): Promise<TemplatesResponse>;
    /**
     * Get a specific template by ID
     */
    getTemplate(templateId: string | number, accountId?: number): Promise<TemplateResponse>;
    /**
     * Create a new template
     */
    createTemplate(data: CreateTemplateData & CreateTemplateParams): Promise<CreateTemplateResponse>;
    /**
     * Update an existing template
     */
    updateTemplate(templateId: string | number, data: UpdateTemplateData & TemplateOperationParams): Promise<TemplateResponse>;
    /**
     * Delete a template
     */
    deleteTemplate(templateId: string | number, accountId?: number): Promise<{
        success: true;
        status: number;
    }>;
    /**
     * Render a template (get HTML preview)
     */
    renderTemplate(templateId: string | number, accountId?: number): Promise<string>;
    /**
     * Duplicate a template (implemented as get + create operation)
     * Since there's no native duplicate endpoint, we simulate it
     */
    duplicateTemplate(templateId: string | number, newName: string, options?: {
        newDescription?: string;
        accountId?: number;
    }): Promise<CreateTemplateResponse>;
    /**
     * Get latest templates (convenience method)
     */
    getLatestTemplates(count?: number, accountId?: number): Promise<TemplatesResponse>;
    /**
     * Search templates by name
     */
    searchTemplatesByName(name: string, accountId?: number): Promise<TemplatesResponse>;
    /**
     * Get templates by tag
     */
    getTemplatesByTag(tag: string, accountId?: number): Promise<TemplatesResponse>;
    /**
     * Get only user-owned templates
     */
    getOwnedTemplates(params?: GetTemplatesParams): Promise<TemplatesResponse>;
}
//# sourceMappingURL=template-api.d.ts.map