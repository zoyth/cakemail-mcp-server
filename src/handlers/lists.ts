import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';
import logger from '../utils/logger.js';
import { normalizeAccountId } from '../utils/validation.js';

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
  bounced_contacts_count?: number;
}

export async function handleListLists(args: any, api: CakemailAPI) {
  try {
    const { 
      page, per_page, status, name, sort, order, with_count, account_id 
    } = args;
    const normalizedAccountId = normalizeAccountId(account_id);
    const lists = await api.lists.getLists({
      page: page || 1,
      per_page: per_page || 50,
      ...(status && { status }),
      ...(name && { name }),
      sort: sort || 'created_on',
      order: (order as 'asc' | 'desc') || 'desc',
      with_count: with_count !== false,
      ...(normalizedAccountId !== undefined && { account_id: normalizedAccountId })
    });

    const total = lists.pagination?.count || 0;
    
    // Fetch detailed information for each list to get contact counts
    const detailedLists = await Promise.all(
      (lists.data?.slice(0, 20) || []).map(async (list: List) => {
        try {
          // Get list statistics from reports API
          logger.info(`Fetching stats for list ${list.id}...`);
          const listStats = await api.reports.getListStats(list.id.toString(), normalizedAccountId);
          const stats = listStats.data;
          
          logger.debug(`List ${list.id} reports stats response:`, { stats: listStats });
          
          return {
            id: list.id,
            name: list.name,
            status: list.status,
            language: list.language,
            created_on: list.created_on,
            updated_on: list.updated_on,
            default_sender: list.default_sender,
            contacts_count: stats?.total_contacts || 0,
            active_contacts_count: stats?.active_contacts || 0,
            unsubscribed_contacts_count: stats?.unsubscribed_contacts || 0,
            bounced_contacts_count: stats?.bounced_contacts || 0
          };
        } catch (error) {
          // If reports API fails, return basic info
          logger.error(`Error fetching stats for list ${list.id}:`, error);
          return {
            id: list.id,
            name: list.name,
            status: list.status,
            language: list.language,
            created_on: list.created_on,
            updated_on: list.updated_on,
            default_sender: list.default_sender,
            contacts_count: 0,
            active_contacts_count: 0,
            unsubscribed_contacts_count: 0,
            bounced_contacts_count: 0
          };
        }
      })
    );

    return {
      content: [
        {
          type: 'text',
          text: `📋 **Contact Lists (${total} total)**\n\n` +
                `**Applied Filters:**\n` +
                `• Status: ${status || 'all'}\n` +
                `• Name Filter: ${name || 'none'}\n` +
                `• Sort: ${sort || 'created_on'} (${order || 'desc'})\n\n` +
                `**Showing ${detailedLists?.length || 0} of ${total} lists:**\n\n` +
                (detailedLists?.map((list: any, i: number) => 
                  `${i + 1}. **${list.name}** (${list.id})\n` +
                  `   🏷️ Status: ${list.status || 'N/A'}\n` +
                  `   🌐 Language: ${list.language || 'N/A'}\n` +
                  `   👤 Default Sender: ${list.default_sender?.name || 'N/A'} <${list.default_sender?.email || 'N/A'}>\n` +
                  `   📊 Contacts: ${list.contacts_count || 0} total, ${list.active_contacts_count || 0} active, ${list.unsubscribed_contacts_count || 0} unsubscribed, ${list.bounced_contacts_count || 0} bounced\n` +
                  `   📅 Created: ${list.created_on || 'N/A'}\n` +
                  `   🔄 Updated: ${list.updated_on || 'N/A'}`
                ).join('\n\n') || 'No lists found.') +
                (total > (detailedLists?.length || 0) ? `\n\n**... and ${total - (detailedLists?.length || 0)} more lists**` : '') +
                `\n\n**Debug Info:**\n${JSON.stringify(detailedLists, null, 2)}`,
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
    const normalizedAccountId = normalizeAccountId(account_id);

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

    const sender = await api.senders.ensureSenderExists(default_sender.email, default_sender.name);
    if (!sender || !sender.id) {
      // Get available confirmed senders to suggest alternatives
      const confirmedSenders = await api.senders.getConfirmedSenders();
      const senderSuggestions = confirmedSenders.length > 0 
        ? `\n\n**Available confirmed senders:**\n${confirmedSenders.map(s => `• ${s.name} <${s.email}>`).join('\n')}`
        : '\n\n**No confirmed senders available.** Please confirm a sender in your Cakemail account first.';
      
      return {
        content: [{
          type: 'text',
          text: `❌ **Could not find or create a confirmed sender for ${default_sender.email}**${senderSuggestions}`
        }]
      };
    }

    const listData: any = {
      name,
      default_sender: {
        id: sender.id
      },
      language,
      redirections,
      webhook
    };

    const result = await api.lists.createList(listData, normalizedAccountId !== undefined ? { account_id: normalizedAccountId } : {});
    
    logger.info('List created successfully', { result });
    
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
      }],
      debug: JSON.stringify(result, null, 2)
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetList(args: any, api: CakemailAPI) {
  try {
    const { list_id, account_id } = args;
    const normalizedAccountId = normalizeAccountId(account_id);

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    const result = await api.lists.getList(list_id, normalizedAccountId !== undefined ? { account_id: normalizedAccountId } : {});
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
    const normalizedAccountId = normalizeAccountId(account_id);

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
      const sender = await api.senders.ensureSenderExists(default_sender.email, default_sender.name);
      if (!sender || !sender.id) {
        // Get available confirmed senders to suggest alternatives
        const confirmedSenders = await api.senders.getConfirmedSenders();
        const senderSuggestions = confirmedSenders.length > 0 
          ? `\n\n**Available confirmed senders:**\n${confirmedSenders.map(s => `• ${s.name} <${s.email}>`).join('\n')}`
          : '\n\n**No confirmed senders available.** Please confirm a sender in your Cakemail account first.';
        
        return {
          content: [{
            type: 'text',
            text: `❌ **Could not find or create a confirmed sender for ${default_sender.email}**${senderSuggestions}`
          }]
        };
      }
      updateData.default_sender = { id: sender.id };
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

    const result = await api.lists.updateList(list_id, updateData, normalizedAccountId !== undefined ? { account_id: normalizedAccountId } : {});
    
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
    const normalizedAccountId = normalizeAccountId(account_id);

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    await api.lists.deleteList(list_id, normalizedAccountId !== undefined ? { account_id: normalizedAccountId } : {});
    
    return {
      content: [{
        type: 'text',
        text: `✅ **List Deleted Successfully**\n\nList with ID \`${list_id}\` has been deleted.`,
      }],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleArchiveList(args: any, api: CakemailAPI) {
  try {
    const { list_id, account_id } = args;
    const normalizedAccountId = normalizeAccountId(account_id);

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    await api.lists.archiveList(list_id, normalizedAccountId !== undefined ? { account_id: normalizedAccountId } : {});
    
    return {
      content: [{
        type: 'text',
        text: `✅ **List Archived Successfully**\n\nList with ID \`${list_id}\` has been archived.`,
      }],
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
    const normalizedAccountId = normalizeAccountId(account_id);

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    const result = await api.reports.getListStats(list_id, normalizedAccountId);
    const stats = result.data;
    
    // Calculate total contacts from all contact types
    const totalContacts = (stats?.active_contacts || 0) + 
                         (stats?.pending_contacts || 0) + 
                         (stats?.invalid_contacts || 0) + 
                         (stats?.unsubscribed_contacts || 0) + 
                         (stats?.flagged_contacts || 0) + 
                         (stats?.deleted_contacts || 0);
    
    // Assess list hygiene based on API-provided rates
    let hygieneAssessment = '';
    const bounceRate = stats?.bounce_rate || 0;
    const spamRate = stats?.spam_rate || 0;
    
    if (bounceRate > 5) {
      hygieneAssessment = '⚠️ **List Hygiene Alert**: High bounce rate suggests list cleanup needed';
    } else if (bounceRate > 2) {
      hygieneAssessment = '⚠️ **List Hygiene Warning**: Moderate bounce rate - consider cleanup';
    } else if (spamRate > 0.1) {
      hygieneAssessment = '⚠️ **List Hygiene Warning**: Elevated spam rate - review content and sender reputation';
    } else {
      hygieneAssessment = '✅ **Good List Hygiene**: Low bounce and spam rates indicate well-maintained list';
    }
    
    return {
      content: [{
        type: 'text',
        text: `📊 **List Performance Statistics**\n\n` +
              `📋 **List ID:** ${list_id}\n` +
              `📅 **Time Period:** ${start_time ? new Date(start_time * 1000).toISOString() : 'All time'} to ${end_time ? new Date(end_time * 1000).toISOString() : 'Now'}\n` +
              `⏱️ **Interval:** ${interval}\n\n` +
              `**📈 Contact Breakdown:**\n` +
              `• Total Contacts: ${totalContacts.toLocaleString()}\n` +
              `• Active Contacts: ${(stats?.active_contacts || 0).toLocaleString()}\n` +
              `• Pending Contacts: ${(stats?.pending_contacts || 0).toLocaleString()}\n` +
              `• Invalid Contacts: ${(stats?.invalid_contacts || 0).toLocaleString()}\n` +
              `• Unsubscribed Contacts: ${(stats?.unsubscribed_contacts || 0).toLocaleString()}\n` +
              `• Flagged Contacts: ${(stats?.flagged_contacts || 0).toLocaleString()}\n` +
              `• Deleted Contacts: ${(stats?.deleted_contacts || 0).toLocaleString()}\n\n` +
              `**📊 Performance Rates (API Provided):**\n` +
              `• Open Rate: ${(stats?.open_rate || 0).toFixed(2)}%\n` +
              `• Click Rate: ${(stats?.click_rate || 0).toFixed(2)}%\n` +
              `• Click-Through Rate: ${(stats?.clickthru_rate || 0).toFixed(2)}%\n` +
              `• Bounce Rate: ${(stats?.bounce_rate || 0).toFixed(2)}%\n` +
              `• Unsubscribe Rate: ${(stats?.unsubscribe_rate || 0).toFixed(2)}%\n` +
              `• Spam Rate: ${(stats?.spam_rate || 0).toFixed(2)}%\n\n` +
              `**📧 Email Volume:**\n` +
              `• Total Emails Sent: ${(stats?.sent_emails || 0).toLocaleString()}\n\n` +
              `${hygieneAssessment}\n\n` +
              `**📝 Interpretation:**\n` +
              `• These metrics represent the overall list performance\n` +
              `• Rates are calculated by the API based on actual email delivery and engagement\n` +
              `• Contact counts show the current state of your list\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetListStatsTimeSeries(args: any, api: CakemailAPI) {
  try {
    const { 
      list_id, 
      start_time, 
      end_time, 
      interval = 'month'
    } = args;

    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: list_id'
        }]
      };
    }

    // Default to last 12 months if no time range provided
    const now = Math.floor(Date.now() / 1000);
    const defaultStartTime = start_time || (now - (12 * 30 * 24 * 60 * 60)); // 12 months ago
    const defaultEndTime = end_time || now;

    // Log the request parameters
    logger.info(`[List Time Series] Fetching time-series data for list ${list_id}`, {
      start_time: defaultStartTime,
      end_time: defaultEndTime,
      interval,
      start_date: new Date(defaultStartTime * 1000).toISOString(),
      end_date: new Date(defaultEndTime * 1000).toISOString()
    });

    let result;
    let stats;
    
    try {
      // Try the time-series endpoint first
      result = await api.reports.getReportsListStats(list_id, {
        start_time: defaultStartTime,
        end_time: defaultEndTime,
        interval
      });
      
      logger.info(`[List Time Series] Time-series API response received`, {
        hasData: !!result.data,
        dataType: typeof result.data,
        isArray: Array.isArray(result.data),
        dataKeys: result.data ? Object.keys(result.data) : []
      });
      
      stats = result.data;
    } catch (timeSeriesError: any) {
      logger.warn(`[List Time Series] Time-series endpoint failed, falling back to regular stats`, {
        error: timeSeriesError.message,
        list_id
      });
      
      // Fallback to regular list stats
      result = await api.reports.getListStats(list_id);
      stats = result.data;
      
      logger.info(`[List Time Series] Fallback stats response received`, {
        hasData: !!stats,
        dataKeys: stats ? Object.keys(stats) : []
      });
    }
    
    if (!stats) {
      logger.error(`[List Time Series] No data available for list ${list_id}`);
      return {
        content: [{
          type: 'text',
          text: '❌ **No Data Available**\n\nNo time-series data found for this list and time period.\n\n**Debug Info:**\n• List ID: ' + list_id + '\n• Time Range: ' + new Date(defaultStartTime * 1000).toLocaleDateString() + ' to ' + new Date(defaultEndTime * 1000).toLocaleDateString() + '\n• Interval: ' + interval + '\n\n**Response:**\n' + JSON.stringify(result, null, 2)
        }]
      };
    }

    // Handle different response formats
    let movements = [];
    
    if (Array.isArray(stats)) {
      // Time-series format - array of periods
      movements = stats.map((period: any) => {
        const timestamp = period.timestamp || period.time;
        const date = new Date(timestamp * 1000).toLocaleDateString();
        
        return {
          date,
          active_contacts: period.active_contacts || 0,
          pending_contacts: period.pending_contacts || 0,
          invalid_contacts: period.invalid_contacts || 0,
          unsubscribed_contacts: period.unsubscribed_contacts || 0,
          flagged_contacts: period.flagged_contacts || 0,
          deleted_contacts: period.deleted_contacts || 0,
          sent_emails: period.sent_emails || 0,
          open_rate: period.open_rate || 0,
          click_rate: period.click_rate || 0,
          bounce_rate: period.bounce_rate || 0,
          unsubscribe_rate: period.unsubscribe_rate || 0
        };
      });
    } else {
      // Single stats format - create a single period
      const date = new Date().toLocaleDateString();
      movements = [{
        date,
        active_contacts: stats.active_contacts || 0,
        pending_contacts: stats.pending_contacts || 0,
        invalid_contacts: stats.invalid_contacts || 0,
        unsubscribed_contacts: stats.unsubscribed_contacts || 0,
        flagged_contacts: stats.flagged_contacts || 0,
        deleted_contacts: stats.deleted_contacts || 0,
        sent_emails: stats.sent_emails || 0,
        open_rate: stats.open_rate || 0,
        click_rate: stats.click_rate || 0,
        bounce_rate: stats.bounce_rate || 0,
        unsubscribe_rate: stats.unsubscribe_rate || 0
      }];
    }

    logger.info(`[List Time Series] Processed ${movements.length} movement periods`);

    // Format the time range
    const startDate = new Date(defaultStartTime * 1000).toLocaleDateString();
    const endDate = new Date(defaultEndTime * 1000).toLocaleDateString();

    let content = [
      {
        type: 'text',
        text: `📊 **List Movement Analysis**\n\n**List ID:** ${list_id}\n**Period:** ${startDate} to ${endDate}\n**Interval:** ${interval}\n**Data Points:** ${movements.length}\n`
      }
    ];

    // Calculate movements (changes between periods)
    const movementsAnalysis = [];
    for (let i = 1; i < movements.length; i++) {
      const current = movements[i];
      const previous = movements[i - 1];
      
      const activeChange = current.active_contacts - previous.active_contacts;
      const pendingChange = current.pending_contacts - previous.pending_contacts;
      const invalidChange = current.invalid_contacts - previous.invalid_contacts;
      const unsubscribedChange = current.unsubscribed_contacts - previous.unsubscribed_contacts;
      const flaggedChange = current.flagged_contacts - previous.flagged_contacts;
      const deletedChange = current.deleted_contacts - previous.deleted_contacts;
      
      movementsAnalysis.push({
        period: current.date,
        active_change: activeChange,
        pending_change: pendingChange,
        invalid_change: invalidChange,
        unsubscribed_change: unsubscribedChange,
        flagged_change: flaggedChange,
        deleted_change: deletedChange,
        total_change: activeChange + pendingChange + invalidChange + unsubscribedChange + flaggedChange + deletedChange,
        emails_sent: current.sent_emails,
        open_rate: current.open_rate,
        click_rate: current.click_rate,
        bounce_rate: current.bounce_rate,
        unsubscribe_rate: current.unsubscribe_rate
      });
    }

    // Add movement summary
    if (movementsAnalysis.length > 0) {
      content.push({
        type: 'text',
        text: `\n📈 **Monthly Movements Summary**\n`
      });

      movementsAnalysis.forEach((movement) => {
        const changeEmoji = movement.total_change > 0 ? '📈' : movement.total_change < 0 ? '📉' : '➡️';
        const activeEmoji = movement.active_change > 0 ? '✅' : movement.active_change < 0 ? '❌' : '➡️';
        const unsubEmoji = movement.unsubscribed_change > 0 ? '👋' : '➡️';
        const bounceEmoji = movement.invalid_change > 0 ? '🔄' : '➡️';

        content.push({
          type: 'text',
          text: `\n**${movement.period}** ${changeEmoji}\n` +
                `• Active: ${activeEmoji} ${movement.active_change > 0 ? '+' : ''}${movement.active_change}\n` +
                `• Unsubscribed: ${unsubEmoji} ${movement.unsubscribed_change > 0 ? '+' : ''}${movement.unsubscribed_change}\n` +
                `• Bounced: ${bounceEmoji} ${movement.invalid_change > 0 ? '+' : ''}${movement.invalid_change}\n` +
                `• Emails Sent: ${movement.emails_sent.toLocaleString()}\n` +
                `• Open Rate: ${movement.open_rate.toFixed(2)}%\n` +
                `• Click Rate: ${movement.click_rate.toFixed(2)}%`
        });
      });

      // Calculate overall trends
      const totalActiveChange = movementsAnalysis.reduce((sum, m) => sum + m.active_change, 0);
      const totalUnsubscribedChange = movementsAnalysis.reduce((sum, m) => sum + m.unsubscribed_change, 0);
      const totalInvalidChange = movementsAnalysis.reduce((sum, m) => sum + m.invalid_change, 0);
      const totalEmailsSent = movementsAnalysis.reduce((sum, m) => sum + m.emails_sent, 0);
      const avgOpenRate = movementsAnalysis.reduce((sum, m) => sum + m.open_rate, 0) / movementsAnalysis.length;
      const avgClickRate = movementsAnalysis.reduce((sum, m) => sum + m.click_rate, 0) / movementsAnalysis.length;

      content.push({
        type: 'text',
        text: `\n📊 **Overall Trends (${movementsAnalysis.length} periods)**\n` +
              `• Net Active Change: ${totalActiveChange > 0 ? '+' : ''}${totalActiveChange}\n` +
              `• Total Unsubscribed: ${totalUnsubscribedChange > 0 ? '+' : ''}${totalUnsubscribedChange}\n` +
              `• Total Bounced: ${totalInvalidChange > 0 ? '+' : ''}${totalInvalidChange}\n` +
              `• Total Emails Sent: ${totalEmailsSent.toLocaleString()}\n` +
              `• Average Open Rate: ${avgOpenRate.toFixed(2)}%\n` +
              `• Average Click Rate: ${avgClickRate.toFixed(2)}%`
      });
    } else if (movements.length === 1) {
      // Single data point - show current stats
      const current = movements[0];
      content.push({
        type: 'text',
        text: `\n📊 **Current List Statistics**\n\n` +
              `**${current.date}**\n` +
              `• Active Contacts: ${current.active_contacts.toLocaleString()}\n` +
              `• Pending Contacts: ${current.pending_contacts.toLocaleString()}\n` +
              `• Invalid Contacts: ${current.invalid_contacts.toLocaleString()}\n` +
              `• Unsubscribed Contacts: ${current.unsubscribed_contacts.toLocaleString()}\n` +
              `• Flagged Contacts: ${current.flagged_contacts.toLocaleString()}\n` +
              `• Deleted Contacts: ${current.deleted_contacts.toLocaleString()}\n` +
              `• Total Emails Sent: ${current.sent_emails.toLocaleString()}\n` +
              `• Open Rate: ${current.open_rate.toFixed(2)}%\n` +
              `• Click Rate: ${current.click_rate.toFixed(2)}%\n` +
              `• Bounce Rate: ${current.bounce_rate.toFixed(2)}%\n` +
              `• Unsubscribe Rate: ${current.unsubscribe_rate.toFixed(2)}%\n\n` +
              `**Note:** Only current statistics available. Time-series data requires multiple data points.`
      });
    } else {
      content.push({
        type: 'text',
        text: '\n❌ **No Movement Data**\n\nInsufficient data points to calculate movements. Try a longer time period.'
      });
    }

    logger.info(`[List Time Series] Successfully processed time-series data for list ${list_id}`);

    return { content };

  } catch (error: any) {
    logger.error(`[List Time Series] Error processing time-series data`, { error: error.message, stack: error.stack });
    return handleCakemailError(error);
  }
}

export async function handleGetListMovementLogs(args: any, api: CakemailAPI) {
  try {
    const { 
      list_id, 
      start_time, 
      end_time, 
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

    // Default to last 12 months if no time range provided
    const now = Math.floor(Date.now() / 1000);
    const defaultStartTime = start_time || (now - (12 * 30 * 24 * 60 * 60)); // 12 months ago
    const defaultEndTime = end_time || now;

    logger.info(`[List Movement Logs] Fetching list logs for movement analysis`, {
      list_id,
      start_time: defaultStartTime,
      end_time: defaultEndTime,
      start_date: new Date(defaultStartTime * 1000).toISOString(),
      end_date: new Date(defaultEndTime * 1000).toISOString()
    });

    // Fetch list logs with pagination to get all events
    let allLogs: any[] = [];
    let page = 1;
    let hasMore = true;
    const perPage = 100; // Maximum per page

    while (hasMore) {
      const params: any = {
        page,
        per_page: perPage,
        with_count: true,
        start_time: defaultStartTime,
        end_time: defaultEndTime
      };
      
      const normalizedAccountId = normalizeAccountId(account_id);
      if (normalizedAccountId !== undefined) params.account_id = normalizedAccountId;

      const result = await api.logs.getListLogs(list_id, params);
      
      logger.info(`[List Movement Logs] Fetched page ${page}`, {
        logsCount: result.data.length,
        hasMore: result.pagination?.has_more,
        totalCount: result.pagination?.count
      });

      allLogs.push(...result.data);
      
      hasMore = result.pagination?.has_more || false;
      page++;
      
      // Safety limit to prevent infinite loops
      if (page > 50) {
        logger.warn(`[List Movement Logs] Reached safety limit of 50 pages`);
        break;
      }
    }

    logger.info(`[List Movement Logs] Total logs fetched: ${allLogs.length}`);

    if (allLogs.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **No Log Data Available**\n\nNo list activity logs found for this time period.\n\n**Debug Info:**\n• List ID: ' + list_id + '\n• Time Range: ' + new Date(defaultStartTime * 1000).toLocaleDateString() + ' to ' + new Date(defaultEndTime * 1000).toLocaleDateString()
        }]
      };
    }

    // Group logs by month and categorize events
    const monthlyMovements = new Map<string, {
      subscribes: number;
      unsubscribes: number;
      bounces: number;
      spam_reports: number;
      updates: number;
      deletions: number;
      other_events: number;
      total_events: number;
      event_types: Map<string, number>;
    }>();

    // Event type mapping for movement tracking
    const movementEvents = {
      subscribes: ['Contact.Subscribed', 'Contact.Added', 'Contact.Confirmed'],
      unsubscribes: ['Contact.Unsubscribed', 'Contact.Removed'],
      bounces: ['Contact.Bounced', 'Email.Bounced'],
      spam_reports: ['Contact.SpamReported', 'Email.SpamReported'],
      updates: ['Contact.Updated', 'Contact.Modified'],
      deletions: ['Contact.Deleted', 'Contact.Removed']
    };

    allLogs.forEach((log: any) => {
      const timestamp = log.time || log.timestamp;
      if (!timestamp) return;

      const date = new Date(timestamp * 1000);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const eventType = log.type || 'Unknown';

      if (!monthlyMovements.has(monthKey)) {
        monthlyMovements.set(monthKey, {
          subscribes: 0,
          unsubscribes: 0,
          bounces: 0,
          spam_reports: 0,
          updates: 0,
          deletions: 0,
          other_events: 0,
          total_events: 0,
          event_types: new Map()
        });
      }

      const month = monthlyMovements.get(monthKey)!;
      month.total_events++;

      // Track event types
      month.event_types.set(eventType, (month.event_types.get(eventType) || 0) + 1);

      // Categorize events
      let categorized = false;
      for (const [category, events] of Object.entries(movementEvents)) {
        if (events.includes(eventType)) {
          if (category === 'subscribes') month.subscribes++;
          else if (category === 'unsubscribes') month.unsubscribes++;
          else if (category === 'bounces') month.bounces++;
          else if (category === 'spam_reports') month.spam_reports++;
          else if (category === 'updates') month.updates++;
          else if (category === 'deletions') month.deletions++;
          categorized = true;
          break;
        }
      }

      if (!categorized) {
        month.other_events++;
      }
    });

    // Convert to sorted array and calculate net movements
    const sortedMonths = Array.from(monthlyMovements.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        
        return {
          month: monthKey,
          date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          ...data,
          net_growth: data.subscribes - data.unsubscribes - data.bounces - data.deletions,
          event_types: Object.fromEntries(data.event_types)
        };
      });

    logger.info(`[List Movement Logs] Processed ${sortedMonths.length} months of data`);

    // Format the time range
    const startDate = new Date(defaultStartTime * 1000).toLocaleDateString();
    const endDate = new Date(defaultEndTime * 1000).toLocaleDateString();

    let content = [
      {
        type: 'text',
        text: `📊 **List Movement Analysis (From Logs)**\n\n**List ID:** ${list_id}\n**Period:** ${startDate} to ${endDate}\n**Total Events:** ${allLogs.length.toLocaleString()}\n**Months Analyzed:** ${sortedMonths.length}\n`
      }
    ];

    if (sortedMonths.length > 0) {
      content.push({
        type: 'text',
        text: `\n📈 **Monthly Movements Summary**\n`
      });

      sortedMonths.forEach((month) => {
        const growthEmoji = month.net_growth > 0 ? '📈' : month.net_growth < 0 ? '📉' : '➡️';
        const subscribeEmoji = month.subscribes > 0 ? '✅' : '➡️';
        const unsubscribeEmoji = month.unsubscribes > 0 ? '👋' : '➡️';
        const bounceEmoji = month.bounces > 0 ? '🔄' : '➡️';

        content.push({
          type: 'text',
          text: `\n**${month.date}** ${growthEmoji}\n` +
                `• Subscribes: ${subscribeEmoji} +${month.subscribes}\n` +
                `• Unsubscribes: ${unsubscribeEmoji} -${month.unsubscribes}\n` +
                `• Bounces: ${bounceEmoji} -${month.bounces}\n` +
                `• Updates: ${month.updates > 0 ? '✏️' : '➡️'} ${month.updates}\n` +
                `• Deletions: ${month.deletions > 0 ? '🗑️' : '➡️'} ${month.deletions}\n` +
                `• Spam Reports: ${month.spam_reports > 0 ? '🚫' : '➡️'} ${month.spam_reports}\n` +
                `• Net Growth: ${month.net_growth > 0 ? '+' : ''}${month.net_growth}\n` +
                `• Total Events: ${month.total_events}`
        });
      });

      // Calculate overall trends
      const totalSubscribes = sortedMonths.reduce((sum, m) => sum + m.subscribes, 0);
      const totalUnsubscribes = sortedMonths.reduce((sum, m) => sum + m.unsubscribes, 0);
      const totalBounces = sortedMonths.reduce((sum, m) => sum + m.bounces, 0);
      const totalDeletions = sortedMonths.reduce((sum, m) => sum + m.deletions, 0);
      const totalUpdates = sortedMonths.reduce((sum, m) => sum + m.updates, 0);
      const totalSpamReports = sortedMonths.reduce((sum, m) => sum + m.spam_reports, 0);
      const totalEvents = sortedMonths.reduce((sum, m) => sum + m.total_events, 0);
      const netGrowth = totalSubscribes - totalUnsubscribes - totalBounces - totalDeletions;

      content.push({
        type: 'text',
        text: `\n📊 **Overall Trends (${sortedMonths.length} months)**\n` +
              `• Total Subscribes: +${totalSubscribes.toLocaleString()}\n` +
              `• Total Unsubscribes: -${totalUnsubscribes.toLocaleString()}\n` +
              `• Total Bounces: -${totalBounces.toLocaleString()}\n` +
              `• Total Deletions: -${totalDeletions.toLocaleString()}\n` +
              `• Total Updates: ${totalUpdates.toLocaleString()}\n` +
              `• Total Spam Reports: ${totalSpamReports.toLocaleString()}\n` +
              `• Net Growth: ${netGrowth > 0 ? '+' : ''}${netGrowth.toLocaleString()}\n` +
              `• Total Events: ${totalEvents.toLocaleString()}\n` +
              `• Average Events/Month: ${Math.round(totalEvents / sortedMonths.length).toLocaleString()}`
      });

      // Calculate rates
      if (totalEvents > 0) {
        const unsubscribeRate = ((totalUnsubscribes / totalEvents) * 100).toFixed(2);
        const bounceRate = ((totalBounces / totalEvents) * 100).toFixed(2);
        const spamRate = ((totalSpamReports / totalEvents) * 100).toFixed(2);

        content.push({
          type: 'text',
          text: `\n📈 **Event Rates**\n` +
                `• Unsubscribe Rate: ${unsubscribeRate}%\n` +
                `• Bounce Rate: ${bounceRate}%\n` +
                `• Spam Report Rate: ${spamRate}%\n` +
                `• Growth Rate: ${netGrowth > 0 ? '+' : ''}${((netGrowth / totalEvents) * 100).toFixed(2)}%`
        });
      }

      // Show top event types
      const allEventTypes = new Map<string, number>();
      sortedMonths.forEach(month => {
        Object.entries(month.event_types).forEach(([eventType, count]) => {
          allEventTypes.set(eventType, (allEventTypes.get(eventType) || 0) + count);
        });
      });

      const topEventTypes = Array.from(allEventTypes.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      if (topEventTypes.length > 0) {
        content.push({
          type: 'text',
          text: `\n📋 **Top Event Types**\n` +
                topEventTypes.map(([eventType, count]) => 
                  `• ${eventType}: ${count.toLocaleString()}`
                ).join('\n')
        });
      }
    } else {
      content.push({
        type: 'text',
        text: '\n❌ **No Movement Data**\n\nNo log events found to calculate movements.'
      });
    }

    logger.info(`[List Movement Logs] Successfully processed movement analysis for list ${list_id}`);

    return { content };

  } catch (error: any) {
    logger.error(`[List Movement Logs] Error processing movement logs`, { error: error.message, stack: error.stack });
    return handleCakemailError(error);
  }
}