/**
 * Behavioral Pattern Recognition Module for Cakemail Campaign Logs
 * Analyzes subscriber engagement patterns and provides actionable insights
 */
export declare enum EngagementLevel {
    HIGHLY_ENGAGED = "highly_engaged",
    MODERATELY_ENGAGED = "moderately_engaged",
    LOW_ENGAGEMENT = "low_engagement",
    DECLINING = "declining",
    INACTIVE = "inactive",
    AT_RISK = "at_risk"
}
export declare enum BehaviorPattern {
    CONSISTENT_OPENER = "consistent_opener",
    SELECTIVE_CLICKER = "selective_clicker",
    MOBILE_PREFERRER = "mobile_preferrer",
    WEEKEND_ENGAGER = "weekend_engager",
    EARLY_BIRD = "early_bird",
    NIGHT_OWL = "night_owl",
    BINGE_READER = "binge_reader",
    QUICK_SCANNER = "quick_scanner",
    UNSUBSCRIBE_RISK = "unsubscribe_risk",
    LOYAL_SUBSCRIBER = "loyal_subscriber",
    CONTENT_SKIMMER = "content_skimmer"
}
export interface EngagementMetrics {
    total_campaigns_sent: number;
    total_opens: number;
    total_clicks: number;
    unique_opens: number;
    unique_clicks: number;
    open_rate: number;
    click_rate: number;
    click_to_open_rate: number;
    average_time_to_open?: number;
    average_time_to_click?: number;
    engagement_trend: 'increasing' | 'stable' | 'declining';
    last_engagement_date?: string;
    days_since_last_engagement?: number;
    engagement_consistency: number;
    peak_engagement_days: string[];
    avg_session_duration?: number;
}
export interface BehavioralInsight {
    pattern: BehaviorPattern;
    confidence: number;
    description: string;
    recommendation: string;
    supporting_data: Record<string, any>;
    impact_score: number;
}
export interface ContactBehaviorProfile {
    contact_id: number;
    email: string;
    engagement_level: EngagementLevel;
    engagement_metrics: EngagementMetrics;
    behavioral_patterns: BehavioralInsight[];
    lifecycle_stage: string;
    predicted_actions: Record<string, number>;
    optimal_send_time?: string;
    content_preferences: Record<string, number>;
    risk_scores: Record<string, number>;
    personalization_opportunities: string[];
    segment_recommendations: string[];
}
export interface AggregateInsights {
    engagement_level_distribution: Record<string, number>;
    average_open_rate: number;
    average_click_rate: number;
    most_common_behavioral_patterns: Array<[string, number]>;
    lifecycle_stage_distribution: Record<string, number>;
    total_at_risk_contacts: number;
    high_value_contacts: number;
    optimal_send_times: Record<string, number>;
    content_performance: Record<string, number>;
    device_preferences: Record<string, number>;
    geographic_patterns?: Record<string, any>;
    seasonal_trends?: Record<string, any>;
}
export interface BehavioralAnalysisResult {
    analysis_metadata: {
        total_contacts_analyzed: number;
        total_log_entries: number;
        analysis_period: {
            start?: string;
            end?: string;
            duration_days?: number;
        };
        generated_at: string;
        performance_metrics: {
            processing_time_ms: number;
            memory_usage_mb?: number;
        };
    };
    contact_profiles: Record<string, ContactBehaviorProfile>;
    aggregate_insights: AggregateInsights;
    anomalies: Array<{
        type: string;
        contact_id?: number;
        description: string;
        severity: 'low' | 'medium' | 'high' | 'positive';
        metrics?: Record<string, any>;
        contact_ids?: number[];
    }>;
    recommendations: Array<{
        type: string;
        priority: 'low' | 'medium' | 'high';
        description: string;
        action: string;
        expected_impact: string;
        affected_contacts?: number;
        estimated_roi?: string;
    }>;
    predictive_insights: {
        churn_predictions: Array<{
            contact_id: number;
            churn_probability: number;
            days_to_churn?: number;
            intervention_recommendations: string[];
        }>;
        engagement_forecasts: Record<string, number>;
        optimal_campaigns: Array<{
            segment: string;
            recommended_timing: string;
            content_type: string;
            expected_performance: Record<string, number>;
        }>;
    };
}
export declare class BehavioralPatternRecognizer {
    private minCampaignsForAnalysis;
    private debugMode;
    constructor(options?: {
        minCampaignsForAnalysis?: number;
        debugMode?: boolean;
    });
    /**
     * Main analysis function that processes campaign logs and returns behavioral insights
     */
    analyzeCampaignLogs(logsData: any[]): Promise<BehavioralAnalysisResult>;
    private groupLogsByContact;
    private analyzeContactBehavior;
    private calculateEngagementMetrics;
    private classifyEngagementLevel;
    private identifyBehavioralPatterns;
    private calculateEngagementTrend;
    private calculateEngagementConsistency;
    private findPeakEngagementDays;
    private determineLifecycleStage;
    private predictFutureActions;
    private findOptimalSendTime;
    private analyzeTimePatterns;
    private analyzeContentPreferences;
    private calculateRiskScores;
    private generatePersonalizationOpportunities;
    private generateSegmentRecommendations;
    private generateAggregateInsights;
    private detectAnomalies;
    private generateRecommendations;
    private generatePredictiveInsights;
    private getAnalysisPeriod;
    private getMemoryUsage;
}
export declare function analyzeBehavioralPatterns(logsData: any[], options?: {
    minCampaignsForAnalysis?: number;
    debugMode?: boolean;
}): Promise<BehavioralAnalysisResult>;
//# sourceMappingURL=behavioral-pattern-recognition.d.ts.map