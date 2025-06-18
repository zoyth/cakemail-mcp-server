import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';

// Define List type locally to fix implicit any types
interface List {
  id: number;
  name: string;
  status?: string;
  language?: string;
  created_on?: string;
  updated_on?: string;
  default_sender?: {
    name: string;
    email: string;
  };
  contacts_count?: number;
  active_contacts_count?: number;
  unsubscribed_contacts_count?: number;
}

export async function handleListLists(args: any, api: CakemailAPI) {
  try {
    const { 
      page, per_page, status, name, sort, order, with_count, account_id 
    } = args;
    
    const lists = await api.lists.getLists({
      page: page || 1,
      per_page: per_page || 50,
      ...(status && { status }),
      ...(name && { name }),
      sort: sort || 'created_on',
      order: (order as 'asc' | 'desc') || 'desc',
      with_count: with_count !== false,
      ...(account_id !== undefined && { account_id })
    });

    const total = lists.pagination?.count || 0;
    const listData = lists.data?.slice(0, 20).map((list: List) => ({
      id: list.id,
      name: list.name,
      status: list.status,
      language: list.language,
      created_on: list.created_on,
      updated_on: list.updated_on,
      default_sender: list.default_sender,
      contacts_count: list.contacts_count,
      active_contacts_count: list.active_contacts_count,
      unsubscribed_contacts_count: list.unsubscribed_contacts_count
    }));

    return {
      content: [
        {
          type: 'text',
          text: `📋 **Contact Lists (${total} total)**\n\n` +
                `**Applied Filters:**\n` +
                `• Status: ${status || 'all'}\n` +
                `• Name Filter: ${name || 'none'}\n` +
                `• Sort: ${sort || 'created_on'} (${order || 'desc'})\n\n` +
                `**Showing ${listData?.length || 0} lists:**\n\n` +
                (listData?.map((list: any, i: number) => 
                  `${i + 1}. **${list.name}** (${list.id})\n` +
                  `   🏷️ Status: ${list.status || 'N/A'}\n` +
                  `   🌐 Language: ${list.language || 'N/A'}\n` +
                  `   👤 Default Sender: ${list.default_sender?.name || 'N/A'} <${list.default_sender?.email || 'N/A'}>\n` +
                  `   📊 Contacts: ${list.contacts_count || 0} total, ${list.active_contacts_count || 0} active, ${list.unsubscribed_contacts_count || 0} unsubscribed\n` +
                  `   📅 Created: ${list.created_on || 'N/A'}\n` +
                  `   🔄 Updated: ${list.updated_on || 'N/A'}`
                ).join('\n\n') || 'No lists found.') +
                (total > 20 ? `\n\n**... and ${total - 20} more lists**` : '') +
                `\n\n**Full Response:**\n${JSON.stringify(lists, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleCreateList(args: any, api: CakemailAPI) {
  try {
    const { 
      name, 
      default_sender, 
      language = 'en_US', 
      redirections = {}, 
      webhook = {},
      account_id 
    } = args;

    // Validate required fields
    if (!name || !default_sender) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Fields**\n\nRequired: name, default_sender (with name and email)'
        }]
      };
    }

    if (!default_sender.name || !default_sender.email) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Invalid Default Sender**\n\ndefault_sender must include both name and email fields'
        }]
      };
    }

    const listData: any = {
      name,
      default_sender,
      language,
      redirections,
      webhook
    };

    const result = await api.lists.createList(listData, { account_id });
    
    return {
      content: [{
        type: 'text',
        text: `✅ **Contact List Created Successfully**\n\n` +
              `📋 **List Details:**\n` +
              `• ID: ${result.data?.id}\n` +
              `• Name: ${name}\n` +
              `• Language: ${language}\n` +
              `• Default Sender: ${default_sender.name} <${default_sender.email}>\n` +
              `• Redirections: ${Object.keys(redirections).length > 0 ? Object.keys(redirections).join(', ') : 'None'}\n` +
              `• Webhook: ${webhook.url ? 'Configured' : 'Not configured'}\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetList(args: any, api: CakemailAPI) {
  try {
    const { list_id, account_id } = args;

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    const result = await api.lists.getList(list_id, { account_id });
    const list = result.data;
    
    return {
      content: [{
        type: 'text',
        text: `📋 **Contact List Details**\n\n` +
              `**Basic Information:**\n` +
              `• ID: ${list?.id}\n` +
              `• Name: ${list?.name}\n` +
              `• Status: ${list?.status}\n` +
              `• Language: ${list?.language}\n` +
              `• Created: ${list?.created_on}\n` +
              `• Updated: ${list?.updated_on}\n\n` +
              `**Default Sender:**\n` +
              `• Name: ${list?.default_sender?.name}\n` +
              `• Email: ${list?.default_sender?.email}\n\n` +
              `**Contact Statistics:**\n` +
              `• Total Contacts: ${list?.contacts_count || 0}\n` +
              `• Active: ${list?.active_contacts_count || 0}\n` +
              `• Unsubscribed: ${list?.unsubscribed_contacts_count || 0}\n` +
              `• Bounced: ${list?.bounced_contacts_count || 0}\n\n` +
              `**Configuration:**\n` +
              `• Redirections: ${list?.redirections ? Object.keys(list.redirections).join(', ') || 'None' : 'None'}\n` +
              `• Webhook: ${list?.webhook?.url ? 'Configured' : 'Not configured'}\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleUpdateList(args: any, api: CakemailAPI) {
  try {
    const { 
      list_id,
      name, 
      default_sender, 
      language, 
      redirections, 
      webhook,
      account_id 
    } = args;

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    let updateData: any = {};
    
    // Only include fields that are provided
    if (name !== undefined) updateData.name = name;
    if (default_sender !== undefined) {
      if (!default_sender.name || !default_sender.email) {
        return {
          content: [{
            type: 'text',
            text: '❌ **Invalid Default Sender**\n\ndefault_sender must include both name and email fields'
          }]
        };
      }
      updateData.default_sender = default_sender;
    }
    if (language !== undefined) updateData.language = language;
    if (redirections !== undefined) updateData.redirections = redirections;
    if (webhook !== undefined) updateData.webhook = webhook;

    if (Object.keys(updateData).length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **No Update Data**\n\nAt least one field must be provided for update.'
        }]
      };
    }

    const result = await api.lists.updateList(list_id, updateData, { account_id });
    
    return {
      content: [{
        type: 'text',
        text: `✅ **Contact List Updated Successfully**\n\n` +
              `📋 **List Details:**\n` +
              `• ID: ${list_id}\n` +
              `• Fields Updated: ${Object.keys(updateData).join(', ')}\n` +
              (updateData.name ? `• New Name: ${updateData.name}\n` : '') +
              (updateData.default_sender ? `• New Default Sender: ${updateData.default_sender.name} <${updateData.default_sender.email}>\n` : '') +
              (updateData.language ? `• New Language: ${updateData.language}\n` : '') +
              (updateData.redirections ? `• Redirections Updated: ${Object.keys(updateData.redirections).join(', ')}\n` : '') +
              (updateData.webhook ? `• Webhook Updated: ${updateData.webhook.url ? 'Configured' : 'Removed'}\n` : '') +
              `\n**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDeleteList(args: any, api: CakemailAPI) {
  try {
    const { list_id, account_id } = args;

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    const result = await api.lists.deleteList(list_id, { account_id });
    
    return {
      content: [{
        type: 'text',
        text: `✅ **Contact List Deleted Successfully**\n\n` +
              `📋 **Deleted List:**\n` +
              `• ID: ${list_id}\n` +
              `• Status: Permanently deleted\n\n` +
              `⚠️ **Warning:** This action is permanent and cannot be undone.\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleArchiveList(args: any, api: CakemailAPI) {
  try {
    const { list_id, account_id } = args;

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    const result = await api.lists.archiveList(list_id, { account_id });
    
    return {
      content: [{
        type: 'text',
        text: `✅ **Contact List Archived Successfully**\n\n` +
              `📋 **Archived List:**\n` +
              `• ID: ${list_id}\n` +
              `• Status: Archived\n\n` +
              `ℹ️ **Info:** The list has been removed from active lists but data is preserved. It can be restored later if needed.\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetListStats(args: any, api: CakemailAPI) {
  try {
    const { 
      list_id, 
      start_time, 
      end_time, 
      interval = 'day',
      account_id 
    } = args;

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    const params: any = {
      list_id,
      interval,
      ...(account_id !== undefined && { account_id })
    };

    if (start_time) params.start_time = start_time;
    if (end_time) params.end_time = end_time;

    const result = await api.lists.getListStats(params);
    const stats = result.data;
    
    return {
      content: [{
        type: 'text',
        text: `📊 **List Performance Statistics**\n\n` +
              `📋 **List ID:** ${list_id}\n` +
              `📅 **Time Period:** ${start_time ? new Date(start_time * 1000).toISOString() : 'All time'} to ${end_time ? new Date(end_time * 1000).toISOString() : 'Now'}\n` +
              `⏱️ **Interval:** ${interval}\n\n` +
              `**Key Metrics:**\n` +
              `• Total Contacts: ${stats?.total_contacts || 0}\n` +
              `• Active Contacts: ${stats?.active_contacts || 0}\n` +
              `• Unsubscribed: ${stats?.unsubscribed_contacts || 0}\n` +
              `• Bounced: ${stats?.bounced_contacts || 0}\n` +
              `• New Subscribers: ${stats?.new_subscribers || 0}\n` +
              `• Unsubscribe Rate: ${stats?.unsubscribe_rate || 0}%\n` +
              `• Growth Rate: ${stats?.growth_rate || 0}%\n\n` +
              `**Activity Summary:**\n` +
              `• Campaigns Sent: ${stats?.campaigns_sent || 0}\n` +
              `• Total Opens: ${stats?.total_opens || 0}\n` +
              `• Total Clicks: ${stats?.total_clicks || 0}\n` +
              `• Open Rate: ${stats?.open_rate || 0}%\n` +
              `• Click Rate: ${stats?.click_rate || 0}%\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}
