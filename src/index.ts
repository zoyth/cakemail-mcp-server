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
    version: '1.4.0', // Bump version for Sub-Account Management
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

function validatePassword(password: string): boolean {
  return password && password.length >= 8;
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
