import { BaseApiClient } from './base-client.js';
import { CreateContactData, UpdateContactData, CreateListData, UpdateListData, PaginationParams, SortParams, ContactsResponse, ContactResponse, CreateContactResponse, ListsResponse, ListResponse, CreateListResponse } from '../types/cakemail-types.js';
export declare class ContactApi extends BaseApiClient {
    getContacts(params?: PaginationParams & {
        list_id?: string;
        account_id?: number;
    }): Promise<ContactsResponse>;
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
    createList(data: CreateListData): Promise<CreateListResponse>;
    getList(listId: string): Promise<ListResponse>;
    updateList(listId: string, data: UpdateListData): Promise<ListResponse>;
    deleteList(listId: string): Promise<{
        success: true;
        status: number;
    }>;
}
//# sourceMappingURL=contact-api.d.ts.map