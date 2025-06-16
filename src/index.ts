#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import 'dotenv/config';
import { 
  CakemailAPI,
  CakemailError,
  CakemailAuthenticationError,
  CakemailValidationError,
  CakemailBadRequestError,
  CakemailNotFoundError,
  CakemailRateLimitError
} from './cakemail-api.js';

const server = new Server(
  {
    name: 'cakemail-mcp-server',
    version: '1.6.0', // Bump version for Logs API implementation
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize API
const username = process.env.CAKEMAIL_USERNAME;
const password = process.env.CAKEMAIL_PASSWORD;

if (!username || !password) {
  console.error('CAKEMAIL_USERNAME and CAKEMAIL_PASSWORD environment variables are required');
  process.exit(1);
}

const api = new CakemailAPI({ 
  username, 
  password,
  circuitBreaker: { 
    enabled: false,
    failureThreshold: 5,
    resetTimeout: 60000
  }
});

function getErrorMessage(error: unknown): string {
  if (error instanceof CakemailError) {
    return `${error.name}: ${error.message} (Status: ${error.statusCode})`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Enhanced error handler for more detailed error responses
function handleCakemailError(error: unknown) {
  if (error instanceof CakemailValidationError) {
    const fieldErrors = error.validationErrors.map(err => {
      const field = err.loc.join('.');
      return `${field}: ${err.msg}`;
    }).join(', ');
    
    return {
      content: [{
        type: 'text',
        text: `❌ **Validation Error**\\n\\nThe following fields have validation issues:\\n${fieldErrors}\\n\\n**Fix these issues and try again.**`
      }],
      isError: true
    };
  }
  
  if (error instanceof CakemailAuthenticationError) {
    return {
      content: [{
        type: 'text',
        text: `🔐 **Authentication Error**\\n\\n${error.message}\\n\\n**Please check your CAKEMAIL_USERNAME and CAKEMAIL_PASSWORD environment variables.**`
      }],
      isError: true
    };
  }
  
  if (error instanceof CakemailBadRequestError) {
    return {
      content: [{
        type: 'text',
        text: `❌ **Bad Request**\\n\\n${error.detail}\\n\\n**Please check your request parameters and try again.**`
      }],
      isError: true
    };
  }
  
  if (error instanceof CakemailNotFoundError) {
    return {
      content: [{
        type: 'text',
        text: `🔍 **Not Found**\\n\\n${error.message}\\n\\n**The requested resource could not be found. Please verify the ID and try again.**`
      }],
      isError: true
    };
  }
  
  if (error instanceof CakemailRateLimitError) {
    const retryMessage = error.retryAfter 
      ? `Please wait ${error.retryAfter} seconds before trying again.`
      : 'Please wait a moment before trying again.';
      
    return {
      content: [{
        type: 'text',
        text: `⏱️ **Rate Limit Exceeded**\\n\\n${error.message}\\n\\n${retryMessage}`
      }],
      isError: true
    };
  }
  
  if (error instanceof CakemailError) {
    return {
      content: [{
        type: 'text',
        text: `❌ **API Error (${error.statusCode})**\\n\\n${error.message}`
      }],
      isError: true
    };
  }
  
  // Fallback for unknown errors
  return {
    content: [{
      type: 'text',
      text: `❌ **Error**\\n\\n${getErrorMessage(error)}`
    }],
    isError: true
  };
}

// Enhanced validation helpers
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string | boolean): boolean {
  return typeof password === 'string' && password.length >= 8;
}

// List tools handler with expanded functionality including sub-accounts
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Health Check
      {
        name: 'cakemail_health_check',
        description: 'Check API connection and authentication status',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      
      // Sender Management
      {
        name: 'cakemail_get_senders',
        description: 'Get list of verified senders',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'cakemail_create_sender',
        description: 'Create a new sender',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Sender name' },
            email: { type: 'string', description: 'Sender email address' },
            language: { type: 'string', description: 'Sender language (e.g., en_US)' },
          },
          required: ['name', 'email'],
        },
      },
      {
        name: 'cakemail_get_sender',
        description: 'Get details of a specific sender',
        inputSchema: {
          type: 'object',
          properties: {
            sender_id: { type: 'string', description: 'Sender ID to retrieve' },
          },
          required: ['sender_id'],
        },
      },
      {
        name: 'cakemail_update_sender',
        description: 'Update an existing sender',
        inputSchema: {
          type: 'object',
          properties: {
            sender_id: { type: 'string', description: 'Sender ID to update' },
            name: { type: 'string', description: 'Sender name' },
            email: { type: 'string', description: 'Sender email address' },
            language: { type: 'string', description: 'Sender language' },
          },
          required: ['sender_id'],
        },
      },
      {
        name: 'cakemail_delete_sender',
        description: 'Delete a sender',
        inputSchema: {
          type: 'object',
          properties: {
            sender_id: { type: 'string', description: 'Sender ID to delete' },
          },
          required: ['sender_id'],
        },
      },

      // Campaign Management
            {
              name: 'cakemail_list_campaigns',
              description: 'List campaigns with filtering, sorting and pagination',
              inputSchema: {
                type: 'object',
                properties: {
                  page: { type: 'number', description: 'Page number (default: 1)' },
                  per_page: { type: 'number', description: 'Items per page (default: 10, max: 50)' },
                  status: { type: 'string', description: 'Filter by campaign status' },
                  name: { type: 'string', description: 'Filter by campaign name' },
                  type: { type: 'string', description: 'Filter by campaign type' },
                  list_id: { type: 'string', description: 'Filter by list ID' },
                  sort: { type: 'string', enum: ['name', 'created_on', 'scheduled_for', 'scheduled_on', 'updated_on', 'type'], description: 'Sort field (default: created_on)' },
                  order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction (default: desc)' },
                  with_count: { type: 'boolean', description: 'Include total count in response' },
                  account_id: { type: 'number', description: 'Account ID for scoped access' },
                },
                required: [],
              },
            },
            {
              name: 'cakemail_get_latest_campaigns',
              description: 'Get the latest campaigns (shortcut for recent campaigns)',
              inputSchema: {
                type: 'object',
                properties: {
                  count: { type: 'number', description: 'Number of latest campaigns to retrieve (default: 10, max: 50)' },
                  status: { type: 'string', description: 'Filter by status (optional)' },
                },
                required: [],
              },
            },
            {
              name: 'cakemail_get_campaign',
              description: 'Get details of a specific campaign',
              inputSchema: {
                type: 'object',
                properties: {
                  campaign_id: { type: 'string', description: 'Campaign ID to retrieve' },
                },
                required: ['campaign_id'],
              },
            },
            {
              name: 'cakemail_create_campaign',
              description: 'Create a new email campaign',
              inputSchema: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Campaign name' },
                  subject: { type: 'string', description: 'Email subject line' },
                  html_content: { type: 'string', description: 'HTML email content' },
                  text_content: { type: 'string', description: 'Plain text email content' },
                  list_id: { type: 'string', description: 'List ID to send to' },
                  sender_id: { type: 'string', description: 'Sender ID to use' },
                  from_name: { type: 'string', description: 'From name (optional)' },
                  reply_to: { type: 'string', description: 'Reply-to email address (optional)' },
                },
                required: ['name', 'subject', 'list_id', 'sender_id'],
              },
            },
            {
              name: 'cakemail_update_campaign',
              description: 'Update an existing campaign',
              inputSchema: {
                type: 'object',
                properties: {
                  campaign_id: { type: 'string', description: 'Campaign ID to update' },
                  name: { type: 'string', description: 'Campaign name' },
                  subject: { type: 'string', description: 'Email subject line' },
                  html_content: { type: 'string', description: 'HTML email content' },
                  text_content: { type: 'string', description: 'Plain text email content' },
                  from_name: { type: 'string', description: 'From name' },
                  reply_to: { type: 'string', description: 'Reply-to email address' },
                },
                required: ['campaign_id'],
              },
            },
            {
              name: 'cakemail_send_campaign',
              description: 'Send or schedule a campaign for delivery',
              inputSchema: {
                type: 'object',
                properties: {
                  campaign_id: { type: 'string', description: 'Campaign ID to send' },
                },
                required: ['campaign_id'],
              },
            },
            {
              name: 'cakemail_delete_campaign',
              description: 'Delete a campaign (permanent action)',
              inputSchema: {
                type: 'object',
                properties: {
                  campaign_id: { type: 'string', description: 'Campaign ID to delete' },
                },
                required: ['campaign_id'],
              },
            },
            {
              name: 'cakemail_debug_campaign_access',
              description: 'Debug campaign access and test different access patterns',
              inputSchema: {
                type: 'object',
                properties: {
                  campaign_id: { type: 'string', description: 'Optional: specific campaign ID to test access' },
                },
                required: [],
              },
            },

            // Sub-Account Management (Enterprise/Agency Features)
      {
        name: 'cakemail_list_sub_accounts',
        description: 'List all sub-accounts with filtering and pagination (Enterprise feature)',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
            status: { type: 'string', enum: ['pending', 'active', 'suspended', 'inactive'], description: 'Filter by account status' },
            name: { type: 'string', description: 'Filter by account name (partial match)' },
            recursive: { type: 'boolean', description: 'Include sub-accounts of sub-accounts' },
            partner_account_id: { type: 'number', description: 'Filter by partner account ID' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_create_sub_account',
        description: 'Create a new sub-account (Enterprise feature)',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Account holder name' },
            email: { type: 'string', description: 'Account email address' },
            password: { type: 'string', description: 'Account password (minimum 8 characters)' },
            company: { type: 'string', description: 'Company name' },
            language: { type: 'string', description: 'Account language (e.g., en_US)' },
            timezone: { type: 'string', description: 'Account timezone' },
            country: { type: 'string', description: 'Country code' },
            phone: { type: 'string', description: 'Phone number' },
            website: { type: 'string', description: 'Website URL' },
            description: { type: 'string', description: 'Account description' },
            partner_account_id: { type: 'number', description: 'Partner account ID' },
            skip_verification: { type: 'boolean', description: 'Skip email verification (default: false)' },
          },
          required: ['name', 'email', 'password'],
        },
      },
      {
        name: 'cakemail_get_sub_account',
        description: 'Get details of a specific sub-account',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string', description: 'Sub-account ID to retrieve' },
          },
          required: ['account_id'],
        },
      },
      {
        name: 'cakemail_update_sub_account',
        description: 'Update a sub-account',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string', description: 'Sub-account ID to update' },
            name: { type: 'string', description: 'Account holder name' },
            email: { type: 'string', description: 'Account email address' },
            company: { type: 'string', description: 'Company name' },
            language: { type: 'string', description: 'Account language' },
            timezone: { type: 'string', description: 'Account timezone' },
            country: { type: 'string', description: 'Country code' },
            phone: { type: 'string', description: 'Phone number' },
            website: { type: 'string', description: 'Website URL' },
            description: { type: 'string', description: 'Account description' },
          },
          required: ['account_id'],
        },
      },
      {
        name: 'cakemail_delete_sub_account',
        description: 'Delete a sub-account (permanent action)',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string', description: 'Sub-account ID to delete' },
          },
          required: ['account_id'],
        },
      },
      {
        name: 'cakemail_suspend_sub_account',
        description: 'Suspend a sub-account (temporary disable)',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string', description: 'Sub-account ID to suspend' },
          },
          required: ['account_id'],
        },
      },
      {
        name: 'cakemail_unsuspend_sub_account',
        description: 'Unsuspend a sub-account (re-enable)',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string', description: 'Sub-account ID to unsuspend' },
          },
          required: ['account_id'],
        },
      },
      {
        name: 'cakemail_confirm_sub_account',
        description: 'Confirm sub-account creation with verification code',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string', description: 'Sub-account ID to confirm' },
            confirmation_code: { type: 'string', description: 'Email verification code' },
            password: { type: 'string', description: 'New password (optional)' },
          },
          required: ['account_id', 'confirmation_code'],
        },
      },
      {
        name: 'cakemail_resend_verification_email',
        description: 'Resend verification email for account creation',
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', description: 'Email address to resend verification to' },
          },
          required: ['email'],
        },
      },
      {
        name: 'cakemail_convert_sub_account_to_organization',
        description: 'Convert a sub-account to an organization',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string', description: 'Sub-account ID to convert' },
            migrate_owner: { type: 'boolean', description: 'Migrate owner (default: true)' },
          },
          required: ['account_id'],
        },
      },
      {
        name: 'cakemail_get_latest_sub_account',
        description: 'Get the most recently created sub-account',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'cakemail_search_sub_accounts_by_name',
        description: 'Search sub-accounts by name',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name to search for (partial match)' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50)' },
          },
          required: ['name'],
        },
      },
      {
        name: 'cakemail_get_sub_accounts_by_status',
        description: 'Get sub-accounts filtered by status',
        inputSchema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['pending', 'active', 'suspended', 'inactive'], description: 'Account status to filter by' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50)' },
          },
          required: ['status'],
        },
      },
      {
        name: 'cakemail_debug_sub_account_access',
        description: 'Debug sub-account access and permissions',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string', description: 'Optional: specific account ID to test access' },
          },
          required: [],
        },
      },

      // Email API (updated naming and description)
      {
        name: 'cakemail_send_email',
        description: 'Send an email using Cakemail Email API (supports both transactional and marketing emails)',
        inputSchema: {
          type: 'object',
          properties: {
            to_email: { type: 'string', description: 'Recipient email address' },
            to_name: { type: 'string', description: 'Recipient name' },
            sender_id: { type: 'string', description: 'Sender ID to use' },
            subject: { type: 'string', description: 'Email subject' },
            html_content: { type: 'string', description: 'HTML email content' },
            text_content: { type: 'string', description: 'Plain text email content' },
            template_id: { type: 'string', description: 'Template ID to use' },
            list_id: { type: 'string', description: 'List ID (optional - will auto-select if not provided)' },
            email_type: { type: 'string', enum: ['transactional', 'marketing'], description: 'Email type (defaults to transactional)' },
          },
          required: ['to_email', 'sender_id', 'subject'],
        },
      },

      // Account Management
      {
        name: 'cakemail_get_self_account',
        description: 'Get current account details',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },

      // Retry Management
      {
        name: 'cakemail_get_retry_config',
        description: 'Get current retry configuration',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },

      // Reports and Analytics
      {
        name: 'cakemail_get_campaign_stats',
        description: 'Get detailed campaign performance statistics and analytics',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', description: 'Campaign ID to get stats for' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
          },
          required: ['campaign_id'],
        },
      },
      {
        name: 'cakemail_get_campaign_links_stats',
        description: 'Get campaign link click statistics and performance data',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', description: 'Campaign ID to get link stats for' },
            start_time: { type: 'number', description: 'Start time for the report (Unix timestamp)' },
            end_time: { type: 'number', description: 'End time for the report (Unix timestamp)' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
            sort: { type: 'string', enum: ['unique', 'total', 'link'], description: 'Sort field' },
            order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction' },
          },
          required: ['campaign_id'],
        },
      },
      {
        name: 'cakemail_get_email_stats',
        description: 'Get transactional email statistics for a time period',
        inputSchema: {
          type: 'object',
          properties: {
            start_time: { type: 'number', description: 'Start time for the report (Unix timestamp)' },
            end_time: { type: 'number', description: 'End time for the report (Unix timestamp)' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
          },
          required: ['start_time', 'end_time'],
        },
      },
      {
        name: 'cakemail_get_list_stats',
        description: 'Get contact list statistics and performance metrics',
        inputSchema: {
          type: 'object',
          properties: {
            list_id: { type: 'string', description: 'List ID to get stats for' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
          },
          required: ['list_id'],
        },
      },
      {
        name: 'cakemail_get_account_stats',
        description: 'Get account-wide statistics and performance overview',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'string', description: 'Account ID to get stats for (omit for self account)' },
            start_time: { type: 'number', description: 'Start time for the report (Unix timestamp)' },
            end_time: { type: 'number', description: 'End time for the report (Unix timestamp)' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_get_campaign_performance_summary',
        description: 'Get comprehensive campaign performance summary with stats and links data',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', description: 'Campaign ID to get performance summary for' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
          },
          required: ['campaign_id'],
        },
      },
      {
        name: 'cakemail_get_account_performance_overview',
        description: 'Get account performance overview with key metrics',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'number', description: 'Account ID (omit for self account)' },
            start_time: { type: 'number', description: 'Start time for the report (Unix timestamp)' },
            end_time: { type: 'number', description: 'End time for the report (Unix timestamp)' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_list_campaign_reports_exports',
        description: 'List all campaign reports exports with filtering options',
        inputSchema: {
          type: 'object',
          properties: {
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            page: { type: 'number', description: 'Page number (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
            status: { type: 'string', description: 'Filter by export status' },
            progress: { type: 'string', description: 'Filter by export progress' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_create_campaign_reports_export',
        description: 'Create a new campaign reports export for download',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_ids: { type: 'array', items: { type: 'string' }, description: 'List of campaign IDs to export' },
            format: { type: 'string', enum: ['csv', 'xlsx'], description: 'Export format (default: csv)' },
            description: { type: 'string', description: 'Optional description for the export' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
          },
          required: ['campaign_ids'],
        },
      },
      {
        name: 'cakemail_get_campaign_reports_export',
        description: 'Get details of a specific campaign reports export',
        inputSchema: {
          type: 'object',
          properties: {
            export_id: { type: 'string', description: 'Export ID to retrieve' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
          },
          required: ['export_id'],
        },
      },
      {
        name: 'cakemail_download_campaign_reports_export',
        description: 'Get download URL for a campaign reports export',
        inputSchema: {
          type: 'object',
          properties: {
            export_id: { type: 'string', description: 'Export ID to download' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
          },
          required: ['export_id'],
        },
      },
      {
        name: 'cakemail_delete_campaign_reports_export',
        description: 'Delete a campaign reports export',
        inputSchema: {
          type: 'object',
          properties: {
            export_id: { type: 'string', description: 'Export ID to delete' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
          },
          required: ['export_id'],
        },
      },
      {
        name: 'cakemail_debug_reports_access',
        description: 'Debug reports API access and test functionality',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', description: 'Optional campaign ID to test campaign reports access' },
          },
          required: [],
        },
      },

      // Logs API
      {
        name: 'cakemail_get_campaign_logs',
        description: 'Get detailed campaign logs with intelligent event categorization and smart filtering. ' +
                    'EVENT CATEGORIES: ' +
                    'ENGAGEMENT (click, open, view, forward, share) - user interactions; ' +
                    'BOUNCES (bounce_hb=hard, bounce_sb=soft, bounce_mb=blocked, bounce_df=DNS, bounce_fm=full, bounce_tr=transient, bounce_cr=challenge, bounce_ac=address_change, bounce_ar=auto_reply) - delivery failures; ' +
                    'LIST_MANAGEMENT (subscribe, unsubscribe, global_unsubscribe) - list changes; ' +
                    'DELIVERABILITY_ISSUES (spam, auto_responder) - reputation threats; ' +
                    'DELIVERY_PIPELINE (generating, in_queue, sent, received, skipped) - processing status. ' +
                    'SMART FILTERS: engagement="type==click;type==open;type==view", critical_issues="type==spam;type==bounce_hb;type==bounce_mb", temporary_failures="type==bounce_sb;type==bounce_df;type==bounce_fm", list_cleanup="type==bounce_hb;type==spam;type==global_unsubscribe"',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', description: 'Campaign ID to get logs for' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            page: { type: 'number', description: 'Page number for pagination (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
            with_count: { type: 'boolean', description: 'Include total count in response' },
            sort: { type: 'string', description: 'Sort field for results' },
            order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction' },
            cursor: { type: 'string', description: 'Pagination cursor for large result sets' },
            filter: { type: 'string', description: 'Smart filter using syntax: term==value;term2==value2. SMART EXAMPLES: "type==click;type==open" (engagement), "type==bounce_hb;type==spam" (critical issues), "type==bounce_sb;type==bounce_fm" (temporary failures). Available terms: additional_info, link_id, contact_id, email, uniques, group_by_contact, log_id, totals, type' },
            type: { type: 'string', description: 'Filter by single log type (use filter parameter for multiple types). Examples: click, open, bounce_hb, bounce_sb, spam, unsubscribe' },
            start_time: { type: 'number', description: 'Start time for log filtering (Unix timestamp)' },
            end_time: { type: 'number', description: 'End time for log filtering (Unix timestamp)' },
          },
          required: ['campaign_id'],
        },
      },
      {
        name: 'cakemail_get_workflow_action_logs',
        description: 'Get logs for specific workflow actions in automation',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: { type: 'string', description: 'Workflow ID to get action logs for' },
            action_id: { type: 'string', description: 'Action ID within the workflow' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            page: { type: 'number', description: 'Page number for pagination (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
            with_count: { type: 'boolean', description: 'Include total count in response' },
            filter: { type: 'string', description: 'Filter using syntax: term==value;term2==value2 (terms: additional_info, link_id, contact_id, email, log_id, track_id, type, group_by_contact)' },
            start_time: { type: 'number', description: 'Start time for log filtering (Unix timestamp)' },
            end_time: { type: 'number', description: 'End time for log filtering (Unix timestamp)' },
          },
          required: ['workflow_id', 'action_id'],
        },
      },
      {
        name: 'cakemail_get_workflow_logs',
        description: 'Get complete workflow logs for automation tracking',
        inputSchema: {
          type: 'object',
          properties: {
            workflow_id: { type: 'string', description: 'Workflow ID to get logs for' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            page: { type: 'number', description: 'Page number for pagination (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
            with_count: { type: 'boolean', description: 'Include total count in response' },
            sort: { type: 'string', description: 'Sort field for results' },
            order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction' },
            filter: { type: 'string', description: 'Filter using syntax: term==value;term2==value2 (terms: additional_info, link_id, contact_id, email, log_id, track_id, type, group_by_contact)' },
            start_time: { type: 'number', description: 'Start time for log filtering (Unix timestamp)' },
            end_time: { type: 'number', description: 'End time for log filtering (Unix timestamp)' },
          },
          required: ['workflow_id'],
        },
      },
      {
        name: 'cakemail_get_transactional_email_logs',
        description: 'Get transactional email logs and delivery tracking',
        inputSchema: {
          type: 'object',
          properties: {
            log_type: { type: 'string', description: 'Required log type parameter' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            page: { type: 'number', description: 'Page number for pagination (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
            with_count: { type: 'boolean', description: 'Include total count in response' },
            sort: { type: 'string', description: 'Sort field for results' },
            order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction' },
            filter: { type: 'string', description: 'Filter using syntax: term==value;term2==value2 (terms: group_id, email, email_id)' },
            start_time: { type: 'number', description: 'Start time for log filtering (Unix timestamp)' },
            end_time: { type: 'number', description: 'End time for log filtering (Unix timestamp)' },
            email_id: { type: 'string', description: 'Filter by specific email ID (deprecated: use filter=email_id==value instead)' },
            sender_id: { type: 'string', description: 'Filter by sender ID' },
            status: { type: 'string', description: 'Filter by delivery status' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_get_list_logs',
        description: 'Get contact list logs and activity tracking',
        inputSchema: {
          type: 'object',
          properties: {
            list_id: { type: 'string', description: 'List ID to get logs for' },
            account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            page: { type: 'number', description: 'Page number for pagination (default: 1)' },
            per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
            with_count: { type: 'boolean', description: 'Include total count in response' },
            filter: { type: 'string', description: 'Filter using syntax: term==value;term2==value2 (terms: additional_info, contact_id, email, uniques, group_by_contact, track_id, log_id, start_id, end_id, totals, type)' },
            start_time: { type: 'number', description: 'Start time for log filtering (Unix timestamp)' },
            end_time: { type: 'number', description: 'End time for log filtering (Unix timestamp)' },
          },
          required: ['list_id'],
        },
      },
      {
        name: 'cakemail_debug_logs_access',
        description: 'Debug logs API access and test different log endpoints',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', description: 'Optional: specific campaign ID to test logs access' },
            workflow_id: { type: 'string', description: 'Optional: specific workflow ID to test logs access' },
          },
          required: [],
        },
      },
    ],
  };
});

// Call tool handler with sub-account support
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'cakemail_health_check': {
        const health = await api.healthCheck();
        return {
          content: [
            {
              type: 'text',
              text: `Health Status: ${JSON.stringify(health, null, 2)}`,
            },
          ],
        };
      }

      // Sender Management
      case 'cakemail_get_senders': {
        const senders = await api.getSenders();
        return {
          content: [
            {
              type: 'text',
              text: `Senders: ${JSON.stringify(senders, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_create_sender': {
        const { name: senderName, email, language } = args as {
          name: string;
          email: string;
          language?: string;
        };
        
        if (!validateEmail(email)) {
          throw new Error('Invalid email format');
        }
        
        const sender = await api.createSender({
          name: senderName,
          email,
          language: language || 'en_US',
        });
        return {
          content: [
            {
              type: 'text',
              text: `Sender created successfully: ${JSON.stringify(sender, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_sender': {
        const { sender_id } = args as { sender_id: string };
        const sender = await api.getSender(sender_id);
        return {
          content: [
            {
              type: 'text',
              text: `Sender details: ${JSON.stringify(sender, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_update_sender': {
        const { sender_id, name: senderName, email, language } = args as {
          sender_id: string;
          name?: string;
          email?: string;
          language?: string;
        };
        
        if (email && !validateEmail(email)) {
          throw new Error('Invalid email format');
        }
        
        const updateData: any = {};
        if (senderName) updateData.name = senderName;
        if (email) updateData.email = email;
        if (language) updateData.language = language;
        
        const sender = await api.updateSender(sender_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: `Sender updated successfully: ${JSON.stringify(sender, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_delete_sender': {
        const { sender_id } = args as { sender_id: string };
        await api.deleteSender(sender_id);
        return {
          content: [
            {
              type: 'text',
              text: `Sender ${sender_id} deleted successfully`,
            },
          ],
        };
      }

      // Campaign Management
      case 'cakemail_list_campaigns': {
        const { 
          page, per_page, status, name, type, list_id, sort, order, with_count, account_id 
        } = args as {
          page?: number;
          per_page?: number;
          status?: string;
          name?: string;
          type?: string;
          list_id?: string;
          sort?: string;
          order?: string;
          with_count?: boolean;
          account_id?: number;
        };
        
        const campaigns = await api.getCampaigns({
          page: page || 1,
          per_page: per_page || 10,
          status,
          name,
          type,
          list_id,
          sort: sort || 'created_on',
          order: order || 'desc',
          with_count: with_count !== false,
          account_id
        });

        const total = campaigns.pagination?.count || 0;
        const campaignList = campaigns.data?.slice(0, 20).map((campaign) => ({
          id: campaign.id,
          name: campaign.name,
          subject: campaign.subject,
          status: campaign.status,
          type: campaign.type,
          created_on: campaign.created_on,
          updated_on: campaign.updated_on
        }));

        return {
          content: [
            {
              type: 'text',
              text: `📧 **Campaigns (${total} total)**\n\n` +
                    `**Applied Filters:**\n` +
                    `• Status: ${status || 'all'}\n` +
                    `• Name Filter: ${name || 'none'}\n` +
                    `• Type: ${type || 'all'}\n` +
                    `• List ID: ${list_id || 'none'}\n` +
                    `• Sort: ${sort || 'created_on'} (${order || 'desc'})\n\n` +
                    `**Showing ${campaignList?.length || 0} campaigns:**\n\n` +
                    (campaignList?.map((camp, i) => 
                      `${i + 1}. **${camp.name}** (${camp.id})\n` +
                      `   📋 Subject: ${camp.subject || 'N/A'}\n` +
                      `   🏷️ Status: ${camp.status || 'N/A'}\n` +
                      `   📂 Type: ${camp.type || 'N/A'}\n` +
                      `   📅 Created: ${camp.created_on || 'N/A'}\n` +
                      `   🔄 Updated: ${camp.updated_on || 'N/A'}`
                    ).join('\n\n') || 'No campaigns found.') +
                    (total > 20 ? `\n\n**... and ${total - 20} more campaigns**` : '') +
                    `\n\n**Full Response:**\n${JSON.stringify(campaigns, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_latest_campaigns': {
        const { count, status } = args as {
          count?: number;
          status?: string;
        };
        
        const campaigns = await api.getCampaigns({
          page: 1,
          per_page: Math.min(count || 10, 50),
          sort: 'created_on',
          order: 'desc',
          status,
          with_count: true
        });

        const total = campaigns.pagination?.count || 0;
        const latestCampaigns = campaigns.data?.map((campaign) => ({
          id: campaign.id,
          name: campaign.name,
          subject: campaign.subject,
          status: campaign.status,
          type: campaign.type,
          created_on: campaign.created_on
        }));

        return {
          content: [
            {
              type: 'text',
              text: `📧 **Latest ${count || 10} Campaigns**\n\n` +
                    `**Total Campaigns:** ${total}\n` +
                    `**Status Filter:** ${status || 'all'}\n\n` +
                    (latestCampaigns?.map((camp, i) => 
                      `${i + 1}. **${camp.name}** (${camp.id})\n` +
                      `   📋 Subject: ${camp.subject || 'N/A'}\n` +
                      `   🏷️ Status: ${camp.status || 'N/A'}\n` +
                      `   📂 Type: ${camp.type || 'N/A'}\n` +
                      `   📅 Created: ${camp.created_on || 'N/A'}`
                    ).join('\n\n') || 'No campaigns found.') +
                    `\n\n**Full Response:**\n${JSON.stringify(campaigns, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_campaign': {
        const { campaign_id } = args as { campaign_id: string };
        const campaign = await api.getCampaign(campaign_id);

        return {
          content: [
            {
              type: 'text',
              text: `📧 **Campaign Details**\n\n` +
                    `**Campaign ID:** ${campaign.data.id}\n` +
                    `**Name:** ${campaign.data.name}\n` +
                    `**Subject:** ${campaign.data.subject || 'N/A'}\n` +
                    `**Status:** ${campaign.data.status || 'N/A'}\n` +
                    `**Type:** ${campaign.data.type || 'N/A'}\n` +
                    `**From Name:** ${campaign.data.from_name || 'N/A'}\n` +
                    `**Reply To:** ${campaign.data.reply_to || 'N/A'}\n` +
                    `**List ID:** ${campaign.data.list_id || 'N/A'}\n` +
                    `**Sender ID:** ${campaign.data.sender_id || 'N/A'}\n` +
                    `**Created:** ${campaign.data.created_on || 'N/A'}\n` +
                    `**Updated:** ${campaign.data.updated_on || 'N/A'}\n` +
                    `**Scheduled For:** ${campaign.data.scheduled_for || 'N/A'}\n\n` +
                    `**Full Response:**\n${JSON.stringify(campaign, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_create_campaign': {
        const { 
          name, subject, html_content, text_content, list_id, sender_id, from_name, reply_to 
        } = args as {
          name: string;
          subject: string;
          html_content?: string;
          text_content?: string;
          list_id: string;
          sender_id: string;
          from_name?: string;
          reply_to?: string;
        };
        
        if (!html_content && !text_content) {
          throw new Error('Either html_content or text_content must be provided');
        }
        
        const campaign = await api.createCampaign({
          name,
          subject,
          html_content,
          text_content,
          list_id,
          sender_id,
          from_name,
          reply_to
        });

        return {
          content: [
            {
              type: 'text',
              text: `📧 **Campaign Created Successfully!**\n\n` +
                    `✅ **Campaign ID:** ${campaign.data.id}\n` +
                    `✅ **Name:** ${campaign.data.name}\n` +
                    `✅ **Subject:** ${campaign.data.subject}\n` +
                    `✅ **Status:** ${campaign.data.status || 'draft'}\n` +
                    `✅ **List ID:** ${campaign.data.list_id}\n` +
                    `✅ **Sender ID:** ${campaign.data.sender_id}\n` +
                    `✅ **Created:** ${campaign.data.created_on}\n\n` +
                    `**Next Steps:** Use cakemail_send_campaign to send this campaign.\n\n` +
                    `**Full Response:**\n${JSON.stringify(campaign, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_update_campaign': {
        const { 
          campaign_id, name, subject, html_content, text_content, from_name, reply_to 
        } = args as {
          campaign_id: string;
          name?: string;
          subject?: string;
          html_content?: string;
          text_content?: string;
          from_name?: string;
          reply_to?: string;
        };
        
        const updateData: any = {};
        if (name) updateData.name = name;
        if (subject) updateData.subject = subject;
        if (html_content) updateData.html_content = html_content;
        if (text_content) updateData.text_content = text_content;
        if (from_name) updateData.from_name = from_name;
        if (reply_to) updateData.reply_to = reply_to;
        
        const campaign = await api.updateCampaign(campaign_id, updateData);

        return {
          content: [
            {
              type: 'text',
              text: `📧 **Campaign Updated Successfully!**\n\n` +
                    `✅ **Campaign ID:** ${campaign.data.id}\n` +
                    `✅ **Name:** ${campaign.data.name}\n` +
                    `✅ **Subject:** ${campaign.data.subject}\n` +
                    `✅ **Status:** ${campaign.data.status}\n` +
                    `✅ **Updated:** ${campaign.data.updated_on}\n\n` +
                    `**Updated Fields:** ${Object.keys(updateData).join(', ')}\n\n` +
                    `**Full Response:**\n${JSON.stringify(campaign, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_send_campaign': {
        const { campaign_id } = args as { campaign_id: string };
        const result = await api.sendCampaign(campaign_id);

        return {
          content: [
            {
              type: 'text',
              text: `🚀 **Campaign Sent Successfully!**\n\n` +
                    `✅ **Campaign ID:** ${campaign_id}\n` +
                    `✅ **Status:** ${result.success ? 'Sent/Scheduled' : 'Failed'}\n` +
                    `✅ **Response Code:** ${result.status}\n\n` +
                    `The campaign has been queued for delivery.\n\n` +
                    `**Full Response:**\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_delete_campaign': {
        const { campaign_id } = args as { campaign_id: string };
        const result = await api.deleteCampaign(campaign_id);

        return {
          content: [
            {
              type: 'text',
              text: `🗑️ **Campaign Deleted Successfully**\n\n` +
                    `✅ **Campaign ID:** ${campaign_id}\n` +
                    `✅ **Deleted:** Yes\n\n` +
                    `⚠️ **This action is permanent and cannot be undone.**\n\n` +
                    `**Full Response:**\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_debug_campaign_access': {
        const { campaign_id } = args as { campaign_id?: string };
        const debug = await api.debugCampaignAccess(campaign_id);

        return {
          content: [
            {
              type: 'text',
              text: `🔍 **Campaign Access Debug**\n\n` +
                    `**Test Results:**\n\n` +
                    debug.tests.map((test, i) => 
                      `${i + 1}. **${test.test}**\n` +
                      `   ${test.success ? '✅ Success' : '❌ Failed'}\n` +
                      (test.success 
                        ? `   📊 Campaign Count: ${test.campaignCount || 0}\n` +
                          `   🆔 First Campaign: ${test.firstCampaignId || 'None'}\n` +
                          (test.accountId ? `   🏢 Account ID: ${test.accountId}\n` : '')
                        : `   ❌ Error: ${test.error}\n`)
                    ).join('\n') +
                    `\n**Full Debug Info:**\n${JSON.stringify(debug, null, 2)}`,
            },
          ],
        };
      }

      // Sub-Account Management
      case 'cakemail_list_sub_accounts': {
        const { page, per_page, status, name, recursive, partner_account_id } = args as {
          page?: number;
          per_page?: number;
          status?: string;
          name?: string;
          recursive?: boolean;
          partner_account_id?: number;
        };

        const accounts = await api.listSubAccounts({
          partner_account_id,
          recursive,
          filters: { status: status as any, name },
          pagination: { page, per_page, with_count: true },
          sort: { sort: 'created_on', order: 'desc' }
        });

        const total = accounts.pagination?.count || 0;
        const displayAccounts = accounts.data?.slice(0, 10).map(acc => ({
          id: acc.id,
          name: acc.name,
          email: acc.email,
          status: acc.status,
          company: acc.company,
          created_on: acc.created_on
        }));

        return {
          content: [
            {
              type: 'text',
              text: `🏢 **Sub-Accounts (${total} total)**\\n\\n` +
                    `**Applied Filters:**\\n` +
                    `• Status: ${status || 'all'}\\n` +
                    `• Name Filter: ${name || 'none'}\\n` +
                    `• Recursive: ${recursive ? 'yes' : 'no'}\\n` +
                    `• Partner Account: ${partner_account_id || 'none'}\\n\\n` +
                    `**Showing ${displayAccounts?.length || 0} accounts:**\\n\\n` +
                    (displayAccounts?.map((acc, i) => 
                      `${i + 1}. **${acc.name}** (${acc.id})\\n` +
                      `   📧 ${acc.email}\\n` +
                      `   🏷️ Status: ${acc.status}\\n` +
                      `   🏢 Company: ${acc.company || 'N/A'}\\n` +
                      `   📅 Created: ${acc.created_on || 'N/A'}`
                    ).join('\\n\\n') || 'No accounts found.') +
                    (total > 10 ? `\\n\\n**... and ${total - 10} more accounts**` : '') +
                    `\\n\\n**Full Response:**\\n${JSON.stringify(accounts, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_create_sub_account': {
        const { 
          name, email, password, company, language, timezone, country, 
          phone, website, description, partner_account_id, skip_verification 
        } = args as {
          name: string;
          email: string;
          password: string;
          company?: string;
          language?: string;
          timezone?: string;
          country?: string;
          phone?: string;
          website?: string;
          description?: string;
          partner_account_id?: number;
          skip_verification?: boolean;
        };

        if (!validateEmail(email)) {
          throw new Error('Invalid email format');
        }

        if (!validatePassword(password)) {
          throw new Error('Password must be at least 8 characters long');
        }

        const account = await api.createSubAccount({
          name,
          email,
          password,
          company,
          language: language || 'en_US',
          timezone,
          country,
          phone,
          website,
          description
        }, {
          partner_account_id,
          skip_verification: skip_verification || false
        });

        return {
          content: [
            {
              type: 'text',
              text: `🏢 **Sub-Account Created Successfully!**\\n\\n` +
                    `✅ **Account ID:** ${account.data.id}\\n` +
                    `✅ **Name:** ${account.data.name}\\n` +
                    `✅ **Email:** ${account.data.email}\\n` +
                    `✅ **Status:** ${account.data.status}\\n` +
                    `✅ **Company:** ${account.data.company || 'N/A'}\\n` +
                    `✅ **Language:** ${account.data.language || 'N/A'}\\n` +
                    `${skip_verification ? '✅ **Verification:** Skipped\\n' : '⏳ **Verification:** Email sent\\n'}` +
                    `\\n**Full Response:**\\n${JSON.stringify(account, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_sub_account': {
        const { account_id } = args as { account_id: string };
        const account = await api.getSubAccount(account_id);

        return {
          content: [
            {
              type: 'text',
              text: `🏢 **Sub-Account Details**\\n\\n` +
                    `**Account ID:** ${account.data.id}\\n` +
                    `**Name:** ${account.data.name}\\n` +
                    `**Email:** ${account.data.email}\\n` +
                    `**Status:** ${account.data.status}\\n` +
                    `**Type:** ${account.data.type || 'N/A'}\\n` +
                    `**Company:** ${account.data.company || 'N/A'}\\n` +
                    `**Language:** ${account.data.language || 'N/A'}\\n` +
                    `**Timezone:** ${account.data.timezone || 'N/A'}\\n` +
                    `**Country:** ${account.data.country || 'N/A'}\\n` +
                    `**Phone:** ${account.data.phone || 'N/A'}\\n` +
                    `**Website:** ${account.data.website || 'N/A'}\\n` +
                    `**Verified:** ${account.data.verified ? 'Yes' : 'No'}\\n` +
                    `**Created:** ${account.data.created_on || 'N/A'}\\n` +
                    `**Updated:** ${account.data.updated_on || 'N/A'}\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(account, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_update_sub_account': {
        const { account_id, name, email, company, language, timezone, country, phone, website, description } = args as {
          account_id: string;
          name?: string;
          email?: string;
          company?: string;
          language?: string;
          timezone?: string;
          country?: string;
          phone?: string;
          website?: string;
          description?: string;
        };

        if (email && !validateEmail(email)) {
          throw new Error('Invalid email format');
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (company) updateData.company = company;
        if (language) updateData.language = language;
        if (timezone) updateData.timezone = timezone;
        if (country) updateData.country = country;
        if (phone) updateData.phone = phone;
        if (website) updateData.website = website;
        if (description) updateData.description = description;

        const account = await api.updateSubAccount(account_id, updateData);

        return {
          content: [
            {
              type: 'text',
              text: `🏢 **Sub-Account Updated Successfully!**\\n\\n` +
                    `✅ **Account ID:** ${account.data.id}\\n` +
                    `✅ **Name:** ${account.data.name}\\n` +
                    `✅ **Email:** ${account.data.email}\\n` +
                    `✅ **Status:** ${account.data.status}\\n` +
                    `✅ **Company:** ${account.data.company || 'N/A'}\\n` +
                    `\\n**Updated Fields:** ${Object.keys(updateData).join(', ')}\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(account, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_delete_sub_account': {
        const { account_id } = args as { account_id: string };
        const result = await api.deleteSubAccount(account_id);

        return {
          content: [
            {
              type: 'text',
              text: `🗑️ **Sub-Account Deleted Successfully**\\n\\n` +
                    `✅ **Account ID:** ${result.data.id}\\n` +
                    `✅ **Deleted:** ${result.data.deleted ? 'Yes' : 'No'}\\n\\n` +
                    `⚠️ **This action is permanent and cannot be undone.**\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_suspend_sub_account': {
        const { account_id } = args as { account_id: string };
        const result = await api.suspendSubAccount(account_id);

        return {
          content: [
            {
              type: 'text',
              text: `⏸️ **Sub-Account Suspended**\\n\\n` +
                    `✅ **Account ID:** ${result.data.id}\\n` +
                    `✅ **Status:** ${result.data.status}\\n` +
                    `✅ **Suspended On:** ${result.data.suspended_on}\\n\\n` +
                    `The account has been temporarily disabled. Use the unsuspend tool to reactivate it.\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_unsuspend_sub_account': {
        const { account_id } = args as { account_id: string };
        const result = await api.unsuspendSubAccount(account_id);

        return {
          content: [
            {
              type: 'text',
              text: `▶️ **Sub-Account Unsuspended**\\n\\n` +
                    `✅ **Account ID:** ${result.data.id}\\n` +
                    `✅ **Status:** ${result.data.status}\\n` +
                    `✅ **Unsuspended On:** ${result.data.unsuspended_on}\\n\\n` +
                    `The account has been reactivated and is now functional.\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_confirm_sub_account': {
        const { account_id, confirmation_code, password } = args as {
          account_id: string;
          confirmation_code: string;
          password?: string;
        };

        const result = await api.confirmSubAccount(account_id, {
          confirmation_code,
          password
        });

        return {
          content: [
            {
              type: 'text',
              text: `✅ **Sub-Account Confirmed Successfully!**\\n\\n` +
                    `✅ **Account ID:** ${result.data.id}\\n` +
                    `✅ **Name:** ${result.data.name}\\n` +
                    `✅ **Email:** ${result.data.email}\\n` +
                    `✅ **Status:** ${result.data.status}\\n` +
                    `✅ **Verified:** ${result.data.verified ? 'Yes' : 'No'}\\n\\n` +
                    `The account has been successfully verified and is now active.\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_resend_verification_email': {
        const { email } = args as { email: string };

        if (!validateEmail(email)) {
          throw new Error('Invalid email format');
        }

        const result = await api.resendVerificationEmail({ email });

        return {
          content: [
            {
              type: 'text',
              text: `📧 **Verification Email Resent**\\n\\n` +
                    `✅ **Email:** ${result.data.email}\\n` +
                    `✅ **Message:** ${result.data.message}\\n` +
                    `✅ **Sent On:** ${result.data.sent_on}\\n\\n` +
                    `Please check the inbox and spam folder for the verification email.\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_convert_sub_account_to_organization': {
        const { account_id, migrate_owner } = args as {
          account_id: string;
          migrate_owner?: boolean;
        };

        const result = await api.convertSubAccountToOrganization(account_id, {
          migrate_owner: migrate_owner ?? true
        });

        return {
          content: [
            {
              type: 'text',
              text: `🏢 **Sub-Account Converted to Organization**\\n\\n` +
                    `✅ **Account ID:** ${result.data.id}\\n` +
                    `✅ **Name:** ${result.data.name}\\n` +
                    `✅ **Email:** ${result.data.email}\\n` +
                    `✅ **Type:** ${result.data.type}\\n` +
                    `✅ **Migrate Owner:** ${migrate_owner ? 'Yes' : 'No'}\\n\\n` +
                    `The account has been successfully converted to an organization.\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_latest_sub_account': {
        const account = await api.getLatestSubAccount();

        if (!account) {
          return {
            content: [
              {
                type: 'text',
                text: `🔍 **No Sub-Accounts Found**\\n\\nNo sub-accounts exist in this account.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: `🏢 **Latest Sub-Account**\\n\\n` +
                    `**Account ID:** ${account.data.id}\\n` +
                    `**Name:** ${account.data.name}\\n` +
                    `**Email:** ${account.data.email}\\n` +
                    `**Status:** ${account.data.status}\\n` +
                    `**Company:** ${account.data.company || 'N/A'}\\n` +
                    `**Created:** ${account.data.created_on || 'N/A'}\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(account, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_search_sub_accounts_by_name': {
        const { name, page, per_page } = args as {
          name: string;
          page?: number;
          per_page?: number;
        };

        const accounts = await api.searchSubAccountsByName(name, { page, per_page });
        const total = accounts.pagination?.count || 0;

        return {
          content: [
            {
              type: 'text',
              text: `🔍 **Sub-Account Search Results**\\n\\n` +
                    `**Search Query:** "${name}"\\n` +
                    `**Total Found:** ${total}\\n\\n` +
                    (accounts.data?.map((acc, i) => 
                      `${i + 1}. **${acc.name}** (${acc.id})\\n` +
                      `   📧 ${acc.email}\\n` +
                      `   🏷️ Status: ${acc.status}\\n` +
                      `   🏢 Company: ${acc.company || 'N/A'}`
                    ).join('\\n\\n') || 'No matching accounts found.') +
                    `\\n\\n**Full Response:**\\n${JSON.stringify(accounts, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_sub_accounts_by_status': {
        const { status, page, per_page } = args as {
          status: string;
          page?: number;
          per_page?: number;
        };

        const accounts = await api.getSubAccountsByStatus(status, { page, per_page });
        const total = accounts.pagination?.count || 0;

        return {
          content: [
            {
              type: 'text',
              text: `🏷️ **Sub-Accounts by Status: ${status}**\\n\\n` +
                    `**Total Found:** ${total}\\n\\n` +
                    (accounts.data?.map((acc, i) => 
                      `${i + 1}. **${acc.name}** (${acc.id})\\n` +
                      `   📧 ${acc.email}\\n` +
                      `   🏢 Company: ${acc.company || 'N/A'}\\n` +
                      `   📅 Created: ${acc.created_on || 'N/A'}`
                    ).join('\\n\\n') || `No ${status} accounts found.`) +
                    `\\n\\n**Full Response:**\\n${JSON.stringify(accounts, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_debug_sub_account_access': {
        const { account_id } = args as { account_id?: string };
        const debug = await api.debugSubAccountAccess(account_id);

        return {
          content: [
            {
              type: 'text',
              text: `🔍 **Sub-Account Access Debug**\\n\\n` +
                    `**Access Check:** ${debug.access_check}\\n` +
                    `**Timestamp:** ${debug.timestamp}\\n\\n` +
                    (debug.access_check === 'success' 
                      ? (account_id 
                          ? `✅ **Account Access:** Working\\n` +
                            `✅ **Account Found:** ${debug.account_found}\\n` +
                            `**Account Details:**\\n${JSON.stringify(debug.account_data, null, 2)}`
                          : `✅ **List Access:** Working\\n` +
                            `✅ **Can List Accounts:** ${debug.can_list_accounts}\\n` +
                            `✅ **Account Count:** ${debug.account_count}\\n` +
                            `**Sample Accounts:**\\n${JSON.stringify(debug.first_few_accounts, null, 2)}`)
                      : `❌ **Error:** ${debug.error}`) +
                    `\\n\\n**Full Debug Info:**\\n${JSON.stringify(debug, null, 2)}`,
            },
          ],
        };
      }

      // Email API (updated to use new EmailApi)
      case 'cakemail_send_email': {
        const { 
          to_email, 
          to_name, 
          sender_id, 
          subject, 
          html_content, 
          text_content, 
          template_id, 
          list_id, 
          email_type 
        } = args as {
          to_email: string;
          to_name?: string;
          sender_id: string;
          subject: string;
          html_content?: string;
          text_content?: string;
          template_id?: string;
          list_id?: string;
          email_type?: 'transactional' | 'marketing';
        };
        
        if (!validateEmail(to_email)) {
          throw new Error('Invalid recipient email format');
        }
        
        const email = await api.sendEmail({
          to_email,
          to_name,
          sender_id,
          subject,
          html_content,
          text_content,
          template_id,
          list_id,
          email_type: email_type || 'transactional',
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `📧 **Email sent successfully via Email API!**\\n\\n` +
                    `✅ **Email ID:** ${email.data?.id}\\n` +
                    `✅ **Status:** ${email.data?.status}\\n` +
                    `✅ **Type:** ${email_type || 'transactional'}\\n` +
                    `✅ **Recipient:** ${to_email}\\n` +
                    `✅ **Subject:** ${subject}\\n\\n` +
                    `**Full Response:**\\n${JSON.stringify(email, null, 2)}`,
            },
          ],
        };
      }

      // Account Management
      case 'cakemail_get_self_account': {
        const account = await api.getSelfAccount();
        return {
          content: [
            {
              type: 'text',
              text: `Account details: ${JSON.stringify(account, null, 2)}`,
            },
          ],
        };
      }

      // Rate Limiting & Retry Management
      case 'cakemail_get_retry_config': {
        const config = api.getRetryConfig();
        return {
          content: [
            {
              type: 'text',
              text: `🔄 **Current Retry Configuration**\\n\\n` +
                    `• Max Retries: ${config.maxRetries}\\n` +
                    `• Base Delay: ${config.baseDelay}ms\\n` +
                    `• Max Delay: ${config.maxDelay}ms\\n` +
                    `• Exponential Base: ${config.exponentialBase}\\n` +
                    `• Jitter Enabled: ${config.jitter ? 'Yes' : 'No'}\\n` +
                    `• Retryable Status Codes: ${config.retryableStatusCodes.join(', ')}\\n` +
                    `• Retryable Errors: ${config.retryableErrors.join(', ')}\\n\\n` +
                    `**Raw Config:**\\n\`\`\`json\\n${JSON.stringify(config, null, 2)}\\n\`\`\``,
            },
          ],
        };
      }

      // Reports and Analytics
      case 'cakemail_get_campaign_stats': {
        const { campaign_id, account_id } = args as {
          campaign_id: string;
          account_id?: number;
        };
        
        const stats = await api.reports.getCampaignStats(campaign_id, account_id);
        
        return {
          content: [
            {
              type: 'text',
              text: `📊 **Campaign Statistics**\n\n` +
                    `**Campaign ID:** ${campaign_id}\n` +
                    `**Account ID:** ${account_id || 'default'}\n\n` +
                    `**Performance Metrics:**\n` +
                    `• Sent: ${stats.data?.sent || 0}\n` +
                    `• Delivered: ${stats.data?.delivered || 0}\n` +
                    `• Opens: ${stats.data?.opens || 0}\n` +
                    `• Unique Opens: ${stats.data?.unique_opens || 0}\n` +
                    `• Clicks: ${stats.data?.clicks || 0}\n` +
                    `• Unique Clicks: ${stats.data?.unique_clicks || 0}\n` +
                    `• Bounces: ${stats.data?.bounces || 0}\n` +
                    `• Unsubscribes: ${stats.data?.unsubscribes || 0}\n` +
                    `• Spam Reports: ${stats.data?.spam_reports || 0}\n\n` +
                    `**Rates:**\n` +
                    `• Open Rate: ${stats.data?.open_rate ? (stats.data.open_rate * 100).toFixed(2) + '%' : 'N/A'}\n` +
                    `• Click Rate: ${stats.data?.click_rate ? (stats.data.click_rate * 100).toFixed(2) + '%' : 'N/A'}\n` +
                    `• Bounce Rate: ${stats.data?.bounce_rate ? (stats.data.bounce_rate * 100).toFixed(2) + '%' : 'N/A'}\n` +
                    `• Unsubscribe Rate: ${stats.data?.unsubscribe_rate ? (stats.data.unsubscribe_rate * 100).toFixed(2) + '%' : 'N/A'}\n\n` +
                    `**Full Response:**\n${JSON.stringify(stats, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_campaign_links_stats': {
        const { 
          campaign_id, start_time, end_time, account_id, page, per_page, sort, order 
        } = args as {
          campaign_id: string;
          start_time?: number;
          end_time?: number;
          account_id?: number;
          page?: number;
          per_page?: number;
          sort?: string;
          order?: string;
        };
        
        const linksStats = await api.reports.getCampaignLinksStats(campaign_id, {
          ...(start_time !== undefined && { start_time }),
          ...(end_time !== undefined && { end_time }),
          ...(account_id !== undefined && { account_id }),
          ...(page !== undefined && { page }),
          ...(per_page !== undefined && { per_page }),
          ...(sort !== undefined && { sort }),
          ...(order !== undefined && (order === 'asc' || order === 'desc') && { order: order as 'asc' | 'desc' })
        });
        
        const totalLinks = linksStats.data?.length || 0;
        const topLinks = linksStats.data?.slice(0, 10) || [];
        
        return {
          content: [
            {
              type: 'text',
              text: `🔗 **Campaign Links Statistics**\n\n` +
                    `**Campaign ID:** ${campaign_id}\n` +
                    `**Total Links:** ${totalLinks}\n` +
                    `**Period:** ${start_time ? new Date(start_time * 1000).toLocaleDateString() : 'All time'} - ${end_time ? new Date(end_time * 1000).toLocaleDateString() : 'Present'}\n\n` +
                    `**Top ${Math.min(topLinks.length, 10)} Links:**\n\n` +
                    (topLinks.map((link, i) => 
                      `${i + 1}. **${link.url || 'N/A'}**\n` +
                      `   • Total Clicks: ${link.total || 0}\n` +
                      `   • Unique Clicks: ${link.unique || 0}\n` +
                      `   • Link ID: ${link.id || 'N/A'}`
                    ).join('\n\n') || 'No links found.') +
                    (totalLinks > 10 ? `\n\n**... and ${totalLinks - 10} more links**` : '') +
                    `\n\n**Full Response:**\n${JSON.stringify(linksStats, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_debug_reports_access': {
        const { campaign_id } = args as { campaign_id?: string };
        const debug = await api.reports.debugReportsAccess(campaign_id);

        return {
          content: [
            {
              type: 'text',
              text: `🔍 **Reports API Access Debug**\n\n` +
                    `**Test Results:**\n\n` +
                    debug.tests.map((test, i) => 
                      `${i + 1}. **${test.test}**\n` +
                      `   ${test.success ? '✅ Success' : '❌ Failed'}\n` +
                      (test.success 
                        ? `   📊 Has Data: ${test.hasData ? 'Yes' : 'No'}\n` +
                          (test.dataKeys ? `   🔑 Data Keys: ${test.dataKeys.join(', ')}\n` : '') +
                          (test.campaignId ? `   🆔 Campaign ID: ${test.campaignId}\n` : '') +
                          (test.linksCount !== undefined ? `   🔗 Links Count: ${test.linksCount}\n` : '') +
                          (test.exportsCount !== undefined ? `   📤 Exports Count: ${test.exportsCount}\n` : '')
                        : `   ❌ Error: ${test.error}\n`)
                    ).join('\n') +
                    `\n**Full Debug Info:**\n${JSON.stringify(debug, null, 2)}`,
            },
          ],
        };
      }

      // Logs API Handlers
      case 'cakemail_get_campaign_logs': {
        const { 
          campaign_id, account_id, page, per_page, with_count, sort, order, cursor, filter, type, start_time, end_time 
        } = args as {
          campaign_id: string;
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
        };

        const logs = await api.getCampaignLogs(campaign_id, {
          account_id,
          page,
          per_page,
          with_count,
          sort,
          order,
          cursor,
          filter,
          type,
          start_time,
          end_time
        });

        // Enhanced analysis with event taxonomy
        const analysis = api.logs.analyzeLogsWithTaxonomy(logs);
        const logCount = Array.isArray(logs.data) ? logs.data.length : 0;
        const timeRange = start_time && end_time 
          ? `${new Date(start_time * 1000).toLocaleDateString()} - ${new Date(end_time * 1000).toLocaleDateString()}`
          : 'All time';

        // Build smart summary
        let smartSummary = '';
        if (analysis.taxonomy) {
          const { categorizedEvents, summary, needsAttention, criticalEventCount } = analysis.taxonomy;
          
          smartSummary = `\n📊 **SMART ANALYSIS:**\n` +
            `• Total Events: ${summary.totalEvents}\n` +
            `• Engagement Rate: ${summary.engagementRate}\n` +
            `• Issue Rate: ${summary.issueRate}\n` +
            `${needsAttention ? `⚠️ **${criticalEventCount} CRITICAL EVENTS NEED ATTENTION**\n` : '✅ No critical issues detected\n'}` +
            `\n**Event Categories:**\n` +
            Object.entries(categorizedEvents).map(([cat, count]) => `• ${cat}: ${count} events`).join('\n') +
            '\n';
        }

        return {
          content: [
            {
              type: 'text',
              text: `📋 **Campaign Logs with Smart Analysis**\n\n` +
                    `**Campaign ID:** ${campaign_id}\n` +
                    `${account_id ? `**Account ID:** ${account_id}\n` : ''}` +
                    `**Log Count:** ${logCount}\n` +
                    `**Time Range:** ${timeRange}\n` +
                    `${filter ? `**Smart Filter Applied:** ${filter}\n` : ''}` +
                    `${type ? `**Event Type Filter:** ${type}\n` : ''}` +
                    `${cursor ? `**Cursor:** ${cursor}\n` : ''}` +
                    `${page ? `**Page:** ${page}\n` : ''}` +
                    `${per_page ? `**Per Page:** ${per_page}\n` : ''}` +
                    smartSummary +
                    `\n**Available Smart Filters:**\n` +
                    `• Engagement: \`filter="type==click;type==open;type==view"\`\n` +
                    `• Critical Issues: \`filter="type==spam;type==bounce_hb;type==bounce_mb"\`\n` +
                    `• Temporary Failures: \`filter="type==bounce_sb;type==bounce_df;type==bounce_fm"\`\n` +
                    `• List Cleanup: \`filter="type==bounce_hb;type==spam;type==global_unsubscribe"\`\n\n` +
                    `**Raw Log Data:**\n${JSON.stringify(logs, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_workflow_action_logs': {
        const { 
          workflow_id, action_id, account_id, page, per_page, with_count, filter, start_time, end_time 
        } = args as {
          workflow_id: string;
          action_id: string;
          account_id?: number;
          page?: number;
          per_page?: number;
          with_count?: boolean;
          filter?: string;
          start_time?: number;
          end_time?: number;
        };

        const logs = await api.getWorkflowActionLogs(workflow_id, action_id, {
          account_id,
          page,
          per_page,
          with_count,
          filter,
          start_time,
          end_time
        });

        const logCount = Array.isArray(logs.data) ? logs.data.length : 0;
        const timeRange = start_time && end_time 
          ? `${new Date(start_time * 1000).toLocaleDateString()} - ${new Date(end_time * 1000).toLocaleDateString()}`
          : 'All time';

        return {
          content: [
            {
              type: 'text',
              text: `🔄 **Workflow Action Logs**\n\n` +
                    `**Workflow ID:** ${workflow_id}\n` +
                    `**Action ID:** ${action_id}\n` +
                    `${account_id ? `**Account ID:** ${account_id}\n` : ''}` +
                    `**Log Count:** ${logCount}\n` +
                    `**Time Range:** ${timeRange}\n` +
                    `${filter ? `**Filter:** ${filter}\n` : ''}` +
                    `${page ? `**Page:** ${page}\n` : ''}` +
                    `${per_page ? `**Per Page:** ${per_page}\n` : ''}\n` +
                    `**Full Response:**\n${JSON.stringify(logs, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_workflow_logs': {
        const { 
          workflow_id, account_id, page, per_page, with_count, sort, order, filter, start_time, end_time 
        } = args as {
          workflow_id: string;
          account_id?: number;
          page?: number;
          per_page?: number;
          with_count?: boolean;
          sort?: string;
          order?: 'asc' | 'desc';
          filter?: string;
          start_time?: number;
          end_time?: number;
        };

        const logs = await api.getWorkflowLogs(workflow_id, {
          account_id,
          page,
          per_page,
          with_count,
          sort,
          order,
          filter,
          start_time,
          end_time
        });

        const logCount = Array.isArray(logs.data) ? logs.data.length : 0;
        const timeRange = start_time && end_time 
          ? `${new Date(start_time * 1000).toLocaleDateString()} - ${new Date(end_time * 1000).toLocaleDateString()}`
          : 'All time';

        return {
          content: [
            {
              type: 'text',
              text: `🔄 **Workflow Logs**\n\n` +
                    `**Workflow ID:** ${workflow_id}\n` +
                    `${account_id ? `**Account ID:** ${account_id}\n` : ''}` +
                    `**Log Count:** ${logCount}\n` +
                    `**Time Range:** ${timeRange}\n` +
                    `${filter ? `**Filter:** ${filter}\n` : ''}` +
                    `${page ? `**Page:** ${page}\n` : ''}` +
                    `${per_page ? `**Per Page:** ${per_page}\n` : ''}\n` +
                    `**Full Response:**\n${JSON.stringify(logs, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_transactional_email_logs': {
        const { 
          log_type, account_id, page, per_page, with_count, sort, order, filter, start_time, end_time, 
          email_id, sender_id, status 
        } = args as {
          log_type?: string;
          account_id?: number;
          page?: number;
          per_page?: number;
          with_count?: boolean;
          sort?: string;
          order?: 'asc' | 'desc';
          filter?: string;
          start_time?: number;
          end_time?: number;
          email_id?: string;
          sender_id?: string;
          status?: string;
        };

        const logs = await api.getTransactionalEmailLogs({
          log_type,
          account_id,
          page,
          per_page,
          with_count,
          sort,
          order,
          filter,
          start_time,
          end_time,
          email_id,
          sender_id,
          status
        });

        const logCount = Array.isArray(logs.data) ? logs.data.length : 0;
        const timeRange = start_time && end_time 
          ? `${new Date(start_time * 1000).toLocaleDateString()} - ${new Date(end_time * 1000).toLocaleDateString()}`
          : 'All time';

        return {
          content: [
            {
              type: 'text',
              text: `📧 **Transactional Email Logs**\n\n` +
                    `${log_type ? `**Log Type:** ${log_type}\n` : ''}` +
                    `${account_id ? `**Account ID:** ${account_id}\n` : ''}` +
                    `**Log Count:** ${logCount}\n` +
                    `**Time Range:** ${timeRange}\n` +
                    `${filter ? `**Filter:** ${filter}\n` : ''}` +
                    `${email_id ? `**Email ID Filter:** ${email_id}\n` : ''}` +
                    `${sender_id ? `**Sender ID Filter:** ${sender_id}\n` : ''}` +
                    `${status ? `**Status Filter:** ${status}\n` : ''}` +
                    `${page ? `**Page:** ${page}\n` : ''}` +
                    `${per_page ? `**Per Page:** ${per_page}\n` : ''}\n` +
                    `**Full Response:**\n${JSON.stringify(logs, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_list_logs': {
        const { 
          list_id, account_id, page, per_page, with_count, filter, start_time, end_time 
        } = args as {
          list_id: string;
          account_id?: number;
          page?: number;
          per_page?: number;
          with_count?: boolean;
          filter?: string;
          start_time?: number;
          end_time?: number;
        };

        const logs = await api.getListLogs(list_id, {
          account_id,
          page,
          per_page,
          with_count,
          filter,
          start_time,
          end_time
        });

        const logCount = Array.isArray(logs.data) ? logs.data.length : 0;
        const timeRange = start_time && end_time 
          ? `${new Date(start_time * 1000).toLocaleDateString()} - ${new Date(end_time * 1000).toLocaleDateString()}`
          : 'All time';

        return {
          content: [
            {
              type: 'text',
              text: `📋 **List Logs**\n\n` +
                    `**List ID:** ${list_id}\n` +
                    `${account_id ? `**Account ID:** ${account_id}\n` : ''}` +
                    `**Log Count:** ${logCount}\n` +
                    `**Time Range:** ${timeRange}\n` +
                    `${filter ? `**Filter:** ${filter}\n` : ''}` +
                    `${page ? `**Page:** ${page}\n` : ''}` +
                    `${per_page ? `**Per Page:** ${per_page}\n` : ''}\n` +
                    `**Full Response:**\n${JSON.stringify(logs, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_debug_logs_access': {
        const { campaign_id, workflow_id } = args as {
          campaign_id?: string;
          workflow_id?: string;
        };

        const debug = await api.debugLogsAccess({ campaign_id, workflow_id });

        return {
          content: [
            {
              type: 'text',
              text: `🔍 **Logs API Access Debug**\n\n` +
                    `**Test Results:**\n\n` +
                    debug.tests.map((test, i) => 
                      `${i + 1}. **${test.test}**\n` +
                      `   ${test.success ? '✅ Success' : '❌ Failed'}\n` +
                      (test.success 
                        ? `   📊 Has Data: ${test.hasData ? 'Yes' : 'No'}\n` +
                          (test.dataType ? `   📋 Data Type: ${test.dataType}\n` : '') +
                          (test.campaign_id ? `   🆔 Campaign ID: ${test.campaign_id}\n` : '') +
                          (test.workflow_id ? `   🔄 Workflow ID: ${test.workflow_id}\n` : '')
                        : `   🚫 Error: ${test.error}\n`)
                    ).join('\n') +
                    `\n**Full Debug Info:**\n${JSON.stringify(debug, null, 2)}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return handleCakemailError(error);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Cakemail MCP server running on stdio');
}

main().catch(console.error);
