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
}
//# sourceMappingURL=sender-api.d.ts.map