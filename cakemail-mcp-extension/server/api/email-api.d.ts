import { BaseApiClient } from './base-client.js';
import type { EmailAPILogsResponse, EmailAPIStatsResponse, EmailLogAnalysis, SmartFilterType, SubmitEmailRequest, SubmitEmailResponse, GetEmailResponse, // Fixed: removed alias
EmailLogsParams, // Now exists
EmailStatsParams } from '../types/cakemail-types.js';
export declare class EmailApi extends BaseApiClient {
    /**
     * Submit an email to be sent using v2 API
     * Fully compliant with POST /v2/emails specification
     */
    sendEmail(data: SubmitEmailRequest): Promise<SubmitEmailResponse>;
    /**
     * Retrieve a submitted email status
     * Compliant with GET /v2/emails/{email_id} specification
     */
    getEmail(emailId: string): Promise<GetEmailResponse>;
    /**
     * Render a submitted email (get HTML/text content)
     */
    renderEmail(emailId: string, options?: {
        as_submitted?: boolean;
        tracking?: boolean;
    }): Promise<string>;
    /**
     * Show Email API activity logs
     * Compliant with GET /v2/logs/emails specification
     */
    getEmailLogs(options?: EmailLogsParams): Promise<EmailAPILogsResponse>;
    /**
     * Show Email API statistics
     * Compliant with GET /v2/reports/emails specification
     */
    getEmailStats(options?: EmailStatsParams): Promise<EmailAPIStatsResponse>;
    /**
     * Helper method to send transactional email
     */
    sendTransactionalEmail(data: SubmitEmailRequest): Promise<SubmitEmailResponse>;
    /**
     * Helper method to send marketing email
     */
    sendMarketingEmail(data: SubmitEmailRequest): Promise<SubmitEmailResponse>;
    /**
     * Helper method to get email status (alias for getEmail)
     */
    getEmailStatus(emailId: string): Promise<GetEmailResponse>;
    /**
     * Bulk email status retrieval
     */
    getBulkEmailStatus(emailIds: string[]): Promise<GetEmailResponse[]>;
    /**
     * Create a filter for logs/stats using the recursive filter syntax
     * Enhanced with validation and helper patterns
     */
    createFilter(conditions: any[], operator?: 'and' | 'or' | 'not' | 'is'): string;
    /**
     * Helper to create simple tag filters
     */
    createTagFilter(tags: string[], operator?: 'and' | 'or'): string;
    /**
     * Helper to create provider filters
     */
    createProviderFilter(providers: string[], operator?: 'and' | 'or'): string;
    /**
     * Create smart filters for common use cases
     */
    createSmartFilter(filterType: SmartFilterType): string;
    /**
     * Analyze email logs with smart insights
     */
    analyzeEmailLogs(logs: EmailAPILogsResponse): EmailLogAnalysis;
    /**
     * Get email logs with automatic analysis
     */
    getEmailLogsWithAnalysis(options?: Parameters<typeof this.getEmailLogs>[0]): Promise<{
        logs: EmailAPILogsResponse;
        analysis: EmailLogAnalysis;
    }>;
    /**
     * Enhanced email validation
     */
    protected isValidEmail(email: string): boolean;
}
export { EmailAPIError } from '../types/errors.js';
//# sourceMappingURL=email-api.d.ts.map