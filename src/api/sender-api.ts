// Sender API operations

import { BaseApiClient } from './base-client.js';
import { 
  CreateSenderData, 
  UpdateSenderData,
  SendersResponse,
  SenderResponse,
  CreateSenderResponse
} from '../types/cakemail-types.js';

export class SenderApi extends BaseApiClient {

  async getSenders(): Promise<SendersResponse> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/brands/default/senders${query}`);
  }

  async createSender(data: CreateSenderData): Promise<CreateSenderResponse> {
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

  async getSender(senderId: string): Promise<SenderResponse> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/brands/default/senders/${senderId}${query}`);
  }

  async updateSender(senderId: string, data: UpdateSenderData): Promise<SenderResponse> {
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    const updateData: Record<string, any> = {
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

  async deleteSender(senderId: string): Promise<{ success: true; status: number }> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/brands/default/senders/${senderId}${query}`, { 
      method: 'DELETE' 
    });
  }

  // Helper methods
  async findSenderByEmail(email: string): Promise<any | null> {
    const response = await this.getSenders();
    const sender = response.data?.find(s => s.email === email);
    return sender || null;
  }

  async findConfirmedSenderByEmail(email: string): Promise<any | null> {
    const response = await this.getSenders();
    const sender = response.data?.find(s => s.email === email && s.confirmed === true);
    return sender || null;
  }

  async getConfirmedSenders(): Promise<any[]> {
    const response = await this.getSenders();
    return response.data?.filter(s => s.confirmed === true) || [];
  }

  async ensureSenderExists(email: string, name: string, language?: string): Promise<any> {
    // Check if sender already exists and is confirmed
    const existing = await this.findConfirmedSenderByEmail(email);
    if (existing) {
      return existing;
    }

    // Check if sender exists but is not confirmed
    const unconfirmed = await this.findSenderByEmail(email);
    if (unconfirmed && !unconfirmed.confirmed) {
      throw new Error(`Sender ${email} exists but is not confirmed. Please confirm the sender before using it.`);
    }

    // Create new sender
    const createData: CreateSenderData = { email, name };
    if (language !== undefined) {
      createData.language = language;
    }
    const response = await this.createSender(createData);
    
    // Check if the newly created sender is confirmed
    if (!response.data.confirmed) {
      throw new Error(`Sender ${email} was created but is not confirmed. Please confirm the sender before using it.`);
    }
    
    return response.data;
  }

  async getDefaultSender(): Promise<any | null> {
    const response = await this.getSenders();
    if (!response.data || response.data.length === 0) {
      return null;
    }

    // Look for a confirmed sender marked as default
    const defaultSender = response.data.find(s => (s as any).is_default === true && s.confirmed === true);
    if (defaultSender) {
      return defaultSender;
    }

    // Return the first confirmed sender if no default is set
    const confirmedSender = response.data.find(s => s.confirmed === true);
    return confirmedSender || null;
  }
}
