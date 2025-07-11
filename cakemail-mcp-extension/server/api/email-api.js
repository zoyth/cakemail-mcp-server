// Email API operations - v2 API for both transactional and marketing emails
import { BaseApiClient } from './base-client.js';
import { EmailAPIError } from '../types/errors.js';
import logger from '../utils/logger.js';
export class EmailApi extends BaseApiClient {
    /**
     * Submit an email to be sent using v2 API
     * Fully compliant with POST /v2/emails specification
     */
    async sendEmail(data) {
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
        // For marketing emails or accounts that require list management, ensure list_id is provided
        if (emailData.content.type === 'marketing' && !emailData.list_id) {
            throw new EmailAPIError('list_id is required for marketing emails', 400);
        }
        // Some accounts require list_id for all emails (list management cannot be disabled)
        // This is a common requirement for newer accounts or certain account types
        if (!emailData.list_id && emailData.content.type !== 'transactional') {
            logger.info('[Email API] Warning: Some accounts require list_id for all emails. Consider providing list_id.');
        }
        // Structure request according to v2 API specification
        // Based on the OpenAPI schema, the structure should match the SubmitEmail schema
        const submitRequest = {
            sender: {
                id: emailData.sender.id
            },
            content: {
                subject: emailData.content.subject
            },
            email: emailData.email
        };
        // Add content fields conditionally
        if (emailData.content.html) {
            submitRequest.content.html = emailData.content.html;
        }
        if (emailData.content.text) {
            submitRequest.content.text = emailData.content.text;
        }
        if (emailData.content.template?.id) {
            submitRequest.content.template = { id: emailData.content.template.id };
        }
        // Set encoding - required when html or text content is present
        if (emailData.content.html || emailData.content.text) {
            submitRequest.content.encoding = emailData.content.encoding || 'utf-8';
        }
        else if (emailData.content.encoding) {
            submitRequest.content.encoding = emailData.content.encoding;
        }
        if (emailData.content.custom_attributes) {
            submitRequest.content.custom_attributes = emailData.content.custom_attributes;
        }
        if (emailData.content.type) {
            submitRequest.content.type = emailData.content.type;
        }
        if (emailData.content.markup) {
            submitRequest.content.markup = emailData.content.markup;
        }
        // Add optional sender name
        if (emailData.sender.name) {
            submitRequest.sender.name = emailData.sender.name;
        }
        // Add optional top-level fields
        if (emailData.list_id !== undefined) {
            submitRequest.list_id = emailData.list_id;
        }
        if (emailData.contact_id !== undefined) {
            submitRequest.contact_id = emailData.contact_id;
        }
        if (emailData.tags && Array.isArray(emailData.tags)) {
            submitRequest.tags = emailData.tags;
        }
        if (emailData.tracking) {
            submitRequest.tracking = emailData.tracking;
        }
        if (emailData.additional_headers && Array.isArray(emailData.additional_headers)) {
            submitRequest.additional_headers = emailData.additional_headers;
        }
        if (emailData.attachment && Array.isArray(emailData.attachment)) {
            submitRequest.attachment = emailData.attachment;
        }
        if (this.debugMode) {
            logger.info('[Email API] v2 Submit request:', JSON.stringify(submitRequest, null, 2));
        }
        const accountId = await this.getCurrentAccountId();
        const query = accountId ? `?account_id=${accountId}` : '';
        try {
            const response = await this.makeRequest(`/v2/emails${query}`, {
                method: 'POST',
                body: JSON.stringify(submitRequest)
            });
            return response;
        }
        catch (error) {
            // Enhanced error handling with better details
            if (error instanceof Error) {
                const errorMessage = error.message;
                let detailedMessage = `Failed to send email: ${errorMessage}`;
                // Extract more details from the error if available
                if (error.response) {
                    try {
                        const responseDetails = JSON.stringify(error.response, null, 2);
                        detailedMessage += `\n\nAPI Response Details:\n${responseDetails}`;
                    }
                    catch {
                        detailedMessage += `\n\nAPI Response: ${String(error.response)}`;
                    }
                }
                // If it's a CakemailError, extract more specific details
                if (error.statusCode && error.response) {
                    const statusCode = error.statusCode;
                    const response = error.response;
                    if (response && typeof response === 'object') {
                        // Handle FastAPI validation errors (Pydantic format)
                        if (Array.isArray(response.detail)) {
                            const validationErrors = response.detail.map((err) => {
                                const field = Array.isArray(err.loc) ? err.loc.join('.') : 'unknown';
                                return `${field}: ${err.msg}`;
                            }).join(', ');
                            detailedMessage = `Failed to send email (${statusCode}): Validation errors - ${validationErrors}`;
                            // Provide helpful suggestions for common validation errors
                            if (validationErrors.includes('content.encoding is required')) {
                                detailedMessage += '\n\nSuggestion: Add encoding: "utf-8" to your content when using html or text.';
                            }
                            if (validationErrors.includes('List Management') || detailedMessage.includes('list_id')) {
                                detailedMessage += '\n\nSuggestion: This account requires a list_id. Please provide a valid list_id parameter.';
                            }
                        }
                        // Handle simple error messages
                        else if (response.detail && typeof response.detail === 'string') {
                            detailedMessage = `Failed to send email (${statusCode}): ${response.detail}`;
                            // Provide helpful suggestions for common error messages
                            if (response.detail.includes('List Management')) {
                                detailedMessage += '\n\nSuggestion: This account requires a list_id. Please provide a valid list_id parameter.';
                            }
                        }
                        // Handle generic error objects
                        else if (response.message) {
                            detailedMessage = `Failed to send email (${statusCode}): ${response.message}`;
                        }
                        // Handle error field
                        else if (response.error) {
                            detailedMessage = `Failed to send email (${statusCode}): ${response.error}`;
                        }
                        // Fallback to JSON serialization
                        else {
                            try {
                                detailedMessage = `Failed to send email (${statusCode}): ${JSON.stringify(response)}`;
                            }
                            catch {
                                detailedMessage = `Failed to send email (${statusCode}): Error parsing response`;
                            }
                        }
                    }
                }
                if (this.debugMode) {
                    logger.error('[Email API] Detailed error:', {
                        message: errorMessage,
                        error: error,
                        response: error.response,
                        submitRequest: submitRequest
                    });
                }
                throw new EmailAPIError(detailedMessage, 500);
            }
            throw error;
        }
    }
    /**
     * Retrieve a submitted email status
     * Compliant with GET /v2/emails/{email_id} specification
     */
    async getEmail(emailId) {
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
            return response;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new EmailAPIError(`Failed to retrieve email ${emailId}: ${error.message}`, 500, emailId);
            }
            throw error;
        }
    }
    /**
     * Render a submitted email (get HTML/text content)
     */
    async renderEmail(emailId, options = {}) {
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
        }
        catch (error) {
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
    async getEmailLogs(options = {}) {
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
            }
            catch {
                throw new EmailAPIError('tags must be valid JSON', 400);
            }
            queryParams.append('tags', options.tags);
        }
        if (options.providers) {
            // Validate JSON format
            try {
                JSON.parse(options.providers);
            }
            catch {
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
            return response;
        }
        catch (error) {
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
    async getEmailStats(options = {}) {
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
            }
            catch {
                throw new EmailAPIError('providers must be valid JSON', 400);
            }
            queryParams.append('providers', options.providers);
        }
        if (options.tags) {
            // Validate JSON format
            try {
                JSON.parse(options.tags);
            }
            catch {
                throw new EmailAPIError('tags must be valid JSON', 400);
            }
            queryParams.append('tags', options.tags);
        }
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        try {
            const response = await this.makeRequest(`/v2/reports/emails${query}`);
            return response;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new EmailAPIError(`Failed to retrieve email statistics: ${error.message}`, 500);
            }
            throw error;
        }
    }
    /**
     * Helper method to send transactional email
     */
    async sendTransactionalEmail(data) {
        const emailData = { ...data };
        emailData.content.type = 'transactional';
        return this.sendEmail(emailData);
    }
    /**
     * Helper method to send marketing email
     */
    async sendMarketingEmail(data) {
        const emailData = { ...data };
        emailData.content.type = 'marketing';
        return this.sendEmail(emailData);
    }
    /**
     * Helper method to get email status (alias for getEmail)
     */
    async getEmailStatus(emailId) {
        return this.getEmail(emailId);
    }
    /**
     * Bulk email status retrieval
     */
    async getBulkEmailStatus(emailIds) {
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
    createFilter(conditions, operator = 'and') {
        if (!conditions || conditions.length === 0) {
            throw new EmailAPIError('Conditions are required for filter creation', 400);
        }
        const validOperators = ['and', 'or', 'not', 'is'];
        if (!validOperators.includes(operator)) {
            throw new EmailAPIError(`Operator must be one of: ${validOperators.join(', ')}`, 400);
        }
        let filter;
        if (conditions.length === 1 && typeof conditions[0] === 'string') {
            filter = { [operator]: conditions[0] };
        }
        else {
            filter = { [operator]: conditions };
        }
        try {
            return JSON.stringify(filter);
        }
        catch (error) {
            throw new EmailAPIError('Failed to create valid JSON filter', 400);
        }
    }
    /**
     * Helper to create simple tag filters
     */
    createTagFilter(tags, operator = 'or') {
        if (!tags || tags.length === 0) {
            throw new EmailAPIError('Tags array cannot be empty', 400);
        }
        return this.createFilter(tags, operator);
    }
    /**
     * Helper to create provider filters
     */
    createProviderFilter(providers, operator = 'or') {
        if (!providers || providers.length === 0) {
            throw new EmailAPIError('Providers array cannot be empty', 400);
        }
        return this.createFilter(providers, operator);
    }
    /**
     * Create smart filters for common use cases
     */
    createSmartFilter(filterType) {
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
    analyzeEmailLogs(logs) {
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
        const eventBreakdown = {};
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
        const recommendations = [];
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
    async getEmailLogsWithAnalysis(options = {}) {
        const logs = await this.getEmailLogs(options);
        const analysis = this.analyzeEmailLogs(logs);
        return { logs, analysis };
    }
    /**
     * Enhanced email validation
     */
    isValidEmail(email) {
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
//# sourceMappingURL=email-api.js.map