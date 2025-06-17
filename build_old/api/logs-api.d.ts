import { BaseApiClient } from './base-client.js';
export declare class LogsApi extends BaseApiClient {
    private readonly FILTER_CONFIGS;
    /**
     * Get campaign logs with detailed activity tracking
     * Tries multiple endpoints to find engagement data (clicks, opens)
     * Primary: GET /logs/campaigns/{campaign_id}
     * Fallbacks: Analytics API and Campaign API endpoints
     */
    getCampaignLogs(campaignId: string, params?: {
        account_id?: number;
        page?: number;
        per_page?: number;
        with_count?: boolean;
        sort?: string;
        order?: 'asc' | 'desc';
        cursor?: string;
        filter?: string;
        type?: string;
        start_time?: number;
        end_time?: number;
    }): Promise<any>;
    /**
     * Check if the response contains engagement data (clicks, opens, etc.)
     * Returns true if engagement events are found, false if only delivery events
     */
    private hasEngagementData;
    /**
     * Get workflow action logs for automation tracking
     * Endpoint: GET /logs/workflows/{workflow_id}/actions/{action_id}
     */
    getWorkflowActionLogs(workflowId: string, actionId: string, params?: {
        account_id?: number;
        page?: number;
        per_page?: number;
        with_count?: boolean;
        start_time?: number;
        end_time?: number;
        filter?: string;
    }): Promise<any>;
    /**
     * Get workflow logs (complete workflow automation logging)
     * Endpoint: GET /logs/workflows/{workflow_id}
     */
    getWorkflowLogs(workflowId: string, params?: {
        account_id?: number;
        page?: number;
        per_page?: number;
        with_count?: boolean;
        sort?: string;
        order?: 'asc' | 'desc';
        start_time?: number;
        end_time?: number;
        filter?: string;
    }): Promise<any>;
    /**
     * Get transactional email logs (if available under /logs/emails)
     * Endpoint: GET /logs/emails
     */
    getTransactionalEmailLogs(params: {
        log_type?: string;
        account_id?: number;
        page?: number;
        per_page?: number;
        with_count?: boolean;
        sort?: string;
        order?: 'asc' | 'desc';
        start_time?: number;
        end_time?: number;
        filter?: string;
        email_id?: string;
        sender_id?: string;
        status?: string;
    }): Promise<any>;
    /**
     * Get list logs for contact list activity tracking
     * Endpoint: GET /logs/lists/{list_id}
     */
    getListLogs(listId: string, params?: {
        account_id?: number;
        page?: number;
        per_page?: number;
        with_count?: boolean;
        start_time?: number;
        end_time?: number;
        filter?: string;
    }): Promise<any>;
    /**
     * Debug logs API access and test different endpoints
     * Provides detailed analysis of log data and endpoint availability
     */
    debugLogsAccess(params?: {
        campaign_id?: string;
        workflow_id?: string;
    }): Promise<{
        timestamp: string;
        tests: any[];
    }>;
    /**
     * Analyze log data structure to understand what types of events are available
     */
    private analyzeLogs;
    /**
     * Validate filter parameter syntax for specific endpoint
     * @param filter Filter string to validate
     * @param endpoint Endpoint type to validate against
     * @returns true if filter is valid, false otherwise
     */
    private validateFilter;
    /**
     * Get smart filter suggestions based on event taxonomy
     * Returns common filter patterns for typical use cases
     */
    getSmartFilterSuggestions(): Array<{
        name: string;
        description: string;
        filter: string;
        useCase: string;
    }>;
    /**
     * Get events in a specific category
     * @param categoryName Category name (ENGAGEMENT, BOUNCES, LIST_MANAGEMENT, etc.)
     */
    getEventsInCategory(categoryName: string): string[];
    /**
     * Get event details and categorization
     * @param eventType Event type code (click, bounce_hb, etc.)
     */
    getEventDetails(eventType: string): {
        event: import("../types/event-taxonomy.js").EventType | undefined;
        category: import("../types/event-taxonomy.js").EventCategory | undefined;
        isValid: boolean;
        isCritical: boolean;
        isRetryable: boolean;
        isPermanent: boolean;
    };
    /**
     * Get pre-built filter for a specific helper
     * @param helperName Name of the filter helper (engagement_events, delivery_issues, etc.)
     */
    getFilterHelper(helperName: string): string | undefined;
    /**
     * Generate filter string for events requiring immediate attention
     */
    getCriticalEventsFilter(): string;
    /**
     * Generate filter string for permanent failures (list cleanup)
     */
    getPermanentFailuresFilter(): string;
    /**
     * Analyze log results with event taxonomy context
     * Enhances the existing analyzeLogs method with taxonomy insights
     */
    analyzeLogsWithTaxonomy(logResult: any): {
        taxonomy: null;
        types: string[];
        samples: any[];
        fields: string[];
        hasClickUrls: boolean;
    } | {
        taxonomy: {
            categorizedEvents: {
                [k: string]: number;
            };
            criticalEventCount: number;
            engagementEventCount: number;
            deliveryIssueCount: number;
            criticalEvents: any[];
            needsAttention: boolean;
            summary: {
                totalEvents: any;
                engagementRate: string;
                issueRate: string;
            };
        };
        types: string[];
        samples: any[];
        fields: string[];
        hasClickUrls: boolean;
    };
}
//# sourceMappingURL=logs-api.d.ts.map