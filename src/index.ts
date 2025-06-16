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
    version: '1.3.0', // Bump version for Email API updates
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

      // Email API (updated naming and description)
      {
        name: 'cakemail_send_transactional_email',
        description: 'Send an email using Cakemail v2 Email API (supports both transactional and marketing emails)',
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

      // Email API (updated to use new EmailApi)
      case 'cakemail_send_transactional_email': {
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
              text: `📧 **Email sent successfully via v2 API!**\\n\\n` +
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
