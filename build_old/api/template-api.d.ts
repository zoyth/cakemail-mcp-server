import { BaseApiClient } from './base-client.js';
import { CreateTemplateData, UpdateTemplateData, PaginationParams, TemplatesResponse, TemplateResponse, CreateTemplateResponse } from '../types/cakemail-types.js';
export declare class TemplateApi extends BaseApiClient {
    getTemplates(params?: PaginationParams & {
        account_id?: number;
    }): Promise<TemplatesResponse>;
    getTemplate(templateId: string): Promise<TemplateResponse>;
    createTemplate(data: CreateTemplateData): Promise<CreateTemplateResponse>;
    updateTemplate(templateId: string, data: UpdateTemplateData): Promise<TemplateResponse>;
    deleteTemplate(templateId: string): Promise<{
        success: true;
        status: number;
    }>;
}
//# sourceMappingURL=template-api.d.ts.map