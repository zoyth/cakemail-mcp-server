export interface ToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
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

export interface FilterParams {
  status?: string;
  name?: string;
  type?: string;
}

export interface CampaignListParams extends PaginationParams, SortParams, FilterParams {
  list_id?: string;
  account_id?: number;
}

export interface SubAccountParams extends PaginationParams, SortParams {
  status?: 'pending' | 'active' | 'suspended' | 'inactive';
  name?: string;
  recursive?: boolean;
  partner_account_id?: number;
}

export interface LogsParams extends PaginationParams, SortParams {
  account_id?: number;
  filter?: string;
  type?: string;
  start_time?: number;
  end_time?: number;
  cursor?: string;
}
