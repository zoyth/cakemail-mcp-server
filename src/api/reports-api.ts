// Reports API operations for campaign analytics and statistics

import { BaseApiClient } from './base-client.js';
import { 
  CampaignStatsResponse,
  CampaignLinksStatsResponse,
  EmailStatsResponse,
  ListStatsResponse,
  AccountStatsResponse,
  ActionStatsResponse,
  CampaignsReportsExportsResponse,
  CreateCampaignReportExportData,
  CreateCampaignReportExportResponse,
  GetCampaignReportExportResponse,
  DeleteCampaignReportExportResponse,
  DownloadCampaignReportExportResponse,
  SuppressedEmailsExportsResponse,
  CreateSuppressedEmailsExportResponse,
  GetSuppressedEmailsExportResponse,
  DeleteSuppressedEmailsExportResponse,
  DownloadSuppressedEmailsExportResponse,
  ReportFilters,
  PaginationParams,
  SortParams
} from '../types/cakemail-types.js';

export class ReportsApi extends BaseApiClient {

  // Campaign Reports
  async getCampaignStats(campaignId: string, accountId?: number): Promise<CampaignStatsResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Getting campaign stats for campaign: ${campaignId}`);
    }
    
    return this.makeRequest(`/reports/campaigns/${campaignId}${query}`);
  }

  async getCampaignLinksStats(
    campaignId: string, 
    params?: {
      start_time?: number;
      end_time?: number;
      account_id?: number;
    } & PaginationParams & SortParams
  ): Promise<CampaignLinksStatsResponse> {
    const queryParams: any = {};
    
    if (params?.start_time) queryParams.start_time = params.start_time;
    if (params?.end_time) queryParams.end_time = params.end_time;
    if (params?.account_id) queryParams.account_id = params.account_id;
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;
    if (params?.with_count) queryParams.with_count = params.with_count;
    
    // Handle sorting with correct API syntax
    if (params?.sort) {
      const direction = params?.order === 'desc' ? '-' : '+';
      queryParams.sort = `${direction}${params.sort}`;
    }
    
    const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams)}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Getting campaign links stats for campaign: ${campaignId}`);
    }
    
    return this.makeRequest(`/reports/campaigns/${campaignId}/links${query}`);
  }

  // Email Reports (Transactional)
  async getEmailStatsReport(
    startTime: number, 
    endTime: number, 
    accountId?: number
  ): Promise<EmailStatsResponse> {
    const queryParams: any = {
      start_time: startTime,
      end_time: endTime
    };
    
    if (accountId) queryParams.account_id = accountId;
    
    const query = `?${new URLSearchParams(queryParams)}`;
    
    if (this.debugMode) {
      console.log(`[Reports API] Getting email stats from ${startTime} to ${endTime}`);
    }
    
    return this.makeRequest(`/reports/emails${query}`);
  }

  // List Reports
  async getListStats(listId: string, accountId?: number): Promise<ListStatsResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Getting list stats for list: ${listId}`);
    }
    
    return this.makeRequest(`/reports/lists/${listId}${query}`);
  }

  // Account Reports
  async getSelfAccountStats(
    startTime?: number, 
    endTime?: number
  ): Promise<AccountStatsResponse> {
    const queryParams: any = {};
    
    if (startTime) queryParams.start_time = startTime;
    if (endTime) queryParams.end_time = endTime;
    
    const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams)}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Getting self account stats`);
    }
    
    return this.makeRequest(`/reports/accounts/self${query}`);
  }

  async getAccountStats(
    accountId: string, 
    startTime?: number, 
    endTime?: number
  ): Promise<AccountStatsResponse> {
    const queryParams: any = {};
    
    if (startTime) queryParams.start_time = startTime;
    if (endTime) queryParams.end_time = endTime;
    
    const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams)}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Getting account stats for account: ${accountId}`);
    }
    
    return this.makeRequest(`/reports/accounts/${accountId}${query}`);
  }

  // Workflow/Action Reports
  async getActionStats(
    workflowId: string, 
    actionId: string, 
    accountId?: number
  ): Promise<ActionStatsResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Getting action stats for workflow: ${workflowId}, action: ${actionId}`);
    }
    
    return this.makeRequest(`/reports/workflows/${workflowId}/actions/${actionId}${query}`);
  }

  // Campaign Reports Export
  async listCampaignReportsExports(
    params?: {
      account_id?: number;
    } & PaginationParams & ReportFilters
  ): Promise<CampaignsReportsExportsResponse> {
    const queryParams: any = {};
    
    if (params?.account_id) queryParams.account_id = params.account_id;
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;
    if (params?.with_count) queryParams.with_count = params.with_count;
    
    // Handle filters with correct API syntax
    const filters: string[] = [];
    if (params?.status) filters.push(`status==${params.status}`);
    if (params?.progress) filters.push(`progress==${params.progress}`);
    
    if (filters.length > 0) {
      queryParams.filter = filters.join(';');
    }
    
    const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams)}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Listing campaign reports exports`);
    }
    
    return this.makeRequest(`/reports/campaigns-exports${query}`);
  }

  async createCampaignReportsExport(
    data: CreateCampaignReportExportData,
    accountId?: number
  ): Promise<CreateCampaignReportExportResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Creating campaign reports export`);
    }
    
    return this.makeRequest(`/reports/campaigns-exports${query}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getCampaignReportsExport(
    exportId: string,
    accountId?: number
  ): Promise<GetCampaignReportExportResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Getting campaign reports export: ${exportId}`);
    }
    
    return this.makeRequest(`/reports/campaigns-exports/${exportId}${query}`);
  }

  async deleteCampaignReportsExport(
    exportId: string,
    accountId?: number
  ): Promise<DeleteCampaignReportExportResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Deleting campaign reports export: ${exportId}`);
    }
    
    return this.makeRequest(`/reports/campaigns-exports/${exportId}${query}`, {
      method: 'DELETE'
    });
  }

  async downloadCampaignReportsExport(
    exportId: string,
    accountId?: number
  ): Promise<DownloadCampaignReportExportResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Downloading campaign reports export: ${exportId}`);
    }
    
    return this.makeRequest(`/reports/campaigns-exports/${exportId}/download${query}`);
  }

  // Suppressed Emails Export
  async listSuppressedEmailsExports(
    params?: {
      account_id?: number;
    } & PaginationParams
  ): Promise<SuppressedEmailsExportsResponse> {
    const queryParams: any = {};
    
    if (params?.account_id) queryParams.account_id = params.account_id;
    if (params?.page) queryParams.page = params.page;
    if (params?.per_page) queryParams.per_page = params.per_page;
    if (params?.with_count) queryParams.with_count = params.with_count;
    
    const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams)}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Listing suppressed emails exports`);
    }
    
    return this.makeRequest(`/reports/suppressed-emails-exports${query}`);
  }

  async createSuppressedEmailsExport(
    description?: string,
    accountId?: number
  ): Promise<CreateSuppressedEmailsExportResponse> {
    const queryParams: any = {};
    
    if (description) queryParams.description = description;
    if (accountId) queryParams.account_id = accountId;
    
    const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams)}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Creating suppressed emails export`);
    }
    
    return this.makeRequest(`/reports/suppressed-emails-exports${query}`, {
      method: 'POST'
    });
  }

  async getSuppressedEmailsExport(
    exportId: string,
    accountId?: number
  ): Promise<GetSuppressedEmailsExportResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Getting suppressed emails export: ${exportId}`);
    }
    
    return this.makeRequest(`/reports/suppressed-emails-exports/${exportId}${query}`);
  }

  async deleteSuppressedEmailsExport(
    exportId: string,
    accountId?: number
  ): Promise<DeleteSuppressedEmailsExportResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Deleting suppressed emails export: ${exportId}`);
    }
    
    return this.makeRequest(`/reports/suppressed-emails-exports/${exportId}${query}`, {
      method: 'DELETE'
    });
  }

  async downloadSuppressedEmailsExport(
    exportId: string,
    accountId?: number
  ): Promise<DownloadSuppressedEmailsExportResponse> {
    const query = accountId ? `?account_id=${accountId}` : '';
    
    if (this.debugMode) {
      console.log(`[Reports API] Downloading suppressed emails export: ${exportId}`);
    }
    
    return this.makeRequest(`/reports/suppressed-emails-exports/${exportId}/download${query}`);
  }

  // Convenience methods for common reporting tasks
  async getCampaignPerformanceSummary(campaignId: string, accountId?: number) {
    if (this.debugMode) {
      console.log(`[Reports API] Getting campaign performance summary for: ${campaignId}`);
    }

    try {
      const [campaignStats, linksStats] = await Promise.all([
        this.getCampaignStats(campaignId, accountId),
        this.getCampaignLinksStats(campaignId, {
          ...(accountId !== undefined && { account_id: accountId }),
          per_page: 50
        })
      ]);

      return {
        campaign_id: campaignId,
        campaign_stats: campaignStats.data,
        links_stats: {
          total_links: linksStats.data?.length || 0,
          links: linksStats.data || [],
          pagination: linksStats.pagination
        },
        generated_at: new Date().toISOString()
      };
    } catch (error: any) {
      if (this.debugMode) {
        console.error(`[Reports API] Failed to get campaign performance summary:`, error.message);
      }
      throw error;
    }
  }

  async getAccountPerformanceOverview(
    accountId?: number,
    startTime?: number,
    endTime?: number
  ) {
    if (this.debugMode) {
      console.log(`[Reports API] Getting account performance overview`);
    }

    try {
      const accountStats = accountId 
        ? await this.getAccountStats(accountId.toString(), startTime, endTime)
        : await this.getSelfAccountStats(startTime, endTime);

      return {
        account_id: accountId || 'self',
        period: {
          start_time: startTime,
          end_time: endTime
        },
        stats: accountStats.data,
        generated_at: new Date().toISOString()
      };
    } catch (error: any) {
      if (this.debugMode) {
        console.error(`[Reports API] Failed to get account performance overview:`, error.message);
      }
      throw error;
    }
  }

  // Debug method to test reports access
  async debugReportsAccess(campaignId?: string) {
    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[]
    };

    // Test 1: Get self account stats
    try {
      const accountStats = await this.getSelfAccountStats();
      results.tests.push({
        test: 'self-account-stats',
        success: true,
        hasData: !!accountStats.data,
        dataKeys: accountStats.data ? Object.keys(accountStats.data) : []
      });
    } catch (error: any) {
      results.tests.push({
        test: 'self-account-stats',
        success: false,
        error: error.message
      });
    }

    // Test 2: Get campaign stats if campaign ID provided
    if (campaignId) {
      try {
        const campaignStats = await this.getCampaignStats(campaignId);
        results.tests.push({
          test: 'campaign-stats',
          success: true,
          campaignId,
          hasData: !!campaignStats.data,
          dataKeys: campaignStats.data ? Object.keys(campaignStats.data) : []
        });
      } catch (error: any) {
        results.tests.push({
          test: 'campaign-stats',
          success: false,
          campaignId,
          error: error.message
        });
      }

      // Test 3: Get campaign links stats
      try {
        const linksStats = await this.getCampaignLinksStats(campaignId, { per_page: 5 });
        results.tests.push({
          test: 'campaign-links-stats',
          success: true,
          campaignId,
          linksCount: Array.isArray(linksStats.data) ? linksStats.data.length : 0,
          hasData: !!linksStats.data
        });
      } catch (error: any) {
        results.tests.push({
          test: 'campaign-links-stats',
          success: false,
          campaignId,
          error: error.message
        });
      }
    }

    // Test 4: List campaign reports exports
    try {
      const exports = await this.listCampaignReportsExports({ per_page: 5 });
      results.tests.push({
        test: 'list-campaign-exports',
        success: true,
        exportsCount: Array.isArray(exports.data) ? exports.data.length : 0,
        hasData: !!exports.data
      });
    } catch (error: any) {
      results.tests.push({
        test: 'list-campaign-exports',
        success: false,
        error: error.message
      });
    }

    return results;
  }

  // Additional helper methods for tests
  async getEmailStats(startTime: number, endTime: number, params?: { interval?: string }): Promise<any> {
    const queryParams: any = {
      start_time: startTime,
      end_time: endTime
    };
    
    if (params?.interval) queryParams.interval = params.interval;
    
    const accountId = await this.getCurrentAccountId();
    if (accountId) queryParams.account_id = accountId;
    
    const query = `?${new URLSearchParams(queryParams)}`;
    return this.makeRequest(`/reports/emails${query}`);
  }

  async getReportsEmailStats(startTime: number, endTime: number, params?: { interval?: string }): Promise<any> {
    return this.getEmailStats(startTime, endTime, params);
  }

  async getReportsListStats(listId: string, params?: { start_time?: number; end_time?: number; interval?: string }): Promise<any> {
    const queryParams: any = {};
    
    if (params?.start_time) queryParams.start_time = params.start_time;
    if (params?.end_time) queryParams.end_time = params.end_time;
    if (params?.interval) queryParams.interval = params.interval;
    
    const accountId = await this.getCurrentAccountId();
    if (accountId) queryParams.account_id = accountId;
    
    const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams)}` : '';
    return this.makeRequest(`/reports/lists/${listId}${query}`);
  }

  async compareCampaignPerformance(campaignId1: string, campaignId2: string): Promise<any> {
    const [stats1, stats2] = await Promise.all([
      this.getCampaignStats(campaignId1),
      this.getCampaignStats(campaignId2)
    ]);
    
    return {
      campaign1: stats1.data,
      campaign2: stats2.data,
      comparison: {
        delivery_rate_diff: (stats1.data?.delivery_rate || 0) - (stats2.data?.delivery_rate || 0),
        open_rate_diff: (stats1.data?.open_rate || 0) - (stats2.data?.open_rate || 0),
        click_rate_diff: (stats1.data?.click_rate || 0) - (stats2.data?.click_rate || 0)
      }
    };
  }

  async getTopPerformingLinks(campaignId: string, limit: number = 10): Promise<any[]> {
    const linksStats = await this.getCampaignLinksStats(campaignId, {
      per_page: limit,
      sort: 'unique',
      order: 'desc'
    });
    
    return linksStats.data || [];
  }

  async getEngagementTimeline(startTime: number, endTime: number): Promise<any[]> {
    const emailStats = await this.getEmailStats(startTime, endTime, { interval: 'hour' });
    
    if (!emailStats.data) return [];
    
    // Transform data into timeline format
    return emailStats.data.map((stat: any) => ({
      timestamp: stat.timestamp || stat.time,
      delivered: stat.delivered || 0,
      opened: stat.opened || 0,
      clicked: stat.clicked || 0,
      bounced: stat.bounced || 0
    }));
  }
}
