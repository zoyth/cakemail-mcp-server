import { BaseApiClient } from './base-client.js';
import { SubAccountsResponse, SubAccountResponse, CreateSubAccountResponse, PatchSubAccountResponse, DeleteSubAccountResponse, SuspendSubAccountResponse, UnsuspendSubAccountResponse, ConfirmSubAccountResponse, ResendSubAccountVerificationResponse, CreateSubAccountData, UpdateSubAccountData, ConfirmSubAccountData, ResendVerificationEmailData, ConvertSubAccountData, SubAccountFilters, PaginationParams, SortParams } from '../types/cakemail-types.js';
export declare class SubAccountApi extends BaseApiClient {
    /**
     * Validate account ID based on endpoint requirements per OpenAPI spec
     */
    private validateAccountId;
    /**
     * Build sort parameter according to OpenAPI spec: [-|+]term
     */
    private buildSortParameter;
    /**
     * Build filter parameter according to OpenAPI spec: term==value;term2==value2
     */
    private buildFilterParameter;
    /**
     * List all sub-accounts with filtering and pagination
     * Compliant with OpenAPI spec: GET /accounts
     */
    listSubAccounts(params?: {
        partner_account_id?: number;
        recursive?: boolean;
        filters?: SubAccountFilters;
        pagination?: PaginationParams;
        sort?: SortParams;
    }): Promise<SubAccountsResponse>;
    /**
     * Create a new sub-account
     * Compliant with OpenAPI spec: POST /accounts
     */
    createSubAccount(data: CreateSubAccountData, options?: {
        partner_account_id?: number;
        skip_verification?: boolean;
    }): Promise<CreateSubAccountResponse>;
    /**
     * Get details of a specific sub-account
     * Compliant with OpenAPI spec: GET /accounts/{account_id}
     * account_id: string with pattern ^[a-zA-Z0-9]+$ (1-20 chars)
     */
    getSubAccount(accountId: string): Promise<SubAccountResponse>;
    /**
     * Update a sub-account
     * Compliant with OpenAPI spec: PATCH /accounts/{account_id}
     * account_id: integer
     */
    updateSubAccount(accountId: string, data: UpdateSubAccountData): Promise<PatchSubAccountResponse>;
    /**
     * Delete a sub-account
     * Compliant with OpenAPI spec: DELETE /accounts/{account_id}
     * account_id: string with pattern ^[a-zA-Z0-9]+$ (1-20 chars)
     */
    deleteSubAccount(accountId: string): Promise<DeleteSubAccountResponse>;
    /**
     * Suspend a sub-account
     * Compliant with OpenAPI spec: POST /accounts/{account_id}/suspend
     * account_id: integer with minimum 1.0
     */
    suspendSubAccount(accountId: string): Promise<SuspendSubAccountResponse>;
    /**
     * Unsuspend a sub-account
     * Compliant with OpenAPI spec: POST /accounts/{account_id}/unsuspend
     * account_id: integer with minimum 1.0
     */
    unsuspendSubAccount(accountId: string): Promise<UnsuspendSubAccountResponse>;
    /**
     * Confirm sub-account creation
     * Compliant with OpenAPI spec: POST /accounts/{account_id}/confirm
     * account_id: string with pattern ^[a-zA-Z0-9]+$ (1-20 chars)
     */
    confirmSubAccount(accountId: string, data: ConfirmSubAccountData): Promise<ConfirmSubAccountResponse>;
    /**
     * Resend account verification email
     * Compliant with OpenAPI spec: POST /accounts/resend-verification-email
     */
    resendVerificationEmail(data: ResendVerificationEmailData): Promise<ResendSubAccountVerificationResponse>;
    /**
     * Convert a sub-account to an organization
     * Compliant with OpenAPI spec: POST /accounts/{account_id}/convert-to-organization
     * account_id: integer
     */
    convertSubAccountToOrganization(accountId: string, data?: ConvertSubAccountData): Promise<SubAccountResponse>;
    /**
     * Get sub-accounts with default parameters for easier usage
     */
    getSubAccountsWithDefaults(params?: {
        status?: 'pending' | 'active' | 'suspended' | 'inactive';
        page?: number;
        per_page?: number;
        recursive?: boolean;
    }): Promise<SubAccountsResponse>;
    /**
     * Get the latest created sub-account
     */
    getLatestSubAccount(): Promise<SubAccountResponse | null>;
    /**
     * Search sub-accounts by name
     */
    searchSubAccountsByName(name: string, params?: {
        page?: number;
        per_page?: number;
    }): Promise<SubAccountsResponse>;
    /**
     * Get sub-accounts by status
     */
    getSubAccountsByStatus(status: 'pending' | 'active' | 'suspended' | 'inactive', params?: {
        page?: number;
        per_page?: number;
    }): Promise<SubAccountsResponse>;
    /**
     * Debug sub-account access - helpful for troubleshooting
     */
    debugSubAccountAccess(accountId?: string): Promise<any>;
    /**
     * Verify sub-account email with code or resend verification
     * This is a wrapper for the confirm endpoint with different behavior
     */
    verifySubAccountEmail(accountId: string, data: {
        verification_code?: string;
        email?: string;
    }): Promise<any>;
    /**
     * Resend sub-account verification email
     * Alternative method name for resendVerificationEmail
     */
    resendSubAccountVerification(email: string): Promise<ResendSubAccountVerificationResponse>;
    /**
     * Convert sub-account to organization (overloaded version)
     */
    convertToOrganization(accountId: string, migrateOwner?: boolean): Promise<SubAccountResponse>;
    /**
     * Find sub-account by email
     */
    findSubAccountByEmail(email: string): Promise<any | null>;
    /**
     * Get active sub-accounts
     */
    getActiveSubAccounts(): Promise<any[]>;
    /**
     * Get sub-account statistics
     */
    getSubAccountStatistics(): Promise<{
        total: number;
        active: number;
        suspended: number;
        pending: number;
        inactive: number;
    }>;
    /**
     * Get all sub-accounts (pagination helper)
     */
    getAllSubAccounts(): Promise<any[]>;
    /**
     * Export sub-accounts to CSV or JSON format
     */
    exportSubAccounts(params?: {
        format?: 'csv' | 'json';
        filename?: string;
        status_filter?: 'pending' | 'active' | 'suspended' | 'inactive';
        include_usage_stats?: boolean;
        include_owner_details?: boolean;
        include_contact_counts?: boolean;
    }): Promise<{
        format: string;
        filename: string;
        data: string;
        totalAccounts: number;
    }>;
    /**
     * Export sub-accounts data with comprehensive information
     * This is a convenience method that aggregates all sub-account data
     * for export purposes (CSV, JSON, etc.)
     */
    exportSubAccountsData(params?: {
        status_filter?: 'pending' | 'active' | 'suspended' | 'inactive';
        recursive?: boolean;
        partner_account_id?: number;
        include_usage_stats?: boolean;
        include_owner_details?: boolean;
    }): Promise<{
        accounts: any[];
        export_info: {
            generated_at: string;
            total_accounts: number;
            filters: any;
            export_options: any;
        };
    }>;
}
//# sourceMappingURL=sub-account-api.d.ts.map