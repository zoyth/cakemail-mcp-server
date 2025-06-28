import { BaseApiClient } from './base-client.js';
import type { PaginationParams, CampaignsResponse, CampaignResponse, CreateCampaignResponse, PatchCampaignResponse, DeleteCampaignResponse, GetCampaignsParams, // was ListCampaignsParams
CreateCampaignRequest, // now exists
UpdateCampaignRequest, // now exists  
ScheduleCampaignRequest, // now exists
SendTestEmailRequest } from '../types/cakemail-types.js';
import type { Components } from '../types/schema.js';
import { UnifiedPaginationOptions, PaginatedResult, PaginatedIterator, IteratorOptions } from '../utils/pagination/index.js';
export declare class CampaignApi extends BaseApiClient {
    getCampaigns(params?: GetCampaignsParams & {
        account_id?: number;
    }): Promise<CampaignsResponse>;
    getCampaignsPaginated(options?: UnifiedPaginationOptions, additionalFilters?: {
        status?: string;
        name?: string;
        type?: string;
        list_id?: string;
        sort?: string;
        order?: 'asc' | 'desc';
        account_id?: number;
    }): Promise<PaginatedResult<any>>;
    getCampaignsIterator(options?: IteratorOptions, campaignFilters?: {
        status?: string;
        name?: string;
        type?: string;
        list_id?: string;
        sort?: string;
        order?: 'asc' | 'desc';
        account_id?: number;
    }): PaginatedIterator<any>;
    getAllCampaigns(options?: IteratorOptions, filters?: {
        status?: string;
        name?: string;
        type?: string;
        list_id?: string;
        sort?: string;
        order?: 'asc' | 'desc';
        account_id?: number;
    }): Promise<any[]>;
    processCampaignsInBatches(processor: (campaigns: any[]) => Promise<void>, options?: IteratorOptions, filters?: {
        status?: string;
        name?: string;
        type?: string;
        list_id?: string;
        sort?: string;
        order?: 'asc' | 'desc';
        account_id?: number;
    }): Promise<void>;
    sendCampaign(id: string): Promise<{
        success: true;
        status: number;
    }>;
    getLatestCampaign(status?: Components['schemas']['CampaignStatus']): Promise<Components['schemas']['CampaignFullResponse'] | null>;
    getCampaignsWithDefaults(params?: Partial<GetCampaignsParams>): Promise<CampaignsResponse>;
    getCampaign(id: string, options?: {
        account_id?: number;
    }): Promise<CampaignResponse>;
    createCampaign(data: CreateCampaignRequest & {
        account_id?: number;
    }): Promise<CreateCampaignResponse>;
    updateCampaign(id: string, data: UpdateCampaignRequest & {
        account_id?: number;
    }): Promise<PatchCampaignResponse>;
    deleteCampaign(id: string): Promise<DeleteCampaignResponse>;
    renderCampaign(id: string, options?: {
        contact_id?: number;
        account_id?: number;
    }): Promise<any>;
    sendTestEmail(id: string, data: SendTestEmailRequest): Promise<any>;
    scheduleCampaign(id: string, data?: ScheduleCampaignRequest): Promise<any>;
    unscheduleCampaign(id: string): Promise<any>;
    rescheduleCampaign(id: string, data: ScheduleCampaignRequest & {
        scheduled_for: string;
    }): Promise<any>;
    suspendCampaign(id: string): Promise<any>;
    resumeCampaign(id: string): Promise<any>;
    cancelCampaign(id: string): Promise<any>;
    archiveCampaign(id: string): Promise<any>;
    unarchiveCampaign(id: string): Promise<any>;
    getCampaignRevisions(id: string, params?: PaginationParams): Promise<any>;
    getCampaignLinks(id: string, params?: PaginationParams): Promise<any>;
    debugCampaignAccess(campaignId?: string): Promise<{
        timestamp: string;
        tests: any[];
    }>;
}
//# sourceMappingURL=campaign-api.d.ts.map