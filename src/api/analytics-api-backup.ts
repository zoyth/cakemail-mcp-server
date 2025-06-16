// Analytics API operations

import { BaseApiClient } from './base-client.js';
import { 
  AnalyticsDateRange,
  CampaignAnalyticsResponse,
  TransactionalAnalyticsResponse,
  ListAnalyticsResponse,
  AccountAnalyticsResponse
} from '../types/cakemail-types.js';

export class AnalyticsApi extends BaseApiClient {

  async getCampaignAnalytics(campaignId: string): Promise<CampaignAnalyticsResponse> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${campaignId}/analytics${query}`);
  }

  async getTransactionalAnalytics(params?: AnalyticsDateRange): Promise<TransactionalAnalyticsResponse> {
    if (params?.start_date && !this.isValidDate(params.start_date)) {
      throw new Error('start_date must be in YYYY-MM-DD format');
    }
    if (params?.end_date && !this.isValidDate(params.end_date)) {
      throw new Error('end_date must be in YYYY-MM-DD format');
    }

    const queryParams: any = {};
    if (params?.start_date) queryParams.start_date = params.start_date;
    if (params?.end_date) queryParams.end_date = params.end_date;

    const accountId = await this.getCurrentAccountId();
    if (accountId) {
      queryParams.account_id = accountId;
    }

    const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams)}` : '';
    return this.makeRequest(`/transactional/analytics${query}`);
  }

  async getListAnalytics(listId: string): Promise<ListAnalyticsResponse> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/lists/${listId}/analytics${query}`);
  }

  async getAccountAnalytics(params?: AnalyticsDateRange): Promise<AccountAnalyticsResponse> {
    if (params?.start_date && !this.isValidDate(params.start_date)) {
      throw new Error('start_date must be in YYYY-MM-DD format');
    }
    if (params?.end_date && !this.isValidDate(params.end_date)) {
      throw new Error('end_date must be in YYYY-MM-DD format');
    }

    const queryParams: any = {};
    if (params?.start_date) queryParams.start_date = params.start_date;
    if (params?.end_date) queryParams.end_date = params.end_date;

    const accountId = await this.getCurrentAccountId();
    if (accountId) {
      queryParams.account_id = accountId;
    }

    const query = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams)}` : '';
    return this.makeRequest(`/account/analytics${query}`);
  }
}
