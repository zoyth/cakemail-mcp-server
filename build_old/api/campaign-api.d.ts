import { BaseApiClient } from './base-client.js';
import { Campaign, CreateCampaignData, UpdateCampaignData, CampaignFilters, PaginationParams, SortParams, CampaignsResponse, CampaignResponse, CreateCampaignResponse, PatchCampaignResponse, DeleteCampaignResponse } from '../types/cakemail-types.js';
export declare class CampaignApi extends BaseApiClient {
    getCampaigns(params?: PaginationParams & SortParams & CampaignFilters & {
        account_id?: number;
    }): Promise<CampaignsResponse>;
    sendCampaign(id: string): Promise<{
        success: true;
        status: number;
    }>;
    getLatestCampaign(status?: string): Promise<Campaign | null>;
    getCampaignsWithDefaults(params?: any): Promise<CampaignsResponse>;
    getCampaign(id: string): Promise<CampaignResponse>;
    createCampaign(data: CreateCampaignData): Promise<CreateCampaignResponse>;
    updateCampaign(id: string, data: UpdateCampaignData): Promise<PatchCampaignResponse>;
    deleteCampaign(id: string): Promise<DeleteCampaignResponse>;
    renderCampaign(id: string, contactId?: number): Promise<any>;
    sendTestEmail(id: string, data: {
        emails: string[];
    }): Promise<any>;
    scheduleCampaign(id: string, data?: {
        scheduled_for?: string;
    }): Promise<any>;
    unscheduleCampaign(id: string): Promise<any>;
    rescheduleCampaign(id: string, data: {
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