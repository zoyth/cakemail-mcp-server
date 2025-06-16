// Shared TypeScript interfaces for Cakemail API

export interface CakemailConfig {
  username: string;
  password: string;
  baseUrl?: string;
  debug?: boolean;
}

export interface CakemailToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface CakemailErrorResponse {
  error: string;
  error_description?: string;
  message?: string;
}

// Generic API response structure (kept for backward compatibility)
export interface ApiResponse<T = any> {
  data?: T;
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
  meta?: any;
}

// Specific response types matching OpenAPI specification
export interface CampaignsResponse {
  data: Campaign[];
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface CampaignResponse {
  data: Campaign;
}

export interface CreateCampaignResponse {
  data: Campaign;
}

export interface PatchCampaignResponse {
  data: Campaign;
}

export interface DeleteCampaignResponse {
  data: {
    id: number;
    deleted: boolean;
  };
}

// Contact and List specific responses
export interface ContactsResponse {
  data: Contact[];
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface ContactResponse {
  data: Contact;
}

export interface CreateContactResponse {
  data: Contact;
}

export interface ListsResponse {
  data: ContactList[];
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface ListResponse {
  data: ContactList;
}

export interface CreateListResponse {
  data: ContactList;
}

// Sender specific responses
export interface SendersResponse {
  data: Sender[];
}

export interface SenderResponse {
  data: Sender;
}

export interface CreateSenderResponse {
  data: Sender;
}

// Template specific responses
export interface TemplatesResponse {
  data: Template[];
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface TemplateResponse {
  data: Template;
}

export interface CreateTemplateResponse {
  data: Template;
}

// Email API responses - Updated for v2 API (renamed from Transactional)
export interface EmailResponse {
  email: string;
  object: string;
  submitted: boolean;
  data: {
    id: string;
    status: string;
  };
}

// Email status response for v2 API
export interface EmailStatusResponse {
  data: {
    id: string;
    status: string;
    email: string;
    submitted_on?: string;
    delivered_on?: string;
    opened_on?: string;
    clicked_on?: string;
    bounced_on?: string;
    [key: string]: any;
  };
}

// Legacy type alias for backward compatibility
export interface TransactionalEmailResponse extends EmailResponse {}

// Analytics specific responses
export interface CampaignAnalyticsResponse {
  data: CampaignAnalytics;
}

export interface TransactionalAnalyticsResponse {
  data: any; // API spec doesn't specify exact structure
}

export interface ListAnalyticsResponse {
  data: any; // API spec doesn't specify exact structure
}

export interface AccountAnalyticsResponse {
  data: any; // API spec doesn't specify exact structure
}

// Automation specific responses
export interface AutomationsResponse {
  data: Automation[];
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface AutomationResponse {
  data: Automation;
}

export interface CreateAutomationResponse {
  data: Automation;
}

// Account responses
export interface AccountResponse {
  data: {
    id: number;
    name: string;
    email: string;
    type?: string;
    [key: string]: any;
  };
}

export interface PatchAccountResponse {
  data: {
    id: number;
    name: string;
    email: string;
    type?: string;
    [key: string]: any;
  };
}

// Sub-Account specific types and responses
export interface SubAccount {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  type?: 'organization' | 'individual';
  partner_account_id?: number;
  created_on?: string;
  updated_on?: string;
  verified?: boolean;
  company?: string;
  language?: string;
  timezone?: string;
  country?: string;
  phone?: string;
  website?: string;
  description?: string;
  [key: string]: any;
}

export interface SubAccountsResponse {
  data: SubAccount[];
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface SubAccountResponse {
  data: SubAccount;
}

export interface CreateSubAccountResponse {
  data: SubAccount;
}

export interface PatchSubAccountResponse {
  data: SubAccount;
}

export interface DeleteSubAccountResponse {
  data: {
    id: string;
    deleted: boolean;
  };
}

export interface SuspendSubAccountResponse {
  data: {
    id: string;
    status: 'suspended';
    suspended_on: string;
  };
}

export interface UnsuspendSubAccountResponse {
  data: {
    id: string;
    status: 'active';
    unsuspended_on: string;
  };
}

export interface ConfirmSubAccountResponse {
  data: SubAccount;
}

export interface ResendSubAccountVerificationResponse {
  data: {
    message: string;
    email: string;
    sent_on: string;
  };
}

// Sub-Account input data interfaces
export interface CreateSubAccountData {
  name: string;
  email: string;
  password: string;
  company?: string;
  language?: string;
  timezone?: string;
  country?: string;
  phone?: string;
  website?: string;
  description?: string;
  [key: string]: any;
}

export interface UpdateSubAccountData {
  name?: string;
  email?: string;
  company?: string;
  language?: string;
  timezone?: string;
  country?: string;
  phone?: string;
  website?: string;
  description?: string;
  [key: string]: any;
}

export interface ConfirmSubAccountData {
  confirmation_code: string;
  password?: string;
}

export interface ResendVerificationEmailData {
  email: string;
}

export interface ConvertSubAccountData {
  migrate_owner?: boolean;
}

// Reports API types
export interface CampaignStats {
  sent_count?: number;
  delivered_count?: number;
  bounce_count?: number;
  hard_bounce_count?: number;
  soft_bounce_count?: number;
  open_count?: number;
  unique_open_count?: number;
  open_rate?: number;
  click_count?: number;
  unique_click_count?: number;
  click_rate?: number;
  unsubscribe_count?: number;
  unsubscribe_rate?: number;
  spam_complaint_count?: number;
  spam_complaint_rate?: number;
  delivery_rate?: number;
  [key: string]: any;
}

export interface CampaignLinkStats {
  link: string;
  unique: number;
  total: number;
  [key: string]: any;
}

export interface EmailStats {
  sent_count?: number;
  delivered_count?: number;
  bounce_count?: number;
  open_count?: number;
  click_count?: number;
  spam_complaint_count?: number;
  [key: string]: any;
}

export interface ListStats {
  subscriber_count?: number;
  active_count?: number;
  unsubscribed_count?: number;
  bounced_count?: number;
  growth_rate?: number;
  [key: string]: any;
}

export interface AccountStats {
  campaigns_sent?: number;
  emails_sent?: number;
  total_opens?: number;
  total_clicks?: number;
  total_bounces?: number;
  total_unsubscribes?: number;
  [key: string]: any;
}

export interface ActionStats {
  executions?: number;
  success_rate?: number;
  average_duration?: number;
  [key: string]: any;
}

export interface CampaignReportExport {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  created_on?: string;
  completed_on?: string;
  download_url?: string;
  [key: string]: any;
}

export interface SuppressedEmailsExport {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  description?: string;
  created_on?: string;
  completed_on?: string;
  download_url?: string;
  [key: string]: any;
}

// Report Response Types
export interface CampaignStatsResponse {
  data: CampaignStats;
}

export interface CampaignLinksStatsResponse {
  data: CampaignLinkStats[];
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface EmailStatsResponse {
  data: EmailStats;
}

export interface ListStatsResponse {
  data: ListStats;
}

export interface AccountStatsResponse {
  data: AccountStats;
}

export interface ActionStatsResponse {
  data: ActionStats;
}

export interface CampaignsReportsExportsResponse {
  data: CampaignReportExport[];
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface CreateCampaignReportExportResponse {
  data: CampaignReportExport;
}

export interface GetCampaignReportExportResponse {
  data: CampaignReportExport;
}

export interface DeleteCampaignReportExportResponse {
  data: {
    id: string;
    deleted: boolean;
  };
}

export interface DownloadCampaignReportExportResponse {
  data: {
    download_url: string;
    expires_at?: string;
  };
}

export interface SuppressedEmailsExportsResponse {
  data: SuppressedEmailsExport[];
  pagination?: {
    count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
}

export interface CreateSuppressedEmailsExportResponse {
  data: SuppressedEmailsExport;
}

export interface GetSuppressedEmailsExportResponse {
  data: SuppressedEmailsExport;
}

export interface DeleteSuppressedEmailsExportResponse {
  data: {
    id: string;
    deleted: boolean;
  };
}

export interface DownloadSuppressedEmailsExportResponse {
  data: {
    download_url: string;
    expires_at?: string;
  };
}

// Report Input Data Types
export interface CreateCampaignReportExportData {
  campaign_ids?: string[];
  start_date?: string;
  end_date?: string;
  format?: 'csv' | 'xlsx';
  fields?: string[];
  [key: string]: any;
}

export interface ReportFilters {
  status?: string;
  progress?: string;
  [key: string]: any;
}

export interface SubAccountFilters {
  name?: string;
  status?: 'pending' | 'active' | 'suspended' | 'inactive';
  type?: 'organization' | 'individual';
  partner_account_id?: number;
}

// Error response types from OpenAPI spec
export interface HTTPBadRequestError {
  detail: string;
}

export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationErrorDetail[];
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  with_count?: boolean;
}

export interface SortParams {
  sort?: string;
  order?: 'asc' | 'desc';
}

// Campaign related interfaces
export interface Campaign {
  id: number;
  name: string;
  subject?: string;
  html_content?: string;
  text_content?: string;
  status?: 'incomplete' | 'draft' | 'scheduled' | 'sending' | 'sent' | 'archived';
  list_id?: number;
  sender_id?: number;
  from_name?: string;
  reply_to?: string;
  created_on?: string;
  updated_on?: string;
  scheduled_for?: string;
  scheduled_on?: string;
  type?: string;
}

export interface CreateCampaignData {
  name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  list_id: string | number;
  sender_id: string | number;
  from_name?: string;
  reply_to?: string;
}

export interface UpdateCampaignData {
  name?: string;
  subject?: string;
  html_content?: string;
  text_content?: string;
  from_name?: string;
  reply_to?: string;
}

export interface CampaignFilters {
  status?: string;
  name?: string;
  type?: string;
  list_id?: string;
}

// Contact and List interfaces
export interface Contact {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  status?: string;
  subscribed_on?: string;
  custom_fields?: Record<string, any>;
}

export interface CreateContactData {
  email: string;
  first_name?: string;
  last_name?: string;
  list_id: string | number;
  custom_fields?: Record<string, any>;
}

export interface UpdateContactData {
  email?: string;
  first_name?: string;
  last_name?: string;
  custom_fields?: Record<string, any>;
}

export interface ContactList {
  id: number;
  name: string;
  description?: string;
  language?: string;
  created_on?: string;
  updated_on?: string;
}

export interface CreateListData {
  name: string;
  description?: string;
  language?: string;
}

export interface UpdateListData {
  name?: string;
  description?: string;
  language?: string;
}

// Sender interfaces
export interface Sender {
  id: number;
  name: string;
  email: string;
  language?: string;
  verified?: boolean;
  created_on?: string;
}

export interface CreateSenderData {
  name: string;
  email: string;
  language?: string;
}

export interface UpdateSenderData {
  name?: string;
  email?: string;
  language?: string;
}

// Template interfaces
export interface Template {
  id: number;
  name: string;
  subject?: string;
  html_content: string;
  text_content?: string;
  description?: string;
  created_on?: string;
  updated_on?: string;
}

export interface CreateTemplateData {
  name: string;
  subject?: string;
  html_content: string;
  text_content?: string;
  description?: string;
}

export interface UpdateTemplateData {
  name?: string;
  subject?: string;
  html_content?: string;
  text_content?: string;
  description?: string;
}

// Email API interfaces - Updated for v2 API (renamed from Transactional)
export interface EmailData {
  to_email: string;
  to_name?: string;
  sender_id: string | number;
  subject: string;
  html_content?: string;
  text_content?: string;
  template_id?: string | number;
  list_id?: string | number; // Required for v2 API, but can be auto-resolved
  email_type?: 'transactional' | 'marketing'; // v2 API content type
}

// Legacy type alias for backward compatibility
export interface TransactionalEmailData extends EmailData {}

// Analytics interfaces
export interface CampaignAnalytics {
  sent_count?: number;
  delivered_count?: number;
  bounce_count?: number;
  open_count?: number;
  unique_open_count?: number;
  open_rate?: number;
  click_count?: number;
  unique_click_count?: number;
  click_rate?: number;
}

export interface AnalyticsDateRange {
  start_date?: string;
  end_date?: string;
}

// Automation interfaces
export interface Automation {
  id: number;
  name: string;
  description?: string;
  status?: 'active' | 'inactive' | 'draft';
  trigger?: any;
  actions?: any[];
  created_on?: string;
  updated_on?: string;
}

export interface CreateAutomationData {
  name: string;
  description?: string;
  trigger: any;
  actions: any[];
}
