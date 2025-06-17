// Sub-Account API operations for enterprise/agency functionality
// Updated for OpenAPI specification compliance

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
   * Validate account ID based on endpoint requirements per OpenAPI spec
   */
  private validateAccountId(accountId: string, endpoint: string): void {
    // Integer endpoints: suspend, unsuspend, and PATCH operations
    if (endpoint.includes('suspend') || endpoint.includes('patch') || endpoint.includes('convert-to-organization')) {
      if (!/^\d+$/.test(accountId)) {
        throw new Error(`Account ID must be a valid integer for ${endpoint} endpoint`);
      }
      const numericId = parseInt(accountId, 10);
      if (endpoint.includes('suspend') && numericId < 1) {
        throw new Error('Account ID must be >= 1 for suspend/unsuspend operations');
      }
    } else {
      // String endpoints: GET, DELETE, confirm
      if (!/^[a-zA-Z0-9]+$/.test(accountId)) {
        throw new Error('Account ID must contain only alphanumeric characters');
      }
      if (accountId.length < 1 || accountId.length > 20) {
        throw new Error('Account ID must be between 1 and 20 characters');
      }
    }
  }

  /**
   * Build sort parameter according to OpenAPI spec: [-|+]term
   */
  private buildSortParameter(sort?: SortParams): string | undefined {
    if (!sort?.sort) return undefined;
    
    const validTerms = ['name', 'created_on'];
    if (!validTerms.includes(sort.sort)) {
      throw new Error(`Invalid sort term. Valid terms: ${validTerms.join(', ')}`);
    }
    
    const prefix = sort.order === 'desc' ? '-' : '+';
    return `${prefix}${sort.sort}`;
  }

  /**
   * Build filter parameter according to OpenAPI spec: term==value;term2==value2
   */
  private buildFilterParameter(filters?: SubAccountFilters): string | undefined {
    if (!filters) return undefined;
    
    const validTerms = ['name', 'status'];
    const filterParts: string[] = [];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (!validTerms.includes(key)) {
          throw new Error(`Invalid filter term '${key}'. Valid terms: ${validTerms.join(', ')}`);
        }
        filterParts.push(`${key}==${value}`);
      }
    });
    
    return filterParts.length > 0 ? filterParts.join(';') : undefined;
  }

  /**
   * List all sub-accounts with filtering and pagination
   * Compliant with OpenAPI spec: GET /accounts
   */
  async listSubAccounts(params?: {
    partner_account_id?: number;
    recursive?: boolean;
    filters?: SubAccountFilters;
    pagination?: PaginationParams;
    sort?: SortParams;
  }): Promise<SubAccountsResponse> {
    const queryParams = new URLSearchParams();
    
    // Partner account ID (integer)
    if (params?.partner_account_id !== undefined) {
      if (!Number.isInteger(params.partner_account_id)) {
        throw new Error('partner_account_id must be an integer');
      }
      queryParams.append('partner_account_id', params.partner_account_id.toString());
    }
    
    // Recursive (boolean, default: false)
    if (params?.recursive !== undefined) {
      queryParams.append('recursive', params.recursive.toString());
    }
    
    // Pagination parameters
    if (params?.pagination?.page !== undefined) {
      if (!Number.isInteger(params.pagination.page) || params.pagination.page < 1) {
        throw new Error('page must be an integer >= 1');
      }
      queryParams.append('page', params.pagination.page.toString());
    }
    
    if (params?.pagination?.per_page !== undefined) {
      if (!Number.isInteger(params.pagination.per_page) || params.pagination.per_page < 1) {
        throw new Error('per_page must be an integer >= 1');
      }
      queryParams.append('per_page', params.pagination.per_page.toString());
    }
    
    if (params?.pagination?.with_count !== undefined) {
      queryParams.append('with_count', params.pagination.with_count.toString());
    }
    
    // Sort parameter (format: [-|+]term)
    const sortParam = this.buildSortParameter(params?.sort);
    if (sortParam) {
      queryParams.append('sort', sortParam);
    }
    
    // Filter parameter (format: term==value;term2==value2)
    const filterParam = this.buildFilterParameter(params?.filters);
    if (filterParam) {
      queryParams.append('filter', filterParam);
    }
    
    const url = `/accounts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(url);
  }

  /**
   * Create a new sub-account
   * Compliant with OpenAPI spec: POST /accounts
   */
  async createSubAccount(data: CreateSubAccountData, options?: {
    partner_account_id?: number;
    skip_verification?: boolean;
  }): Promise<CreateSubAccountResponse> {
    // Validate required fields
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('name is required and must be a string');
    }
    if (!data.email || typeof data.email !== 'string') {
      throw new Error('email is required and must be a string');
    }
    if (!data.password || typeof data.password !== 'string') {
      throw new Error('password is required and must be a string');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }
    
    // Validate password length (minimum 8 characters per OpenAPI spec)
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    const queryParams = new URLSearchParams();
    
    if (options?.partner_account_id !== undefined) {
      if (!Number.isInteger(options.partner_account_id)) {
        throw new Error('partner_account_id must be an integer');
      }
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
   * Compliant with OpenAPI spec: GET /accounts/{account_id}
   * account_id: string with pattern ^[a-zA-Z0-9]+$ (1-20 chars)
   */
  async getSubAccount(accountId: string): Promise<SubAccountResponse> {
    this.validateAccountId(accountId, 'get');
    return this.makeRequest(`/accounts/${accountId}`);
  }

  /**
   * Update a sub-account
   * Compliant with OpenAPI spec: PATCH /accounts/{account_id}
   * account_id: integer
   */
  async updateSubAccount(accountId: string, data: UpdateSubAccountData): Promise<PatchSubAccountResponse> {
    this.validateAccountId(accountId, 'patch');
    
    // Validate email if provided
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }
    }
    
    // Convert string to number for the API call as OpenAPI expects integer
    const numericAccountId = parseInt(accountId, 10);
    
    return this.makeRequest(`/accounts/${numericAccountId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete a sub-account
   * Compliant with OpenAPI spec: DELETE /accounts/{account_id}
   * account_id: string with pattern ^[a-zA-Z0-9]+$ (1-20 chars)
   */
  async deleteSubAccount(accountId: string): Promise<DeleteSubAccountResponse> {
    this.validateAccountId(accountId, 'delete');
    return this.makeRequest(`/accounts/${accountId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Suspend a sub-account
   * Compliant with OpenAPI spec: POST /accounts/{account_id}/suspend
   * account_id: integer with minimum 1.0
   */
  async suspendSubAccount(accountId: string): Promise<SuspendSubAccountResponse> {
    this.validateAccountId(accountId, 'suspend');
    
    const numericAccountId = parseInt(accountId, 10);
    return this.makeRequest(`/accounts/${numericAccountId}/suspend`, {
      method: 'POST'
    });
  }

  /**
   * Unsuspend a sub-account
   * Compliant with OpenAPI spec: POST /accounts/{account_id}/unsuspend
   * account_id: integer with minimum 1.0
   */
  async unsuspendSubAccount(accountId: string): Promise<UnsuspendSubAccountResponse> {
    this.validateAccountId(accountId, 'unsuspend');
    
    const numericAccountId = parseInt(accountId, 10);
    return this.makeRequest(`/accounts/${numericAccountId}/unsuspend`, {
      method: 'POST'
    });
  }

  /**
   * Confirm sub-account creation
   * Compliant with OpenAPI spec: POST /accounts/{account_id}/confirm
   * account_id: string with pattern ^[a-zA-Z0-9]+$ (1-20 chars)
   */
  async confirmSubAccount(accountId: string, data: ConfirmSubAccountData): Promise<ConfirmSubAccountResponse> {
    this.validateAccountId(accountId, 'confirm');
    
    if (!data.confirmation_code || typeof data.confirmation_code !== 'string') {
      throw new Error('confirmation_code is required and must be a string');
    }
    
    // Validate password if provided (minimum 8 characters)
    if (data.password && data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    return this.makeRequest(`/accounts/${accountId}/confirm`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Resend account verification email
   * Compliant with OpenAPI spec: POST /accounts/resend-verification-email
   */
  async resendVerificationEmail(data: ResendVerificationEmailData): Promise<ResendSubAccountVerificationResponse> {
    if (!data.email || typeof data.email !== 'string') {
      throw new Error('email is required and must be a string');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }
    
    return this.makeRequest('/accounts/resend-verification-email', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Convert a sub-account to an organization
   * Compliant with OpenAPI spec: POST /accounts/{account_id}/convert-to-organization
   * account_id: integer
   */
  async convertSubAccountToOrganization(accountId: string, data?: ConvertSubAccountData): Promise<SubAccountResponse> {
    this.validateAccountId(accountId, 'convert-to-organization');
    
    // Default migrate_owner to true per OpenAPI spec
    const payload = data || { migrate_owner: true };
    
    const numericAccountId = parseInt(accountId, 10);
    return this.makeRequest(`/accounts/${numericAccountId}/convert-to-organization`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // ===== CONVENIENCE METHODS (not in OpenAPI spec but useful) =====

  /**
   * Get sub-accounts with default parameters for easier usage
   */
  async getSubAccountsWithDefaults(params?: {
    status?: 'pending' | 'active' | 'suspended' | 'inactive';
    page?: number;
    per_page?: number;
    recursive?: boolean;
  }): Promise<SubAccountsResponse> {
    const listParams: Parameters<typeof this.listSubAccounts>[0] = {
      recursive: params?.recursive || false,
      pagination: {
        page: params?.page || 1,
        per_page: params?.per_page || 50,
        with_count: true
      },
      sort: {
        sort: 'created_on',
        order: 'desc'
      }
    };
    
    if (params?.status) {
      listParams.filters = { status: params.status };
    }
    
    return this.listSubAccounts(listParams);
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
    if (!name || typeof name !== 'string') {
      throw new Error('name parameter is required and must be a string');
    }
    
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
  async getSubAccountsByStatus(status: 'pending' | 'active' | 'suspended' | 'inactive', params?: {
    page?: number;
    per_page?: number;
  }): Promise<SubAccountsResponse> {
    const validStatuses = ['pending', 'active', 'suspended', 'inactive'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Valid statuses: ${validStatuses.join(', ')}`);
    }
    
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
        this.validateAccountId(accountId, 'get');
        const account = await this.getSubAccount(accountId);
        return {
          access_check: 'success',
          account_found: true,
          account_data: account.data,
          timestamp: new Date().toISOString(),
          validation: 'account_id format validated',
          openapi_compliance: 'verified'
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
          timestamp: new Date().toISOString(),
          filter_validation: 'OpenAPI compliant filters supported',
          openapi_compliance: 'verified'
        };
      }
    } catch (error) {
      return {
        access_check: 'failed',
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        validation_error: true,
        openapi_compliance: 'validation_failed'
      };
    }
  }
}
