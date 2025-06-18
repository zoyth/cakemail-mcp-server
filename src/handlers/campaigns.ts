import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';
import {
  createBasicBEETemplate as createBEETemplateUtil,
  createNewsletterTemplate as createNewsletterTemplateUtil,
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
    const { 
      page, per_page, status, name, type, list_id, sort, order, with_count, account_id 
    } = args;
    
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
export async function handleGetLatestCampaigns(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleCreateCampaign(args: any, api: CakemailAPI) {
  try {
    const { 
      name, 
      subject, 
      list_id, 
      sender_id, 
      from_name, 
      reply_to,
      html_content,
      text_content,
      json_content, // BEEeditor JSON format
      content_type = 'html', // 'html' or 'bee' or 'auto-detect'
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
    
    // Additional validation for practical campaign creation
    if (!list_id || !sender_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Essential Fields**\n\nWhile only name is required by the API, you also need list_id and sender_id for a functional campaign'
        }]
      };
    }

    let campaignData: any = {
      name,
      list_id,
      sender_id,
      from_name,
      reply_to,
      subject,
      html_content,
      text_content,
      json_content,
      ...(account_id && { account_id })
    };

    // Handle different content types
    if (json_content || content_type === 'bee') {
      // BEEeditor format
      if (json_content) {
        // Validate BEE template
        const validation = validateBEETemplateUtil(json_content);
        if (!validation.valid) {
          return {
            content: [{
              type: 'text',
              text: `❌ **Invalid BEE Template**\n\nErrors:\n${validation.errors.map(e => `• ${e}`).join('\n')}`
            }]
          };
        }
        
        // For BEEeditor, we need to use the json field in content
        campaignData.json_content = json_content;
        
        const result = await api.campaigns.createCampaign(campaignData);
        
        const templateStructure = printBEETemplateStructureUtil(json_content);
        
        return {
          content: [{
            type: 'text',
            text: `✅ **BEE Campaign Created Successfully**\n\n` +
                  `📧 **Campaign Details:**\n` +
                  `• ID: ${result.data?.id}\n` +
                  `• Name: ${name}\n` +
                  `• Subject: ${subject}\n` +
                  `• Format: BEEeditor JSON\n` +
                  `• List ID: ${list_id}\n` +
                  `• Sender ID: ${sender_id}\n\n` +
                  `📋 **Template Structure:**\n\`\`\`\n${templateStructure}\`\`\`\n\n` +
                  `**Full Response:**\n${JSON.stringify(result, null, 2)}`
          }]
        };
      } else {
        return {
          content: [{
            type: 'text',
            text: '❌ **Missing JSON Content**\n\nWhen using BEE format, json_content is required.'
          }]
        };
      }
    } else {
      // Traditional HTML/text format
      campaignData.html_content = html_content;
      campaignData.text_content = text_content;
      
      const result = await api.campaigns.createCampaign(campaignData);
      
      return {
        content: [{
          type: 'text',
          text: `✅ **Campaign Created Successfully**\n\n` +
                `📧 **Campaign Details:**\n` +
                `• ID: ${result.data?.id}\n` +
                `• Name: ${name}\n` +
                `• Subject: ${subject}\n` +
                `• Format: HTML${text_content ? '/Text' : ''}\n` +
                `• List ID: ${list_id}\n` +
                `• Sender ID: ${sender_id}\n\n` +
                `**Full Response:**\n${JSON.stringify(result, null, 2)}`
        }]
      };
    }
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleUpdateCampaign(args: any, api: CakemailAPI) {
  try {
    const { 
      campaign_id,
      name, 
      subject, 
      from_name, 
      reply_to,
      html_content,
      text_content,
      json_content, // BEEeditor JSON format
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
    if (from_name !== undefined) updateData.from_name = from_name;
    if (reply_to !== undefined) updateData.reply_to = reply_to;
    
    // Handle content updates
    if (json_content) {
      // BEEeditor format update
      const validation = validateBEETemplateUtil(json_content);
      if (!validation.valid) {
        return {
          content: [{
            type: 'text',
            text: `❌ **Invalid BEE Template**\n\nErrors:\n${validation.errors.map(e => `• ${e}`).join('\n')}`
          }]
        };
      }
      updateData.json_content = json_content;
    }
    
    // Traditional HTML/text format update
    if (subject !== undefined) updateData.subject = subject;
    if (html_content !== undefined) updateData.html_content = html_content;
    if (text_content !== undefined) updateData.text_content = text_content;

    if (Object.keys(updateData).length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **No Update Data**\n\nAt least one field must be provided for update.'
        }]
      };
    }

    const result = await api.campaigns.updateCampaign(campaign_id, { ...updateData, ...(account_id && { account_id }) });
    
    let formatInfo = 'HTML';
    let templateInfo = '';
    
    if (json_content) {
      formatInfo = 'BEEeditor JSON';
      templateInfo = `\n\n📋 **Updated Template Structure:**\n\`\`\`\n${printBEETemplateStructureUtil(json_content)}\`\`\``;
    } else if (text_content) {
      formatInfo = 'HTML/Text';
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

export async function handleSendCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDeleteCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDebugCampaignAccess(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleRenderCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleSendTestEmail(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleScheduleCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleUnscheduleCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleRescheduleCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleSuspendCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleResumeCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleCancelCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleArchiveCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleUnarchiveCampaign(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetCampaignRevisions(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetCampaignLinks(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

// BEEeditor specific handlers

export async function handleCreateBEETemplate(args: any, _api: CakemailAPI) {
  try {
    const {
      title = 'Newsletter',
      subject = 'Newsletter Subject',
      preheader = '',
      backgroundColor = '#f5f5f5',
      contentAreaBackgroundColor = '#ffffff',
      width = 600
    } = args;
    
    const template = createBEETemplateUtil({
      title,
      subject,
      preheader,
      backgroundColor,
      contentAreaBackgroundColor,
      width
    });
    
    const validation = validateBEETemplateUtil(template);
    const structure = printBEETemplateStructureUtil(template);
    
    return {
      content: [{
        type: 'text',
        text: `✅ **BEE Template Created**\n\n` +
              `📋 **Template Structure:**\n\`\`\`\n${structure}\`\`\`\n\n` +
              `🔍 **Validation:** ${validation.valid ? 'Valid' : 'Invalid'}\n` +
              (validation.valid ? '' : `Errors: ${validation.errors.join(', ')}\n`) +
              `\n**JSON Template:**\n\`\`\`json\n${JSON.stringify(template, null, 2)}\`\`\``
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleCreateBEENewsletter(args: any, _api: CakemailAPI) {
  try {
    const {
      title = 'Newsletter',
      subject = 'Newsletter Subject',
      preheader = '',
      headerText,
      contentSections = [],
      footerText = 'Thank you for reading!',
      backgroundColor = '#f5f5f5',
      contentAreaBackgroundColor = '#ffffff'
    } = args;
    
    // Default content sections if none provided
    let sections = contentSections;
    if (sections.length === 0) {
      sections = [
        {
          title: 'Welcome to Our Newsletter',
          content: 'Thank you for subscribing to our newsletter. We\'re excited to share our latest updates with you.',
          buttonText: 'Read More',
          buttonUrl: 'https://example.com/welcome'
        },
        {
          title: 'Latest News',
          content: 'Here are the latest developments from our team. We\'ve been working hard to bring you new features and improvements.',
          imageUrl: 'https://via.placeholder.com/300x200/007BFF/ffffff?text=News'
        }
      ];
    }
    
    const template = createNewsletterTemplateUtil({
      title,
      subject,
      preheader,
      headerText: headerText || title,
      contentSections: sections,
      footerText,
      backgroundColor,
      contentAreaBackgroundColor
    });
    
    const validation = validateBEETemplateUtil(template);
    const structure = printBEETemplateStructureUtil(template);
    
    return {
      content: [{
        type: 'text',
        text: `✅ **BEE Newsletter Created**\n\n` +
              `📋 **Template Structure:**\n\`\`\`\n${structure}\`\`\`\n\n` +
              `🔍 **Validation:** ${validation.valid ? 'Valid' : 'Invalid'}\n` +
              (validation.valid ? '' : `Errors: ${validation.errors.join(', ')}\n`) +
              `📊 **Content Sections:** ${sections.length}\n\n` +
              `**JSON Template:**\n\`\`\`json\n${JSON.stringify(template, null, 2)}\`\`\``
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleValidateBEETemplate(args: any, _api: CakemailAPI) {
  try {
    const { json_content } = args;
    
    if (!json_content) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing JSON Content**\n\nPlease provide json_content to validate.'
        }]
      };
    }
    
    const validation = validateBEETemplateUtil(json_content);
    const structure = printBEETemplateStructureUtil(json_content);
    
    return {
      content: [{
        type: 'text',
        text: `🔍 **BEE Template Validation**\n\n` +
              `**Status:** ${validation.valid ? '✅ Valid' : '❌ Invalid'}\n\n` +
              (validation.valid ? 
                `📋 **Template Structure:**\n\`\`\`\n${structure}\`\`\`` :
                `**Errors:**\n${validation.errors.map(e => `• ${e}`).join('\n')}`
              )
      }]
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}
