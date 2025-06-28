import { CakemailConfig } from './types/cakemail-types.js';
import { BaseApiClient, EnhancedCakemailConfig } from './api/base-client.js';
import { CampaignApi } from './api/campaign-api.js';
import { ContactApi } from './api/contact-api.js';
import { SenderApi } from './api/sender-api.js';
import { TemplateApi } from './api/template-api.js';
import { EmailApi } from './api/email-api.js';
import { ListApi } from './api/list-api.js';
import { AccountApi } from './api/account-api.js';
import { SubAccountApi } from './api/sub-account-api.js';
import { ReportsApi } from './api/reports-api.js';
import { LogsApi } from './api/logs-api.js';
export declare class CakemailAPI extends BaseApiClient {
    campaigns: CampaignApi;
    contacts: ContactApi;
    senders: SenderApi;
    templates: TemplateApi;
    email: EmailApi;
    lists: ListApi;
    account: AccountApi;
    subAccounts: SubAccountApi;
    reports: ReportsApi;
    logs: LogsApi;
    constructor(config: CakemailConfig | EnhancedCakemailConfig);
    getTokenStatus(): {
        hasToken: boolean;
        isExpired: boolean;
        expiresAt: Date | null;
        timeUntilExpiry: number | null;
        needsRefresh: boolean;
        tokenType: string | null;
        hasRefreshToken: boolean;
    };
    forceRefreshToken(): Promise<{
        success: boolean;
        newToken: Partial<import("./types/cakemail-types.js").CakemailToken> | null;
        previousExpiry: Date | null;
        newExpiry: Date | null;
        error?: string;
    }>;
    validateToken(): Promise<{
        isValid: boolean;
        statusCode?: number;
        error?: string;
        accountInfo?: any;
    }>;
    getTokenScopes(): {
        accounts: number[];
        scopes: string | null;
        permissions: string[];
    };
}
export type { CakemailConfig, CakemailToken, CakemailErrorResponse, Campaign, CreateCampaignData, UpdateCampaignData, CampaignFilters, CampaignsResponse, CampaignResponse, CreateCampaignResponse, PatchCampaignResponse, DeleteCampaignResponse, EmailData, SubmitEmailRequest, SubmitEmailResponse, GetEmailResponse, EmailAPILogsResponse, EmailAPIStatsResponse, EmailStatusResponse, Contact, ContactList, CreateContactData, UpdateContactData, ContactsResponse, ContactResponse, CreateContactResponse, Sender, CreateSenderData, UpdateSenderData, SendersResponse, SenderResponse, CreateSenderResponse, Template, TemplateContent, CreateTemplateData, UpdateTemplateData, TemplatesResponse, TemplateResponse, CreateTemplateResponse, PaginationParams, SortParams, ApiResponse, GetCampaignsParams, LogTypeV2, EmailStatus, IntervalEnum } from './types/cakemail-types.js';
export type { Components, Paths } from './types/schema.js';
export * from './types/errors.js';
export * from './types/retry.js';
export * from './utils/pagination/index.js';
export type { UnifiedPaginationOptions, PaginatedResult, PaginationStrategy, EndpointPaginationConfig, IteratorOptions } from './utils/pagination/index.js';
export type { EventType } from './types/event-taxonomy.js';
export { BaseApiClient } from './api/base-client.js';
export type { EnhancedCakemailConfig } from './api/base-client.js';
export { CampaignApi } from './api/campaign-api.js';
export { ContactApi } from './api/contact-api.js';
export { SenderApi } from './api/sender-api.js';
export { TemplateApi } from './api/template-api.js';
export type { TemplateFilters, GetTemplatesParams, CreateTemplateParams, TemplateOperationParams } from './api/template-api.js';
export { EmailApi } from './api/email-api.js';
export { ListApi } from './api/list-api.js';
export type { ListData, UpdateListData, ListFilters, ListsResponse, ListResponse, CreateListResponse, ListStatsParams, ListStatsResponse } from './api/list-api.js';
export { AccountApi } from './api/account-api.js';
export { SubAccountApi } from './api/sub-account-api.js';
export { ReportsApi } from './api/reports-api.js';
export { LogsApi } from './api/logs-api.js';
//# sourceMappingURL=cakemail-api.d.ts.map