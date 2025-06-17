// Account API operations - Updated for OpenAPI specification compliance
import { BaseApiClient } from './base-client.js';
export class AccountApi extends BaseApiClient {
    /**
     * Get my account details
     * Compliant with OpenAPI spec: GET /accounts/self
     */
    async getSelfAccount() {
        return this.makeRequest('/accounts/self');
    }
    /**
     * Update my account
     * Compliant with OpenAPI spec: PATCH /accounts/self
     */
    async patchSelfAccount(data) {
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
    async convertSelfAccountToOrganization() {
        return this.makeRequest('/accounts/self/convert-to-organization', {
            method: 'POST'
        });
    }
}
//# sourceMappingURL=account-api.js.map