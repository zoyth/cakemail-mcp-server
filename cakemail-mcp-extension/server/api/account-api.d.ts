import { BaseApiClient } from './base-client.js';
import { AccountResponse, PatchAccountResponse } from '../types/cakemail-types.js';
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
export declare class AccountApi extends BaseApiClient {
    /**
     * Get my account details
     * Compliant with OpenAPI spec: GET /accounts/self
     */
    getSelfAccount(): Promise<AccountResponse>;
    /**
     * Update my account
     * Compliant with OpenAPI spec: PATCH /accounts/self
     */
    patchSelfAccount(data: PatchSelfAccount): Promise<PatchAccountResponse>;
    /**
     * Convert my account to an Organization
     * Compliant with OpenAPI spec: POST /accounts/self/convert-to-organization
     */
    convertSelfAccountToOrganization(): Promise<AccountResponse>;
}
//# sourceMappingURL=account-api.d.ts.map