import { CakemailConfig } from './types/cakemail-types.js';
import { BaseApiClient, EnhancedCakemailConfig } from './api/base-client.js';
import { CampaignApi } from './api/campaign-api.js';
import { ContactApi } from './api/contact-api.js';
import { SenderApi } from './api/sender-api.js';
import { TemplateApi } from './api/template-api.js';
import { EmailApi } from './api/email-api.js';
import { AccountApi } from './api/account-api.js';
import { SubAccountApi } from './api/sub-account-api.js';
import { ReportsApi } from './api/reports-api.js';
import { LogsApi } from './api/logs-api.js';
export declare class CakemailAPI extends BaseApiClient {
    campaigns: CampaignApi;
    contacts: ContactApi;
    senders: SenderApi;
    templates: TemplateApi;
    email: EmailApi;
    account: AccountApi;
    subAccounts: SubAccountApi;
    reports: ReportsApi;
    logs: LogsApi;
    constructor(config: CakemailConfig | EnhancedCakemailConfig);
}
export * from './types/cakemail-types.js';
export * from './types/errors.js';
export * from './types/retry.js';
export * from './types/event-taxonomy.js';
export { BaseApiClient, EnhancedCakemailConfig } from './api/base-client.js';
export { CampaignApi } from './api/campaign-api.js';
export { ContactApi } from './api/contact-api.js';
export { SenderApi } from './api/sender-api.js';
export { TemplateApi } from './api/template-api.js';
export { EmailApi } from './api/email-api.js';
export { AccountApi } from './api/account-api.js';
export { SubAccountApi } from './api/sub-account-api.js';
export { ReportsApi } from './api/reports-api.js';
export { LogsApi } from './api/logs-api.js';
//# sourceMappingURL=cakemail-api.d.ts.map