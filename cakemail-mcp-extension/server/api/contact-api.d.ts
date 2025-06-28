import { BaseApiClient } from './base-client.js';
import { CreateContactData, UpdateContactData, CreateListData, UpdateListData, PaginationParams, SortParams, ContactsResponse, ContactResponse, CreateContactResponse, ListsResponse, ListResponse, CreateListResponse } from '../types/cakemail-types.js';
import { UnifiedPaginationOptions, PaginatedResult, PaginatedIterator, IteratorOptions } from '../utils/pagination/index.js';
export declare class ContactApi extends BaseApiClient {
    getContacts(params?: PaginationParams & {
        list_id?: string;
        account_id?: number;
        email?: string;
        status?: string;
    }): Promise<ContactsResponse>;
    getContactsPaginated(listId?: string, options?: UnifiedPaginationOptions, additionalFilters?: {
        account_id?: number;
        status?: string;
        email?: string;
        list_id?: string;
    }): Promise<PaginatedResult<any>>;
    getContactsIterator(listId?: string, options?: IteratorOptions, filters?: {
        account_id?: number;
        status?: string;
        email?: string;
        list_id?: string;
    }): PaginatedIterator<any>;
    getAllContacts(listId?: string, options?: IteratorOptions, filters?: {
        account_id?: number;
        status?: string;
        email?: string;
        list_id?: string;
    }): Promise<any[]>;
    processContactsInBatches(listId: string, processor: (contacts: any[]) => Promise<void>, options?: IteratorOptions, filters?: {
        account_id?: number;
        status?: string;
        email?: string;
        list_id?: string;
    }): Promise<void>;
    createContact(data: CreateContactData): Promise<CreateContactResponse>;
    getContact(contactId: string): Promise<ContactResponse>;
    updateContact(contactId: string, data: UpdateContactData): Promise<ContactResponse>;
    deleteContact(contactId: string): Promise<{
        success: true;
        status: number;
    }>;
    getLists(params?: PaginationParams & SortParams & {
        account_id?: number;
    }): Promise<ListsResponse>;
    getListsPaginated(options?: UnifiedPaginationOptions, additionalFilters?: {
        account_id?: number;
        status?: string;
        name?: string;
        sort?: string;
        order?: 'asc' | 'desc';
    }): Promise<PaginatedResult<any>>;
    getListsIterator(options?: IteratorOptions, filters?: {
        account_id?: number;
        status?: string;
        name?: string;
        sort?: string;
        order?: 'asc' | 'desc';
    }): PaginatedIterator<any>;
    getAllLists(options?: IteratorOptions, filters?: {
        account_id?: number;
        status?: string;
        name?: string;
        sort?: string;
        order?: 'asc' | 'desc';
    }): Promise<any[]>;
    createList(data: CreateListData): Promise<CreateListResponse>;
    getList(listId: string): Promise<ListResponse>;
    updateList(listId: string, data: UpdateListData): Promise<ListResponse>;
    deleteList(listId: string): Promise<{
        success: true;
        status: number;
    }>;
    unsubscribeContact(listId: string, contactId: string): Promise<any>;
    importContacts(listId: string, contacts: any[], updateExisting?: boolean): Promise<any>;
    tagContacts(listId: string, contactIds: number[], tags: string[]): Promise<any>;
    untagContacts(listId: string, contactIds: number[], tags: string[]): Promise<any>;
    searchContacts(listId: string, params: {
        query?: string;
        filters?: any;
        page?: number;
        per_page?: number;
    }): Promise<any>;
    findContactByEmail(email: string): Promise<any | null>;
    getActiveContactsInList(listId: string): Promise<any[]>;
    ensureContactExists(listId: string, email: string): Promise<any>;
}
//# sourceMappingURL=contact-api.d.ts.map