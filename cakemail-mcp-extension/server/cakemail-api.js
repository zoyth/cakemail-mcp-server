// Main Cakemail API client that composes all sub-APIs
import { BaseApiClient } from './api/base-client.js';
import { CampaignApi } from './api/campaign-api.js';
import { ContactApi } from './api/contact-api.js';
import { SenderApi } from './api/sender-api.js';
import { TemplateApi } from './api/template-api.js';
import { EmailApi } from './api/email-api.js';
import { ListApi } from './api/list-api.js';
import { AccountApi } from './api/account-api.js';
import { SubAccountApi } from './api/sub-account-api.js';
import { ReportsApi } from './api/reports-api.js';
import { LogsApi } from './api/logs-api.js';
export class CakemailAPI extends BaseApiClient {
    campaigns;
    contacts;
    senders;
    templates;
    email;
    lists;
    account;
    subAccounts;
    reports;
    logs;
    constructor(config) {
        super(config);
        // Initialize all sub-APIs with the same config
        this.campaigns = new CampaignApi(config);
        this.contacts = new ContactApi(config);
        this.senders = new SenderApi(config);
        this.templates = new TemplateApi(config);
        this.email = new EmailApi(config);
        this.lists = new ListApi(config);
        this.account = new AccountApi(config);
        this.subAccounts = new SubAccountApi(config);
        this.reports = new ReportsApi(config);
        this.logs = new LogsApi(config);
    }
    // Expose token management methods
    getTokenStatus() {
        return super.getTokenStatus();
    }
    async forceRefreshToken() {
        return super.forceRefreshToken();
    }
    async validateToken() {
        return super.validateToken();
    }
    getTokenScopes() {
        return super.getTokenScopes();
    }
}
// Export error and retry types
export * from './types/errors.js';
export * from './types/retry.js';
// Export unified pagination system
export * from './utils/pagination/index.js';
export { BaseApiClient } from './api/base-client.js';
export { CampaignApi } from './api/campaign-api.js';
export { ContactApi } from './api/contact-api.js';
export { SenderApi } from './api/sender-api.js';
export { TemplateApi } from './api/template-api.js';
export { EmailApi } from './api/email-api.js';
export { ListApi } from './api/list-api.js';
export { AccountApi } from './api/account-api.js';
export { SubAccountApi } from './api/sub-account-api.js';
export { ReportsApi } from './api/reports-api.js';
export { LogsApi } from './api/logs-api.js';
//# sourceMappingURL=cakemail-api.js.map