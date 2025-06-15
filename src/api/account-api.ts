// Account API operations

import { BaseApiClient } from './base-client.js';
import { 
  AccountResponse,
  PatchAccountResponse
} from '../types/cakemail-types.js';

export interface PatchSelfAccount {
  name?: string;
  email?: string;
  [key: string]: any;
}

export class AccountApi extends BaseApiClient {

  async getSelfAccount(): Promise<AccountResponse> {
    return this.makeRequest('/accounts/self');
  }

  async patchSelfAccount(data: PatchSelfAccount): Promise<PatchAccountResponse> {
    return this.makeRequest('/accounts/self', {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async convertSelfAccountToOrganization(): Promise<AccountResponse> {
    return this.makeRequest('/accounts/self/convert-to-organization', {
      method: 'POST'
    });
  }
}
