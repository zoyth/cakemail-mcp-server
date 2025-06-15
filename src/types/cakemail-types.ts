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

export interface CakemailError {
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

// Transactional email responses
export interface TransactionalEmailResponse {
  data: {
    id: string;
    status: string;
    message?: string;
  };
}

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

// Transactional email interfaces
export interface TransactionalEmailData {
  to_email: string;
  to_name?: string;
  sender_id: string | number;
  subject: string;
  html_content: string;
  text_content?: string;
  template_id?: string;
}

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
