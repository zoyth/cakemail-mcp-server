// Main Cakemail API client that composes all sub-APIs

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

export class CakemailAPI extends BaseApiClient {
  public campaigns: CampaignApi;
  public contacts: ContactApi;
  public senders: SenderApi;
  public templates: TemplateApi;
  public email: EmailApi;
  public lists: ListApi;


  public account: AccountApi;
  public subAccounts: SubAccountApi;
  public reports: ReportsApi;
  public logs: LogsApi;



  constructor(config: CakemailConfig | EnhancedCakemailConfig) {
    super(config);
    
    // Initialize all sub-APIs with the same config
    this.campaigns = new CampaignApi(config);
    this.contacts = new ContactApi(config);
    this.senders = new SenderApi(config);
    this.templates = new TemplateApi(config);
    this.email = new EmailApi(config);
    this.lists = new ListApi(config);


    this.account = new AccountApi(config);
    this.subAccounts = new SubAccountApi(config);
    this.reports = new ReportsApi(config);
    this.logs = new LogsApi(config);
  }

  // Expose token management methods
  public getTokenStatus() {
    return super.getTokenStatus();
  }

  public async forceRefreshToken() {
    return super.forceRefreshToken();
  }

  public async validateToken() {
    return super.validateToken();
  }

  public getTokenScopes() {
    return super.getTokenScopes();
  }


}

// Export everything for convenience - using explicit exports to avoid conflicts
export type {
  // Core config types
  CakemailConfig, CakemailToken, CakemailErrorResponse,
  
  // Campaign types  
  Campaign, CreateCampaignData, UpdateCampaignData, CampaignFilters,
  CampaignsResponse, CampaignResponse, CreateCampaignResponse,
  PatchCampaignResponse, DeleteCampaignResponse,
  
  // Email types
  EmailData, SubmitEmailRequest, SubmitEmailResponse, GetEmailResponse,
  EmailAPILogsResponse, EmailAPIStatsResponse, EmailStatusResponse,
  
  // Contact types
  Contact, ContactList, CreateContactData, UpdateContactData,
  ContactsResponse, ContactResponse, CreateContactResponse,
  
  // Sender types
  Sender, CreateSenderData, UpdateSenderData,
  SendersResponse, SenderResponse, CreateSenderResponse,
  
  // Template types
  Template, TemplateContent, CreateTemplateData, UpdateTemplateData,
  TemplatesResponse, TemplateResponse, CreateTemplateResponse,
  
  // Utility types
  PaginationParams, SortParams, ApiResponse,
  GetCampaignsParams, LogTypeV2, EmailStatus, IntervalEnum
} from './types/cakemail-types.js';

// Export schema types with namespace to avoid conflicts
export type { Components, Paths } from './types/schema.js';

// Export error and retry types
export * from './types/errors.js';
export * from './types/retry.js';

// Export unified pagination system
export * from './utils/pagination/index.js';
export type {
  UnifiedPaginationOptions,
  PaginatedResult,
  PaginationStrategy,
  EndpointPaginationConfig,
  IteratorOptions
} from './utils/pagination/index.js';

// Export event types
export type { EventType } from './types/event-taxonomy.js';
export { BaseApiClient } from './api/base-client.js';
export type { EnhancedCakemailConfig } from './api/base-client.js';
export { CampaignApi } from './api/campaign-api.js';
export { ContactApi } from './api/contact-api.js';
export { SenderApi } from './api/sender-api.js';
export { TemplateApi } from './api/template-api.js';
export type {
  TemplateFilters,
  GetTemplatesParams,
  CreateTemplateParams,
  TemplateOperationParams
} from './api/template-api.js';
export { EmailApi } from './api/email-api.js';
export { ListApi } from './api/list-api.js';
export type {
  ListData,
  UpdateListData,
  ListFilters,
  ListsResponse,
  ListResponse,
  CreateListResponse,
  ListStatsParams,
  ListStatsResponse
} from './api/list-api.js';


export { AccountApi } from './api/account-api.js';
export { SubAccountApi } from './api/sub-account-api.js';
export { ReportsApi } from './api/reports-api.js';
export { LogsApi } from './api/logs-api.js';


