// Account API operations - Updated for OpenAPI specification compliance

import { BaseApiClient } from './base-client.js';
import { 
  AccountResponse,
  PatchAccountResponse
} from '../types/cakemail-types.js';

export interface PatchSelfAccount {
  name?: string;
  email?: string;
  company?: string;
  language?: string;
  timezone?: string;
  country?: string;
  phone?: string;
  website?: string;
  description?: string;
  [key: string]: any;
}

export class AccountApi extends BaseApiClient {

  /**
   * Get my account details
   * Compliant with OpenAPI spec: GET /accounts/self
   */
  async getSelfAccount(): Promise<AccountResponse> {
    return this.makeRequest('/accounts/self');
  }

  /**
   * Update my account
   * Compliant with OpenAPI spec: PATCH /accounts/self
   */
  async patchSelfAccount(data: PatchSelfAccount): Promise<PatchAccountResponse> {
    // Validate email if provided
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }
    }
    
    return this.makeRequest('/accounts/self', {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * Convert my account to an Organization
   * Compliant with OpenAPI spec: POST /accounts/self/convert-to-organization
   */
  async convertSelfAccountToOrganization(): Promise<AccountResponse> {
    return this.makeRequest('/accounts/self/convert-to-organization', {
      method: 'POST'
    });
  }
}
