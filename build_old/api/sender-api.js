// Sender API operations
import { BaseApiClient } from './base-client.js';
export class SenderApi extends BaseApiClient {
    async getSenders() {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/brands/default/senders${query}`);
    }
    async createSender(data) {
        if (!this.isValidEmail(data.email)) {
            throw new Error('Invalid email format');
        }
        const senderData = {
            name: data.name,
            email: data.email,
            language: data.language || 'en_US',
        };
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/brands/default/senders${query}`, {
            method: 'POST',
            body: JSON.stringify(senderData)
        });
    }
    async getSender(senderId) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/brands/default/senders/${senderId}${query}`);
    }
    async updateSender(senderId, data) {
        if (data.email && !this.isValidEmail(data.email)) {
            throw new Error('Invalid email format');
        }
        const updateData = {
            name: data.name,
            email: data.email,
            language: data.language,
        };
        // Remove undefined fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/brands/default/senders/${senderId}${query}`, {
            method: 'PATCH',
            body: JSON.stringify(updateData)
        });
    }
    async deleteSender(senderId) {
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        return this.makeRequest(`/brands/default/senders/${senderId}${query}`, {
            method: 'DELETE'
        });
    }
}
//# sourceMappingURL=sender-api.js.map