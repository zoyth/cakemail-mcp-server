import { BaseApiClient } from './base-client.js';
import { CreateSenderData, UpdateSenderData, SendersResponse, SenderResponse, CreateSenderResponse } from '../types/cakemail-types.js';
export declare class SenderApi extends BaseApiClient {
    getSenders(): Promise<SendersResponse>;
    createSender(data: CreateSenderData): Promise<CreateSenderResponse>;
    getSender(senderId: string): Promise<SenderResponse>;
    updateSender(senderId: string, data: UpdateSenderData): Promise<SenderResponse>;
    deleteSender(senderId: string): Promise<{
        success: true;
        status: number;
    }>;
    findSenderByEmail(email: string): Promise<any | null>;
    findConfirmedSenderByEmail(email: string): Promise<any | null>;
    getConfirmedSenders(): Promise<any[]>;
    ensureSenderExists(email: string, name: string, language?: string): Promise<any>;
    getDefaultSender(): Promise<any | null>;
}
//# sourceMappingURL=sender-api.d.ts.map