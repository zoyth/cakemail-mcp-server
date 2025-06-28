import { BaseApiClient } from './base-client.js';
import type { PaginationParams } from '../types/cakemail-types.js';
export interface GetCampaignLogsParams extends PaginationParams {
    account_id?: number;
    filter?: string;
    cursor?: string;
    sort?: string;
    type?: string;
    start_time?: number;
    end_time?: number;
}
export interface CampaignLogResponse {
    pagination?: {
        page: number;
        per_page: number;
        count?: number;
        has_more?: boolean;
        cursor?: string;
    };
    data: any[];
}
export declare class LogsApi extends BaseApiClient {
    /**
     * Get campaign logs with filtering and pagination
     */
    getCampaignLogs(campaignId: string, params?: GetCampaignLogsParams): Promise<CampaignLogResponse>;
    /**
     * Get campaign logs with intelligent categorization and analysis
     */
    getCampaignLogsWithAnalysis(campaignId: string, params?: GetCampaignLogsParams): Promise<{
        logs: CampaignLogResponse;
        analysis: {
            summary: {
                total_events: number;
                event_types: Record<string, number>;
                time_range: {
                    start?: number;
                    end?: number;
                };
                top_events: string[];
            };
            insights: string[];
            recommendations: string[];
            sequence_analysis?: {
                funnel_metrics: {
                    sent: number;
                    delivered: number;
                    opened: number;
                    clicked: number;
                    bounced: number;
                    unsubscribed: number;
                };
                conversion_rates: {
                    delivery_rate: number;
                    open_rate: number;
                    click_through_rate: number;
                    click_to_open_rate: number;
                    bounce_rate: number;
                    unsubscribe_rate: number;
                };
                timing_analysis: {
                    avg_time_to_open?: number;
                    avg_time_to_click?: number;
                    peak_engagement_hour?: number;
                    engagement_pattern: 'immediate' | 'delayed' | 'mixed' | 'unknown';
                };
                user_journeys: {
                    complete_journey: number;
                    opened_not_clicked: number;
                    delivered_not_opened: number;
                    bounced_immediately: number;
                };
                drop_off_analysis: {
                    delivery_drop_off: number;
                    open_drop_off: number;
                    click_drop_off: number;
                    primary_drop_off_stage: string;
                };
            };
        };
    }>;
    /**
     * Analyze campaign logs to provide insights with advanced event sequence analysis
     */
    private analyzeCampaignLogs;
    /**
     * Perform advanced event sequence analysis
     */
    private performSequenceAnalysis;
    /**
     * Generate insights based on sequence analysis
     */
    private generateSequenceInsights;
    /**
     * Generate recommendations based on sequence analysis
     */
    private generateSequenceRecommendations;
    /**
     * Debug logs access and test different access patterns
     */
    debugLogsAccess(campaignId?: string): Promise<{
        timestamp: string;
        tests: any[];
    }>;
    getEmailLogs(logType: string, params?: any): Promise<any>;
    getEmailLogsWithAnalysis(logType: string, params?: any): Promise<any>;
    getCampaignEngagementLogs(campaignId: string): Promise<any[]>;
    getCampaignBounceAndSpamLogs(campaignId: string): Promise<any[]>;
    getEmailJourney(emailId: string): Promise<any>;
    aggregateCampaignLogsByType(campaignId: string): Promise<any>;
    getClickPatterns(campaignId: string): Promise<any>;
    iterateCampaignLogs(campaignId: string, params?: any): AsyncGenerator<any[], void, unknown>;
    processCampaignLogsInBatches(campaignId: string, processor: (batch: any[]) => Promise<void>, params?: any): Promise<void>;
    /**
     * Get list logs with filtering and pagination
     */
    getListLogs(listId: string, params?: any): Promise<any>;
}
//# sourceMappingURL=logs-api.d.ts.map