// Logs API operations

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

export class LogsApi extends BaseApiClient {
  
  /**
   * Get campaign logs with filtering and pagination
   */
  async getCampaignLogs(campaignId: string, params?: GetCampaignLogsParams): Promise<CampaignLogResponse> {
    const apiParams: any = {};
    const filters: string[] = [];
    
    // Handle pagination
    if (params?.page) apiParams.page = params.page;
    if (params?.per_page) apiParams.per_page = params.per_page;
    if (params?.with_count !== undefined) apiParams.with_count = params.with_count;
    
    // Handle cursor pagination
    if (params?.cursor) apiParams.cursor = params.cursor;
    
    // Handle sorting
    if (params?.sort) {
      apiParams.sort = params.sort;
    }
    
    // Handle time range filtering
    if (params?.start_time) apiParams.start_time = params.start_time;
    if (params?.end_time) apiParams.end_time = params.end_time;
    
    // Handle filtering with correct API syntax (term==value;term2==value2)
    if (params?.type) {
      filters.push(`type==${params.type}`);
    }
    
    // If custom filter is provided, use it (advanced users)
    if (params?.filter) {
      if (filters.length > 0) {
        filters.push(params.filter);
      } else {
        apiParams.filter = params.filter;
      }
    }
    
    if (filters.length > 0 && !params?.filter) {
      apiParams.filter = filters.join(';');
    }
    
    // Add account_id support for proper scoping
    if (params?.account_id) {
      apiParams.account_id = params.account_id;
    } else {
      // Try to get current account ID for better results
      const accountId = await this.getCurrentAccountId();
      if (accountId) {
        apiParams.account_id = accountId;
      }
    }
    
    // Validate per_page limits
    if (apiParams.per_page && apiParams.per_page > 100) {
      throw new Error('per_page cannot exceed 100 (API limit)');
    }
    
    const query = Object.keys(apiParams).length > 0 ? `?${new URLSearchParams(apiParams)}` : '';
    
    if (this.debugMode) {
      console.log(`[Logs API] Getting campaign logs for campaign ${campaignId}`);
      console.log(`[Logs API] Query parameters:`, apiParams);
      console.log(`[Logs API] Final URL: GET /logs/campaigns/${campaignId}${query}`);
    }
    
    return this.makeRequest(`/logs/campaigns/${campaignId}${query}`);
  }
  
  /**
   * Get campaign logs with intelligent categorization and analysis
   */
  async getCampaignLogsWithAnalysis(campaignId: string, params?: GetCampaignLogsParams): Promise<{
    logs: CampaignLogResponse;
    analysis: {
      summary: {
        total_events: number;
        event_types: Record<string, number>;
        time_range: { start?: number; end?: number };
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
  }> {
    // Get the logs
    const logs = await this.getCampaignLogs(campaignId, params);
    
    // Analyze the logs
    const analysis = this.analyzeCampaignLogs(logs.data);
    
    return { logs, analysis };
  }
  
  /**
   * Analyze campaign logs to provide insights with advanced event sequence analysis
   */
  private analyzeCampaignLogs(logData: any[]): {
    summary: {
      total_events: number;
      event_types: Record<string, number>;
      time_range: { start?: number; end?: number };
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
        complete_journey: number; // sent → delivered → opened → clicked
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
  } {
    const summary = {
      total_events: logData.length,
      event_types: {} as Record<string, number>,
      time_range: {} as { start?: number; end?: number },
      top_events: [] as string[]
    };
    
    const insights: string[] = [];
    const recommendations: string[] = [];
    
    if (logData.length === 0) {
      insights.push("No log events found for this campaign");
      recommendations.push("Check if the campaign has been sent or if there are permission issues");
      return { summary, insights, recommendations };
    }
    
    // Count event types and track time range
    let minTime = Infinity;
    let maxTime = -Infinity;
    
    logData.forEach(log => {
      const eventType = log.type || 'unknown';
      summary.event_types[eventType] = (summary.event_types[eventType] || 0) + 1;
      
      // Track time range
      if (log.time) {
        minTime = Math.min(minTime, log.time);
        maxTime = Math.max(maxTime, log.time);
      }
    });
    
    if (minTime !== Infinity) {
      summary.time_range.start = minTime;
    }
    if (maxTime !== -Infinity) {
      summary.time_range.end = maxTime;
    }
    
    // Get top events
    summary.top_events = Object.entries(summary.event_types)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type);
    
    // Advanced sequence analysis
    const sequence_analysis = this.performSequenceAnalysis(logData);
    
    // Generate insights based on sequence analysis
    const sequenceInsights = this.generateSequenceInsights(sequence_analysis);
    insights.push(...sequenceInsights);
    
    // Generate recommendations based on sequence analysis
    const sequenceRecommendations = this.generateSequenceRecommendations(sequence_analysis);
    recommendations.push(...sequenceRecommendations);
    
    // Original basic insights
    const bounces = summary.event_types['bounce'] || 0;
    const opens = summary.event_types['open'] || 0;
    const clicks = summary.event_types['click'] || 0;
    const delivered = summary.event_types['delivered'] || summary.event_types['sent'] || 0;
    
    if (delivered > 0) {
      const bounceRate = (bounces / delivered) * 100;
      const openRate = (opens / delivered) * 100;
      const clickRate = (clicks / delivered) * 100;
      
      insights.push(`Delivery: ${delivered} emails delivered`);
      
      if (bounceRate > 0) {
        insights.push(`Bounce rate: ${bounceRate.toFixed(1)}% (${bounces} bounces)`);
        if (bounceRate > 5) {
          recommendations.push("High bounce rate detected - consider cleaning your email list");
        }
      }
      
      if (openRate > 0) {
        insights.push(`Open rate: ${openRate.toFixed(1)}% (${opens} opens)`);
        if (openRate < 15) {
          recommendations.push("Low open rate - consider improving subject lines");
        }
      }
      
      if (clickRate > 0) {
        insights.push(`Click rate: ${clickRate.toFixed(1)}% (${clicks} clicks)`);
        if (clickRate < 2) {
          recommendations.push("Low click rate - consider improving email content and CTAs");
        }
      }
    }
    
    // Time-based insights
    if (summary.time_range.start && summary.time_range.end) {
      const duration = summary.time_range.end - summary.time_range.start;
      const hours = duration / 3600;
      if (hours > 0) {
        insights.push(`Campaign activity span: ${hours.toFixed(1)} hours`);
      }
    }
    
    return { summary, insights, recommendations, sequence_analysis };
  }
  
  /**
   * Perform advanced event sequence analysis
   */
  private performSequenceAnalysis(logData: any[]) {
    // Group events by email/contact for sequence tracking
    const emailSequences = new Map<string, any[]>();
    
    logData.forEach(log => {
      const emailKey = log.email || log.contact_id || 'unknown';
      if (!emailSequences.has(emailKey)) {
        emailSequences.set(emailKey, []);
      }
      emailSequences.get(emailKey)!.push(log);
    });
    
    // Sort sequences by time for each email
    emailSequences.forEach(sequence => {
      sequence.sort((a, b) => (a.time || 0) - (b.time || 0));
    });
    
    // Calculate funnel metrics
    const funnel_metrics = {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0
    };
    
    // Track unique emails at each stage
    const uniqueEmails = {
      sent: new Set<string>(),
      delivered: new Set<string>(),
      opened: new Set<string>(),
      clicked: new Set<string>(),
      bounced: new Set<string>(),
      unsubscribed: new Set<string>()
    };
    
    // Timing analysis data
    const openTimes: number[] = [];
    const clickTimes: number[] = [];
    const hourlyEngagement = new Array(24).fill(0);
    
    // User journey tracking
    let complete_journey = 0;
    let opened_not_clicked = 0;
    let delivered_not_opened = 0;
    let bounced_immediately = 0;
    
    // Process each email sequence
    emailSequences.forEach((sequence, emailKey) => {
      const sortedEvents = sequence.sort((a, b) => (a.time || 0) - (b.time || 0));
      
      // Track funnel progression for this email
      let sent = false, delivered = false, opened = false, clicked = false, bounced = false, unsubscribed = false;
      let deliveredTime: number | undefined;
      let openedTime: number | undefined;
      
      sortedEvents.forEach(log => {
        const eventType = log.type;
        
        switch (eventType) {
          case 'sent':
          case 'submitted':
          case 'queued':
            if (!sent) {
              sent = true;
              uniqueEmails.sent.add(emailKey);
            }
            break;
          case 'delivered':
            if (!delivered) {
              delivered = true;
              deliveredTime = log.time;
              uniqueEmails.delivered.add(emailKey);
            }
            break;
          case 'open':
            if (!opened) {
              opened = true;
              openedTime = log.time;
              uniqueEmails.opened.add(emailKey);
              
              // Track time to open
              if (deliveredTime && log.time) {
                openTimes.push(log.time - deliveredTime);
              }
              
              // Track hourly engagement
              if (log.time) {
                const hour = new Date(log.time * 1000).getHours();
                hourlyEngagement[hour]++;
              }
            }
            break;
          case 'click':
            if (!clicked) {
              clicked = true;
              uniqueEmails.clicked.add(emailKey);
              
              // Track time to click
              if (openedTime && log.time) {
                clickTimes.push(log.time - openedTime);
              } else if (deliveredTime && log.time) {
                clickTimes.push(log.time - deliveredTime);
              }
              
              // Track hourly engagement
              if (log.time) {
                const hour = new Date(log.time * 1000).getHours();
                hourlyEngagement[hour]++;
              }
            }
            break;
          case 'bounce':
            if (!bounced) {
              bounced = true;
              uniqueEmails.bounced.add(emailKey);
            }
            break;
          case 'unsubscribe':
          case 'global_unsubscribe':
            if (!unsubscribed) {
              unsubscribed = true;
              uniqueEmails.unsubscribed.add(emailKey);
            }
            break;
        }
      });
      
      // Analyze user journey for this email
      if (sent && delivered && opened && clicked) {
        complete_journey++;
      } else if (sent && delivered && opened && !clicked) {
        opened_not_clicked++;
      } else if (sent && delivered && !opened) {
        delivered_not_opened++;
      } else if (sent && bounced) {
        bounced_immediately++;
      }
    });
    
    // Set funnel metrics from unique counts
    funnel_metrics.sent = uniqueEmails.sent.size;
    funnel_metrics.delivered = uniqueEmails.delivered.size;
    funnel_metrics.opened = uniqueEmails.opened.size;
    funnel_metrics.clicked = uniqueEmails.clicked.size;
    funnel_metrics.bounced = uniqueEmails.bounced.size;
    funnel_metrics.unsubscribed = uniqueEmails.unsubscribed.size;
    
    // Calculate conversion rates
    const conversion_rates = {
      delivery_rate: funnel_metrics.sent > 0 ? (funnel_metrics.delivered / funnel_metrics.sent) * 100 : 0,
      open_rate: funnel_metrics.delivered > 0 ? (funnel_metrics.opened / funnel_metrics.delivered) * 100 : 0,
      click_through_rate: funnel_metrics.delivered > 0 ? (funnel_metrics.clicked / funnel_metrics.delivered) * 100 : 0,
      click_to_open_rate: funnel_metrics.opened > 0 ? (funnel_metrics.clicked / funnel_metrics.opened) * 100 : 0,
      bounce_rate: funnel_metrics.sent > 0 ? (funnel_metrics.bounced / funnel_metrics.sent) * 100 : 0,
      unsubscribe_rate: funnel_metrics.delivered > 0 ? (funnel_metrics.unsubscribed / funnel_metrics.delivered) * 100 : 0
    };
    
    // Calculate timing analysis
    const avg_time_to_open = openTimes.length > 0 ? openTimes.reduce((a, b) => a + b, 0) / openTimes.length : undefined;
    const avg_time_to_click = clickTimes.length > 0 ? clickTimes.reduce((a, b) => a + b, 0) / clickTimes.length : undefined;
    
    // Find peak engagement hour
    const maxEngagement = Math.max(...hourlyEngagement);
    const peak_engagement_hour = maxEngagement > 0 ? hourlyEngagement.indexOf(maxEngagement) : undefined;
    
    // Determine engagement pattern
    let engagement_pattern: 'immediate' | 'delayed' | 'mixed' | 'unknown' = 'unknown';
    if (openTimes.length > 0) {
      const immediateOpens = openTimes.filter(time => time < 3600).length; // Within 1 hour
      const immediateRatio = immediateOpens / openTimes.length;
      
      if (immediateRatio >= 0.7) {
        engagement_pattern = 'immediate';
      } else if (immediateRatio <= 0.3) {
        engagement_pattern = 'delayed';
      } else {
        engagement_pattern = 'mixed';
      }
    }
    
    // Calculate drop-off analysis
    const delivery_drop_off = funnel_metrics.sent > 0 ? ((funnel_metrics.sent - funnel_metrics.delivered) / funnel_metrics.sent) * 100 : 0;
    const open_drop_off = funnel_metrics.delivered > 0 ? ((funnel_metrics.delivered - funnel_metrics.opened) / funnel_metrics.delivered) * 100 : 0;
    const click_drop_off = funnel_metrics.opened > 0 ? ((funnel_metrics.opened - funnel_metrics.clicked) / funnel_metrics.opened) * 100 : 0;
    
    // Identify primary drop-off stage
    let primary_drop_off_stage = 'delivery';
    if (open_drop_off > delivery_drop_off && open_drop_off > click_drop_off) {
      primary_drop_off_stage = 'opening';
    } else if (click_drop_off > delivery_drop_off && click_drop_off > open_drop_off) {
      primary_drop_off_stage = 'clicking';
    }
    
    const timing_analysis: {
      avg_time_to_open?: number;
      avg_time_to_click?: number;
      peak_engagement_hour?: number;
      engagement_pattern: 'immediate' | 'delayed' | 'mixed' | 'unknown';
    } = {
      engagement_pattern
    };
    
    if (avg_time_to_open !== undefined) {
      timing_analysis.avg_time_to_open = avg_time_to_open;
    }
    if (avg_time_to_click !== undefined) {
      timing_analysis.avg_time_to_click = avg_time_to_click;
    }
    if (peak_engagement_hour !== undefined) {
      timing_analysis.peak_engagement_hour = peak_engagement_hour;
    }
    
    return {
      funnel_metrics,
      conversion_rates,
      timing_analysis,
      user_journeys: {
        complete_journey,
        opened_not_clicked,
        delivered_not_opened,
        bounced_immediately
      },
      drop_off_analysis: {
        delivery_drop_off,
        open_drop_off,
        click_drop_off,
        primary_drop_off_stage
      }
    };
  }
  
  /**
   * Generate insights based on sequence analysis
   */
  private generateSequenceInsights(analysis: any): string[] {
    const insights: string[] = [];
    
    // Funnel insights
    if (analysis.funnel_metrics.sent > 0) {
      insights.push(`Email funnel: ${analysis.funnel_metrics.sent} sent → ${analysis.funnel_metrics.delivered} delivered → ${analysis.funnel_metrics.opened} opened → ${analysis.funnel_metrics.clicked} clicked`);
    }
    
    // Timing insights
    if (analysis.timing_analysis.avg_time_to_open) {
      const avgOpenHours = (analysis.timing_analysis.avg_time_to_open / 3600).toFixed(1);
      insights.push(`Average time to open: ${avgOpenHours} hours`);
    }
    
    if (analysis.timing_analysis.avg_time_to_click) {
      const avgClickMinutes = (analysis.timing_analysis.avg_time_to_click / 60).toFixed(1);
      insights.push(`Average time from open to click: ${avgClickMinutes} minutes`);
    }
    
    // Engagement pattern insights
    switch (analysis.timing_analysis.engagement_pattern) {
      case 'immediate':
        insights.push('Immediate engagement pattern - recipients open emails quickly');
        break;
      case 'delayed':
        insights.push('Delayed engagement pattern - recipients take time to open emails');
        break;
      case 'mixed':
        insights.push('Mixed engagement pattern - varied opening behaviors');
        break;
    }
    
    // Peak engagement time
    if (analysis.timing_analysis.peak_engagement_hour !== undefined) {
      insights.push(`Peak engagement time: ${analysis.timing_analysis.peak_engagement_hour}:00 hours`);
    }
    
    // User journey insights
    const total_journeys = analysis.user_journeys.complete_journey + 
                          analysis.user_journeys.opened_not_clicked + 
                          analysis.user_journeys.delivered_not_opened + 
                          analysis.user_journeys.bounced_immediately;
    
    if (total_journeys > 0) {
      const complete_rate = (analysis.user_journeys.complete_journey / total_journeys) * 100;
      insights.push(`Complete journey rate: ${complete_rate.toFixed(1)}% (sent → delivered → opened → clicked)`);
    }
    
    // Drop-off insights
    insights.push(`Primary drop-off stage: ${analysis.drop_off_analysis.primary_drop_off_stage} (${analysis.drop_off_analysis[analysis.drop_off_analysis.primary_drop_off_stage + '_drop_off'].toFixed(1)}% loss)`);
    
    return insights;
  }
  
  /**
   * Generate recommendations based on sequence analysis
   */
  private generateSequenceRecommendations(analysis: any): string[] {
    const recommendations: string[] = [];
    
    // Delivery recommendations
    if (analysis.conversion_rates.delivery_rate < 95) {
      recommendations.push('Improve deliverability - delivery rate is below optimal (95%+)');
    }
    
    // Drop-off specific recommendations
    switch (analysis.drop_off_analysis.primary_drop_off_stage) {
      case 'delivery':
        recommendations.push('Focus on deliverability: authenticate your domain, clean your list, monitor sender reputation');
        break;
      case 'opening':
        recommendations.push('Focus on open rates: optimize subject lines, sender name, and send timing');
        break;
      case 'clicking':
        recommendations.push('Focus on content engagement: improve CTAs, email design, and value proposition');
        break;
    }
    
    // Timing-based recommendations
    if (analysis.timing_analysis.engagement_pattern === 'delayed') {
      recommendations.push('Consider follow-up emails - many recipients engage with delay');
    } else if (analysis.timing_analysis.engagement_pattern === 'immediate') {
      recommendations.push('Optimize for immediate impact - recipients engage quickly with your content');
    }
    
    // Peak time recommendations
    if (analysis.timing_analysis.peak_engagement_hour !== undefined) {
      const peakHour = analysis.timing_analysis.peak_engagement_hour;
      recommendations.push(`Consider sending future campaigns around ${peakHour}:00 for maximum engagement`);
    }
    
    // User journey recommendations
    if (analysis.user_journeys.opened_not_clicked > analysis.user_journeys.complete_journey) {
      recommendations.push('High open-to-click drop-off - strengthen your call-to-action and content relevance');
    }
    
    if (analysis.user_journeys.delivered_not_opened > analysis.user_journeys.opened_not_clicked) {
      recommendations.push('High delivery-to-open drop-off - focus on subject line optimization and sender reputation');
    }
    
    // Click-to-open rate recommendations
    if (analysis.conversion_rates.click_to_open_rate < 15) {
      recommendations.push('Low click-to-open rate - improve email content relevance and CTA effectiveness');
    } else if (analysis.conversion_rates.click_to_open_rate > 25) {
      recommendations.push('Excellent click-to-open rate - content is highly relevant to openers');
    }
    
    return recommendations;
  }
  
  /**
   * Debug logs access and test different access patterns
   */
  async debugLogsAccess(campaignId?: string) {
    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[]
    };

    // Test 1: Try to get campaign logs if ID provided
    if (campaignId) {
      try {
        const logs = await this.getCampaignLogs(campaignId, { per_page: 5 });
        results.tests.push({
          test: 'campaign-logs',
          success: true,
          campaignId,
          logCount: Array.isArray(logs.data) ? logs.data.length : 0,
          hasLogs: Array.isArray(logs.data) && logs.data.length > 0
        });
      } catch (error: any) {
        results.tests.push({
          test: 'campaign-logs',
          success: false,
          campaignId,
          error: error.message
        });
      }
    }

    // Test 2: Try with account scoping
    try {
      const accountId = await this.getCurrentAccountId();
      if (accountId && campaignId) {
        const logs = await this.getCampaignLogs(campaignId, { 
          account_id: accountId, 
          per_page: 5 
        });
        results.tests.push({
          test: 'account-scoped-logs',
          success: true,
          accountId,
          campaignId,
          logCount: Array.isArray(logs.data) ? logs.data.length : 0
        });
      }
    } catch (error: any) {
      results.tests.push({
        test: 'account-scoped-logs',
        success: false,
        error: error.message
      });
    }

    return results;
  }

  // Additional methods for email logs
  async getEmailLogs(logType: string, params?: any): Promise<any> {
    // Validate log type
    const validTypes = ['all', 'submitted', 'queued', 'delivered', 'rejected', 'error', 'open', 'click', 'bounce', 'spam', 'unsubscribe', 'global_unsubscribe'];
    if (!validTypes.includes(logType)) {
      throw new Error('Invalid log type');
    }

    const queryParams = new URLSearchParams();
    queryParams.append('log_type', logType);
    queryParams.append('page', params?.page || '1');
    queryParams.append('per_page', params?.per_page || '50');
    queryParams.append('with_count', params?.with_count !== undefined ? params.with_count.toString() : 'false');
    
    // Add account ID
    const accountId = await this.getCurrentAccountId();
    if (accountId) queryParams.append('account_id', accountId.toString());
    
    // Add other parameters
    if (params?.email_id) queryParams.append('email_id', params.email_id);
    if (params?.start_time) queryParams.append('start_time', params.start_time.toString());
    if (params?.end_time) queryParams.append('end_time', params.end_time.toString());
    if (params?.tags) queryParams.append('tags', params.tags);
    if (params?.providers) queryParams.append('providers', params.providers);
    if (params?.iso_time) queryParams.append('iso_time', params.iso_time.toString());
    
    return this.makeRequest(`/logs/emails?${queryParams.toString()}`);
  }

  async getEmailLogsWithAnalysis(logType: string, params?: any): Promise<any> {
    const logs = await this.getEmailLogs(logType, params);
    
    const analysis = {
      total_logs: logs.data?.length || 0,
      by_type: {} as Record<string, number>,
      performance: {
        delivery_rate: 0,
        open_rate: 0,
        click_rate: 0,
        bounce_rate: 0
      },
      timeline: {}
    };
    
    // Count by type
    if (logs.data) {
      let delivered = 0, opens = 0, clicks = 0, bounces = 0;
      
      logs.data.forEach((log: any) => {
        const type = log.type || 'unknown';
        analysis.by_type[type] = (analysis.by_type[type] || 0) + 1;
        
        if (type === 'delivered') delivered++;
        if (type === 'open') opens++;
        if (type === 'click') clicks++;
        if (type === 'bounce') bounces++;
      });
      
      const total = delivered + bounces;
      if (total > 0) {
        analysis.performance.delivery_rate = delivered / total;
        analysis.performance.bounce_rate = bounces / total;
      }
      if (delivered > 0) {
        analysis.performance.open_rate = opens / delivered;
        analysis.performance.click_rate = clicks / delivered;
      }
    }
    
    return { logs, analysis };
  }

  async getCampaignEngagementLogs(campaignId: string): Promise<any[]> {
    const response = await this.getCampaignLogs(campaignId, {
      filter: 'type==open;type==click;type==unsubscribe'
    });
    return response.data || [];
  }

  async getCampaignBounceAndSpamLogs(campaignId: string): Promise<any[]> {
    const response = await this.getCampaignLogs(campaignId, {
      filter: 'type==bounce;type==spam'
    });
    return response.data || [];
  }

  async getEmailJourney(emailId: string): Promise<any> {
    const logs = await this.getEmailLogs('all', { email_id: emailId });
    const events = logs.data || [];
    
    // Sort events by timestamp
    events.sort((a: any, b: any) => (a.timestamp || 0) - (b.timestamp || 0));
    
    // Calculate journey duration
    let duration = 0;
    if (events.length > 1) {
      duration = (events[events.length - 1].timestamp || 0) - (events[0].timestamp || 0);
    }
    
    // Determine final status
    let finalStatus = 'pending';
    if (events.some((e: any) => e.type === 'click')) {
      finalStatus = 'engaged';
    } else if (events.some((e: any) => e.type === 'open')) {
      finalStatus = 'opened';
    } else if (events.some((e: any) => e.type === 'delivered')) {
      finalStatus = 'delivered';
    } else if (events.some((e: any) => e.type === 'bounce')) {
      finalStatus = 'bounced';
    }
    
    return {
      email_id: emailId,
      events,
      journey_duration: duration,
      final_status: finalStatus
    };
  }

  async aggregateCampaignLogsByType(campaignId: string): Promise<any> {
    const logs = await this.getCampaignLogs(campaignId, { per_page: 100 });
    const aggregated: Record<string, any> = {};
    
    if (logs.data) {
      logs.data.forEach((log: any) => {
        const type = log.type || 'unknown';
        if (!aggregated[type]) {
          aggregated[type] = {
            total: 0,
            unique: 0,
            contacts: []
          };
        }
        
        aggregated[type].total++;
        if (log.contact_id && !aggregated[type].contacts.includes(log.contact_id)) {
          aggregated[type].contacts.push(log.contact_id);
          aggregated[type].unique = aggregated[type].contacts.length;
        }
      });
    }
    
    return aggregated;
  }

  async getClickPatterns(campaignId: string): Promise<any> {
    const logs = await this.getCampaignLogs(campaignId, {
      filter: 'type==click',
      per_page: 100
    });
    
    const clickData: Record<string, any> = {};
    const uniqueClickers = new Set<number>();
    let totalClicks = 0;
    
    if (logs.data) {
      logs.data.forEach((log: any) => {
        if (log.type === 'click' && log.clickthru_url) {
          totalClicks++;
          if (log.contact_id) uniqueClickers.add(log.contact_id);
          
          const url = log.clickthru_url;
          if (!clickData[url]) {
            clickData[url] = {
              url,
              clicks: 0,
              unique_clicks: 0,
              clickers: new Set(),
              first_click: log.timestamp,
              last_click: log.timestamp
            };
          }
          
          clickData[url].clicks++;
          if (log.contact_id) {
            clickData[url].clickers.add(log.contact_id);
            clickData[url].unique_clicks = clickData[url].clickers.size;
          }
          
          if (log.timestamp < clickData[url].first_click) {
            clickData[url].first_click = log.timestamp;
          }
          if (log.timestamp > clickData[url].last_click) {
            clickData[url].last_click = log.timestamp;
          }
        }
      });
    }
    
    // Convert to array and clean up
    const links = Object.values(clickData).map((link: any) => ({
      url: link.url,
      clicks: link.clicks,
      unique_clicks: link.unique_clicks,
      first_click: link.first_click,
      last_click: link.last_click
    }));
    
    // Sort by clicks descending
    links.sort((a, b) => b.clicks - a.clicks);
    
    return {
      total_clicks: totalClicks,
      unique_clickers: uniqueClickers.size,
      links
    };
  }

  async *iterateCampaignLogs(campaignId: string, params?: any): AsyncGenerator<any[], void, unknown> {
    let cursor: string | undefined = undefined;
    let hasMore = true;
    
    while (hasMore) {
      const response = await this.getCampaignLogs(campaignId, {
        ...params,
        cursor,
        per_page: params?.per_page || 100
      });
      
      if (response.data && response.data.length > 0) {
        yield response.data;
      }
      
      cursor = response.pagination?.cursor;
      hasMore = !!cursor;
    }
  }

  async processCampaignLogsInBatches(
    campaignId: string,
    processor: (batch: any[]) => Promise<void>,
    params?: any
  ): Promise<void> {
    for await (const batch of this.iterateCampaignLogs(campaignId, params)) {
      await processor(batch);
    }
  }
}
