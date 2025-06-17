import { BaseApiClient } from './base-client.js';
import { EmailData, EmailAPILogsResponse, EmailAPIStatsResponse, SubmitEmailResponse, GetEmailResponse, LogTypeV2, EmailLogAnalysis, SmartFilterType } from '../types/cakemail-types.js';
export declare class EmailApi extends BaseApiClient {
    /**
     * Submit an email to be sent using v2 API
     * Fully compliant with POST /v2/emails specification
     */
    sendEmail(data: EmailData): Promise<SubmitEmailResponse>;
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
    getEmailLogs(options?: {
        log_type?: LogTypeV2;
        email_id?: string;
        iso_time?: boolean;
        page?: number;
        per_page?: number;
        start_time?: number;
        end_time?: number;
        tags?: string;
        providers?: string;
        sort?: string;
    }): Promise<EmailAPILogsResponse>;
    /**
     * Show Email API statistics
     * Compliant with GET /v2/reports/emails specification
     */
    getEmailStats(options?: {
        interval?: 'hour' | 'day' | 'week' | 'month';
        iso_time?: boolean;
        start_time?: number;
        end_time?: number;
        providers?: string;
        tags?: string;
    }): Promise<EmailAPIStatsResponse>;
    /**
     * Helper method to send transactional email
     */
    sendTransactionalEmail(data: EmailData): Promise<SubmitEmailResponse>;
    /**
     * Helper method to send marketing email
     */
    sendMarketingEmail(data: EmailData): Promise<SubmitEmailResponse>;
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