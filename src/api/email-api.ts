// Email API operations - v2 API for both transactional and marketing emails

import { BaseApiClient } from './base-client.js';
import { 
  EmailData,
  EmailResponse,
  EmailStatusResponse,
  EmailAPILogsResponse,
  EmailAPIStatsResponse
} from '../types/cakemail-types.js';

export class EmailApi extends BaseApiClient {

  /**
   * Submit an email to be sent using v2 API
   * @param data Email data conforming to v2 API specifications
   * @returns Promise<EmailResponse>
   */
  async sendEmail(data: EmailData): Promise<EmailResponse> {
    if (!this.isValidEmail(data.to_email)) {
      throw new Error('Invalid recipient email format');
    }

    // Required fields validation
    if (!data.sender_id) {
      throw new Error('sender_id is required');
    }
    if (!data.subject) {
      throw new Error('subject is required');
    }

    // Structure the email data according to Cakemail v2 API specification
    const emailData: any = {
      to: data.to_email,
      sender_id: String(data.sender_id),
      subject: data.subject
    };

    // Add recipient name if provided
    if (data.to_name) {
      emailData.to_name = data.to_name;
    }

    // Add HTML content if provided
    if (data.html_content) {
      emailData.html_content = data.html_content;
    }

    // Add text content if provided
    if (data.text_content) {
      emailData.text_content = data.text_content;
    }

    // Add template if provided instead of direct content
    if (data.template_id) {
      emailData.template_id = String(data.template_id);
    }

    // Add tags if provided (for filtering and organization)
    if (data.tags) {
      emailData.tags = data.tags;
    }

    // Add metadata if provided
    if (data.metadata) {
      emailData.metadata = data.metadata;
    }

    if (this.debugMode) {
      console.log('[Email API] v2 Email data:', JSON.stringify(emailData, null, 2));
    }

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';

    return this.makeRequest(`/v2/emails${query}`, {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }

  /**
   * Retrieve a submitted email status
   * @param emailId UUID of the email to retrieve
   * @returns Promise<EmailStatusResponse>
   */
  async getEmail(emailId: string): Promise<EmailStatusResponse> {
    if (!emailId) {
      throw new Error('email_id is required');
    }

    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/v2/emails/${emailId}${query}`);
  }

  /**
   * Render a submitted email (get HTML/text content)
   * @param emailId UUID of the email to render
   * @param options Render options
   * @returns Promise<string> HTML content
   */
  async renderEmail(
    emailId: string, 
    options: {
      as_submitted?: boolean;
      tracking?: boolean;
    } = {}
  ): Promise<string> {
    if (!emailId) {
      throw new Error('email_id is required');
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
    
    return this.makeRequest(`/v2/emails/${emailId}/render${query}`, {
      headers: {
        'Accept': 'text/html'
      }
    });
  }

  /**
   * Show Email API activity logs
   * @param options Log filtering options
   * @returns Promise<EmailAPILogsResponse>
   */
  async getEmailLogs(options: {
    log_type?: 'all' | 'submitted' | 'queued' | 'delivered' | 'rejected' | 'error' | 'open' | 'click' | 'bounce' | 'spam' | 'unsubscribe' | 'global_unsubscribe';
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
      queryParams.append('email_id', options.email_id);
    }
    if (options.iso_time !== undefined) {
      queryParams.append('iso_time', String(options.iso_time));
    }
    if (options.page) {
      queryParams.append('page', String(options.page));
    }
    if (options.per_page) {
      queryParams.append('per_page', String(options.per_page));
    }
    if (options.start_time) {
      queryParams.append('start_time', String(options.start_time));
    }
    if (options.end_time) {
      queryParams.append('end_time', String(options.end_time));
    }
    if (options.tags) {
      queryParams.append('tags', options.tags);
    }
    if (options.providers) {
      queryParams.append('providers', options.providers);
    }
    if (options.sort) {
      queryParams.append('sort', options.sort);
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return this.makeRequest(`/v2/logs/emails${query}`);
  }

  /**
   * Show Email API statistics
   * @param options Statistics filtering options
   * @returns Promise<EmailAPIStatsResponse>
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
      queryParams.append('interval', options.interval);
    }
    if (options.iso_time !== undefined) {
      queryParams.append('iso_time', String(options.iso_time));
    }
    if (options.start_time) {
      queryParams.append('start_time', String(options.start_time));
    }
    if (options.end_time) {
      queryParams.append('end_time', String(options.end_time));
    }
    if (options.providers) {
      queryParams.append('providers', options.providers);
    }
    if (options.tags) {
      queryParams.append('tags', options.tags);
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    return this.makeRequest(`/v2/reports/emails${query}`);
  }

  // Helper method to send transactional email (backward compatibility)
  async sendTransactionalEmail(data: any): Promise<EmailResponse> {
    return this.sendEmail({
      ...data,
      email_type: 'transactional'
    });
  }

  // Helper method to send marketing email
  async sendMarketingEmail(data: EmailData): Promise<EmailResponse> {
    return this.sendEmail({
      ...data,
      email_type: 'marketing'
    });
  }

  // Helper method to get email status (alias for getEmail)
  async getEmailStatus(emailId: string): Promise<EmailStatusResponse> {
    return this.getEmail(emailId);
  }

  /**
   * Create a filter for logs/stats using the recursive filter syntax
   * @param conditions Array of conditions or nested filters
   * @param operator Logical operator: 'and', 'or', 'not', 'is'
   * @returns JSON string for use in API calls
   */
  createFilter(conditions: any[], operator: 'and' | 'or' | 'not' | 'is' = 'and'): string {
    if (!conditions || conditions.length === 0) {
      throw new Error('Conditions are required for filter creation');
    }

    let filter: any;
    
    if (conditions.length === 1 && typeof conditions[0] === 'string') {
      filter = { [operator]: conditions[0] };
    } else {
      filter = { [operator]: conditions };
    }

    return JSON.stringify(filter);
  }

  /**
   * Helper to create simple tag filters
   * @param tags Array of tag names to filter by
   * @param operator Logical operator
   * @returns JSON filter string
   */
  createTagFilter(tags: string[], operator: 'and' | 'or' = 'or'): string {
    return this.createFilter(tags, operator);
  }

  /**
   * Helper to create provider filters
   * @param providers Array of provider names to filter by
   * @param operator Logical operator
   * @returns JSON filter string
   */
  createProviderFilter(providers: string[], operator: 'and' | 'or' = 'or'): string {
    return this.createFilter(providers, operator);
  }
}
