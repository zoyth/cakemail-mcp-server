// Logs API for accessing Cakemail log endpoints

import { BaseApiClient } from './base-client.js';

export class LogsApi extends BaseApiClient {
  
  /**
   * Get campaign logs with detailed activity tracking
   * Endpoint: GET /logs/campaigns/{campaign_id}
   */
  async getCampaignLogs(
    campaignId: string,
    params?: {
      account_id?: number;
      page?: number;
      per_page?: number;
      with_count?: boolean;
      sort?: string;
      order?: 'asc' | 'desc';
      type?: string;
      start_time?: number;
      end_time?: number;
    }
  ) {
    const url = new URL(`${this.baseUrl}/logs/campaigns/${campaignId}`);
    
    // Add query parameters
    if (params?.account_id) url.searchParams.set('account_id', params.account_id.toString());
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.per_page) url.searchParams.set('per_page', params.per_page.toString());
    if (params?.with_count !== undefined) url.searchParams.set('with_count', params.with_count.toString());
    if (params?.sort) url.searchParams.set('sort', params.sort);
    if (params?.order) url.searchParams.set('order', params.order);
    if (params?.type) url.searchParams.set('type', params.type);
    if (params?.start_time) url.searchParams.set('start_time', params.start_time.toString());
    if (params?.end_time) url.searchParams.set('end_time', params.end_time.toString());

    const endpoint = `/logs/campaigns/${campaignId}${url.search}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get workflow action logs for automation tracking
   * Endpoint: GET /logs/workflows/{workflow_id}/actions/{action_id}
   */
  async getWorkflowActionLogs(
    workflowId: string,
    actionId: string,
    params?: {
      account_id?: number;
      page?: number;
      per_page?: number;
      with_count?: boolean;
      start_time?: number;
      end_time?: number;
    }
  ) {
    const url = new URL(`${this.baseUrl}/logs/workflows/${workflowId}/actions/${actionId}`);
    
    // Add query parameters
    if (params?.account_id) url.searchParams.set('account_id', params.account_id.toString());
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.per_page) url.searchParams.set('per_page', params.per_page.toString());
    if (params?.with_count !== undefined) url.searchParams.set('with_count', params.with_count.toString());
    if (params?.start_time) url.searchParams.set('start_time', params.start_time.toString());
    if (params?.end_time) url.searchParams.set('end_time', params.end_time.toString());

    const endpoint = `/logs/workflows/${workflowId}/actions/${actionId}${url.search}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get workflow logs (complete workflow automation logging)
   * Endpoint: GET /logs/workflows/{workflow_id}
   */
  async getWorkflowLogs(
    workflowId: string,
    params?: {
      account_id?: number;
      page?: number;
      per_page?: number;
      with_count?: boolean;
      sort?: string;
      order?: 'asc' | 'desc';
      start_time?: number;
      end_time?: number;
    }
  ) {
    const url = new URL(`${this.baseUrl}/logs/workflows/${workflowId}`);
    
    // Add query parameters
    if (params?.account_id) url.searchParams.set('account_id', params.account_id.toString());
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.per_page) url.searchParams.set('per_page', params.per_page.toString());
    if (params?.with_count !== undefined) url.searchParams.set('with_count', params.with_count.toString());
    if (params?.sort) url.searchParams.set('sort', params.sort);
    if (params?.order) url.searchParams.set('order', params.order);
    if (params?.start_time) url.searchParams.set('start_time', params.start_time.toString());
    if (params?.end_time) url.searchParams.set('end_time', params.end_time.toString());

    const endpoint = `/logs/workflows/${workflowId}${url.search}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get transactional email logs (if available under /logs/emails)
   * Endpoint: GET /logs/emails
   */
  async getTransactionalEmailLogs(
    params?: {
      account_id?: number;
      page?: number;
      per_page?: number;
      with_count?: boolean;
      sort?: string;
      order?: 'asc' | 'desc';
      start_time?: number;
      end_time?: number;
      email_id?: string;
      sender_id?: string;
      status?: string;
    }
  ) {
    const url = new URL(`${this.baseUrl}/logs/emails`);
    
    // Add query parameters
    if (params?.account_id) url.searchParams.set('account_id', params.account_id.toString());
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.per_page) url.searchParams.set('per_page', params.per_page.toString());
    if (params?.with_count !== undefined) url.searchParams.set('with_count', params.with_count.toString());
    if (params?.sort) url.searchParams.set('sort', params.sort);
    if (params?.order) url.searchParams.set('order', params.order);
    if (params?.start_time) url.searchParams.set('start_time', params.start_time.toString());
    if (params?.end_time) url.searchParams.set('end_time', params.end_time.toString());
    if (params?.email_id) url.searchParams.set('email_id', params.email_id);
    if (params?.sender_id) url.searchParams.set('sender_id', params.sender_id);
    if (params?.status) url.searchParams.set('status', params.status);

    const endpoint = `/logs/emails${url.search}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Debug logs API access and test different endpoints
   */
  async debugLogsAccess(params?: { campaign_id?: string; workflow_id?: string }) {
    const debugResults = {
      timestamp: new Date().toISOString(),
      tests: [] as any[]
    };

    // Test campaign logs if campaign_id provided
    if (params?.campaign_id) {
      try {
        const campaignLogs = await this.getCampaignLogs(params.campaign_id, { 
          page: 1,
          per_page: 5
        });
        debugResults.tests.push({
          test: "campaign-logs",
          campaign_id: params.campaign_id,
          success: true,
          hasData: !!campaignLogs?.data,
          dataType: campaignLogs?.data ? typeof campaignLogs.data : 'none'
        });
      } catch (error) {
        debugResults.tests.push({
          test: "campaign-logs",
          campaign_id: params.campaign_id,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Test workflow logs if workflow_id provided
    if (params?.workflow_id) {
      try {
        const workflowLogs = await this.getWorkflowLogs(params.workflow_id, { 
          page: 1,
          per_page: 5
        });
        debugResults.tests.push({
          test: "workflow-logs",
          workflow_id: params.workflow_id,
          success: true,
          hasData: !!workflowLogs?.data,
          dataType: workflowLogs?.data ? typeof workflowLogs.data : 'none'
        });
      } catch (error) {
        debugResults.tests.push({
          test: "workflow-logs",
          workflow_id: params.workflow_id,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Test transactional email logs
    try {
      const emailLogs = await this.getTransactionalEmailLogs({ 
        page: 1,
        per_page: 5
      });
      debugResults.tests.push({
        test: "transactional-email-logs",
        success: true,
        hasData: !!emailLogs?.data,
        dataType: emailLogs?.data ? typeof emailLogs.data : 'none'
      });
    } catch (error) {
      debugResults.tests.push({
        test: "transactional-email-logs", 
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    return debugResults;
  }
}
