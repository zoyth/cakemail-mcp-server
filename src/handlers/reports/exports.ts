import { CakemailAPI } from '../../cakemail-api.js';
import { handleCakemailError } from '../../utils/errors.js';
import { formatSectionHeader, formatKeyValue } from '../../utils/formatting.js';

/**
 * Format file size in human readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a visual progress bar
 */
function generateProgressBar(progress: number): string {
  const width = 20;
  const filled = Math.round((progress / 100) * width);
  const empty = width - filled;
  
  return `Progress: [${'█'.repeat(filled)}${'░'.repeat(empty)}] ${progress}%`;
}

/**
 * List all campaign reports exports
 */
export async function handleListCampaignReportsExports(args: any, api: CakemailAPI) {
  try {
    const { account_id, page, per_page, status, progress } = args;
    
    // Build parameters
    const params: any = {
      page: page || 1,
      per_page: per_page || 50,
      with_count: true
    };
    
    if (account_id) params.account_id = Number(account_id);
    if (status) params.status = status;
    if (progress) params.progress = progress;
    
    // Get exports list
    const result = await api.reports.listCampaignReportsExports(params);
    
    // Format the response
    let response = `${formatSectionHeader('📈 Campaign Reports Exports')}\n\n`;
    
    // Pagination info
    if (result.pagination) {
      const p = result.pagination;
      response += `${formatSectionHeader('📄 Pagination')}\n`;
      response += `${formatKeyValue('Page', `${p.page} of ${p.total_pages || '?'}`)}\n`;
      response += `${formatKeyValue('Items', `${result.data?.length || 0} of ${p.count || '?'} total`)}\n`;
    }
    
    if (result.data && result.data.length > 0) {
      response += `\n${formatSectionHeader('📁 Available Exports')}\n\n`;
      
      result.data.forEach((exp: any, index: number) => {
        const statusEmoji = exp.status === 'completed' ? '✅' : exp.status === 'failed' ? '❌' : '⏳';
        
        response += `**${index + 1}. Export ${exp.id}**\n`;
        if (exp.description) {
          response += `   ${exp.description}\n`;
        }
        response += `   • **Status:** ${statusEmoji} ${exp.status || 'unknown'}\n`;
        if (exp.progress !== undefined) {
          response += `   • **Progress:** ${exp.progress}%\n`;
        }
        if (exp.file_size) {
          response += `   • **File Size:** ${formatFileSize(exp.file_size)}\n`;
        }
        if (exp.created_on) {
          response += `   • **Created:** ${new Date(exp.created_on * 1000).toLocaleString()}\n`;
        }
        if (exp.expires_on) {
          response += `   • **Expires:** ${new Date(exp.expires_on * 1000).toLocaleString()}\n`;
        }
        response += '\n';
      });
      
      response += `${formatSectionHeader('ℹ️ About Campaign Exports')}\n`;
      response += '• Campaign exports contain detailed performance data\n';
      response += '• Use exports for external analysis and reporting\n';
      response += '• Files are available for download until expiry date\n';
    } else {
      response += `${formatSectionHeader('ℹ️ No Exports Found')}\n`;
      response += 'No campaign reports exports are currently available.\n\n';
      response += 'To create a new export, use the `cakemail_create_campaign_reports_export` tool.\n';
    }
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Create a campaign reports export
 */
export async function handleCreateCampaignReportsExport(args: any, api: CakemailAPI) {
  try {
    const { campaign_ids, start_time, end_time, format, fields, account_id } = args;
    
    if (!campaign_ids || !Array.isArray(campaign_ids) || campaign_ids.length === 0) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: campaign_ids array is required'
        }],
        isError: true
      };
    }
    
    // Build export data
    const exportData: any = {
      campaign_ids,
      format: format || 'csv'
    };
    
    if (start_time) exportData.start_time = start_time;
    if (end_time) exportData.end_time = end_time;
    if (fields && Array.isArray(fields)) exportData.fields = fields;
    
    // Create the export
    const result = await api.reports.createCampaignReportsExport(exportData, Number(account_id) || undefined);
    
    // Format the response
    let response = `${formatSectionHeader('✅ Campaign Report Export Created')}\n\n`;
    
    if (result.data) {
      const exp = result.data;
      response += `${formatSectionHeader('📄 Export Details')}\n`;
      response += `${formatKeyValue('Export ID', exp.id)}\n`;
      response += `${formatKeyValue('Status', exp.status || 'processing')}\n`;
      
      if (exp.description) {
        response += `${formatKeyValue('Description', exp.description)}\n`;
      }
      
      response += `\n${formatSectionHeader('📊 Export Configuration')}\n`;
      response += `${formatKeyValue('Campaigns', campaign_ids.length.toString())}\n`;
      response += `${formatKeyValue('Format', format || 'csv')}\n`;
      
      if (start_time || end_time) {
        response += `\n${formatSectionHeader('📅 Time Range')}\n`;
        if (start_time) {
          response += `${formatKeyValue('Start', new Date(start_time * 1000).toLocaleString())}\n`;
        }
        if (end_time) {
          response += `${formatKeyValue('End', new Date(end_time * 1000).toLocaleString())}\n`;
        }
      }
      
      response += `\n${formatSectionHeader('ℹ️ Next Steps')}\n`;
      response += '• The export is being processed in the background\n';
      response += '• Use `cakemail_get_campaign_reports_export` to check the status\n';
      response += '• Once complete, use `cakemail_download_campaign_reports_export` to get the file\n';
      response += '• Exports typically complete within a few minutes depending on data size\n';
      
      if (exp.expires_on) {
        response += `\n⚠️ **Note:** This export will expire on ${new Date(exp.expires_on * 1000).toLocaleString()}\n`;
      }
    }
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Get status of a campaign reports export
 */
export async function handleGetCampaignReportsExport(args: any, api: CakemailAPI) {
  try {
    const { export_id, account_id } = args;
    
    if (!export_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: export_id is required'
        }],
        isError: true
      };
    }
    
    // Get export details
    const result = await api.reports.getCampaignReportsExport(export_id, Number(account_id) || undefined);
    
    // Format the response
    let response = `${formatSectionHeader('📊 Campaign Report Export Status')}\n\n`;
    
    if (result.data) {
      const exp = result.data;
      
      // Status indicator
      const statusEmoji = exp.status === 'completed' ? '✅' : exp.status === 'failed' ? '❌' : '⏳';
      
      response += `${formatSectionHeader('📄 Export Details')}\n`;
      response += `${formatKeyValue('Export ID', exp.id)}\n`;
      response += `${formatKeyValue('Status', `${statusEmoji} ${exp.status || 'unknown'}`)}\n`;
      
      if (exp.progress !== undefined) {
        response += `${formatKeyValue('Progress', `${exp.progress}%`)}\n`;
        
        // Progress bar
        const progressBar = generateProgressBar(exp.progress);
        response += `${progressBar}\n`;
      }
      
      if (exp.description) {
        response += `${formatKeyValue('Description', exp.description)}\n`;
      }
      
      if (exp.file_size) {
        response += `${formatKeyValue('File Size', formatFileSize(exp.file_size))}\n`;
      }
      
      response += `\n${formatSectionHeader('📅 Timeline')}\n`;
      if (exp.created_on) {
        response += `${formatKeyValue('Created', new Date(Number(exp.created_on) * 1000).toLocaleString())}\n`;
      }
      if (exp.completed_on) {
        response += `${formatKeyValue('Completed', new Date(Number(exp.completed_on) * 1000).toLocaleString())}\n`;
      }
      if (exp.expires_on) {
        const expiryDate = new Date(exp.expires_on * 1000);
        const now = new Date();
        const hoursLeft = Math.max(0, (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60));
        response += `${formatKeyValue('Expires', `${expiryDate.toLocaleString()} (${hoursLeft.toFixed(1)} hours left)`)}\n`;
      }
      
      // Status-specific instructions
      response += `\n${formatSectionHeader('ℹ️ Instructions')}\n`;
      if (exp.status === 'completed') {
        response += '✅ Export is ready for download!\n';
        response += `• Use \`cakemail_download_campaign_reports_export\` with export ID: ${exp.id}\n`;
        response += '• Download before the expiry time shown above\n';
      } else if (exp.status === 'processing') {
        response += '⏳ Export is still being processed...\n';
        response += '• Check back in a few moments\n';
        response += '• Large exports may take several minutes\n';
      } else if (exp.status === 'failed') {
        response += '❌ Export failed to process\n';
        response += '• Try creating a new export\n';
        response += '• Contact support if the issue persists\n';
      }
      
      // Export metadata if available
      if (exp.metadata) {
        response += `\n${formatSectionHeader('📋 Export Metadata')}\n`;
        if (exp.metadata.campaign_count) {
          response += `${formatKeyValue('Campaigns Included', exp.metadata.campaign_count.toString())}\n`;
        }
        if (exp.metadata.record_count) {
          response += `${formatKeyValue('Total Records', exp.metadata.record_count.toLocaleString())}\n`;
        }
      }
    }
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Download a campaign reports export
 */
export async function handleDownloadCampaignReportsExport(args: any, api: CakemailAPI) {
  try {
    const { export_id, account_id } = args;
    
    if (!export_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: export_id is required'
        }],
        isError: true
      };
    }
    
    // Get download URL
    const result = await api.reports.downloadCampaignReportsExport(export_id, Number(account_id) || undefined);
    
    // Format the response
    let response = `${formatSectionHeader('📥 Campaign Report Export Download')}\n\n`;
    
    if (result.data) {
      response += `${formatSectionHeader('✅ Download Ready')}\n`;
      response += `${formatKeyValue('Export ID', export_id)}\n`;
      
      if (result.data.download_url) {
        response += `\n${formatSectionHeader('🔗 Download Link')}\n`;
        response += `${result.data.download_url}\n\n`;
        
        response += `${formatSectionHeader('ℹ️ Download Instructions')}\n`;
        response += '• Click the link above to download the export file\n';
        response += '• The link is temporary and will expire soon\n';
        response += '• Save the file to your local system for analysis\n';
        
        if ((result.data as any).file_name) {
          response += `\n${formatKeyValue('File Name', (result.data as any).file_name)}\n`;
        }
        if ((result.data as any).file_size) {
          response += `${formatKeyValue('File Size', formatFileSize((result.data as any).file_size))}\n`;
        }
        if ((result.data as any).content_type) {
          response += `${formatKeyValue('Content Type', (result.data as any).content_type)}\n`;
        }
      } else {
        response += `\n${formatSectionHeader('⚠️ Download Not Available')}\n`;
        response += 'The download URL is not available. This could mean:\n';
        response += '• The export is still being processed\n';
        response += '• The export has expired\n';
        response += '• There was an error generating the download link\n\n';
        response += 'Try checking the export status with `cakemail_get_campaign_reports_export`\n';
      }
    }
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Delete a campaign reports export
 */
export async function handleDeleteCampaignReportsExport(args: any, api: CakemailAPI) {
  try {
    const { export_id, account_id } = args;
    
    if (!export_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: export_id is required'
        }],
        isError: true
      };
    }
    
    // Delete the export
    await api.reports.deleteCampaignReportsExport(export_id, Number(account_id) || undefined);
    
    // Format the response
    let response = `${formatSectionHeader('🗑️ Campaign Report Export Deleted')}\n\n`;
    response += `${formatSectionHeader('✅ Success')}\n`;
    response += `${formatKeyValue('Export ID', export_id)}\n`;
    response += `${formatKeyValue('Status', 'Deleted')}\n`;
    response += `\n${formatSectionHeader('ℹ️ Note')}\n`;
    response += '• The export and its associated files have been permanently deleted\n';
    response += '• This action cannot be undone\n';
    response += '• You can create a new export at any time using `cakemail_create_campaign_reports_export`\n';
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * List suppressed emails exports
 */
export async function handleListSuppressedEmailsExports(args: any, api: CakemailAPI) {
  try {
    const { account_id, page, per_page } = args;
    
    // Build parameters
    const params: any = {
      page: page || 1,
      per_page: per_page || 50,
      with_count: true
    };
    
    if (account_id) params.account_id = Number(account_id);
    
    // Get exports list
    const result = await api.reports.listSuppressedEmailsExports(params);
    
    // Format the response
    let response = `${formatSectionHeader('🚫 Suppressed Emails Exports')}\n\n`;
    
    // Pagination info
    if (result.pagination) {
      const p = result.pagination;
      response += `${formatSectionHeader('📄 Pagination')}\n`;
      response += `${formatKeyValue('Page', `${p.page} of ${p.total_pages || '?'}`)}\n`;
      response += `${formatKeyValue('Items', `${result.data?.length || 0} of ${p.count || '?'} total`)}\n`;
    }
    
    if (result.data && result.data.length > 0) {
      response += `\n${formatSectionHeader('📁 Available Exports')}\n\n`;
      
      result.data.forEach((exp: any, index: number) => {
        const statusEmoji = exp.status === 'completed' ? '✅' : exp.status === 'failed' ? '❌' : '⏳';
        
        response += `**${index + 1}. Export ${exp.id}**\n`;
        if (exp.description) {
          response += `   ${exp.description}\n`;
        }
        response += `   • **Status:** ${statusEmoji} ${exp.status || 'unknown'}\n`;
        if (exp.progress !== undefined) {
          response += `   • **Progress:** ${exp.progress}%\n`;
        }
        if (exp.file_size) {
          response += `   • **File Size:** ${formatFileSize(exp.file_size)}\n`;
        }
        if (exp.created_on) {
          response += `   • **Created:** ${new Date(exp.created_on * 1000).toLocaleString()}\n`;
        }
        if (exp.expires_on) {
          response += `   • **Expires:** ${new Date(exp.expires_on * 1000).toLocaleString()}\n`;
        }
        response += '\n';
      });
      
      response += `${formatSectionHeader('ℹ️ About Suppressed Emails')}\n`;
      response += '• Suppressed emails are addresses that should not receive emails\n';
      response += '• Includes hard bounces, spam complaints, and manual suppressions\n';
      response += '• Exporting this list helps maintain compliance and deliverability\n';
    } else {
      response += `${formatSectionHeader('ℹ️ No Exports Found')}\n`;
      response += 'No suppressed emails exports are currently available.\n\n';
      response += 'To create a new export, use the `cakemail_create_suppressed_emails_export` tool.\n';
    }
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Create a suppressed emails export
 */
export async function handleCreateSuppressedEmailsExport(args: any, api: CakemailAPI) {
  try {
    const { description, account_id } = args;
    
    // Create the export
    const result = await api.reports.createSuppressedEmailsExport(description, Number(account_id) || undefined);
    
    // Format the response
    let response = `${formatSectionHeader('✅ Suppressed Emails Export Created')}\n\n`;
    
    if (result.data) {
      const exp = result.data;
      response += `${formatSectionHeader('📄 Export Details')}\n`;
      response += `${formatKeyValue('Export ID', exp.id)}\n`;
      response += `${formatKeyValue('Status', exp.status || 'processing')}\n`;
      
      if (description) {
        response += `${formatKeyValue('Description', description)}\n`;
      }
      
      response += `\n${formatSectionHeader('ℹ️ Next Steps')}\n`;
      response += '• The export is being processed in the background\n';
      response += '• Use `cakemail_get_suppressed_emails_export` to check the status\n';
      response += '• Once complete, use `cakemail_download_suppressed_emails_export` to get the file\n';
      response += '• The export will include all suppressed email addresses and reasons\n';
      
      if (exp.expires_on) {
        response += `\n⚠️ **Note:** This export will expire on ${new Date(exp.expires_on * 1000).toLocaleString()}\n`;
      }
    }
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Get status of a suppressed emails export
 */
export async function handleGetSuppressedEmailsExport(args: any, api: CakemailAPI) {
  try {
    const { export_id, account_id } = args;
    
    if (!export_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: export_id is required'
        }],
        isError: true
      };
    }
    
    // Get export details
    const result = await api.reports.getSuppressedEmailsExport(export_id, Number(account_id) || undefined);
    
    // Format the response
    let response = `${formatSectionHeader('🚫 Suppressed Emails Export Status')}\n\n`;
    
    if (result.data) {
      const exp = result.data;
      const statusEmoji = exp.status === 'completed' ? '✅' : exp.status === 'failed' ? '❌' : '⏳';
      
      response += `${formatSectionHeader('📄 Export Details')}\n`;
      response += `${formatKeyValue('Export ID', exp.id)}\n`;
      response += `${formatKeyValue('Status', `${statusEmoji} ${exp.status || 'unknown'}`)}\n`;
      
      if (exp.progress !== undefined) {
        response += `${formatKeyValue('Progress', `${exp.progress}%`)}\n`;
        const progressBar = generateProgressBar(exp.progress);
        response += `${progressBar}\n`;
      }
      
      if (exp.description) {
        response += `${formatKeyValue('Description', exp.description)}\n`;
      }
      
      if (exp.file_size) {
        response += `${formatKeyValue('File Size', formatFileSize(exp.file_size))}\n`;
      }
      
      // Export metadata
      if (exp.metadata) {
        response += `\n${formatSectionHeader('📊 Export Content')}\n`;
        if (exp.metadata.total_suppressions !== undefined) {
          response += `${formatKeyValue('Total Suppressions', exp.metadata.total_suppressions.toLocaleString())}\n`;
        }
        if (exp.metadata.hard_bounces !== undefined) {
          response += `${formatKeyValue('Hard Bounces', exp.metadata.hard_bounces.toLocaleString())}\n`;
        }
        if (exp.metadata.spam_complaints !== undefined) {
          response += `${formatKeyValue('Spam Complaints', exp.metadata.spam_complaints.toLocaleString())}\n`;
        }
        if (exp.metadata.manual_suppressions !== undefined) {
          response += `${formatKeyValue('Manual Suppressions', exp.metadata.manual_suppressions.toLocaleString())}\n`;
        }
      }
      
      response += `\n${formatSectionHeader('📅 Timeline')}\n`;
      if (exp.created_on) {
        response += `${formatKeyValue('Created', new Date(Number(exp.created_on) * 1000).toLocaleString())}\n`;
      }
      if (exp.completed_on) {
        response += `${formatKeyValue('Completed', new Date(Number(exp.completed_on) * 1000).toLocaleString())}\n`;
      }
      if (exp.expires_on) {
        response += `${formatKeyValue('Expires', new Date(exp.expires_on * 1000).toLocaleString())}\n`;
      }
      
      // Status-specific instructions
      response += `\n${formatSectionHeader('ℹ️ Instructions')}\n`;
      if (exp.status === 'completed') {
        response += '✅ Export is ready for download!\n';
        response += `• Use \`cakemail_download_suppressed_emails_export\` with export ID: ${exp.id}\n`;
      } else if (exp.status === 'processing') {
        response += '⏳ Export is still being processed...\n';
        response += '• Check back in a few moments\n';
      } else if (exp.status === 'failed') {
        response += '❌ Export failed to process\n';
        response += '• Try creating a new export\n';
      }
    }
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Download a suppressed emails export
 */
export async function handleDownloadSuppressedEmailsExport(args: any, api: CakemailAPI) {
  try {
    const { export_id, account_id } = args;
    
    if (!export_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: export_id is required'
        }],
        isError: true
      };
    }
    
    // Get download URL
    const result = await api.reports.downloadSuppressedEmailsExport(export_id, Number(account_id) || undefined);
    
    // Format the response
    let response = `${formatSectionHeader('📥 Suppressed Emails Export Download')}\n\n`;
    
    if (result.data) {
      response += `${formatSectionHeader('✅ Download Ready')}\n`;
      response += `${formatKeyValue('Export ID', export_id)}\n`;
      
      if (result.data.download_url) {
        response += `\n${formatSectionHeader('🔗 Download Link')}\n`;
        response += `${result.data.download_url}\n\n`;
        
        response += `${formatSectionHeader('ℹ️ File Contents')}\n`;
        response += 'The CSV file contains:\n';
        response += '• Email addresses that are suppressed\n';
        response += '• Suppression reason (bounce, spam, manual, etc.)\n';
        response += '• Date of suppression\n';
        response += '• Additional metadata where available\n';
        
        if ((result.data as any).file_name) {
          response += `\n${formatKeyValue('File Name', (result.data as any).file_name)}\n`;
        }
        if ((result.data as any).file_size) {
          response += `${formatKeyValue('File Size', formatFileSize((result.data as any).file_size))}\n`;
        }
      } else {
        response += `\n${formatSectionHeader('⚠️ Download Not Available')}\n`;
        response += 'The download URL is not available.\n';
      }
    }
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Delete a suppressed emails export
 */
export async function handleDeleteSuppressedEmailsExport(args: any, api: CakemailAPI) {
  try {
    const { export_id, account_id } = args;
    
    if (!export_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: export_id is required'
        }],
        isError: true
      };
    }
    
    // Delete the export
    await api.reports.deleteSuppressedEmailsExport(export_id, Number(account_id) || undefined);
    
    // Format the response
    let response = `${formatSectionHeader('🗑️ Suppressed Emails Export Deleted')}\n\n`;
    response += `${formatSectionHeader('✅ Success')}\n`;
    response += `${formatKeyValue('Export ID', export_id)}\n`;
    response += `${formatKeyValue('Status', 'Deleted')}\n`;
    response += `\n${formatSectionHeader('ℹ️ Note')}\n`;
    response += '• The export has been permanently deleted\n';
    response += '• You can create a new export using `cakemail_create_suppressed_emails_export`\n';
    
    return {
      content: [{
        type: 'text',
        text: response
      }]
    };
    
  } catch (error) {
    return handleCakemailError(error);
  }
}
