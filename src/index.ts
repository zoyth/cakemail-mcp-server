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
    version: '1.2.0',
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

const api = new CakemailAPI({ username, password });

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
        text: `❌ **Validation Error**\n\nThe following fields have validation issues:\n${fieldErrors}\n\n**Fix these issues and try again.**`
      }],
      isError: true
    };
  }
  
  if (error instanceof CakemailAuthenticationError) {
    return {
      content: [{
        type: 'text',
        text: `🔐 **Authentication Error**\n\n${error.message}\n\n**Please check your CAKEMAIL_USERNAME and CAKEMAIL_PASSWORD environment variables.**`
      }],
      isError: true
    };
  }
  
  if (error instanceof CakemailBadRequestError) {
    return {
      content: [{
        type: 'text',
        text: `❌ **Bad Request**\n\n${error.detail}\n\n**Please check your request parameters and try again.**`
      }],
      isError: true
    };
  }
  
  if (error instanceof CakemailNotFoundError) {
    return {
      content: [{
        type: 'text',
        text: `🔍 **Not Found**\n\n${error.message}\n\n**The requested resource could not be found. Please verify the ID and try again.**`
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
        text: `⏱️ **Rate Limit Exceeded**\n\n${error.message}\n\n${retryMessage}`
      }],
      isError: true
    };
  }
  
  if (error instanceof CakemailError) {
    return {
      content: [{
        type: 'text',
        text: `❌ **API Error (${error.statusCode})**\n\n${error.message}`
      }],
      isError: true
    };
  }
  
  // Fallback for unknown errors
  return {
    content: [{
      type: 'text',
      text: `❌ **Error**\n\n${getErrorMessage(error)}`
    }],
    isError: true
  };
}

// Enhanced validation helpers
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateDate(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
}

// Helper function to format campaign data intelligently
function formatCampaignSummary(campaign: any): string {
  // Fix: Convert Unix timestamp (seconds) to Date by multiplying by 1000
  const created = campaign.created_on ? new Date(campaign.created_on * 1000).toLocaleString() : 'Unknown';
  const updated = campaign.updated_on ? new Date(campaign.updated_on * 1000).toLocaleString() : 'Unknown';
  
  return [
    `📧 Campaign: ${campaign.name || 'Unnamed'}`,
    `🆔 ID: ${campaign.id}`,
    `📌 Status: ${campaign.status || 'Unknown'}`,
    `📝 Subject: ${campaign.subject || 'No subject'}`,
    `📅 Created: ${created}`,
    `🔄 Updated: ${updated}`,
    campaign.list_id ? `📋 List ID: ${campaign.list_id}` : '',
    campaign.sender_id ? `👤 Sender ID: ${campaign.sender_id}` : '',
  ].filter(Boolean).join('\n');
}

// Helper function to format campaign analytics
function formatCampaignAnalytics(analytics: any): string {
  if (!analytics || typeof analytics !== 'object') {
    return 'No analytics data available';
  }

  const sections = [];
  
  if (analytics.sent_count !== undefined) {
    sections.push(`📊 **Delivery Stats:**`);
    sections.push(`   • Sent: ${analytics.sent_count || 0}`);
    sections.push(`   • Delivered: ${analytics.delivered_count || 0}`);
    sections.push(`   • Bounced: ${analytics.bounce_count || 0}`);
  }

  if (analytics.open_count !== undefined) {
    sections.push(`\n👀 **Engagement Stats:**`);
    sections.push(`   • Opens: ${analytics.open_count || 0}`);
    sections.push(`   • Unique Opens: ${analytics.unique_open_count || 0}`);
    sections.push(`   • Open Rate: ${analytics.open_rate ? (analytics.open_rate * 100).toFixed(2) + '%' : 'N/A'}`);
  }

  if (analytics.click_count !== undefined) {
    sections.push(`\n🖱️ **Click Stats:**`);
    sections.push(`   • Clicks: ${analytics.click_count || 0}`);
    sections.push(`   • Unique Clicks: ${analytics.unique_click_count || 0}`);
    sections.push(`   • Click Rate: ${analytics.click_rate ? (analytics.click_rate * 100).toFixed(2) + '%' : 'N/A'}`);
  }

  return sections.length > 0 ? sections.join('\n') : 'No analytics data available';
}

// List tools handler with expanded functionality
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

      // List Management
      {
        name: 'cakemail_get_lists',
        description: 'Get contact lists (defaults to latest first: sort=created_on&order=desc)',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number for pagination' },
            per_page: { type: 'number', description: 'Number of lists per page' },
            sort: { type: 'string', enum: ['name', 'created_on'], description: 'Sort field (defaults to created_on)' },
            order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction (defaults to desc for latest first)' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_create_list',
        description: 'Create a new contact list',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'List name' },
            description: { type: 'string', description: 'List description' },
            language: { type: 'string', description: 'List language (e.g., en_US)' },
          },
          required: ['name'],
        },
      },
      {
        name: 'cakemail_get_list',
        description: 'Get details of a specific list',
        inputSchema: {
          type: 'object',
          properties: {
            list_id: { type: 'string', description: 'List ID to retrieve' },
          },
          required: ['list_id'],
        },
      },
      {
        name: 'cakemail_update_list',
        description: 'Update an existing list',
        inputSchema: {
          type: 'object',
          properties: {
            list_id: { type: 'string', description: 'List ID to update' },
            name: { type: 'string', description: 'List name' },
            description: { type: 'string', description: 'List description' },
            language: { type: 'string', description: 'List language' },
          },
          required: ['list_id'],
        },
      },
      {
        name: 'cakemail_delete_list',
        description: 'Delete a contact list',
        inputSchema: {
          type: 'object',
          properties: {
            list_id: { type: 'string', description: 'List ID to delete' },
          },
          required: ['list_id'],
        },
      },

      // Contact Management
      {
        name: 'cakemail_get_contacts',
        description: 'Get contacts from lists (defaults to latest first: sort=created_on&order=desc)',
        inputSchema: {
          type: 'object',
          properties: {
            list_id: { type: 'string', description: 'Filter contacts by list ID' },
            page: { type: 'number', description: 'Page number for pagination' },
            per_page: { type: 'number', description: 'Number of contacts per page' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_create_contact',
        description: 'Create a new contact',
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', description: 'Contact email address' },
            first_name: { type: 'string', description: 'Contact first name' },
            last_name: { type: 'string', description: 'Contact last name' },
            list_id: { type: 'string', description: 'List ID to add contact to' },
            custom_fields: { type: 'object', description: 'Custom field data' },
          },
          required: ['email', 'list_id'],
        },
      },
      {
        name: 'cakemail_get_contact',
        description: 'Get details of a specific contact',
        inputSchema: {
          type: 'object',
          properties: {
            contact_id: { type: 'string', description: 'Contact ID to retrieve' },
          },
          required: ['contact_id'],
        },
      },
      {
        name: 'cakemail_update_contact',
        description: 'Update an existing contact',
        inputSchema: {
          type: 'object',
          properties: {
            contact_id: { type: 'string', description: 'Contact ID to update' },
            email: { type: 'string', description: 'Contact email address' },
            first_name: { type: 'string', description: 'Contact first name' },
            last_name: { type: 'string', description: 'Contact last name' },
            custom_fields: { type: 'object', description: 'Custom field data' },
          },
          required: ['contact_id'],
        },
      },
      {
        name: 'cakemail_delete_contact',
        description: 'Delete a contact',
        inputSchema: {
          type: 'object',
          properties: {
            contact_id: { type: 'string', description: 'Contact ID to delete' },
          },
          required: ['contact_id'],
        },
      },

      // Transactional Email
      {
        name: 'cakemail_send_transactional_email',
        description: 'Send a transactional email',
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
          },
          required: ['to_email', 'sender_id', 'subject', 'html_content'],
        },
      },

      // Enhanced Campaign Management
      {
        name: 'cakemail_get_campaigns',
        description: 'Get list of campaigns with filtering and sorting (defaults to latest first: sort=created_on&order=desc)',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number for pagination' },
            per_page: { type: 'number', description: 'Number of campaigns per page (max 50)', maximum: 50 },
            sort: { type: 'string', enum: ['name', 'created_on'], description: 'Sort field (defaults to created_on)' },
            order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction (defaults to desc for latest first)' },
            status: { type: 'string', enum: ['incomplete', 'draft', 'scheduled', 'sending', 'sent', 'archived'], description: 'Filter by campaign status' },
            name: { type: 'string', description: 'Filter campaigns by name (partial match)' },
            created_after: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Filter campaigns created after date (YYYY-MM-DD)' },
            created_before: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Filter campaigns created before date (YYYY-MM-DD)' },
            with_count: { type: 'boolean', description: 'Include total count in response' }
          },
          required: [],
        },
      },
      {
        name: 'cakemail_get_latest_campaign',
        description: 'Get the most recently created campaign with intelligent formatting and optional analytics',
        inputSchema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['incomplete', 'draft', 'scheduled', 'sending', 'sent', 'archived'], description: 'Filter by campaign status' },
            include_analytics: { type: 'boolean', description: 'Include performance analytics if available' }
          },
          required: [],
        },
      },
      {
        name: 'cakemail_create_campaign',
        description: 'Create a new draft campaign',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Campaign name' },
            subject: { type: 'string', description: 'Email subject line' },
            html_content: { type: 'string', description: 'HTML email content' },
            text_content: { type: 'string', description: 'Plain text email content' },
            list_id: { type: 'string', description: 'Contact list ID to send to' },
            sender_id: { type: 'string', description: 'Sender ID to use' },
            from_name: { type: 'string', description: 'From name for the email' },
            reply_to: { type: 'string', description: 'Reply-to email address' },
          },
          required: ['name', 'subject', 'html_content', 'list_id', 'sender_id'],
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
        name: 'cakemail_update_campaign',
        description: 'Update an existing draft campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', description: 'Campaign ID to update' },
            name: { type: 'string', description: 'Campaign name' },
            subject: { type: 'string', description: 'Email subject line' },
            html_content: { type: 'string', description: 'HTML email content' },
            text_content: { type: 'string', description: 'Plain text email content' },
            from_name: { type: 'string', description: 'From name for the email' },
            reply_to: { type: 'string', description: 'Reply-to email address' },
          },
          required: ['campaign_id'],
        },
      },
      {
        name: 'cakemail_send_campaign',
        description: 'Send an existing campaign',
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
        description: 'Delete a draft campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', description: 'Campaign ID to delete' },
          },
          required: ['campaign_id'],
        },
      },

      // Template Management
      {
        name: 'cakemail_get_templates',
        description: 'Get list of email templates (defaults to latest first: sort=created_on&order=desc)',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number for pagination' },
            per_page: { type: 'number', description: 'Number of templates per page' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_get_template',
        description: 'Get details of a specific template',
        inputSchema: {
          type: 'object',
          properties: {
            template_id: { type: 'string', description: 'Template ID to retrieve' },
          },
          required: ['template_id'],
        },
      },
      {
        name: 'cakemail_create_template',
        description: 'Create a new email template',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Template name' },
            subject: { type: 'string', description: 'Template subject' },
            html_content: { type: 'string', description: 'HTML template content' },
            text_content: { type: 'string', description: 'Plain text template content' },
            description: { type: 'string', description: 'Template description' },
          },
          required: ['name', 'html_content'],
        },
      },
      {
        name: 'cakemail_update_template',
        description: 'Update an existing template',
        inputSchema: {
          type: 'object',
          properties: {
            template_id: { type: 'string', description: 'Template ID to update' },
            name: { type: 'string', description: 'Template name' },
            subject: { type: 'string', description: 'Template subject' },
            html_content: { type: 'string', description: 'HTML template content' },
            text_content: { type: 'string', description: 'Plain text template content' },
            description: { type: 'string', description: 'Template description' },
          },
          required: ['template_id'],
        },
      },
      {
        name: 'cakemail_delete_template',
        description: 'Delete a template',
        inputSchema: {
          type: 'object',
          properties: {
            template_id: { type: 'string', description: 'Template ID to delete' },
          },
          required: ['template_id'],
        },
      },

      // Analytics
      {
        name: 'cakemail_get_campaign_analytics',
        description: 'Get analytics for a specific campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', description: 'Campaign ID to get analytics for' },
          },
          required: ['campaign_id'],
        },
      },
      {
        name: 'cakemail_get_transactional_analytics',
        description: 'Get transactional email analytics',
        inputSchema: {
          type: 'object',
          properties: {
            start_date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Start date (YYYY-MM-DD)' },
            end_date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'End date (YYYY-MM-DD)' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_get_list_analytics',
        description: 'Get analytics for a specific list',
        inputSchema: {
          type: 'object',
          properties: {
            list_id: { type: 'string', description: 'List ID to get analytics for' },
          },
          required: ['list_id'],
        },
      },
      {
        name: 'cakemail_get_account_analytics',
        description: 'Get account-wide analytics',
        inputSchema: {
          type: 'object',
          properties: {
            start_date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Start date (YYYY-MM-DD)' },
            end_date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'End date (YYYY-MM-DD)' },
          },
          required: [],
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
      {
        name: 'cakemail_patch_self_account',
        description: 'Update current account details',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Account name' },
            email: { type: 'string', description: 'Account email' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_convert_account_to_organization',
        description: 'Convert current account to an organization',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },

      // Automation
      {
        name: 'cakemail_get_automations',
        description: 'Get list of automation workflows',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number for pagination' },
            per_page: { type: 'number', description: 'Number of automations per page' },
            status: { type: 'string', enum: ['active', 'inactive', 'draft'], description: 'Filter by status' },
          },
          required: [],
        },
      },
      {
        name: 'cakemail_get_automation',
        description: 'Get details of a specific automation',
        inputSchema: {
          type: 'object',
          properties: {
            automation_id: { type: 'string', description: 'Automation ID to retrieve' },
          },
          required: ['automation_id'],
        },
      },
      {
        name: 'cakemail_create_automation',
        description: 'Create a new automation workflow',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Automation name' },
            description: { type: 'string', description: 'Automation description' },
            trigger: { type: 'object', description: 'Automation trigger configuration' },
            actions: { type: 'array', description: 'Array of automation actions' },
          },
          required: ['name', 'trigger', 'actions'],
        },
      },
      {
        name: 'cakemail_start_automation',
        description: 'Start an automation workflow',
        inputSchema: {
          type: 'object',
          properties: {
            automation_id: { type: 'string', description: 'Automation ID to start' },
          },
          required: ['automation_id'],
        },
      },
      {
        name: 'cakemail_stop_automation',
        description: 'Stop an automation workflow',
        inputSchema: {
          type: 'object',
          properties: {
            automation_id: { type: 'string', description: 'Automation ID to stop' },
          },
          required: ['automation_id'],
        },
      },
    ],
  };
});

// Call tool handler
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

      // List Management with default sorting
      case 'cakemail_get_lists': {
        const { page, per_page, sort, order } = args as { 
          page?: number; 
          per_page?: number; 
          sort?: string; 
          order?: string; 
        };
        
        // Apply intelligent defaults for better UX
        const params: any = {
          sort: sort || 'created_on',
          order: order || 'desc'
        };
        if (page) params.page = page;
        if (per_page) params.per_page = per_page;
        
        const lists = await api.getLists(params);
        
        let responseText = `Found ${lists.data?.length || 0} lists`;
        if (lists.pagination?.count) {
          responseText += ` (${lists.pagination.count} total)`;
        }
        responseText += `\nSorted by: ${params.sort} ${params.order}`;
        if (Object.keys(args || {}).length > 0) {
          responseText += `\nCustom filters: ${JSON.stringify(args, null, 2)}`;
        }
        responseText += `\n\nLists: ${JSON.stringify(lists, null, 2)}`;
        
        return {
          content: [
            {
              type: 'text',
              text: responseText,
            },
          ],
        };
      }

      case 'cakemail_create_list': {
        const { name: listName, description, language } = args as {
          name: string;
          description?: string;
          language?: string;
        };
        const list = await api.createList({
          name: listName,
          description,
          language: language || 'en_US',
        });
        return {
          content: [
            {
              type: 'text',
              text: `List created successfully: ${JSON.stringify(list, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_list': {
        const { list_id } = args as { list_id: string };
        const list = await api.getList(list_id);
        return {
          content: [
            {
              type: 'text',
              text: `List details: ${JSON.stringify(list, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_update_list': {
        const { list_id, name: listName, description, language } = args as {
          list_id: string;
          name?: string;
          description?: string;
          language?: string;
        };
        
        const updateData: any = {};
        if (listName) updateData.name = listName;
        if (description) updateData.description = description;
        if (language) updateData.language = language;
        
        const list = await api.updateList(list_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: `List updated successfully: ${JSON.stringify(list, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_delete_list': {
        const { list_id } = args as { list_id: string };
        await api.deleteList(list_id);
        return {
          content: [
            {
              type: 'text',
              text: `List ${list_id} deleted successfully`,
            },
          ],
        };
      }

      // Contact Management with default sorting
      case 'cakemail_get_contacts': {
        const { list_id, page, per_page } = args as {
          list_id?: string;
          page?: number;
          per_page?: number;
        };
        
        const params: any = {};
        if (list_id) params.list_id = list_id;
        if (page) params.page = page;
        if (per_page) params.per_page = per_page;
        
        const contacts = await api.getContacts(params);
        return {
          content: [
            {
              type: 'text',
              text: `Contacts: ${JSON.stringify(contacts, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_create_contact': {
        const { email, first_name, last_name, list_id, custom_fields } = args as {
          email: string;
          first_name?: string;
          last_name?: string;
          list_id: string;
          custom_fields?: any;
        };
        
        if (!validateEmail(email)) {
          throw new Error('Invalid email format');
        }
        
        const contact = await api.createContact({
          email,
          first_name,
          last_name,
          list_id,
          custom_fields,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Contact created successfully: ${JSON.stringify(contact, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_contact': {
        const { contact_id } = args as { contact_id: string };
        const contact = await api.getContact(contact_id);
        return {
          content: [
            {
              type: 'text',
              text: `Contact details: ${JSON.stringify(contact, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_update_contact': {
        const { contact_id, email, first_name, last_name, custom_fields } = args as {
          contact_id: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          custom_fields?: any;
        };
        
        if (email && !validateEmail(email)) {
          throw new Error('Invalid email format');
        }
        
        const updateData: any = {};
        if (email) updateData.email = email;
        if (first_name) updateData.first_name = first_name;
        if (last_name) updateData.last_name = last_name;
        if (custom_fields) updateData.custom_fields = custom_fields;
        
        const contact = await api.updateContact(contact_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: `Contact updated successfully: ${JSON.stringify(contact, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_delete_contact': {
        const { contact_id } = args as { contact_id: string };
        await api.deleteContact(contact_id);
        return {
          content: [
            {
              type: 'text',
              text: `Contact ${contact_id} deleted successfully`,
            },
          ],
        };
      }

      // Transactional Email
      case 'cakemail_send_transactional_email': {
        const { to_email, to_name, sender_id, subject, html_content, text_content, template_id } = args as {
          to_email: string;
          to_name?: string;
          sender_id: string;
          subject: string;
          html_content: string;
          text_content?: string;
          template_id?: string;
        };
        
        if (!validateEmail(to_email)) {
          throw new Error('Invalid recipient email format');
        }
        
        const email = await api.sendTransactionalEmail({
          to_email,
          to_name,
          sender_id,
          subject,
          html_content,
          text_content,
          template_id,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Transactional email sent successfully: ${JSON.stringify(email, null, 2)}`,
            },
          ],
        };
      }

      // Enhanced Campaign Management
      case 'cakemail_get_campaigns': {
        const { 
          page, 
          per_page, 
          sort, 
          order, 
          status, 
          name, 
          created_after, 
          created_before, 
          with_count 
        } = args as { 
          page?: number; 
          per_page?: number; 
          sort?: string; 
          order?: string; 
          status?: string; 
          name?: string; 
          created_after?: string; 
          created_before?: string; 
          with_count?: boolean; 
        };
        
        // Validate date formats
        if (created_after && !validateDate(created_after)) {
          throw new Error('created_after must be in YYYY-MM-DD format');
        }
        if (created_before && !validateDate(created_before)) {
          throw new Error('created_before must be in YYYY-MM-DD format');
        }
        
        // Apply intelligent defaults for better UX
        const params: any = {
          sort: sort || 'created_on',
          order: order || 'desc'
        };
        if (page) params.page = page;
        if (per_page) params.per_page = per_page;
        if (status) params.status = status;
        if (name) params.name = name;
        if (created_after) params.created_after = created_after;
        if (created_before) params.created_before = created_before;
        if (with_count) params.with_count = with_count;
        
        const campaigns = await api.getCampaignsWithDefaults(params);
        
        let responseText = `Found ${campaigns.data?.length || 0} campaigns`;
        if (campaigns.pagination?.count) {
          responseText += ` (${campaigns.pagination.count} total)`;
        }
        responseText += `\nSorted by: ${params.sort} ${params.order} (latest first)`;
        if (Object.keys(args || {}).length > 0) {
          responseText += `\nCustom filters: ${JSON.stringify(args, null, 2)}`;
        }
        responseText += `\n\nCampaigns: ${JSON.stringify(campaigns, null, 2)}`;
        
        return {
          content: [
            {
              type: 'text',
              text: responseText,
            },
          ],
        };
      }

      case 'cakemail_get_latest_campaign': {
        const { status, include_analytics } = args as {
          status?: string;
          include_analytics?: boolean;
        };

        // Get the latest campaign using enhanced API method
        const latestCampaign = await api.getLatestCampaign(status);
        
        if (!latestCampaign) {
          return {
            content: [
              {
                type: 'text',
                text: status 
                  ? `No campaigns found with status: ${status}`
                  : 'No campaigns found in your account',
              },
            ],
          };
        }

        let responseText = `🎯 **Latest Campaign**\n\n${formatCampaignSummary(latestCampaign)}`;

        // Include analytics if requested and campaign is sent
        if (include_analytics && latestCampaign.status === 'sent') {
          try {
            const analytics = await api.getCampaignAnalytics(String(latestCampaign.id));
            responseText += `\n\n📊 **Performance Analytics**\n${formatCampaignAnalytics(analytics)}`;
          } catch (error) {
            responseText += `\n\n📊 **Analytics**: Not available yet (${getErrorMessage(error)})`;
          }
        } else if (include_analytics) {
          responseText += `\n\n📊 **Analytics**: Not available (campaign status: ${latestCampaign.status})`;
        }

        responseText += `\n\n**Raw Data:**\n${JSON.stringify(latestCampaign, null, 2)}`;

        return {
          content: [
            {
              type: 'text',
              text: responseText,
            },
          ],
        };
      }

      case 'cakemail_create_campaign': {
        const { 
          name: campaignName, 
          subject, 
          html_content, 
          text_content, 
          list_id, 
          sender_id,
          from_name,
          reply_to
        } = args as {
          name: string;
          subject: string;
          html_content: string;
          text_content?: string;
          list_id: string;
          sender_id: string;
          from_name?: string;
          reply_to?: string;
        };
        
        if (reply_to && !validateEmail(reply_to)) {
          throw new Error('Invalid reply_to email format');
        }
        
        const campaignData = {
          name: campaignName,
          subject,
          html_content,
          text_content,
          list_id,
          sender_id,
          from_name,
          reply_to
        };
        
        const campaign = await api.createCampaign(campaignData);
        
        const campaignDetails = campaign.data || campaign;
        const verification = [
          `✅ Campaign ID: ${campaignDetails.id}`,
          `✅ Name: ${campaignDetails.name}`,
          `✅ Subject: ${campaignDetails.subject || 'SAVED'}`,
          `✅ HTML Content: ${campaignDetails.html_content ? 'SAVED' : 'NULL'}`,
          `✅ Text Content: ${campaignDetails.text_content ? 'SAVED' : 'NULL'}`,
          `✅ List ID: ${campaignDetails.list_id || 'NULL'}`,
          `✅ Sender ID: ${campaignDetails.sender_id || 'NULL'}`,
          `✅ Status: ${campaignDetails.status || 'NULL'}`
        ].join('\n');
        
        return {
          content: [
            {
              type: 'text',
              text: `Draft campaign created successfully!\n\n${verification}\n\nFull response: ${JSON.stringify(campaign, null, 2)}`,
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
              text: `Campaign details: ${JSON.stringify(campaign, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_update_campaign': {
        const { 
          campaign_id, 
          name: campaignName, 
          subject, 
          html_content, 
          text_content,
          from_name,
          reply_to
        } = args as {
          campaign_id: string;
          name?: string;
          subject?: string;
          html_content?: string;
          text_content?: string;
          from_name?: string;
          reply_to?: string;
        };
        
        if (reply_to && !validateEmail(reply_to)) {
          throw new Error('Invalid reply_to email format');
        }
        
        const updateData: any = {};
        if (campaignName) updateData.name = campaignName;
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
              text: `Campaign updated successfully: ${JSON.stringify(campaign, null, 2)}`,
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
              text: `Campaign sent successfully: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_delete_campaign': {
        const { campaign_id } = args as { campaign_id: string };
        await api.deleteCampaign(campaign_id);
        return {
          content: [
            {
              type: 'text',
              text: `Campaign ${campaign_id} deleted successfully`,
            },
          ],
        };
      }

      // Template Management
      case 'cakemail_get_templates': {
        const { page, per_page } = args as { page?: number; per_page?: number };
        const params: any = {};
        if (page) params.page = page;
        if (per_page) params.per_page = per_page;
        
        const templates = await api.getTemplates(params);
        return {
          content: [
            {
              type: 'text',
              text: `Templates: ${JSON.stringify(templates, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_template': {
        const { template_id } = args as { template_id: string };
        const template = await api.getTemplate(template_id);
        return {
          content: [
            {
              type: 'text',
              text: `Template details: ${JSON.stringify(template, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_create_template': {
        const { name, subject, html_content, text_content, description } = args as {
          name: string;
          subject?: string;
          html_content: string;
          text_content?: string;
          description?: string;
        };
        
        const template = await api.createTemplate({
          name,
          subject,
          html_content,
          text_content,
          description,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Template created successfully: ${JSON.stringify(template, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_update_template': {
        const { template_id, name, subject, html_content, text_content, description } = args as {
          template_id: string;
          name?: string;
          subject?: string;
          html_content?: string;
          text_content?: string;
          description?: string;
        };
        
        const updateData: any = {};
        if (name) updateData.name = name;
        if (subject) updateData.subject = subject;
        if (html_content) updateData.html_content = html_content;
        if (text_content) updateData.text_content = text_content;
        if (description) updateData.description = description;
        
        const template = await api.updateTemplate(template_id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: `Template updated successfully: ${JSON.stringify(template, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_delete_template': {
        const { template_id } = args as { template_id: string };
        await api.deleteTemplate(template_id);
        return {
          content: [
            {
              type: 'text',
              text: `Template ${template_id} deleted successfully`,
            },
          ],
        };
      }

      // Analytics
      case 'cakemail_get_campaign_analytics': {
        const { campaign_id } = args as { campaign_id: string };
        const analytics = await api.getCampaignAnalytics(campaign_id);
        return {
          content: [
            {
              type: 'text',
              text: `Campaign analytics: ${JSON.stringify(analytics, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_transactional_analytics': {
        const { start_date, end_date } = args as { start_date?: string; end_date?: string };
        
        if (start_date && !validateDate(start_date)) {
          throw new Error('start_date must be in YYYY-MM-DD format');
        }
        if (end_date && !validateDate(end_date)) {
          throw new Error('end_date must be in YYYY-MM-DD format');
        }
        
        const params: any = {};
        if (start_date) params.start_date = start_date;
        if (end_date) params.end_date = end_date;
        
        const analytics = await api.getTransactionalAnalytics(params);
        return {
          content: [
            {
              type: 'text',
              text: `Transactional analytics: ${JSON.stringify(analytics, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_list_analytics': {
        const { list_id } = args as { list_id: string };
        const analytics = await api.getListAnalytics(list_id);
        return {
          content: [
            {
              type: 'text',
              text: `List analytics: ${JSON.stringify(analytics, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_account_analytics': {
        const { start_date, end_date } = args as { start_date?: string; end_date?: string };
        
        if (start_date && !validateDate(start_date)) {
          throw new Error('start_date must be in YYYY-MM-DD format');
        }
        if (end_date && !validateDate(end_date)) {
          throw new Error('end_date must be in YYYY-MM-DD format');
        }
        
        const params: any = {};
        if (start_date) params.start_date = start_date;
        if (end_date) params.end_date = end_date;
        
        const analytics = await api.getAccountAnalytics(params);
        return {
          content: [
            {
              type: 'text',
              text: `Account analytics: ${JSON.stringify(analytics, null, 2)}`,
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

      case 'cakemail_patch_self_account': {
        const { name, email } = args as {
          name?: string;
          email?: string;
        };
        
        if (email && !validateEmail(email)) {
          throw new Error('Invalid email format');
        }
        
        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        
        const account = await api.patchSelfAccount(updateData);
        return {
          content: [
            {
              type: 'text',
              text: `Account updated successfully: ${JSON.stringify(account, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_convert_account_to_organization': {
        const account = await api.convertSelfAccountToOrganization();
        return {
          content: [
            {
              type: 'text',
              text: `Account converted to organization: ${JSON.stringify(account, null, 2)}`,
            },
          ],
        };
      }

      // Automation
      case 'cakemail_get_automations': {
        const { page, per_page, status } = args as { page?: number; per_page?: number; status?: string };
        const params: any = {};
        if (page) params.page = page;
        if (per_page) params.per_page = per_page;
        if (status) params.status = status;
        
        const automations = await api.getAutomations(params);
        return {
          content: [
            {
              type: 'text',
              text: `Automations: ${JSON.stringify(automations, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_get_automation': {
        const { automation_id } = args as { automation_id: string };
        const automation = await api.getAutomation(automation_id);
        return {
          content: [
            {
              type: 'text',
              text: `Automation details: ${JSON.stringify(automation, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_create_automation': {
        const { name, description, trigger, actions } = args as {
          name: string;
          description?: string;
          trigger: any;
          actions: any[];
        };
        
        const automation = await api.createAutomation({
          name,
          description,
          trigger,
          actions,
        });
        return {
          content: [
            {
              type: 'text',
              text: `Automation created successfully: ${JSON.stringify(automation, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_start_automation': {
        const { automation_id } = args as { automation_id: string };
        const result = await api.startAutomation(automation_id);
        return {
          content: [
            {
              type: 'text',
              text: `Automation started successfully: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'cakemail_stop_automation': {
        const { automation_id } = args as { automation_id: string };
        const result = await api.stopAutomation(automation_id);
        return {
          content: [
            {
              type: 'text',
              text: `Automation stopped successfully: ${JSON.stringify(result, null, 2)}`,
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
