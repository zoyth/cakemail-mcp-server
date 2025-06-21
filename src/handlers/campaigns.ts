import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';
import {
  validateBEETemplate as validateBEETemplateUtil,
  printBEETemplateStructure as printBEETemplateStructureUtil
} from '../utils/bee-editor.js';

// Define Campaign type locally to fix implicit any types
interface Campaign {
  id: number;
  name: string;
  subject?: string;
  status?: string;
  type?: string;
  created_on?: string;
  updated_on?: string;
}

export async function handleListCampaigns(args: any, api: CakemailAPI) {
  try {
    let { 
      page, per_page, status, name, type, list_id, sort, order, with_count, account_id 
    } = args;
    // Map 'sent' to 'delivered' for user convenience
    if (status === 'sent') status = 'delivered';
    
    const campaigns = await api.campaigns.getCampaigns({
      page: page || 1,
      per_page: per_page || 10,
      ...(status && { status }),
      ...(name && { name }),
      ...(type && { type }),
      ...(list_id && { list_id }),
      sort: sort || 'created_on',
      order: (order as 'asc' | 'desc') || 'desc',
      with_count: with_count !== false,
      ...(account_id !== undefined && { account_id })
    });

    const total = campaigns.pagination?.count || 0;
    const campaignList = campaigns.data?.slice(0, 20).map((campaign: Campaign) => ({
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
                (campaignList?.map((camp: any, i: number) => 
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
  } catch (error) {
    return handleCakemailError(error);
  }
}

// Enhanced campaign handlers with BEE support
export async function handleGetLatestCampaigns(args: any, api: CakemailAPI) {
  try {
    let { count = 10, status } = args;
    // Map 'sent' to 'delivered' for user convenience
    if (status === 'sent') status = 'delivered';
    
    const campaigns = await api.campaigns.getCampaigns({
      page: 1,
      per_page: Math.min(count, 50), // API max is 50
      sort: 'created_on',
      order: 'desc',
      with_count: true,
      ...(status && { status })
    });

    const campaignList = campaigns.data?.map((campaign: Campaign) => ({
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
          text: `📧 **Latest ${count} Campaigns**\n\n` +
                `**Filter:**\n` +
                `• Status: ${status || 'all'}\n\n` +
                `**Campaigns:**\n\n` +
                (campaignList?.map((camp: any, i: number) => 
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
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetCampaign(args: any, api: CakemailAPI) {
  try {
    const { campaign_id } = args;

    if (!campaign_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: campaign_id'
        }]
      };
    }

    const campaign = await api.campaigns.getCampaign(campaign_id);
    const campaignData = campaign.data as any; // Use any to access extended properties

    // logger.info({ campaignData }, '[handleGetCampaign] campaignData');

    // Safely access properties that might exist on the full campaign response
    const subject = campaignData?.content?.subject || campaignData?.subject || 'N/A';
    const listId = campaignData?.audience?.list_id || campaignData?.list_id || 'N/A';
    const senderId = campaignData?.sender?.id || campaignData?.sender_id || 'N/A';
    const senderName = campaignData?.sender?.name || campaignData?.from_name || 'N/A';
    const contentType = campaignData?.content?.type || 'html';
    const webLink = campaignData?.web_email_link || 'N/A';
    
    let contentInfo = '';
    if (campaignData?.content?.json) {
      const templateStructure = printBEETemplateStructureUtil(campaignData.content.json);
      contentInfo = `\n\n📋 **BEE Template Structure:**\n\n${templateStructure}\n\n`;
    }

    // Safely extract metadata from possible locations
    const metadata = campaignData?.metadata || campaignData?.content?.json?.metadata;
    let metadataInfo = '';
    if (metadata) {
      metadataInfo = `\n\n📝 **Metadata:**\n\n${JSON.stringify(metadata, null, 2)}`;
    }

    return {
      content: [{
        type: 'text',
        text: `📧 **Campaign Details**\n\n` +
              `• **ID:** ${campaignData?.id}\n` +
              `• **Name:** ${campaignData?.name}\n` +
              `• **Subject:** ${subject}\n` +
              `• **Status:** ${campaignData?.status}\n` +
              `• **Type:** ${campaignData?.type}\n` +
              `• **Content Type:** ${contentType}\n` +
              `• **List ID:** ${listId}\n` +
              `• **Sender ID:** ${senderId}\n` +
              `• **Sender Name:** ${senderName}\n` +
              `• **Created:** ${campaignData?.created_on}\n` +
              `• **Updated:** ${campaignData?.updated_on}\n` +
              `• **Scheduled For:** ${campaignData?.scheduled_for || 'N/A'}\n` +
              `• **Web Link:** ${webLink}${contentInfo}${metadataInfo}\n\n` +
              `**Full Response:**\n${JSON.stringify(campaign, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleCreateCampaign(args: any, api: CakemailAPI) {
  try {
    const {
      name,
      audience,      // { list_id: number, segment_id?: number }
      sender,        // { id: string, name?: string }
      content,       // { subject?: string, html?: string, text?: string, json?: object, type?: string, template?: {id}, blueprint?: {id}, encoding, default_unsubscribe_link }
      tracking,      // { opens?: boolean, clicks_html?: boolean, clicks_text?: boolean }
      reply_to_email,
      account_id // Agency/Enterprise account scoping
    } = args;

    // Validate required fields per API spec - only name is required
    if (!name) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Fields**\n\nRequired: name'
        }]
      };
    }

    // Flatten fields for API
    let campaignData: any = {
      name,
      // Audience
      ...(audience?.list_id && { list_id: audience.list_id }),
      ...(audience?.segment_id && { segment_id: audience.segment_id }),
      // Sender
      ...(sender?.id && { sender_id: sender.id }),
      ...(sender?.name && { from_name: sender.name }),
      // Content
      ...(content?.subject && { subject: content.subject }),
      ...(content?.html && { html_content: content.html }),
      ...(content?.text && { text_content: content.text }),
      // BEE JSON: unwrap 'template' key if present, and wrap in 'page' if needed
      ...(content?.json && {
        json_content: (() => {
          const beeJson = content.json.template ? content.json.template : content.json;
          // If already wrapped in 'page', use as is
          if (beeJson.page) return beeJson;
          // Otherwise, wrap in { page: beeJson, comments: {} }
          return { page: beeJson, comments: {} };
        })()
      }),
      ...(content?.type && { content_type: content.type }),
      ...(content?.template?.id && { template_id: content.template.id }),
      ...(content?.blueprint?.id && { blueprint_id: content.blueprint.id }),
      ...(content?.encoding && { encoding: content.encoding }),
      ...(content?.default_unsubscribe_link !== undefined && { default_unsubscribe_link: content.default_unsubscribe_link }),
      // Tracking
      ...(tracking && { tracking }),
      // Reply-to
      ...(reply_to_email && { reply_to: reply_to_email }),
      // Account
      ...(account_id && { account_id })
    };

    // Handle BEE template validation if JSON content is provided
    if (content?.json) {
      const validation = validateBEETemplateUtil(content.json);
      if (!validation.valid) {
        return {
          content: [{
            type: 'text',
            text: `❌ **Invalid BEE Template**\n\nErrors:\n${validation.errors.map(e => `• ${e}`).join('\n')}`
          }]
        };
      }
    }
    
    const result = await api.campaigns.createCampaign(campaignData);
    
    // Extract display information
    const listId = audience?.list_id || 'undefined';
    const senderId = sender?.id || 'undefined';
    const subject = content?.subject || 'undefined';
    const contentType = content?.type === 'bee' ? 'BEEeditor JSON' : 
                       content?.html && content?.text ? 'HTML/Text' :
                       content?.html ? 'HTML' :
                       content?.text ? 'Text' : 'HTML';
    
    let templateInfo = '';
    if (content?.json) {
      const templateStructure = printBEETemplateStructureUtil(content.json);
      templateInfo = `\n\n📋 **Template Structure:**\n\n${templateStructure}\n\n`;
    }
    
    return {
      content: [{
        type: 'text',
        text: `✅ **Campaign Created Successfully**\n\n` +
              `📧 **Campaign Details:**\n` +
              `• ID: ${result.data?.id}\n` +
              `• Name: ${name}\n` +
              `• Subject: ${subject}\n` +
              `• Format: ${contentType}\n` +
              `• List ID: ${listId}\n` +
              `• Sender ID: ${senderId}\n${templateInfo}\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleUpdateCampaign(args: any, api: CakemailAPI) {
  try {
    const { 
      campaign_id,
      name, 
      audience,      // { list_id: number, segment_id?: number }
      sender,        // { id: string, name?: string }
      content,       // { subject?: string, html?: string, text?: string, json?: object, type?: string }
      tracking,      // { opens?: boolean, clicks_html?: boolean, clicks_text?: boolean }
      reply_to_email,
      account_id // Agency/Enterprise account scoping
    } = args;

    // Validate required fields
    if (!campaign_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: campaign_id'
        }]
      };
    }

    let updateData: any = {};
    
    // Only include fields that are provided
    if (name !== undefined) updateData.name = name;
    if (audience !== undefined) updateData.audience = audience;
    if (sender !== undefined) updateData.sender = sender;
    if (content !== undefined) updateData.content = content;
    if (tracking !== undefined) updateData.tracking = tracking;
    if (reply_to_email !== undefined) updateData.reply_to_email = reply_to_email;
    
    // Handle BEE template validation if JSON content is provided
    if (content?.json) {
      const validation = validateBEETemplateUtil(content.json);
      if (!validation.valid) {
        return {
          content: [{
            type: 'text',
            text: `❌ **Invalid BEE Template**\n\nErrors:\n${validation.errors.map(e => `• ${e}`).join('\n')}`
          }]
        };
      }
    }

    if (Object.keys(updateData).length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **No Update Data**\n\nAt least one field must be provided for update.'
        }]
      };
    }

    const result = await api.campaigns.updateCampaign(campaign_id, { ...updateData, ...(account_id && { account_id }) });
    
    // Determine format info
    let formatInfo = 'HTML';
    let templateInfo = '';
    
    if (content?.json) {
      formatInfo = 'BEEeditor JSON';
      templateInfo = `\n\n📋 **Updated Template Structure:**\n\`\`\`\n${printBEETemplateStructureUtil(content.json)}\`\`\``;
    } else if (content?.html && content?.text) {
      formatInfo = 'HTML/Text';
    } else if (content?.text) {
      formatInfo = 'Text';
    }
    
    return {
      content: [{
        type: 'text',
        text: `✅ **Campaign Updated Successfully**\n\n` +
              `📧 **Campaign Details:**\n` +
              `• ID: ${campaign_id}\n` +
              `• Format: ${formatInfo}\n` +
              `• Fields Updated: ${Object.keys(updateData).join(', ')}\n${templateInfo}\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleSendCampaign(args: any, api: CakemailAPI) {
  try {
    const { campaign_id } = args;
    
    if (!campaign_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: campaign_id'
        }]
      };
    }

    const result = await api.campaigns.sendCampaign(campaign_id);
    
    return {
      content: [{
        type: 'text',
        text: `✅ **Campaign Sent Successfully**\n\n` +
              `• **Campaign ID:** ${campaign_id}\n` +
              `• **Status:** ${result.success ? 'Sent' : 'Failed'}\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDeleteCampaign(args: any, api: CakemailAPI) {
  try {
    const { campaign_id } = args;
    
    if (!campaign_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: campaign_id'
        }]
      };
    }

    const result = await api.campaigns.deleteCampaign(campaign_id);
    
    return {
      content: [{
        type: 'text',
        text: `✅ **Campaign Deleted Successfully**\n\n` +
              `• **Campaign ID:** ${campaign_id}\n` +
              `• **Deleted:** ${result.data?.deleted || 'true'}\n\n` +
              `**Full Response:**\n${JSON.stringify(result, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDebugCampaignAccess(args: any, api: CakemailAPI) {
  try {
    const { campaign_id, account_id } = args;

    let debugInfo = '🔍 **Campaign Access Debug**\n\n';

    // Test general campaign list access
    try {
      const campaigns = await api.campaigns.getCampaigns({
        page: 1,
        per_page: 5,
        ...(account_id && { account_id })
      });
      debugInfo += `✅ **List Campaigns:** OK (${campaigns.data?.length || 0} campaigns found)\n`;
    } catch (error: any) {
      debugInfo += `❌ **List Campaigns:** FAILED - ${error.message}\n`;
    }

    // Test specific campaign access if campaign_id provided
    if (campaign_id) {
      try {
        const campaign = await api.campaigns.getCampaign(campaign_id, {
          ...(account_id && { account_id })
        });
        debugInfo += `✅ **Get Campaign ${campaign_id}:** OK - "${campaign.data?.name}"\n`;
      } catch (error: any) {
        debugInfo += `❌ **Get Campaign ${campaign_id}:** FAILED - ${error.message}\n`;
      }
    } else {
      debugInfo += `ℹ️ **Specific Campaign Test:** Skipped (no campaign_id provided)\n`;
    }

    // Test account access
    try {
      const account = await api.account.getSelfAccount();
      debugInfo += `✅ **Account Access:** OK - Account ID ${account.data?.id}\n`;
    } catch (error: any) {
      debugInfo += `❌ **Account Access:** FAILED - ${error.message}\n`;
    }

    // Add usage instructions
    debugInfo += `\n**Usage:**\n`;
    debugInfo += `• Use without parameters to test general access\n`;
    debugInfo += `• Provide campaign_id to test specific campaign access\n`;
    debugInfo += `• Provide account_id for sub-account testing\n`;

    return {
      content: [{
        type: 'text',
        text: debugInfo
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleRenderCampaign(args: any, api: CakemailAPI) {
  try {
    const { campaign_id, contact_id } = args;

    if (!campaign_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Required Field**\n\nRequired: campaign_id'
        }]
      };
    }

    const rendered = await api.campaigns.renderCampaign(campaign_id, contact_id);
    const renderedData = rendered as any; // Use any to access response structure

    // Safely access properties that might exist on the response
    const htmlContent = renderedData?.data?.html || renderedData?.html || '';
    const textContent = renderedData?.data?.text || renderedData?.text || '';
    const subject = renderedData?.data?.subject || renderedData?.subject || 'N/A';
    
    // Truncate content for display
    const htmlPreview = htmlContent.length > 500 ? 
      htmlContent.substring(0, 500) + '...' : htmlContent;
    const textPreview = textContent.length > 500 ? 
      textContent.substring(0, 500) + '...' : textContent;

    return {
      content: [{
        type: 'text',
        text: `🎨 **Campaign Rendered**\n\n` +
              `📧 **Campaign ID:** ${campaign_id}\n` +
              `👤 **Contact ID:** ${contact_id || 'None (default rendering)'}\n` +
              `📋 **Subject:** ${subject}\n\n` +
              `🏠 **HTML Preview:**\n\`\`\`html\n${htmlPreview}\`\`\`\n\n` +
              `📝 **Text Preview:**\n\`\`\`\n${textPreview}\`\`\`\n\n` +
              `**Full Response:**\n${JSON.stringify(rendered, null, 2)}`
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

// Re-add missing handler stubs
export async function handleSendTestEmail() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleScheduleCampaign() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleUnscheduleCampaign() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleRescheduleCampaign() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleSuspendCampaign() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleResumeCampaign() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleCancelCampaign() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleArchiveCampaign() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleUnarchiveCampaign() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleGetCampaignRevisions() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleGetCampaignLinks() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleCreateBEETemplate() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }
export async function handleValidateBEETemplate() { return { content: [{ type: 'text', text: 'Not implemented yet' }] }; }