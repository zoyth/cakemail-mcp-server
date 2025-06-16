// Sub-Account API operations for enterprise/agency functionality

import { BaseApiClient } from './base-client.js';
import { 
  SubAccountsResponse,
  SubAccountResponse,
  CreateSubAccountResponse,
  PatchSubAccountResponse,
  DeleteSubAccountResponse,
  SuspendSubAccountResponse,
  UnsuspendSubAccountResponse,
  ConfirmSubAccountResponse,
  ResendSubAccountVerificationResponse,
  CreateSubAccountData,
  UpdateSubAccountData,
  ConfirmSubAccountData,
  ResendVerificationEmailData,
  ConvertSubAccountData,
  SubAccountFilters,
  PaginationParams,
  SortParams
} from '../types/cakemail-types.js';

export class SubAccountApi extends BaseApiClient {

  /**
   * List all sub-accounts with filtering and pagination
   */
  async listSubAccounts(params?: {
    partner_account_id?: number;
    recursive?: boolean;
    filters?: SubAccountFilters;
    pagination?: PaginationParams;
    sort?: SortParams;
  }): Promise<SubAccountsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.partner_account_id) {
      queryParams.append('partner_account_id', params.partner_account_id.toString());
    }
    
    if (params?.recursive !== undefined) {
      queryParams.append('recursive', params.recursive.toString());
    }
    
    // Add pagination parameters
    if (params?.pagination?.page) {
      queryParams.append('page', params.pagination.page.toString());
    }
    if (params?.pagination?.per_page) {
      queryParams.append('per_page', params.pagination.per_page.toString());
    }
    if (params?.pagination?.with_count !== undefined) {
      queryParams.append('with_count', params.pagination.with_count.toString());
    }
    
    // Add sorting parameters
    if (params?.sort?.sort) {
      const sortPrefix = params.sort.order === 'desc' ? '-' : '+';
      queryParams.append('sort', `${sortPrefix}${params.sort.sort}`);
    }
    
    // Add filter parameters
    if (params?.filters) {
      const filters = [];
      if (params.filters.name) {
        filters.push(`name==${params.filters.name}`);
      }
      if (params.filters.status) {
        filters.push(`status==${params.filters.status}`);
      }
      if (filters.length > 0) {
        queryParams.append('filter', filters.join(';'));
      }
    }
    
    const url = `/accounts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(url);
  }

  /**
   * Create a new sub-account
   */
  async createSubAccount(data: CreateSubAccountData, options?: {
    partner_account_id?: number;
    skip_verification?: boolean;
  }): Promise<CreateSubAccountResponse> {
    const queryParams = new URLSearchParams();
    
    if (options?.partner_account_id) {
      queryParams.append('partner_account_id', options.partner_account_id.toString());
    }
    
    if (options?.skip_verification !== undefined) {
      queryParams.append('skip_verification', options.skip_verification.toString());
    }
    
    const url = `/accounts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Get details of a specific sub-account
   */
  async getSubAccount(accountId: string): Promise<SubAccountResponse> {
    return this.makeRequest(`/accounts/${accountId}`);
  }

  /**
   * Update a sub-account
   */
  async updateSubAccount(accountId: string, data: UpdateSubAccountData): Promise<PatchSubAccountResponse> {
    return this.makeRequest(`/accounts/${accountId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete a sub-account
   */
  async deleteSubAccount(accountId: string): Promise<DeleteSubAccountResponse> {
    return this.makeRequest(`/accounts/${accountId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Suspend a sub-account
   */
  async suspendSubAccount(accountId: string): Promise<SuspendSubAccountResponse> {
    return this.makeRequest(`/accounts/${accountId}/suspend`, {
      method: 'POST'
    });
  }

  /**
   * Unsuspend a sub-account
   */
  async unsuspendSubAccount(accountId: string): Promise<UnsuspendSubAccountResponse> {
    return this.makeRequest(`/accounts/${accountId}/unsuspend`, {
      method: 'POST'
    });
  }

  /**
   * Confirm sub-account creation
   */
  async confirmSubAccount(accountId: string, data: ConfirmSubAccountData): Promise<ConfirmSubAccountResponse> {
    return this.makeRequest(`/accounts/${accountId}/confirm`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Resend account verification email
   */
  async resendVerificationEmail(data: ResendVerificationEmailData): Promise<ResendSubAccountVerificationResponse> {
    return this.makeRequest('/accounts/resend-verification-email', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Convert a sub-account to an organization
   */
  async convertSubAccountToOrganization(accountId: string, data?: ConvertSubAccountData): Promise<SubAccountResponse> {
    const payload = data || { migrate_owner: true };
    
    return this.makeRequest(`/accounts/${accountId}/convert-to-organization`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Get sub-accounts with default parameters for easier usage
   */
  async getSubAccountsWithDefaults(params?: {
    status?: string;
    page?: number;
    per_page?: number;
    recursive?: boolean;
  }): Promise<SubAccountsResponse> {
    return this.listSubAccounts({
      recursive: params?.recursive || false,
      pagination: {
        page: params?.page || 1,
        per_page: params?.per_page || 50,
        with_count: true
      },
      filters: params?.status ? { status: params.status } : undefined,
      sort: {
        sort: 'created_on',
        order: 'desc'
      }
    });
  }

  /**
   * Get the latest created sub-account
   */
  async getLatestSubAccount(): Promise<SubAccountResponse | null> {
    const response = await this.listSubAccounts({
      pagination: {
        page: 1,
        per_page: 1,
        with_count: false
      },
      sort: {
        sort: 'created_on',
        order: 'desc'
      }
    });

    if (response.data && response.data.length > 0) {
      return {
        data: response.data[0]
      };
    }

    return null;
  }

  /**
   * Search sub-accounts by name
   */
  async searchSubAccountsByName(name: string, params?: {
    page?: number;
    per_page?: number;
  }): Promise<SubAccountsResponse> {
    return this.listSubAccounts({
      filters: { name },
      pagination: {
        page: params?.page || 1,
        per_page: params?.per_page || 50,
        with_count: true
      },
      sort: {
        sort: 'name',
        order: 'asc'
      }
    });
  }

  /**
   * Get sub-accounts by status
   */
  async getSubAccountsByStatus(status: string, params?: {
    page?: number;
    per_page?: number;
  }): Promise<SubAccountsResponse> {
    return this.listSubAccounts({
      filters: { status },
      pagination: {
        page: params?.page || 1,
        per_page: params?.per_page || 50,
        with_count: true
      },
      sort: {
        sort: 'created_on',
        order: 'desc'
      }
    });
  }

  /**
   * Debug sub-account access - helpful for troubleshooting
   */
  async debugSubAccountAccess(accountId?: string): Promise<any> {
    try {
      if (accountId) {
        const account = await this.getSubAccount(accountId);
        return {
          access_check: 'success',
          account_found: true,
          account_data: account.data,
          timestamp: new Date().toISOString()
        };
      } else {
        const accounts = await this.listSubAccounts({
          pagination: { page: 1, per_page: 5, with_count: true }
        });
        return {
          access_check: 'success',
          can_list_accounts: true,
          account_count: accounts.pagination?.count || 0,
          first_few_accounts: accounts.data?.slice(0, 3).map(acc => ({
            id: acc.id,
            name: acc.name,
            status: acc.status
          })),
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      return {
        access_check: 'failed',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      };
    }
  }
}
