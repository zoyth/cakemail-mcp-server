// Automation API operations

import { BaseApiClient } from './base-client.js';
import { 
  CreateAutomationData,
  PaginationParams,
  AutomationsResponse,
  AutomationResponse,
  CreateAutomationResponse
} from '../types/cakemail-types.js';

export class AutomationApi extends BaseApiClient {

  async getAutomations(params?: PaginationParams & { status?: string; account_id?: number }): Promise<AutomationsResponse> {
    const enhancedParams = { ...params };
    const accountId = await this.getCurrentAccountId();
    if (accountId && !enhancedParams.account_id) {
      enhancedParams.account_id = accountId;
    }
    
    const query = enhancedParams ? `?${new URLSearchParams(enhancedParams as any)}` : '';
    return this.makeRequest(`/automations${query}`);
  }

  async getAutomation(automationId: string): Promise<AutomationResponse> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/automations/${automationId}${query}`);
  }

  async createAutomation(data: CreateAutomationData): Promise<CreateAutomationResponse> {
    const automationData = {
      name: data.name,
      description: data.description,
      trigger: data.trigger,
      actions: data.actions,
    };

    // Remove undefined fields
    Object.keys(automationData).forEach(key => {
      if ((automationData as any)[key] === undefined) {
        delete (automationData as any)[key];
      }
    });

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    return this.makeRequest(`/automations${query}`, {
      method: 'POST',
      body: JSON.stringify(automationData)
    });
  }

  async startAutomation(automationId: string): Promise<{ success: true; status: number }> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/automations/${automationId}/start${query}`, { 
      method: 'POST' 
    });
  }

  async stopAutomation(automationId: string): Promise<{ success: true; status: number }> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/automations/${automationId}/stop${query}`, { 
      method: 'POST' 
    });
  }
}
