export const emailTools = [
  {
    name: 'cakemail_send_email',
    description: 'Send an email using Cakemail v2 Email API (supports both transactional and marketing emails)',
    inputSchema: {
      type: 'object',
      properties: {
        to_email: { 
          type: 'string', 
          description: 'Recipient email address',
          format: 'email'
        },
        to_name: { 
          type: 'string', 
          description: 'Recipient name (optional)' 
        },
        sender_id: { 
          type: 'string', 
          description: 'Sender ID to use for the email' 
        },
        subject: { 
          type: 'string', 
          description: 'Email subject line' 
        },
        html_content: { 
          type: 'string', 
          description: 'HTML email content (optional if template_id provided)' 
        },
        text_content: { 
          type: 'string', 
          description: 'Plain text email content (optional)' 
        },
        template_id: { 
          type: 'string', 
          description: 'Template ID to use instead of content (optional)' 
        },
        list_id: { 
          type: 'string', 
          description: 'List ID for the email (optional)' 
        },
        email_type: { 
          type: 'string', 
          enum: ['transactional', 'marketing'], 
          description: 'Email type (defaults to transactional)',
          default: 'transactional'
        },
      },
      required: ['to_email', 'sender_id', 'subject'],
    },
  },
  {
    name: 'cakemail_get_email',
    description: 'Retrieve email status and details by email ID',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: {
          type: 'string',
          description: 'UUID of the email to retrieve',
          format: 'uuid'
        }
      },
      required: ['email_id'],
    },
  },
  {
    name: 'cakemail_render_email',
    description: 'Render email content (get HTML/text preview)',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: {
          type: 'string',
          description: 'UUID of the email to render',
          format: 'uuid'
        },
        as_submitted: {
          type: 'boolean',
          description: 'Render the original submitted content',
          default: false
        },
        tracking: {
          type: 'boolean',
          description: 'Enable tracking in rendered content',
          default: false
        }
      },
      required: ['email_id'],
    },
  },
  {
    name: 'cakemail_get_email_logs',
    description: 'Retrieve email activity logs with filtering and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        log_type: {
          type: 'string',
          enum: ['all', 'submitted', 'queued', 'delivered', 'rejected', 'error', 'open', 'click', 'bounce', 'spam', 'unsubscribe', 'global_unsubscribe'],
          description: 'Type of logs to retrieve',
          default: 'all'
        },
        email_id: {
          type: 'string',
          description: 'Filter logs for specific email ID (UUID)',
          format: 'uuid'
        },
        iso_time: {
          type: 'boolean',
          description: 'Convert timestamps to ISO format',
          default: false
        },
        page: {
          type: 'integer',
          minimum: 1,
          description: 'Page number for pagination',
          default: 1
        },
        per_page: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          description: 'Number of logs per page',
          default: 50
        },
        start_time: {
          type: 'integer',
          description: 'Start time as Unix timestamp'
        },
        end_time: {
          type: 'integer',
          description: 'End time as Unix timestamp'
        },
        tags: {
          type: 'string',
          description: 'Tags filter as JSON string (recursive filter syntax)'
        },
        providers: {
          type: 'string',
          description: 'Providers filter as JSON string (recursive filter syntax)'
        },
        sort: {
          type: 'string',
          description: 'Sort field with direction (e.g., "-time", "+id")',
          default: '-time'
        }
      },
      required: [],
    },
  },
  {
    name: 'cakemail_get_email_stats',
    description: 'Retrieve email statistics with time intervals',
    inputSchema: {
      type: 'object',
      properties: {
        interval: {
          type: 'string',
          enum: ['hour', 'day', 'week', 'month'],
          description: 'Time interval for statistics aggregation',
          default: 'day'
        },
        iso_time: {
          type: 'boolean',
          description: 'Convert timestamps to ISO format',
          default: false
        },
        start_time: {
          type: 'integer',
          description: 'Start time as Unix timestamp'
        },
        end_time: {
          type: 'integer',
          description: 'End time as Unix timestamp'
        },
        providers: {
          type: 'string',
          description: 'Providers filter as JSON string (recursive filter syntax)'
        },
        tags: {
          type: 'string',
          description: 'Tags filter as JSON string (recursive filter syntax)'
        }
      },
      required: [],
    },
  },
  {
    name: 'cakemail_send_transactional_email',
    description: 'Send a transactional email (helper for cakemail_send_email with type=transactional)',
    inputSchema: {
      type: 'object',
      properties: {
        to_email: { 
          type: 'string', 
          description: 'Recipient email address',
          format: 'email'
        },
        to_name: { 
          type: 'string', 
          description: 'Recipient name (optional)' 
        },
        sender_id: { 
          type: 'string', 
          description: 'Sender ID to use for the email' 
        },
        subject: { 
          type: 'string', 
          description: 'Email subject line' 
        },
        html_content: { 
          type: 'string', 
          description: 'HTML email content (optional if template_id provided)' 
        },
        text_content: { 
          type: 'string', 
          description: 'Plain text email content (optional)' 
        },
        template_id: { 
          type: 'string', 
          description: 'Template ID to use instead of content (optional)' 
        },
        list_id: { 
          type: 'string', 
          description: 'List ID for the email (optional)' 
        },
      },
      required: ['to_email', 'sender_id', 'subject'],
    },
  },
  {
    name: 'cakemail_send_marketing_email',
    description: 'Send a marketing email (helper for cakemail_send_email with type=marketing)',
    inputSchema: {
      type: 'object',
      properties: {
        to_email: { 
          type: 'string', 
          description: 'Recipient email address',
          format: 'email'
        },
        to_name: { 
          type: 'string', 
          description: 'Recipient name (optional)' 
        },
        sender_id: { 
          type: 'string', 
          description: 'Sender ID to use for the email' 
        },
        subject: { 
          type: 'string', 
          description: 'Email subject line' 
        },
        html_content: { 
          type: 'string', 
          description: 'HTML email content (optional if template_id provided)' 
        },
        text_content: { 
          type: 'string', 
          description: 'Plain text email content (optional)' 
        },
        template_id: { 
          type: 'string', 
          description: 'Template ID to use instead of content (optional)' 
        },
        list_id: { 
          type: 'string', 
          description: 'List ID for the email (optional)' 
        },
      },
      required: ['to_email', 'sender_id', 'subject'],
    },
  },
  {
    name: 'cakemail_get_email_logs_with_analysis',
    description: 'Retrieve email logs with automatic performance analysis and insights',
    inputSchema: {
      type: 'object',
      properties: {
        log_type: {
          type: 'string',
          enum: ['all', 'submitted', 'queued', 'delivered', 'rejected', 'error', 'open', 'click', 'bounce', 'spam', 'unsubscribe', 'global_unsubscribe'],
          description: 'Type of logs to retrieve',
          default: 'all'
        },
        email_id: {
          type: 'string',
          description: 'Filter logs for specific email ID (UUID)',
          format: 'uuid'
        },
        iso_time: {
          type: 'boolean',
          description: 'Convert timestamps to ISO format',
          default: false
        },
        page: {
          type: 'integer',
          minimum: 1,
          description: 'Page number for pagination',
          default: 1
        },
        per_page: {
          type: 'integer',
          minimum: 1,
          maximum: 100,
          description: 'Number of logs per page',
          default: 50
        },
        start_time: {
          type: 'integer',
          description: 'Start time as Unix timestamp'
        },
        end_time: {
          type: 'integer',
          description: 'End time as Unix timestamp'
        },
        tags: {
          type: 'string',
          description: 'Tags filter as JSON string (recursive filter syntax)'
        },
        providers: {
          type: 'string',
          description: 'Providers filter as JSON string (recursive filter syntax)'
        },
        sort: {
          type: 'string',
          description: 'Sort field with direction (e.g., "-time", "+id")',
          default: '-time'
        }
      },
      required: [],
    },
  },
  {
    name: 'cakemail_debug_email_access',
    description: 'Debug email API access and test different access patterns',
    inputSchema: {
      type: 'object',
      properties: {
        email_id: {
          type: 'string',
          description: 'Optional: specific email ID to test access (UUID)',
          format: 'uuid'
        }
      },
      required: [],
    },
  }
];
