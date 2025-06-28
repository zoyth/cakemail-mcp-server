import { BaseApiClient } from './base-client.js';
export interface ListData {
    name: string;
    default_sender: {
        id: number;
    };
    language?: string;
    redirections?: {
        subscribe?: string;
        unsubscribe?: string;
        update?: string;
    };
    webhook?: {
        url?: string;
        actions?: string[];
    };
}
export interface UpdateListData {
    name?: string;
    default_sender?: {
        id: number;
    };
    language?: string;
    redirections?: {
        subscribe?: string;
        unsubscribe?: string;
        update?: string;
    };
    webhook?: {
        url?: string;
        actions?: string[];
    };
}
export interface ListFilters {
    page?: number;
    per_page?: number;
    status?: string;
    name?: string;
    sort?: 'name' | 'created_on' | 'updated_on' | 'status';
    order?: 'asc' | 'desc';
    with_count?: boolean;
    account_id?: number;
}
export interface ListsResponse {
    pagination: {
        count?: number;
        page?: number;
        per_page?: number;
        total_pages?: number;
    };
    data: any[];
}
export interface ListResponse {
    data: any;
}
export interface CreateListResponse {
    data: any;
}
export interface ListStatsParams {
    list_id: string;
    start_time?: number;
    end_time?: number;
    interval?: 'hour' | 'day' | 'week' | 'month';
    account_id?: number;
}
export interface ListStatsResponse {
    data: any;
}
export declare class ListApi extends BaseApiClient {
    getLists(filters?: ListFilters): Promise<ListsResponse>;
    createList(data: ListData, options?: {
        account_id?: number;
    }): Promise<CreateListResponse>;
    getList(listId: string, options?: {
        account_id?: number;
    }): Promise<ListResponse>;
    updateList(listId: string, data: UpdateListData, options?: {
        account_id?: number;
    }): Promise<ListResponse>;
    deleteList(listId: string, options?: {
        account_id?: number;
    }): Promise<{
        success: true;
        status: number;
    }>;
    archiveList(listId: string, options?: {
        account_id?: number;
    }): Promise<{
        success: true;
        status: number;
    }>;
    getListStats(listId: string, params?: {
        start_time?: number;
        end_time?: number;
        interval?: string;
    }): Promise<ListStatsResponse>;
    findListByName(name: string): Promise<any | null>;
    getActiveLists(): Promise<any[]>;
    getAllLists(): Promise<any[]>;
    processListsInBatches(processor: (batch: any[]) => Promise<void>): Promise<void>;
}
//# sourceMappingURL=list-api.d.ts.map