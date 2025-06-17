// Email API operations - v2 API for both transactional and marketing emails

import { BaseApiClient } from './base-client.js';
import { 
  EmailData,
  EmailAPILogsResponse,
  EmailAPIStatsResponse,
  SubmitEmailRequest,
  SubmitEmailResponse,
  GetEmailResponse,
  LogTypeV2,
  EmailLogAnalysis,
  SmartFilterType
} from '../types/cakemail-types.js';
import { EmailAPIError } from '../types/errors.js';

export class EmailApi extends BaseApiClient {

  /**
   * Submit an email to be sent using v2 API
   * Fully compliant with POST /v2/emails specification
   */
  async sendEmail(data: EmailData): Promise<SubmitEmailResponse> {
    const emailData = data;
    
    // Enhanced validation
    if (!this.isValidEmail(emailData.email)) {
      throw EmailAPIError.forInvalidEmail(emailData.email);
    }

    if (!emailData.sender?.id) {
      throw new EmailAPIError('sender.id is required', 400);
    }
    if (!emailData.content?.subject) {
      throw new EmailAPIError('content.subject is required', 400);
    }

    // Must have either content or template
    if (!emailData.content.html && !emailData.content.text && !emailData.content.template?.id) {
      throw EmailAPIError.forMissingContent();
    }

    // Structure request according to v2 API specification
    const submitRequest: SubmitEmailRequest = {
      sender: {
        id: emailData.sender.id,
        ...(emailData.sender.name && { name: emailData.sender.name })
      },
      content: {
        subject: emailData.content.subject,
        ...(emailData.content.html && { html: emailData.content.html }),
        ...(emailData.content.text && { text: emailData.content.text }),
        ...(emailData.content.template?.id && { template: { id: emailData.content.template.id } }),
        ...(emailData.content.encoding && { encoding: emailData.content.encoding }),
        ...(emailData.content.custom_attributes && { custom_attributes: emailData.content.custom_attributes }),
        ...(emailData.content.type && { type: emailData.content.type }),
        ...(emailData.content.markup && { markup: emailData.content.markup })
      },
      email: emailData.email
    };

    // Add optional fields only if provided
    if (emailData.list_id !== undefined) submitRequest.list_id = emailData.list_id;
    if (emailData.contact_id !== undefined) submitRequest.contact_id = emailData.contact_id;
    if (emailData.tags) submitRequest.tags = emailData.tags;
    if (emailData.tracking) submitRequest.tracking = emailData.tracking;
    if (emailData.additional_headers) submitRequest.additional_headers = emailData.additional_headers;
    if (emailData.attachment) submitRequest.attachment = emailData.attachment;

    if (this.debugMode) {
      console.log('[Email API] v2 Submit request:', JSON.stringify(submitRequest, null, 2));
    }

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    try {
      const response = await this.makeRequest(`/v2/emails${query}`, {
        method: 'POST',
        body: JSON.stringify(submitRequest)
      });

      return response as SubmitEmailResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new EmailAPIError(`Failed to send email: ${error.message}`, 500);
      }
      throw error;
    }
  }



  /**
   * Retrieve a submitted email status
   * Compliant with GET /v2/emails/{email_id} specification
   */
  async getEmail(emailId: string): Promise<GetEmailResponse> {
    if (!emailId) {
      throw new EmailAPIError('email_id is required', 400);
    }

    // Validate UUID format (v4 UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(emailId)) {
      throw new EmailAPIError('email_id must be a valid UUID', 400);
    }

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    try {
      const response = await this.makeRequest(`/v2/emails/${emailId}${query}`);
      return response as GetEmailResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new EmailAPIError(`Failed to retrieve email ${emailId}: ${error.message}`, 500, emailId);
      }
      throw error;
    }
  }

  /**
   * Render a submitted email (get HTML/text content)
   */
  async renderEmail(
    emailId: string, 
    options: {
      as_submitted?: boolean;
      tracking?: boolean;
    } = {}
  ): Promise<string> {
    if (!emailId) {
      throw new EmailAPIError('email_id is required', 400);
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(emailId)) {
      throw new EmailAPIError('email_id must be a valid UUID', 400);
    }

    const accountId = await this.getCurrentAccountId();
    const queryParams = new URLSearchParams();
    
    if (accountId) {
      queryParams.append('account_id', String(accountId));
    }
    if (options.as_submitted !== undefined) {
      queryParams.append('as_submitted', String(options.as_submitted));
    }
    if (options.tracking !== undefined) {
      queryParams.append('tracking', String(options.tracking));
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    try {
      return await this.makeRequest(`/v2/emails/${emailId}/render${query}`, {
        headers: {
          'Accept': 'text/html'
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new EmailAPIError(`Failed to render email ${emailId}: ${error.message}`, 500, emailId);
      }
      throw error;
    }
  }

  /**
   * Show Email API activity logs
   * Compliant with GET /v2/logs/emails specification
   */
  async getEmailLogs(options: {
    log_type?: LogTypeV2;
    email_id?: string;
    iso_time?: boolean;
    page?: number;
    per_page?: number;
    start_time?: number;
    end_time?: number;
    tags?: string; // JSON string for recursive filter
    providers?: string; // JSON string for recursive filter
    sort?: string;
  } = {}): Promise<EmailAPILogsResponse> {
    const accountId = await this.getCurrentAccountId();
    const queryParams = new URLSearchParams();
    
    if (accountId) {
      queryParams.append('account_id', String(accountId));
    }
    if (options.log_type) {
      queryParams.append('log_type', options.log_type);
    }
    if (options.email_id) {
      // Validate UUID format for email_id
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(options.email_id)) {
        throw new EmailAPIError('email_id must be a valid UUID format', 400);
      }
      queryParams.append('email_id', options.email_id);
    }
    if (options.iso_time !== undefined) {
      queryParams.append('iso_time', String(options.iso_time));
    }
    if (options.page) {
      if (options.page < 1) {
        throw new EmailAPIError('page must be >= 1', 400);
      }
      queryParams.append('page', String(options.page));
    }
    if (options.per_page) {
      if (options.per_page < 1 || options.per_page > 100) {
        throw new EmailAPIError('per_page must be between 1 and 100', 400);
      }
      queryParams.append('per_page', String(options.per_page));
    }
    if (options.start_time) {
      if (options.start_time < 1 || options.start_time > 2147483647) {
        throw new EmailAPIError('start_time must be a valid Unix timestamp', 400);
      }
      queryParams.append('start_time', String(options.start_time));
    }
    if (options.end_time) {
      if (options.end_time < 1 || options.end_time > 2147483647) {
        throw new EmailAPIError('end_time must be a valid Unix timestamp', 400);
      }
      queryParams.append('end_time', String(options.end_time));
    }
    if (options.tags) {
      // Validate JSON format
      try {
        JSON.parse(options.tags);
      } catch {
        throw new EmailAPIError('tags must be valid JSON', 400);
      }
      queryParams.append('tags', options.tags);
    }
    if (options.providers) {
      // Validate JSON format
      try {
        JSON.parse(options.providers);
      } catch {
        throw new EmailAPIError('providers must be valid JSON', 400);
      }
      queryParams.append('providers', options.providers);
    }
    if (options.sort) {
      const validSortFields = ['id', 'time', 'submitted_time', 'type', 'provider'];
      const sortField = options.sort.replace(/^[-+]/, ''); // Remove direction prefix
      if (!validSortFields.includes(sortField)) {
        throw new EmailAPIError(`sort field must be one of: ${validSortFields.join(', ')}`, 400);
      }
      queryParams.append('sort', options.sort);
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    try {
      const response = await this.makeRequest(`/v2/logs/emails${query}`);
      return response as EmailAPILogsResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new EmailAPIError(`Failed to retrieve email logs: ${error.message}`, 500);
      }
      throw error;
    }
  }

  /**
   * Show Email API statistics
   * Compliant with GET /v2/reports/emails specification
   */
  async getEmailStats(options: {
    interval?: 'hour' | 'day' | 'week' | 'month';
    iso_time?: boolean;
    start_time?: number;
    end_time?: number;
    providers?: string; // JSON string for recursive filter
    tags?: string; // JSON string for recursive filter
  } = {}): Promise<EmailAPIStatsResponse> {
    const accountId = await this.getCurrentAccountId();
    const queryParams = new URLSearchParams();
    
    if (accountId) {
      queryParams.append('account_id', String(accountId));
    }
    if (options.interval) {
      const validIntervals = ['hour', 'day', 'week', 'month'];
      if (!validIntervals.includes(options.interval)) {
        throw new EmailAPIError(`interval must be one of: ${validIntervals.join(', ')}`, 400);
      }
      queryParams.append('interval', options.interval);
    }
    if (options.iso_time !== undefined) {
      queryParams.append('iso_time', String(options.iso_time));
    }
    if (options.start_time) {
      if (options.start_time < 1 || options.start_time > 2147483647) {
        throw new EmailAPIError('start_time must be a valid Unix timestamp', 400);
      }
      queryParams.append('start_time', String(options.start_time));
    }
    if (options.end_time) {
      if (options.end_time < 1 || options.end_time > 2147483647) {
        throw new EmailAPIError('end_time must be a valid Unix timestamp', 400);
      }
      queryParams.append('end_time', String(options.end_time));
    }
    if (options.providers) {
      // Validate JSON format
      try {
        JSON.parse(options.providers);
      } catch {
        throw new EmailAPIError('providers must be valid JSON', 400);
      }
      queryParams.append('providers', options.providers);
    }
    if (options.tags) {
      // Validate JSON format
      try {
        JSON.parse(options.tags);
      } catch {
        throw new EmailAPIError('tags must be valid JSON', 400);
      }
      queryParams.append('tags', options.tags);
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    try {
      const response = await this.makeRequest(`/v2/reports/emails${query}`);
      return response as EmailAPIStatsResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new EmailAPIError(`Failed to retrieve email statistics: ${error.message}`, 500);
      }
      throw error;
    }
  }

  /**
   * Helper method to send transactional email
   */
  async sendTransactionalEmail(data: EmailData): Promise<SubmitEmailResponse> {
    const emailData = { ...data };
    emailData.content.type = 'transactional';
    return this.sendEmail(emailData);
  }

  /**
   * Helper method to send marketing email
   */
  async sendMarketingEmail(data: EmailData): Promise<SubmitEmailResponse> {
    const emailData = { ...data };
    emailData.content.type = 'marketing';
    return this.sendEmail(emailData);
  }

  /**
   * Helper method to get email status (alias for getEmail)
   */
  async getEmailStatus(emailId: string): Promise<GetEmailResponse> {
    return this.getEmail(emailId);
  }

  /**
   * Bulk email status retrieval
   */
  async getBulkEmailStatus(emailIds: string[]): Promise<GetEmailResponse[]> {
    if (!emailIds || emailIds.length === 0) {
      throw new EmailAPIError('emailIds array cannot be empty', 400);
    }

    if (emailIds.length > 100) {
      throw new EmailAPIError('Cannot retrieve more than 100 emails at once', 400);
    }

    // Validate all UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds = emailIds.filter(id => !uuidRegex.test(id));
    if (invalidIds.length > 0) {
      throw new EmailAPIError(`Invalid UUID format for email IDs: ${invalidIds.join(', ')}`, 400);
    }

    const promises = emailIds.map(id => this.getEmail(id));
    return Promise.all(promises);
  }

  /**
   * Create a filter for logs/stats using the recursive filter syntax
   * Enhanced with validation and helper patterns
   */
  createFilter(conditions: any[], operator: 'and' | 'or' | 'not' | 'is' = 'and'): string {
    if (!conditions || conditions.length === 0) {
      throw new EmailAPIError('Conditions are required for filter creation', 400);
    }

    const validOperators = ['and', 'or', 'not', 'is'];
    if (!validOperators.includes(operator)) {
      throw new EmailAPIError(`Operator must be one of: ${validOperators.join(', ')}`, 400);
    }

    let filter: any;
    
    if (conditions.length === 1 && typeof conditions[0] === 'string') {
      filter = { [operator]: conditions[0] };
    } else {
      filter = { [operator]: conditions };
    }

    try {
      return JSON.stringify(filter);
    } catch (error) {
      throw new EmailAPIError('Failed to create valid JSON filter', 400);
    }
  }

  /**
   * Helper to create simple tag filters
   */
  createTagFilter(tags: string[], operator: 'and' | 'or' = 'or'): string {
    if (!tags || tags.length === 0) {
      throw new EmailAPIError('Tags array cannot be empty', 400);
    }
    return this.createFilter(tags, operator);
  }

  /**
   * Helper to create provider filters
   */
  createProviderFilter(providers: string[], operator: 'and' | 'or' = 'or'): string {
    if (!providers || providers.length === 0) {
      throw new EmailAPIError('Providers array cannot be empty', 400);
    }
    return this.createFilter(providers, operator);
  }

  /**
   * Create smart filters for common use cases
   */
  createSmartFilter(filterType: SmartFilterType): string {
    const smartFilters = {
      engagement: ['click', 'open', 'view', 'forward', 'share'],
      critical_issues: ['spam', 'bounce_hb', 'bounce_mb'],
      temporary_failures: ['bounce_sb', 'bounce_df', 'bounce_fm', 'bounce_tr'],
      list_cleanup: ['bounce_hb', 'spam', 'global_unsubscribe']
    };

    const eventTypes = smartFilters[filterType];
    if (!eventTypes) {
      throw new EmailAPIError(`Unknown smart filter type: ${filterType}`, 400);
    }

    const conditions = eventTypes.map(type => `type==${type}`);
    return this.createFilter(conditions, 'or');
  }

  /**
   * Analyze email logs with smart insights
   */
  analyzeEmailLogs(logs: EmailAPILogsResponse): EmailLogAnalysis {
    const data = logs.data || [];
    const totalEvents = data.length;

    if (totalEvents === 0) {
      return {
        totalEvents: 0,
        eventBreakdown: {},
        deliveryRate: 0,
        engagementRate: 0,
        issueRate: 0,
        recommendations: ['No events to analyze']
      };
    }

    // Count events by type
    const eventBreakdown: Record<string, number> = {};
    data.forEach(log => {
      const type = log.type || 'unknown';
      eventBreakdown[type] = (eventBreakdown[type] || 0) + 1;
    });

    // Calculate rates
    const delivered = eventBreakdown.delivered || 0;
    const bounced = (eventBreakdown.bounce || 0) + (eventBreakdown.bounce_hb || 0) + (eventBreakdown.bounce_sb || 0);
    const opened = eventBreakdown.open || 0;
    const clicked = eventBreakdown.click || 0;
    const spam = eventBreakdown.spam || 0;

    const deliveryRate = delivered > 0 ? (delivered / (delivered + bounced)) * 100 : 0;
    const engagementRate = delivered > 0 ? ((opened + clicked) / delivered) * 100 : 0;
    const issueRate = totalEvents > 0 ? ((bounced + spam) / totalEvents) * 100 : 0;

    // Generate recommendations
    const recommendations: string[] = [];
    if (deliveryRate < 95) {
      recommendations.push('Low delivery rate detected. Consider list cleaning and sender reputation monitoring.');
    }
    if (engagementRate < 15) {
      recommendations.push('Low engagement rate. Consider improving subject lines and content quality.');
    }
    if (issueRate > 5) {
      recommendations.push('High issue rate detected. Review bounce handling and spam prevention measures.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Email performance looks healthy. Continue monitoring key metrics.');
    }

    return {
      totalEvents,
      eventBreakdown,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      engagementRate: Math.round(engagementRate * 100) / 100,
      issueRate: Math.round(issueRate * 100) / 100,
      recommendations
    };
  }

  /**
   * Get email logs with automatic analysis
   */
  async getEmailLogsWithAnalysis(options: Parameters<typeof this.getEmailLogs>[0] = {}): Promise<{
    logs: EmailAPILogsResponse;
    analysis: EmailLogAnalysis;
  }> {
    const logs = await this.getEmailLogs(options);
    const analysis = this.analyzeEmailLogs(logs);
    
    return { logs, analysis };
  }

  /**
   * Enhanced email validation
   */
  protected isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
  }
}

// Re-export for convenience
export { EmailAPIError } from '../types/errors.js';
