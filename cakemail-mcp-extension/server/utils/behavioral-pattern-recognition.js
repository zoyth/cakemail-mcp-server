/**
 * Behavioral Pattern Recognition Module for Cakemail Campaign Logs
 * Analyzes subscriber engagement patterns and provides actionable insights
 */
import { performance } from 'perf_hooks';
export var EngagementLevel;
(function (EngagementLevel) {
    EngagementLevel["HIGHLY_ENGAGED"] = "highly_engaged";
    EngagementLevel["MODERATELY_ENGAGED"] = "moderately_engaged";
    EngagementLevel["LOW_ENGAGEMENT"] = "low_engagement";
    EngagementLevel["DECLINING"] = "declining";
    EngagementLevel["INACTIVE"] = "inactive";
    EngagementLevel["AT_RISK"] = "at_risk";
})(EngagementLevel || (EngagementLevel = {}));
export var BehaviorPattern;
(function (BehaviorPattern) {
    BehaviorPattern["CONSISTENT_OPENER"] = "consistent_opener";
    BehaviorPattern["SELECTIVE_CLICKER"] = "selective_clicker";
    BehaviorPattern["MOBILE_PREFERRER"] = "mobile_preferrer";
    BehaviorPattern["WEEKEND_ENGAGER"] = "weekend_engager";
    BehaviorPattern["EARLY_BIRD"] = "early_bird";
    BehaviorPattern["NIGHT_OWL"] = "night_owl";
    BehaviorPattern["BINGE_READER"] = "binge_reader";
    BehaviorPattern["QUICK_SCANNER"] = "quick_scanner";
    BehaviorPattern["UNSUBSCRIBE_RISK"] = "unsubscribe_risk";
    BehaviorPattern["LOYAL_SUBSCRIBER"] = "loyal_subscriber";
    BehaviorPattern["CONTENT_SKIMMER"] = "content_skimmer";
})(BehaviorPattern || (BehaviorPattern = {}));
export class BehavioralPatternRecognizer {
    minCampaignsForAnalysis;
    debugMode;
    constructor(options = {}) {
        this.minCampaignsForAnalysis = options.minCampaignsForAnalysis || 3;
        this.debugMode = options.debugMode || false;
    }
    /**
     * Main analysis function that processes campaign logs and returns behavioral insights
     */
    async analyzeCampaignLogs(logsData) {
        const startTime = performance.now();
        if (this.debugMode) {
            console.log(`[Behavioral Analysis] Starting analysis of ${logsData.length} log entries`);
        }
        // Group logs by contact
        const contactLogs = this.groupLogsByContact(logsData);
        // Analyze each contact's behavior
        const contactProfiles = {};
        for (const [contactId, logs] of Object.entries(contactLogs)) {
            if (logs.length >= this.minCampaignsForAnalysis) {
                const profile = await this.analyzeContactBehavior(parseInt(contactId), logs);
                contactProfiles[contactId] = profile;
            }
        }
        // Generate aggregate insights
        const aggregateInsights = this.generateAggregateInsights(contactProfiles);
        // Identify anomalies and trends
        const anomalies = this.detectAnomalies(contactProfiles);
        // Generate recommendations
        const recommendations = this.generateRecommendations(contactProfiles, aggregateInsights);
        // Generate predictive insights
        const predictiveInsights = this.generatePredictiveInsights(contactProfiles);
        const endTime = performance.now();
        const processingTime = endTime - startTime;
        return {
            analysis_metadata: {
                total_contacts_analyzed: Object.keys(contactProfiles).length,
                total_log_entries: logsData.length,
                analysis_period: this.getAnalysisPeriod(logsData),
                generated_at: new Date().toISOString(),
                performance_metrics: (() => {
                    const memUsage = this.getMemoryUsage();
                    const metrics = {
                        processing_time_ms: Math.round(processingTime)
                    };
                    if (memUsage !== undefined) {
                        metrics.memory_usage_mb = memUsage;
                    }
                    return metrics;
                })()
            },
            contact_profiles: contactProfiles,
            aggregate_insights: aggregateInsights,
            anomalies: anomalies,
            recommendations: recommendations,
            predictive_insights: predictiveInsights
        };
    }
    groupLogsByContact(logsData) {
        const contactLogs = {};
        for (const log of logsData) {
            const contactId = log.contact_id;
            if (contactId) {
                if (!contactLogs[contactId]) {
                    contactLogs[contactId] = [];
                }
                contactLogs[contactId].push(log);
            }
        }
        return contactLogs;
    }
    async analyzeContactBehavior(contactId, logs) {
        // Calculate engagement metrics
        const engagementMetrics = this.calculateEngagementMetrics(logs);
        // Determine engagement level
        const engagementLevel = this.classifyEngagementLevel(engagementMetrics);
        // Identify behavioral patterns
        const behavioralPatterns = this.identifyBehavioralPatterns(logs, engagementMetrics);
        // Determine lifecycle stage
        const lifecycleStage = this.determineLifecycleStage(logs, engagementMetrics);
        // Predict future actions
        const predictedActions = this.predictFutureActions(logs, engagementMetrics);
        // Find optimal send time
        const optimalSendTime = this.findOptimalSendTime(logs);
        // Analyze content preferences
        const contentPreferences = this.analyzeContentPreferences(logs);
        // Calculate risk scores
        const riskScores = this.calculateRiskScores(logs, engagementMetrics);
        // Generate personalization opportunities
        const personalizationOpportunities = this.generatePersonalizationOpportunities(logs, behavioralPatterns);
        // Generate segment recommendations
        const segmentRecommendations = this.generateSegmentRecommendations(engagementLevel, behavioralPatterns);
        // Get email from logs
        const email = logs[0]?.email || `contact_${contactId}@unknown.com`;
        return {
            contact_id: contactId,
            email: email,
            engagement_level: engagementLevel,
            engagement_metrics: engagementMetrics,
            behavioral_patterns: behavioralPatterns,
            lifecycle_stage: lifecycleStage,
            predicted_actions: predictedActions,
            ...(optimalSendTime !== undefined && { optimal_send_time: optimalSendTime }),
            content_preferences: contentPreferences,
            risk_scores: riskScores,
            personalization_opportunities: personalizationOpportunities,
            segment_recommendations: segmentRecommendations
        };
    }
    calculateEngagementMetrics(logs) {
        // Count different event types
        const eventCounts = {};
        logs.forEach(log => {
            const eventType = log.type?.name || log.type || 'unknown';
            eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
        });
        const totalOpens = (eventCounts['open'] || 0) + (eventCounts['implied_open'] || 0);
        const totalClicks = eventCounts['click'] || 0;
        // Get unique campaigns
        const campaignIds = new Set(logs.map(log => log.campaign_id).filter(Boolean));
        const totalCampaignsSent = campaignIds.size;
        // Calculate rates
        const openRate = totalCampaignsSent > 0 ? totalOpens / totalCampaignsSent : 0;
        const clickRate = totalCampaignsSent > 0 ? totalClicks / totalCampaignsSent : 0;
        const clickToOpenRate = totalOpens > 0 ? totalClicks / totalOpens : 0;
        // Calculate timing metrics
        const openTimes = logs
            .filter(log => ['open', 'implied_open'].includes(log.type?.name || log.type))
            .map(log => log.timestamp)
            .filter(Boolean);
        const clickTimes = logs
            .filter(log => (log.type?.name || log.type) === 'click')
            .map(log => log.timestamp)
            .filter(Boolean);
        const avgTimeToOpen = openTimes.length > 0 ?
            openTimes.reduce((sum, time) => sum + time, 0) / openTimes.length : undefined;
        const avgTimeToClick = clickTimes.length > 0 ?
            clickTimes.reduce((sum, time) => sum + time, 0) / clickTimes.length : undefined;
        // Determine engagement trend
        const engagementTrend = this.calculateEngagementTrend(logs);
        // Last engagement
        const allEngagementTimes = logs
            .filter(log => ['open', 'click', 'implied_open'].includes(log.type?.name || log.type))
            .map(log => log.timestamp)
            .filter(Boolean);
        let lastEngagementDate;
        let daysSinceLastEngagement;
        if (allEngagementTimes.length > 0) {
            const lastEngagementTimestamp = Math.max(...allEngagementTimes);
            lastEngagementDate = new Date(lastEngagementTimestamp * 1000).toISOString();
            daysSinceLastEngagement = Math.floor((Date.now() - lastEngagementTimestamp * 1000) / (1000 * 60 * 60 * 24));
        }
        // Calculate engagement consistency
        const engagementConsistency = this.calculateEngagementConsistency(logs);
        // Find peak engagement days
        const peakEngagementDays = this.findPeakEngagementDays(logs);
        return {
            total_campaigns_sent: totalCampaignsSent,
            total_opens: totalOpens,
            total_clicks: totalClicks,
            unique_opens: new Set(logs.filter(log => ['open', 'implied_open'].includes(log.type?.name || log.type)).map(log => log.id)).size,
            unique_clicks: new Set(logs.filter(log => (log.type?.name || log.type) === 'click').map(log => log.id)).size,
            open_rate: Number(openRate.toFixed(3)),
            click_rate: Number(clickRate.toFixed(3)),
            click_to_open_rate: Number(clickToOpenRate.toFixed(3)),
            ...(avgTimeToOpen !== undefined && { average_time_to_open: avgTimeToOpen }),
            ...(avgTimeToClick !== undefined && { average_time_to_click: avgTimeToClick }),
            engagement_trend: engagementTrend,
            ...(lastEngagementDate !== undefined && { last_engagement_date: lastEngagementDate }),
            ...(daysSinceLastEngagement !== undefined && { days_since_last_engagement: daysSinceLastEngagement }),
            engagement_consistency: engagementConsistency,
            peak_engagement_days: peakEngagementDays
        };
    }
    classifyEngagementLevel(metrics) {
        if (metrics.days_since_last_engagement && metrics.days_since_last_engagement > 90) {
            return EngagementLevel.INACTIVE;
        }
        if (metrics.engagement_trend === "declining" && metrics.open_rate < 0.1) {
            return EngagementLevel.AT_RISK;
        }
        if (metrics.open_rate >= 0.5 && metrics.click_rate >= 0.1) {
            return EngagementLevel.HIGHLY_ENGAGED;
        }
        else if (metrics.open_rate >= 0.25 && metrics.click_rate >= 0.05) {
            return EngagementLevel.MODERATELY_ENGAGED;
        }
        else if (metrics.engagement_trend === "declining") {
            return EngagementLevel.DECLINING;
        }
        else {
            return EngagementLevel.LOW_ENGAGEMENT;
        }
    }
    identifyBehavioralPatterns(logs, metrics) {
        const patterns = [];
        // Consistent opener pattern
        if (metrics.open_rate > 0.8) {
            patterns.push({
                pattern: BehaviorPattern.CONSISTENT_OPENER,
                confidence: Math.min(metrics.open_rate, 1.0),
                description: `Opens ${(metrics.open_rate * 100).toFixed(1)}% of campaigns consistently`,
                recommendation: "Continue current email frequency and consider premium content",
                supporting_data: { open_rate: metrics.open_rate, total_opens: metrics.total_opens },
                impact_score: 8
            });
        }
        // Selective clicker pattern
        if (metrics.click_to_open_rate > 0.3) {
            patterns.push({
                pattern: BehaviorPattern.SELECTIVE_CLICKER,
                confidence: metrics.click_to_open_rate,
                description: `High click-to-open rate of ${(metrics.click_to_open_rate * 100).toFixed(1)}%`,
                recommendation: "Focus on high-quality, targeted content with clear CTAs",
                supporting_data: { click_to_open_rate: metrics.click_to_open_rate },
                impact_score: 7
            });
        }
        // Loyal subscriber pattern
        if (metrics.engagement_consistency > 0.8 && metrics.total_campaigns_sent > 10) {
            patterns.push({
                pattern: BehaviorPattern.LOYAL_SUBSCRIBER,
                confidence: metrics.engagement_consistency,
                description: "Consistently engages across multiple campaigns",
                recommendation: "Offer exclusive content or VIP benefits to maintain loyalty",
                supporting_data: { consistency: metrics.engagement_consistency, campaigns: metrics.total_campaigns_sent },
                impact_score: 9
            });
        }
        // Mobile preference detection
        const mobileInteractions = logs.filter(log => log.user_agent?.device_type === 'mobile' ||
            log.user_agent?.is_mobile === true).length;
        if (mobileInteractions / logs.length > 0.7) {
            patterns.push({
                pattern: BehaviorPattern.MOBILE_PREFERRER,
                confidence: mobileInteractions / logs.length,
                description: "Primarily engages via mobile device",
                recommendation: "Optimize emails for mobile experience",
                supporting_data: { mobile_interaction_rate: mobileInteractions / logs.length },
                impact_score: 6
            });
        }
        // Time-based patterns
        const hourEngagement = this.analyzeTimePatterns(logs);
        if (hourEngagement && Object.keys(hourEngagement).length > 0) {
            const peakHour = Object.keys(hourEngagement).reduce((a, b) => hourEngagement[a] > hourEngagement[b] ? a : b);
            if (parseInt(peakHour) < 9) {
                patterns.push({
                    pattern: BehaviorPattern.EARLY_BIRD,
                    confidence: 0.8,
                    description: "Most active in early morning hours",
                    recommendation: "Send campaigns between 6-9 AM",
                    supporting_data: { peak_hour: peakHour, hour_distribution: hourEngagement },
                    impact_score: 5
                });
            }
            else if (parseInt(peakHour) > 20) {
                patterns.push({
                    pattern: BehaviorPattern.NIGHT_OWL,
                    confidence: 0.8,
                    description: "Most active in evening hours",
                    recommendation: "Send campaigns between 7-10 PM",
                    supporting_data: { peak_hour: peakHour, hour_distribution: hourEngagement },
                    impact_score: 5
                });
            }
        }
        // Unsubscribe risk pattern
        if (metrics.engagement_trend === "declining" &&
            metrics.days_since_last_engagement &&
            metrics.days_since_last_engagement > 30) {
            const riskScore = Math.min((metrics.days_since_last_engagement - 30) / 60, 1.0);
            patterns.push({
                pattern: BehaviorPattern.UNSUBSCRIBE_RISK,
                confidence: riskScore,
                description: `High unsubscribe risk - ${metrics.days_since_last_engagement} days since last engagement`,
                recommendation: "Send re-engagement campaign or reduce frequency",
                supporting_data: {
                    days_since_engagement: metrics.days_since_last_engagement,
                    risk_score: riskScore
                },
                impact_score: 10
            });
        }
        // Quick scanner pattern (opens but doesn't click much)
        if (metrics.open_rate > 0.5 && metrics.click_to_open_rate < 0.1) {
            patterns.push({
                pattern: BehaviorPattern.QUICK_SCANNER,
                confidence: 0.7,
                description: "Opens emails frequently but rarely clicks",
                recommendation: "Focus on compelling subject lines and preview text rather than CTAs",
                supporting_data: {
                    open_rate: metrics.open_rate,
                    click_to_open_rate: metrics.click_to_open_rate
                },
                impact_score: 4
            });
        }
        return patterns.sort((a, b) => b.impact_score - a.impact_score);
    }
    calculateEngagementTrend(logs) {
        // Sort logs by timestamp
        const sortedLogs = logs
            .filter(log => log.timestamp)
            .sort((a, b) => a.timestamp - b.timestamp);
        if (sortedLogs.length < 6) {
            return "stable"; // Not enough data
        }
        // Split into two halves and compare engagement rates
        const midPoint = Math.floor(sortedLogs.length / 2);
        const firstHalf = sortedLogs.slice(0, midPoint);
        const secondHalf = sortedLogs.slice(midPoint);
        const calculateEngagementRate = (logSubset) => {
            const engagementEvents = logSubset.filter(log => ['open', 'click', 'implied_open'].includes(log.type?.name || log.type)).length;
            return logSubset.length > 0 ? engagementEvents / logSubset.length : 0;
        };
        const firstHalfRate = calculateEngagementRate(firstHalf);
        const secondHalfRate = calculateEngagementRate(secondHalf);
        if (secondHalfRate > firstHalfRate * 1.2) {
            return "increasing";
        }
        else if (secondHalfRate < firstHalfRate * 0.8) {
            return "declining";
        }
        else {
            return "stable";
        }
    }
    calculateEngagementConsistency(logs) {
        // Group logs by campaign and calculate engagement rate per campaign
        const campaignEngagement = {};
        logs.forEach(log => {
            const campaignId = log.campaign_id || 'unknown';
            if (!campaignEngagement[campaignId]) {
                campaignEngagement[campaignId] = { total: 0, engaged: 0 };
            }
            campaignEngagement[campaignId].total++;
            if (['open', 'click', 'implied_open'].includes(log.type?.name || log.type)) {
                campaignEngagement[campaignId].engaged++;
            }
        });
        // Calculate engagement rates for each campaign
        const engagementRates = Object.values(campaignEngagement)
            .map(campaign => campaign.total > 0 ? campaign.engaged / campaign.total : 0);
        if (engagementRates.length === 0)
            return 0;
        // Calculate consistency as inverse of standard deviation
        const mean = engagementRates.reduce((sum, rate) => sum + rate, 0) / engagementRates.length;
        const variance = engagementRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / engagementRates.length;
        const stdDev = Math.sqrt(variance);
        // Convert to 0-1 scale where 1 is perfectly consistent
        return Math.max(0, 1 - stdDev);
    }
    findPeakEngagementDays(logs) {
        const dayEngagement = {};
        logs.forEach(log => {
            if (log.timestamp && ['open', 'click', 'implied_open'].includes(log.type?.name || log.type)) {
                const date = new Date(log.timestamp * 1000);
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                dayEngagement[dayOfWeek] = (dayEngagement[dayOfWeek] || 0) + 1;
            }
        });
        // Return top 2 days
        return Object.entries(dayEngagement)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([day]) => day);
    }
    determineLifecycleStage(logs, metrics) {
        const engagementLevel = this.classifyEngagementLevel(metrics);
        if (!logs.length)
            return "unknown";
        const timestamps = logs.map(log => log.timestamp).filter(Boolean);
        if (!timestamps.length)
            return "unknown";
        const daysActive = Math.floor((Date.now() - Math.min(...timestamps) * 1000) / (1000 * 60 * 60 * 24));
        if (daysActive < 30) {
            return "new_subscriber";
        }
        else if (engagementLevel === EngagementLevel.HIGHLY_ENGAGED) {
            return "engaged_subscriber";
        }
        else if ([EngagementLevel.DECLINING, EngagementLevel.AT_RISK].includes(engagementLevel)) {
            return "at_risk_subscriber";
        }
        else if (engagementLevel === EngagementLevel.INACTIVE) {
            return "inactive_subscriber";
        }
        else {
            return "regular_subscriber";
        }
    }
    predictFutureActions(_logs, metrics) {
        const engagementLevel = this.classifyEngagementLevel(metrics);
        const predictions = {};
        // Predict open probability
        predictions["will_open_next_campaign"] = Math.min(metrics.open_rate * 1.1, 1.0);
        // Predict click probability
        predictions["will_click_next_campaign"] = Math.min(metrics.click_rate * 1.1, 1.0);
        // Predict unsubscribe probability
        let unsubscribeRisk = 0.0;
        if (metrics.engagement_trend === "declining")
            unsubscribeRisk += 0.3;
        if (metrics.days_since_last_engagement && metrics.days_since_last_engagement > 60)
            unsubscribeRisk += 0.4;
        if (metrics.open_rate < 0.1)
            unsubscribeRisk += 0.2;
        predictions["will_unsubscribe"] = Math.min(unsubscribeRisk, 1.0);
        // Predict re-engagement probability
        if ([EngagementLevel.DECLINING, EngagementLevel.AT_RISK].includes(engagementLevel)) {
            predictions["will_re_engage"] = Math.max(0.3 - (metrics.days_since_last_engagement || 0) / 100, 0.1);
        }
        else {
            predictions["will_re_engage"] = 0.8;
        }
        return predictions;
    }
    findOptimalSendTime(logs) {
        const hourEngagement = this.analyzeTimePatterns(logs);
        if (!hourEngagement || Object.keys(hourEngagement).length === 0) {
            return undefined;
        }
        const bestHour = Object.keys(hourEngagement).reduce((a, b) => hourEngagement[a] > hourEngagement[b] ? a : b);
        const hour = parseInt(bestHour);
        if (hour < 12) {
            return `${hour}:00 AM`;
        }
        else if (hour === 12) {
            return "12:00 PM";
        }
        else {
            return `${hour - 12}:00 PM`;
        }
    }
    analyzeTimePatterns(logs) {
        const hourEngagement = {};
        logs.forEach(log => {
            if (log.timestamp && ['open', 'click', 'implied_open'].includes(log.type?.name || log.type)) {
                const hour = new Date(log.timestamp * 1000).getHours();
                hourEngagement[hour.toString()] = (hourEngagement[hour.toString()] || 0) + 1;
            }
        });
        return hourEngagement;
    }
    analyzeContentPreferences(logs) {
        // This would be enhanced with actual campaign content analysis
        // For now, return basic preferences based on engagement patterns
        const clickLogs = logs.filter(log => (log.type?.name || log.type) === 'click');
        const preferences = {
            promotional_content: 0.5,
            educational_content: 0.5,
            newsletter_content: 0.5,
            product_updates: 0.5
        };
        // Basic heuristics based on click-through rate
        if (clickLogs.length / logs.length > 0.1) {
            preferences["promotional_content"] = 0.8;
        }
        return preferences;
    }
    calculateRiskScores(logs, metrics) {
        const risks = {};
        // Churn risk
        let churnRisk = 0.0;
        if (metrics.engagement_trend === "declining")
            churnRisk += 0.4;
        if (metrics.days_since_last_engagement && metrics.days_since_last_engagement > 30) {
            churnRisk += Math.min((metrics.days_since_last_engagement - 30) / 60, 0.5);
        }
        if (metrics.open_rate < 0.05)
            churnRisk += 0.3;
        risks["churn_risk"] = Math.min(churnRisk, 1.0);
        // Spam complaint risk
        let spamRisk = 0.1; // baseline
        if (metrics.open_rate < 0.02 && logs.length > 10)
            spamRisk += 0.3;
        risks["spam_complaint_risk"] = Math.min(spamRisk, 1.0);
        // Low engagement risk
        risks["low_engagement_risk"] = 1.0 - metrics.open_rate;
        return risks;
    }
    generatePersonalizationOpportunities(_logs, patterns) {
        const opportunities = [];
        // Time-based personalization
        const timePatterns = patterns.filter(p => [BehaviorPattern.EARLY_BIRD, BehaviorPattern.NIGHT_OWL].includes(p.pattern));
        if (timePatterns.length > 0) {
            opportunities.push("Personalize send times based on individual engagement patterns");
        }
        // Device-based personalization
        const mobilePattern = patterns.find(p => p.pattern === BehaviorPattern.MOBILE_PREFERRER);
        if (mobilePattern) {
            opportunities.push("Create mobile-first email designs for this subscriber");
        }
        // Content-based personalization
        const selectivePattern = patterns.find(p => p.pattern === BehaviorPattern.SELECTIVE_CLICKER);
        if (selectivePattern) {
            opportunities.push("Curate highly targeted content based on past click behavior");
        }
        // Engagement-based personalization
        const consistentPattern = patterns.find(p => p.pattern === BehaviorPattern.CONSISTENT_OPENER);
        if (consistentPattern) {
            opportunities.push("Offer exclusive or early access content to reward loyalty");
        }
        return opportunities;
    }
    generateSegmentRecommendations(level, patterns) {
        const recommendations = [];
        // Engagement level based segments
        switch (level) {
            case EngagementLevel.HIGHLY_ENGAGED:
                recommendations.push("VIP Segment", "Brand Advocates", "Early Access Group");
                break;
            case EngagementLevel.MODERATELY_ENGAGED:
                recommendations.push("Regular Subscribers", "Content Nurture Segment");
                break;
            case EngagementLevel.DECLINING:
                recommendations.push("Re-engagement Campaign", "Win-back Segment");
                break;
            case EngagementLevel.AT_RISK:
                recommendations.push("Urgent Re-engagement", "Churn Prevention");
                break;
            case EngagementLevel.INACTIVE:
                recommendations.push("Sunset Campaign", "Final Attempt Segment");
                break;
        }
        // Pattern-based segments
        patterns.forEach(pattern => {
            switch (pattern.pattern) {
                case BehaviorPattern.MOBILE_PREFERRER:
                    recommendations.push("Mobile-Optimized Segment");
                    break;
                case BehaviorPattern.EARLY_BIRD:
                    recommendations.push("Morning Engagement Segment");
                    break;
                case BehaviorPattern.NIGHT_OWL:
                    recommendations.push("Evening Engagement Segment");
                    break;
                case BehaviorPattern.SELECTIVE_CLICKER:
                    recommendations.push("High-Intent Segment");
                    break;
            }
        });
        return [...new Set(recommendations)]; // Remove duplicates
    }
    generateAggregateInsights(contactProfiles) {
        if (Object.keys(contactProfiles).length === 0) {
            return {
                engagement_level_distribution: {},
                average_open_rate: 0,
                average_click_rate: 0,
                most_common_behavioral_patterns: [],
                lifecycle_stage_distribution: {},
                total_at_risk_contacts: 0,
                high_value_contacts: 0,
                optimal_send_times: {},
                content_performance: {},
                device_preferences: {}
            };
        }
        const profiles = Object.values(contactProfiles);
        // Engagement level distribution
        const engagementDistribution = {};
        profiles.forEach(profile => {
            const level = profile.engagement_level;
            engagementDistribution[level] = (engagementDistribution[level] || 0) + 1;
        });
        // Average metrics
        const avgOpenRate = profiles.reduce((sum, p) => sum + p.engagement_metrics.open_rate, 0) / profiles.length;
        const avgClickRate = profiles.reduce((sum, p) => sum + p.engagement_metrics.click_rate, 0) / profiles.length;
        // Most common patterns
        const allPatterns = [];
        profiles.forEach(profile => {
            profile.behavioral_patterns.forEach(pattern => {
                allPatterns.push(pattern.pattern);
            });
        });
        const patternCounts = {};
        allPatterns.forEach(pattern => {
            patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
        });
        const commonPatterns = Object.entries(patternCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);
        // Lifecycle stage distribution
        const lifecycleDistribution = {};
        profiles.forEach(profile => {
            const stage = profile.lifecycle_stage;
            lifecycleDistribution[stage] = (lifecycleDistribution[stage] || 0) + 1;
        });
        // Risk analysis
        const atRiskContacts = profiles.filter(p => [EngagementLevel.AT_RISK, EngagementLevel.DECLINING].includes(p.engagement_level)).length;
        const highValueContacts = profiles.filter(p => p.engagement_level === EngagementLevel.HIGHLY_ENGAGED).length;
        // Optimal send times
        const sendTimes = {};
        profiles.forEach(profile => {
            if (profile.optimal_send_time) {
                sendTimes[profile.optimal_send_time] = (sendTimes[profile.optimal_send_time] || 0) + 1;
            }
        });
        // Content performance (simplified)
        const contentPerformance = {
            promotional: profiles.reduce((sum, p) => sum + (p.content_preferences.promotional_content || 0), 0) / profiles.length,
            educational: profiles.reduce((sum, p) => sum + (p.content_preferences.educational_content || 0), 0) / profiles.length,
            newsletter: profiles.reduce((sum, p) => sum + (p.content_preferences.newsletter_content || 0), 0) / profiles.length
        };
        // Device preferences
        const mobilePreference = profiles.filter(p => p.behavioral_patterns.some(pattern => pattern.pattern === BehaviorPattern.MOBILE_PREFERRER)).length;
        const devicePreferences = {
            mobile: mobilePreference,
            desktop: profiles.length - mobilePreference
        };
        return {
            engagement_level_distribution: engagementDistribution,
            average_open_rate: Number(avgOpenRate.toFixed(3)),
            average_click_rate: Number(avgClickRate.toFixed(3)),
            most_common_behavioral_patterns: commonPatterns,
            lifecycle_stage_distribution: lifecycleDistribution,
            total_at_risk_contacts: atRiskContacts,
            high_value_contacts: highValueContacts,
            optimal_send_times: sendTimes,
            content_performance: contentPerformance,
            device_preferences: devicePreferences
        };
    }
    detectAnomalies(contactProfiles) {
        const anomalies = [];
        const profiles = Object.values(contactProfiles);
        // Find contacts with sudden engagement drops
        profiles.forEach(profile => {
            if (profile.engagement_metrics.engagement_trend === "declining" &&
                profile.engagement_metrics.open_rate < 0.1 &&
                profile.engagement_metrics.total_campaigns_sent > 5) {
                anomalies.push({
                    type: "sudden_engagement_drop",
                    contact_id: profile.contact_id,
                    description: `Contact ${profile.contact_id} shows sudden drop in engagement`,
                    severity: "high",
                    metrics: {
                        open_rate: profile.engagement_metrics.open_rate,
                        days_since_last_engagement: profile.engagement_metrics.days_since_last_engagement
                    }
                });
            }
        });
        // Find unusually high performers
        const highPerformers = profiles.filter(p => p.engagement_metrics.open_rate > 0.9 && p.engagement_metrics.click_rate > 0.2);
        if (highPerformers.length > 0) {
            anomalies.push({
                type: "exceptional_engagement",
                description: `Found ${highPerformers.length} exceptionally engaged contacts`,
                severity: "positive",
                contact_ids: highPerformers.map(p => p.contact_id)
            });
        }
        // Detect potential bot behavior (extremely high engagement but no real patterns)
        profiles.forEach(profile => {
            if (profile.engagement_metrics.open_rate > 0.95 &&
                profile.engagement_metrics.engagement_consistency < 0.3 &&
                profile.engagement_metrics.total_campaigns_sent > 10) {
                anomalies.push({
                    type: "potential_bot_behavior",
                    contact_id: profile.contact_id,
                    description: `Contact ${profile.contact_id} shows potential automated engagement patterns`,
                    severity: "medium",
                    metrics: {
                        open_rate: profile.engagement_metrics.open_rate,
                        consistency: profile.engagement_metrics.engagement_consistency
                    }
                });
            }
        });
        return anomalies;
    }
    generateRecommendations(_contactProfiles, aggregateInsights) {
        const recommendations = [];
        // Re-engagement recommendations
        if (aggregateInsights.total_at_risk_contacts > 0) {
            recommendations.push({
                type: "re_engagement",
                priority: "high",
                description: `${aggregateInsights.total_at_risk_contacts} contacts are at risk of churning`,
                action: "Create targeted re-engagement campaign for at-risk subscribers",
                expected_impact: "Reduce churn rate by 15-25%",
                affected_contacts: aggregateInsights.total_at_risk_contacts,
                estimated_roi: "High"
            });
        }
        // Send time optimization
        const topSendTime = Object.entries(aggregateInsights.optimal_send_times)
            .sort(([, a], [, b]) => b - a)[0];
        if (topSendTime) {
            recommendations.push({
                type: "send_time_optimization",
                priority: "medium",
                description: `Optimize send times based on engagement patterns`,
                action: `Consider sending more campaigns at ${topSendTime[0]} when most subscribers are active`,
                expected_impact: "Increase open rates by 8-12%",
                estimated_roi: "Medium"
            });
        }
        // Segmentation recommendations
        if (aggregateInsights.high_value_contacts > 10) {
            recommendations.push({
                type: "vip_segmentation",
                priority: "medium",
                description: `Create VIP segment for ${aggregateInsights.high_value_contacts} highly engaged contacts`,
                action: "Develop exclusive content and offers for top-performing subscribers",
                expected_impact: "Increase customer lifetime value by 20-30%",
                affected_contacts: aggregateInsights.high_value_contacts,
                estimated_roi: "High"
            });
        }
        // Mobile optimization
        const mobileUsers = aggregateInsights.device_preferences.mobile || 0;
        const totalUsers = Object.values(aggregateInsights.device_preferences).reduce((sum, count) => sum + count, 0);
        if (mobileUsers / totalUsers > 0.6) {
            recommendations.push({
                type: "mobile_optimization",
                priority: "medium",
                description: "High percentage of mobile users detected",
                action: "Prioritize mobile-first email design and shorter subject lines",
                expected_impact: "Improve mobile engagement by 15-20%",
                estimated_roi: "Medium"
            });
        }
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
    generatePredictiveInsights(contactProfiles) {
        const profiles = Object.values(contactProfiles);
        // Churn predictions
        const churnPredictions = profiles
            .filter(p => p.predicted_actions.will_unsubscribe > 0.3)
            .map(profile => ({
            contact_id: profile.contact_id,
            churn_probability: profile.predicted_actions.will_unsubscribe,
            ...(profile.engagement_metrics.days_since_last_engagement !== undefined && {
                days_to_churn: Math.round(90 - profile.engagement_metrics.days_since_last_engagement)
            }),
            intervention_recommendations: [
                "Send personalized re-engagement email",
                "Offer special discount or incentive",
                "Reduce email frequency",
                "Survey for feedback and preferences"
            ]
        }))
            .sort((a, b) => b.churn_probability - a.churn_probability);
        // Engagement forecasts
        const engagementForecasts = {
            overall_open_rate_trend: profiles.reduce((sum, p) => sum + p.predicted_actions.will_open_next_campaign, 0) / profiles.length,
            overall_click_rate_trend: profiles.reduce((sum, p) => sum + p.predicted_actions.will_click_next_campaign, 0) / profiles.length,
            re_engagement_potential: profiles.reduce((sum, p) => sum + p.predicted_actions.will_re_engage, 0) / profiles.length
        };
        // Optimal campaign recommendations
        const optimalCampaigns = [
            {
                segment: "highly_engaged",
                recommended_timing: "Tuesday 10:00 AM",
                content_type: "premium_content",
                expected_performance: { open_rate: 0.65, click_rate: 0.12 }
            },
            {
                segment: "at_risk",
                recommended_timing: "Thursday 2:00 PM",
                content_type: "re_engagement",
                expected_performance: { open_rate: 0.25, click_rate: 0.05 }
            },
            {
                segment: "mobile_users",
                recommended_timing: "Evening 7:00 PM",
                content_type: "mobile_optimized",
                expected_performance: { open_rate: 0.45, click_rate: 0.08 }
            }
        ];
        return {
            churn_predictions: churnPredictions,
            engagement_forecasts: engagementForecasts,
            optimal_campaigns: optimalCampaigns
        };
    }
    getAnalysisPeriod(logsData) {
        if (!logsData.length)
            return {};
        const timestamps = logsData.map(log => log.timestamp).filter(Boolean);
        if (!timestamps.length)
            return {};
        const minTimestamp = Math.min(...timestamps);
        const maxTimestamp = Math.max(...timestamps);
        return {
            start: new Date(minTimestamp * 1000).toISOString(),
            end: new Date(maxTimestamp * 1000).toISOString(),
            duration_days: Math.ceil((maxTimestamp - minTimestamp) / (60 * 60 * 24))
        };
    }
    getMemoryUsage() {
        try {
            if (process.memoryUsage) {
                return Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
            }
        }
        catch (error) {
            // Memory usage not available
        }
        return undefined;
    }
}
// Export convenience function for quick analysis
export async function analyzeBehavioralPatterns(logsData, options) {
    const analyzer = new BehavioralPatternRecognizer(options);
    return analyzer.analyzeCampaignLogs(logsData);
}
//# sourceMappingURL=behavioral-pattern-recognition.js.map