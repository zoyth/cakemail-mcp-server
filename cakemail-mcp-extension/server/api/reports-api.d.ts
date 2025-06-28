import { BaseApiClient } from './base-client.js';
import { CampaignStatsResponse, CampaignLinksStatsResponse, EmailStatsResponse, ListStatsResponse, AccountStatsResponse, ActionStatsResponse, CampaignsReportsExportsResponse, CreateCampaignReportExportData, CreateCampaignReportExportResponse, GetCampaignReportExportResponse, DeleteCampaignReportExportResponse, DownloadCampaignReportExportResponse, SuppressedEmailsExportsResponse, CreateSuppressedEmailsExportResponse, GetSuppressedEmailsExportResponse, DeleteSuppressedEmailsExportResponse, DownloadSuppressedEmailsExportResponse, ReportFilters, PaginationParams, SortParams } from '../types/cakemail-types.js';
export declare class ReportsApi extends BaseApiClient {
    getCampaignStats(campaignId: string, accountId?: number): Promise<CampaignStatsResponse>;
    getCampaignLinksStats(campaignId: string, params?: {
        start_time?: number;
        end_time?: number;
        account_id?: number;
    } & PaginationParams & SortParams): Promise<CampaignLinksStatsResponse>;
    getEmailStatsReport(startTime: number, endTime: number, accountId?: number): Promise<EmailStatsResponse>;
    getListStats(listId: string, accountId?: number): Promise<ListStatsResponse>;
    getSelfAccountStats(startTime?: number, endTime?: number): Promise<AccountStatsResponse>;
    getAccountStats(accountId: string, startTime?: number, endTime?: number): Promise<AccountStatsResponse>;
    getActionStats(workflowId: string, actionId: string, accountId?: number): Promise<ActionStatsResponse>;
    listCampaignReportsExports(params?: {
        account_id?: number;
    } & PaginationParams & ReportFilters): Promise<CampaignsReportsExportsResponse>;
    createCampaignReportsExport(data: CreateCampaignReportExportData, accountId?: number): Promise<CreateCampaignReportExportResponse>;
    getCampaignReportsExport(exportId: string, accountId?: number): Promise<GetCampaignReportExportResponse>;
    deleteCampaignReportsExport(exportId: string, accountId?: number): Promise<DeleteCampaignReportExportResponse>;
    downloadCampaignReportsExport(exportId: string, accountId?: number): Promise<DownloadCampaignReportExportResponse>;
    listSuppressedEmailsExports(params?: {
        account_id?: number;
    } & PaginationParams): Promise<SuppressedEmailsExportsResponse>;
    createSuppressedEmailsExport(description?: string, accountId?: number): Promise<CreateSuppressedEmailsExportResponse>;
    getSuppressedEmailsExport(exportId: string, accountId?: number): Promise<GetSuppressedEmailsExportResponse>;
    deleteSuppressedEmailsExport(exportId: string, accountId?: number): Promise<DeleteSuppressedEmailsExportResponse>;
    downloadSuppressedEmailsExport(exportId: string, accountId?: number): Promise<DownloadSuppressedEmailsExportResponse>;
    getCampaignPerformanceSummary(campaignId: string, accountId?: number): Promise<{
        campaign_id: string;
        campaign_stats: import("../types/cakemail-types.js").CampaignStats;
        links_stats: {
            total_links: number;
            links: import("../types/cakemail-types.js").CampaignLinkStats[];
            pagination: {
                count?: number;
                page?: number;
                per_page?: number;
                total_pages?: number;
            } | undefined;
        };
        generated_at: string;
    }>;
    getAccountPerformanceOverview(accountId?: number, startTime?: number, endTime?: number): Promise<{
        account_id: string | number;
        period: {
            start_time: number | undefined;
            end_time: number | undefined;
        };
        stats: import("../types/cakemail-types.js").AccountStats;
        generated_at: string;
    }>;
    debugReportsAccess(campaignId?: string): Promise<{
        timestamp: string;
        tests: any[];
    }>;
    getEmailStats(startTime: number, endTime: number, params?: {
        interval?: string;
    }): Promise<any>;
    getReportsEmailStats(startTime: number, endTime: number, params?: {
        interval?: string;
    }): Promise<any>;
    getReportsListStats(listId: string, params?: {
        start_time?: number;
        end_time?: number;
        interval?: string;
    }): Promise<any>;
    compareCampaignPerformance(campaignId1: string, campaignId2: string): Promise<any>;
    getTopPerformingLinks(campaignId: string, limit?: number): Promise<any[]>;
    getEngagementTimeline(startTime: number, endTime: number): Promise<any[]>;
}
//# sourceMappingURL=reports-api.d.ts.map