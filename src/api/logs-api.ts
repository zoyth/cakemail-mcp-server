// Logs API for accessing Cakemail log endpoints
// Enhanced with event taxonomy for intelligent filtering and categorization

import { BaseApiClient } from './base-client.js';
import { CAKEMAIL_EVENT_TAXONOMY, EventTaxonomyHelper } from '../types/event-taxonomy.js';

export class LogsApi extends BaseApiClient {
  
  // Filter validation configurations per endpoint
  private readonly FILTER_CONFIGS = {
    // Event taxonomy provides smart filtering capabilities - see getSmartFilterSuggestions()
    campaigns: {
      validTerms: ['additional_info', 'link_id', 'contact_id', 'email', 'uniques', 'group_by_contact', 'log_id', 'totals', 'type', 'clickthru', 'clickthru_url'],
      validOperators: ['=='],
      separator: ';'
    },
    workflows: {
      validTerms: ['additional_info', 'link_id', 'contact_id', 'email', 'log_id', 'track_id', 'type', 'group_by_contact'],
      validOperators: ['=='],
      separator: ';'
    },
    emails: {
      validTerms: ['group_id', 'email', 'email_id'],
      validOperators: ['=='],
      separator: ';'
    },
    lists: {
      validTerms: ['additional_info', 'contact_id', 'email', 'uniques', 'group_by_contact', 'track_id', 'log_id', 'start_id', 'end_id', 'totals', 'type'],
      validOperators: ['=='],
      separator: ';'
    }
  };
  
  /**
   * Get campaign logs with detailed activity tracking
   * Tries multiple endpoints to find engagement data (clicks, opens)
   * Primary: GET /logs/campaigns/{campaign_id}
   * Fallbacks: Analytics API and Campaign API endpoints
   */
  async getCampaignLogs(
    campaignId: string,
    params?: {
      account_id?: number;
      page?: number;
      per_page?: number;
      with_count?: boolean;
      sort?: string;
      order?: 'asc' | 'desc';
      cursor?: string;
      filter?: string;
      type?: string; // Keep for backward compatibility
      start_time?: number;
      end_time?: number;
    }
  ) {
    // Try multiple endpoint patterns to find engagement data
    const endpointAttempts = [
      {
        pattern: `/logs/campaigns/${campaignId}`,
        description: 'Primary logs endpoint'
      },
      {
        pattern: `/analytics/campaigns/${campaignId}/logs`,
        description: 'Analytics API logs endpoint'
      },
      {
        pattern: `/reports/campaigns/${campaignId}/logs`,
        description: 'Reports API logs endpoint'
      },
      {
        pattern: `/campaigns/${campaignId}/logs`,
        description: 'Campaign API logs endpoint'
      },
      {
        pattern: `/campaigns/${campaignId}/activities`,
        description: 'Campaign activities endpoint'
      }
    ];

    const buildEndpoint = (basePath: string) => {
      const url = new URL(`${this.baseUrl}${basePath}`);
      
      // Add query parameters
      if (params?.account_id) url.searchParams.set('account_id', params.account_id.toString());
      if (params?.page) url.searchParams.set('page', params.page.toString());
      if (params?.per_page) url.searchParams.set('per_page', params.per_page.toString());
      if (params?.with_count !== undefined) url.searchParams.set('with_count', params.with_count.toString());
      if (params?.sort) url.searchParams.set('sort', params.sort);
      if (params?.order) url.searchParams.set('order', params.order);
      if (params?.start_time) url.searchParams.set('start_time', params.start_time.toString());
      if (params?.end_time) url.searchParams.set('end_time', params.end_time.toString());
      if (params?.cursor) url.searchParams.set('cursor', params.cursor);
      
      // Handle filter parameter with validation
      if (params?.filter) {
        if (this.validateFilter(params.filter, 'campaigns')) {
          url.searchParams.set('filter', params.filter);
        } else {
          console.warn('Invalid filter syntax for campaigns endpoint:', params.filter);
          // Continue without filter rather than failing
        }
      }
      
      // Backward compatibility: convert type to filter format
      if (params?.type && !params?.filter) {
        url.searchParams.set('filter', `type==${params.type}`);
      }
      
      return `${basePath}${url.search}`;
    };

    let lastError: any = null;
    let primaryResult: any = null;

    // Try each endpoint in order
    for (let i = 0; i < endpointAttempts.length; i++) {
      const attempt = endpointAttempts[i];
      
      try {
        const endpoint = buildEndpoint(attempt.pattern);
        const result = await this.makeRequest(endpoint);
        
        // Store the first result (primary endpoint)
        if (i === 0) {
          primaryResult = result;
        }
        
        // Check if this result contains engagement data
        if (this.hasEngagementData(result)) {
          // Add debug info to the result
          result._debug = {
            endpoint_used: attempt.pattern,
            description: attempt.description,
            attempt_number: i + 1,
            has_engagement_data: true
          };
          return result;
        }
        
      } catch (error) {
        lastError = error;
        console.warn(`Logs endpoint ${attempt.pattern} failed:`, error);
        continue;
      }
    }
    
    // If no endpoint returned engagement data, return the primary result with debug info
    if (primaryResult) {
      primaryResult._debug = {
        endpoint_used: endpointAttempts[0].pattern,
        description: 'Primary endpoint (delivery logs only)',
        attempt_number: 1,
        has_engagement_data: false,
        attempted_endpoints: endpointAttempts.length,
        note: 'Only delivery events found - engagement events may not be available or require different filtering'
      };
      return primaryResult;
    }
    
    // If all endpoints failed, throw the last error
    throw lastError || new Error('All log endpoints failed');
  }

  /**
   * Check if the response contains engagement data (clicks, opens, etc.)
   * Returns true if engagement events are found, false if only delivery events
   */
  private hasEngagementData(result: any): boolean {
    if (!result?.data || !Array.isArray(result.data)) {
      return false;
    }
    
    // Look for engagement event indicators
    const engagementIndicators = [
      // Event type patterns
      (log: any) => log.type && ['click', 'open', 'bounce', 'unsubscribe', 'spam'].some(type => 
        log.type.toLowerCase().includes(type)
      ),
      // Has clickthrough URL (indicates click tracking)
      (log: any) => log.clickthru_url !== null && log.clickthru_url !== undefined,
      // Has event_type field with engagement values
      (log: any) => log.event_type && ['click', 'open', 'bounce', 'unsubscribe'].includes(log.event_type.toLowerCase()),
      // Has activity_type field
      (log: any) => log.activity_type && log.activity_type !== 'delivery',
      // Non-delivery type events
      (log: any) => log.type && !['generating', 'in_queue', 'received', 'sent', 'delivered'].includes(log.type.toLowerCase())
    ];
    
    // Check if any log entry matches engagement patterns
    const hasEngagement = result.data.some((log: any) => 
      engagementIndicators.some(indicator => indicator(log))
    );
    
    return hasEngagement;
  }

  /**
   * Get workflow action logs for automation tracking
   * Endpoint: GET /logs/workflows/{workflow_id}/actions/{action_id}
   */
  async getWorkflowActionLogs(
    workflowId: string,
    actionId: string,
    params?: {
      account_id?: number;
      page?: number;
      per_page?: number;
      with_count?: boolean;
      start_time?: number;
      end_time?: number;
      filter?: string;
    }
  ) {
    const url = new URL(`${this.baseUrl}/logs/workflows/${workflowId}/actions/${actionId}`);
    
    // Add query parameters
    if (params?.account_id) url.searchParams.set('account_id', params.account_id.toString());
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.per_page) url.searchParams.set('per_page', params.per_page.toString());
    if (params?.with_count !== undefined) url.searchParams.set('with_count', params.with_count.toString());
    if (params?.start_time) url.searchParams.set('start_time', params.start_time.toString());
    if (params?.end_time) url.searchParams.set('end_time', params.end_time.toString());
    
    // Handle filter parameter with validation
    if (params?.filter) {
      if (this.validateFilter(params.filter, 'workflows')) {
        url.searchParams.set('filter', params.filter);
      } else {
        console.warn('Invalid filter syntax for workflow action endpoint:', params.filter);
        // Continue without filter rather than failing
      }
    }

    const endpoint = `/logs/workflows/${workflowId}/actions/${actionId}${url.search}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get workflow logs (complete workflow automation logging)
   * Endpoint: GET /logs/workflows/{workflow_id}
   */
  async getWorkflowLogs(
    workflowId: string,
    params?: {
      account_id?: number;
      page?: number;
      per_page?: number;
      with_count?: boolean;
      sort?: string;
      order?: 'asc' | 'desc';
      start_time?: number;
      end_time?: number;
      filter?: string;
    }
  ) {
    const url = new URL(`${this.baseUrl}/logs/workflows/${workflowId}`);
    
    // Add query parameters
    if (params?.account_id) url.searchParams.set('account_id', params.account_id.toString());
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.per_page) url.searchParams.set('per_page', params.per_page.toString());
    if (params?.with_count !== undefined) url.searchParams.set('with_count', params.with_count.toString());
    if (params?.sort) url.searchParams.set('sort', params.sort);
    if (params?.order) url.searchParams.set('order', params.order);
    if (params?.start_time) url.searchParams.set('start_time', params.start_time.toString());
    if (params?.end_time) url.searchParams.set('end_time', params.end_time.toString());
    
    // Handle filter parameter with validation
    if (params?.filter) {
      if (this.validateFilter(params.filter, 'workflows')) {
        url.searchParams.set('filter', params.filter);
      } else {
        console.warn('Invalid filter syntax for workflow endpoint:', params.filter);
        // Continue without filter rather than failing
      }
    }

    const endpoint = `/logs/workflows/${workflowId}${url.search}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get transactional email logs (if available under /logs/emails)
   * Endpoint: GET /logs/emails
   */
  async getTransactionalEmailLogs(
    params: {
      log_type?: string; // Make optional for backward compatibility but warn if missing
      account_id?: number;
      page?: number;
      per_page?: number;
      with_count?: boolean;
      sort?: string;
      order?: 'asc' | 'desc';
      start_time?: number;
      end_time?: number;
      filter?: string;
      // Keep existing individual parameters for backward compatibility
      email_id?: string;
      sender_id?: string;
      status?: string;
    }
  ) {
    const url = new URL(`${this.baseUrl}/logs/emails`);
    
    // Required parameter per API spec
    if (params.log_type) {
      url.searchParams.set('log_type', params.log_type);
    } else {
      console.warn('log_type parameter is required per API specification. Proceeding without it for backward compatibility.');
    }
    
    // Add query parameters
    if (params?.account_id) url.searchParams.set('account_id', params.account_id.toString());
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.per_page) url.searchParams.set('per_page', params.per_page.toString());
    if (params?.with_count !== undefined) url.searchParams.set('with_count', params.with_count.toString());
    if (params?.sort) url.searchParams.set('sort', params.sort);
    if (params?.order) url.searchParams.set('order', params.order);
    if (params?.start_time) url.searchParams.set('start_time', params.start_time.toString());
    if (params?.end_time) url.searchParams.set('end_time', params.end_time.toString());
    
    // Backward compatibility parameters
    if (params?.email_id) url.searchParams.set('email_id', params.email_id);
    if (params?.sender_id) url.searchParams.set('sender_id', params.sender_id);
    if (params?.status) url.searchParams.set('status', params.status);
    
    // Handle filter parameter with validation
    if (params?.filter) {
      if (this.validateFilter(params.filter, 'emails')) {
        url.searchParams.set('filter', params.filter);
      } else {
        console.warn('Invalid filter syntax for emails endpoint:', params.filter);
        // Continue without filter rather than failing
      }
    }

    const endpoint = `/logs/emails${url.search}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Get list logs for contact list activity tracking
   * Endpoint: GET /logs/lists/{list_id}
   */
  async getListLogs(
    listId: string,
    params?: {
      account_id?: number;
      page?: number;
      per_page?: number;
      with_count?: boolean;
      start_time?: number;
      end_time?: number;
      filter?: string;
    }
  ) {
    const url = new URL(`${this.baseUrl}/logs/lists/${listId}`);
    
    // Add query parameters
    if (params?.account_id) url.searchParams.set('account_id', params.account_id.toString());
    if (params?.page) url.searchParams.set('page', params.page.toString());
    if (params?.per_page) url.searchParams.set('per_page', params.per_page.toString());
    if (params?.with_count !== undefined) url.searchParams.set('with_count', params.with_count.toString());
    if (params?.start_time) url.searchParams.set('start_time', params.start_time.toString());
    if (params?.end_time) url.searchParams.set('end_time', params.end_time.toString());
    
    // Handle filter parameter with validation
    if (params?.filter) {
      if (this.validateFilter(params.filter, 'lists')) {
        url.searchParams.set('filter', params.filter);
      } else {
        console.warn('Invalid filter syntax for lists endpoint:', params.filter);
        // Continue without filter rather than failing
      }
    }

    const endpoint = `/logs/lists/${listId}${url.search}`;
    return this.makeRequest(endpoint);
  }

  /**
   * Debug logs API access and test different endpoints
   * Provides detailed analysis of log data and endpoint availability
   */
  async debugLogsAccess(params?: { campaign_id?: string; workflow_id?: string }) {
    const debugResults = {
      timestamp: new Date().toISOString(),
      tests: [] as any[]
    };

    // Test campaign logs if campaign_id provided
    if (params?.campaign_id) {
      try {
        // Test without type filter first
        const campaignLogs = await this.getCampaignLogs(params.campaign_id, { 
          page: 1,
          per_page: 10
        });
        
        // Analyze the log data structure
        const logAnalysis = this.analyzeLogs(campaignLogs);
        
        debugResults.tests.push({
          test: "campaign-logs",
          campaign_id: params.campaign_id,
          success: true,
          hasData: !!campaignLogs?.data,
          dataType: campaignLogs?.data ? typeof campaignLogs.data : 'none',
          logCount: Array.isArray(campaignLogs?.data) ? campaignLogs.data.length : 0,
          endpointUsed: campaignLogs?._debug?.endpoint_used || '/logs/campaigns/{id}',
          hasEngagementData: campaignLogs?._debug?.has_engagement_data || false,
          logTypes: logAnalysis.types,
          sampleEvents: logAnalysis.samples,
          eventFields: logAnalysis.fields
        });
        
        // Test with click filter
        try {
          const clickLogs = await this.getCampaignLogs(params.campaign_id, { 
            page: 1,
            per_page: 5,
            type: 'click'
          });
          
          const clickAnalysis = this.analyzeLogs(clickLogs);
          
          debugResults.tests.push({
            test: "campaign-logs-clicks",
            campaign_id: params.campaign_id,
            success: true,
            filter: 'click',
            hasData: !!clickLogs?.data,
            logCount: Array.isArray(clickLogs?.data) ? clickLogs.data.length : 0,
            endpointUsed: clickLogs?._debug?.endpoint_used,
            hasEngagementData: clickLogs?._debug?.has_engagement_data || false,
            logTypes: clickAnalysis.types,
            hasClickthroughUrls: clickAnalysis.hasClickUrls
          });
        } catch (error) {
          debugResults.tests.push({
            test: "campaign-logs-clicks",
            campaign_id: params.campaign_id,
            success: false,
            filter: 'click',
            error: error instanceof Error ? error.message : String(error)
          });
        }
        
        // Test with open filter
        try {
          const openLogs = await this.getCampaignLogs(params.campaign_id, { 
            page: 1,
            per_page: 5,
            type: 'open'
          });
          
          const openAnalysis = this.analyzeLogs(openLogs);
          
          debugResults.tests.push({
            test: "campaign-logs-opens",
            campaign_id: params.campaign_id,
            success: true,
            filter: 'open',
            hasData: !!openLogs?.data,
            logCount: Array.isArray(openLogs?.data) ? openLogs.data.length : 0,
            endpointUsed: openLogs?._debug?.endpoint_used,
            hasEngagementData: openLogs?._debug?.has_engagement_data || false,
            logTypes: openAnalysis.types
          });
        } catch (error) {
          debugResults.tests.push({
            test: "campaign-logs-opens",
            campaign_id: params.campaign_id,
            success: false,
            filter: 'open',
            error: error instanceof Error ? error.message : String(error)
          });
        }
        
      } catch (error) {
        debugResults.tests.push({
          test: "campaign-logs",
          campaign_id: params.campaign_id,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Test workflow logs if workflow_id provided
    if (params?.workflow_id) {
      try {
        const workflowLogs = await this.getWorkflowLogs(params.workflow_id, { 
          page: 1,
          per_page: 5
        });
        debugResults.tests.push({
          test: "workflow-logs",
          workflow_id: params.workflow_id,
          success: true,
          hasData: !!workflowLogs?.data,
          dataType: workflowLogs?.data ? typeof workflowLogs.data : 'none'
        });
      } catch (error) {
        debugResults.tests.push({
          test: "workflow-logs",
          workflow_id: params.workflow_id,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Test transactional email logs
    try {
      const emailLogs = await this.getTransactionalEmailLogs({ 
        page: 1,
        per_page: 5
      });
      debugResults.tests.push({
        test: "transactional-email-logs",
        success: true,
        hasData: !!emailLogs?.data,
        dataType: emailLogs?.data ? typeof emailLogs.data : 'none'
      });
    } catch (error) {
      debugResults.tests.push({
        test: "transactional-email-logs", 
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }

    return debugResults;
  }

  /**
   * Analyze log data structure to understand what types of events are available
   */
  private analyzeLogs(logResult: any) {
    const analysis = {
      types: [] as string[],
      samples: [] as any[],
      fields: [] as string[],
      hasClickUrls: false
    };
    
    if (!logResult?.data || !Array.isArray(logResult.data)) {
      return analysis;
    }
    
    const allFields = new Set<string>();
    const typeSet = new Set<string>();
    
    logResult.data.forEach((log: any, index: number) => {
      // Collect event types
      if (log.type) typeSet.add(log.type);
      if (log.event_type) typeSet.add(log.event_type);
      if (log.activity_type) typeSet.add(log.activity_type);
      
      // Check for clickthrough URLs
      if (log.clickthru_url !== null && log.clickthru_url !== undefined) {
        analysis.hasClickUrls = true;
      }
      
      // Collect all field names
      Object.keys(log).forEach(key => allFields.add(key));
      
      // Keep first 3 samples for reference
      if (index < 3) {
        analysis.samples.push({
          type: log.type,
          event_type: log.event_type,
          activity_type: log.activity_type,
          contact_id: log.contact_id,
          email: log.email,
          timestamp: log.timestamp,
          clickthru_url: log.clickthru_url,
          user_agent: log.user_agent
        });
      }
    });
    
    analysis.types = Array.from(typeSet);
    analysis.fields = Array.from(allFields);
    
    return analysis;
  }

  /**
   * Validate filter parameter syntax for specific endpoint
   * @param filter Filter string to validate
   * @param endpoint Endpoint type to validate against
   * @returns true if filter is valid, false otherwise
   */
  private validateFilter(filter: string, endpoint: 'campaigns' | 'workflows' | 'emails' | 'lists'): boolean {
    const config = this.FILTER_CONFIGS[endpoint];
    const conditions = filter.split(config.separator);
    
    for (const condition of conditions) {
      const hasValidOperator = config.validOperators.some(op => condition.includes(op));
      if (!hasValidOperator) {
        console.warn(`Invalid operator in filter condition: ${condition}. Valid operators: ${config.validOperators.join(', ')}`);
        return false;
      }
      
      const [term] = condition.split(config.validOperators[0]);
      const trimmedTerm = term.trim();
      if (!config.validTerms.includes(trimmedTerm)) {
        console.warn(`Invalid filter term: ${trimmedTerm}. Valid terms for ${endpoint}: ${config.validTerms.join(', ')}`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Get smart filter suggestions based on event taxonomy
   * Returns common filter patterns for typical use cases
   */
  getSmartFilterSuggestions(): Array<{name: string, description: string, filter: string, useCase: string}> {
    return EventTaxonomyHelper.getSmartFilterSuggestions().map(suggestion => ({
      ...suggestion,
      useCase: CAKEMAIL_EVENT_TAXONOMY.filterHelpers.find(h => h.name === suggestion.name)?.useCase || 'General filtering'
    }));
  }

  /**
   * Get events in a specific category
   * @param categoryName Category name (ENGAGEMENT, BOUNCES, LIST_MANAGEMENT, etc.)
   */
  getEventsInCategory(categoryName: string): string[] {
    return EventTaxonomyHelper.getEventsInCategory(categoryName);
  }

  /**
   * Get event details and categorization
   * @param eventType Event type code (click, bounce_hb, etc.)
   */
  getEventDetails(eventType: string) {
    const details = EventTaxonomyHelper.getEventDetails(eventType);
    const category = EventTaxonomyHelper.getEventCategory(eventType);
    
    return {
      event: details,
      category: category,
      isValid: EventTaxonomyHelper.isValidEventType(eventType),
      isCritical: details?.severity === 'critical',
      isRetryable: details?.retryable === true,
      isPermanent: details?.permanent === true
    };
  }

  /**
   * Get pre-built filter for a specific helper
   * @param helperName Name of the filter helper (engagement_events, delivery_issues, etc.)
   */
  getFilterHelper(helperName: string): string | undefined {
    const helper = EventTaxonomyHelper.getFilterHelper(helperName);
    return helper?.filterQuery;
  }

  /**
   * Generate filter string for events requiring immediate attention
   */
  getCriticalEventsFilter(): string {
    const criticalEvents = EventTaxonomyHelper.getCriticalEvents();
    return criticalEvents.map(event => `type==${event}`).join(';');
  }

  /**
   * Generate filter string for permanent failures (list cleanup)
   */
  getPermanentFailuresFilter(): string {
    const permanentFailures = EventTaxonomyHelper.getPermanentFailureEvents();
    return permanentFailures.map(event => `type==${event}`).join(';');
  }

  /**
   * Analyze log results with event taxonomy context
   * Enhances the existing analyzeLogs method with taxonomy insights
   */
  analyzeLogsWithTaxonomy(logResult: any) {
    const basicAnalysis = this.analyzeLogs(logResult);
    
    if (!logResult?.data || !Array.isArray(logResult.data)) {
      return { ...basicAnalysis, taxonomy: null };
    }

    // Categorize events
    const categorizedEvents = new Map<string, number>();
    const criticalEvents: any[] = [];
    const engagementEvents: any[] = [];
    const deliveryIssues: any[] = [];
    
    logResult.data.forEach((log: any) => {
      if (log.type) {
        const details = this.getEventDetails(log.type);
        
        // Count by category
        if (details.category) {
          const current = categorizedEvents.get(details.category.name) || 0;
          categorizedEvents.set(details.category.name, current + 1);
        }
        
        // Collect critical events
        if (details.isCritical) {
          criticalEvents.push(log);
        }
        
        // Collect engagement events
        if (details.category?.name === 'ENGAGEMENT') {
          engagementEvents.push(log);
        }
        
        // Collect delivery issues
        if (details.category?.name === 'BOUNCES' || details.category?.name === 'DELIVERABILITY_ISSUES') {
          deliveryIssues.push(log);
        }
      }
    });

    return {
      ...basicAnalysis,
      taxonomy: {
        categorizedEvents: Object.fromEntries(categorizedEvents),
        criticalEventCount: criticalEvents.length,
        engagementEventCount: engagementEvents.length,
        deliveryIssueCount: deliveryIssues.length,
        criticalEvents: criticalEvents.slice(0, 5), // First 5 critical events
        needsAttention: criticalEvents.length > 0,
        summary: {
          totalEvents: logResult.data.length,
          engagementRate: logResult.data.length > 0 ? (engagementEvents.length / logResult.data.length * 100).toFixed(1) + '%' : '0%',
          issueRate: logResult.data.length > 0 ? (deliveryIssues.length / logResult.data.length * 100).toFixed(1) + '%' : '0%'
        }
      }
    };
  }
}
