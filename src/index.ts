#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import 'dotenv/config';
import { CakemailAPI } from './cakemail-api.js';

const server = new Server(
  {
    name: 'cakemail-mcp-server',
    version: '1.0.0',
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
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
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
        name: 'cakemail_get_lists',
        description: 'Get contact lists',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number for pagination' },
            per_page: { type: 'number', description: 'Number of lists per page' },
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
        name: 'cakemail_get_contacts',
        description: 'Get contacts from lists',
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
      {
        name: 'cakemail_get_campaigns',
        description: 'Get list of campaigns with filtering and sorting',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number for pagination' },
            per_page: { type: 'number', description: 'Number of campaigns per page (max 50)' },
            sort: { type: 'string', enum: ['name', 'created_on'], description: 'Sort field' },
            order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction' },
            status: { type: 'string', enum: ['incomplete', 'draft', 'scheduled', 'sending', 'sent', 'archived'], description: 'Filter by campaign status' },
            name: { type: 'string', description: 'Filter campaigns by name (partial match)' },
            created_after: { type: 'string', description: 'Filter campaigns created after date (YYYY-MM-DD)' },
            created_before: { type: 'string', description: 'Filter campaigns created before date (YYYY-MM-DD)' },
            with_count: { type: 'boolean', description: 'Include total count in response' }
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
    ],
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
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

      case 'cakemail_get_lists': {
        const { page, per_page, sort, order, status, name } = args as { 
          page?: number; 
          per_page?: number; 
          sort?: string; 
          order?: string; 
          status?: string; 
          name?: string; 
        };
        
        const params: any = {};
        if (page) params.page = page;
        if (per_page) params.per_page = per_page;
        if (sort) params.sort = sort;
        if (order) params.order = order;
        if (status) params.status = status;
        if (name) params.name = name;
        
        const lists = await api.getLists(params);
        
        let responseText = `Found ${lists.data?.length || 0} lists`;
        if (Object.keys(params).length > 0) {
          responseText += `\nFilters applied: ${JSON.stringify(params, null, 2)}`;
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
        const email = await api.sendTransactionalEmail({
          email: {
            email: to_email,
            name: to_name,
            sender: sender_id,
            content: {
              subject,
              html: html_content,
              text: text_content,
              encoding: 'utf-8',
            },
            template_id,
          },
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
        
        const params: any = {};
        if (page) params.page = page;
        if (per_page) params.per_page = per_page;
        if (sort) params.sort = sort;
        if (order) params.order = order;
        if (status) params.status = status;
        if (name) params.name = name;
        if (created_after) params.created_after = created_after;
        if (created_before) params.created_before = created_before;
        if (with_count) params.with_count = with_count;
        
        const campaigns = await api.getCampaigns(params);
        
        // Enhanced response with filtering info
        let responseText = `Found ${campaigns.data?.length || 0} campaigns`;
        if (campaigns.pagination?.count) {
          responseText += ` (${campaigns.pagination.count} total)`;
        }
        if (Object.keys(params).length > 0) {
          responseText += `\nFilters applied: ${JSON.stringify(params, null, 2)}`;
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
        
        // Get the created campaign details for verification
        const campaignDetails = campaign.data || campaign;
        const content = campaignDetails.content || {};
        const audience = campaignDetails.audience || {};
        const sender = campaignDetails.sender || {};
        
        const verification = [
          `✅ Campaign ID: ${campaignDetails.id}`,
          `✅ Name: ${campaignDetails.name}`,
          `✅ Subject: ${content.subject || 'NULL'}`,
          `✅ HTML Content: ${content.html ? 'SAVED' : 'NULL'}`,
          `✅ Text Content: ${content.text ? 'SAVED' : 'NULL'}`,
          `✅ List ID: ${audience.list_id || 'NULL'}`,
          `✅ Sender: ${sender.name || 'NULL'}`,
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

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${getErrorMessage(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Cakemail MCP server running on stdio');
}

main().catch(console.error);