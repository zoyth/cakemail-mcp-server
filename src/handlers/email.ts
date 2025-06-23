import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';
import { EmailAPIError } from '../types/errors.js';

/**
 * Submit an email using the v2 Email API
 */
export async function handleSendEmail(args: any, api: CakemailAPI) {
  try {
    const {
      email,
      sender_id,
      subject,
      html_content,
      text_content,
      template_id,
      list_id,
      email_type = 'transactional'
    } = args;

    // Validate required fields
    if (!email) {
      throw new EmailAPIError('email is required', 400);
    }
    if (!sender_id) {
      throw new EmailAPIError('sender_id is required', 400);
    }
    if (!subject) {
      throw new EmailAPIError('subject is required', 400);
    }

    // Must have either content or template
    if (!html_content && !text_content && !template_id) {
      throw new EmailAPIError('Either html_content, text_content, or template_id is required', 400);
    }

    // Build email data according to v2 API specification
    const emailData: any = {
      email: email,
      sender: {
        id: sender_id  // Keep as string, API might expect string format
      },
      content: {
        subject: subject
      }
    };

    // Add content based on what's provided
    if (template_id) {
      // Template ID should be a number according to schema
      const templateIdNum = parseInt(template_id);
      if (!isNaN(templateIdNum)) {
        emailData.content.template = { id: templateIdNum };
      } else {
        throw new EmailAPIError('template_id must be a valid number', 400);
      }
    } else {
      // Must have either html or text content if no template
      if (html_content) {
        emailData.content.html = html_content;
      }
      if (text_content) {
        emailData.content.text = text_content;
      }
      
      // Add required encoding when content is provided
      if (html_content || text_content) {
        emailData.content.encoding = 'utf-8';
      }
    }

    // Add email type to content if specified
    if (email_type) {
      emailData.content.type = email_type;
    }

    // Add optional list_id as number
    if (list_id) {
      const listIdNum = parseInt(list_id);
      if (!isNaN(listIdNum)) {
        emailData.list_id = listIdNum;
      } else {
        throw new EmailAPIError('list_id must be a valid number', 400);
      }
    } else if (email_type === 'marketing') {
      // Marketing emails typically require a list_id
      throw new EmailAPIError('list_id is required for marketing emails', 400);
    }

    const result = await api.email.sendEmail(emailData);

    return {
      content: [
        {
          type: 'text',
          text: `✅ **Email sent successfully!**\n\n` +
                `📧 **Email ID:** ${result.data.id}\n` +
                `📤 **Status:** ${result.data.status}\n` +
                `📬 **Recipient:** ${result.email}\n` +
                `✅ **Submitted:** ${result.submitted}\n\n` +
                `**Full Response:**\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };

  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Retrieve email status by ID
 */
export async function handleGetEmail(args: any, api: CakemailAPI) {
  try {
    const { email_id } = args;

    if (!email_id) {
      throw new EmailAPIError('email_id is required', 400);
    }

    const result = await api.email.getEmail(email_id);

    return {
      content: [
        {
          type: 'text',
          text: `📧 **Email Details Retrieved**\n\n` +
                `**Email ID:** ${result.data.id}\n` +
                `**Status:** ${result.data.status}\n` +
                `**Recipient:** ${result.data.email}\n` +
                `**Subject:** ${result.data.subject || 'N/A'}\n` +
                `**Submitted:** ${result.data.submitted_on || 'N/A'}\n\n` +
                `**Full Response:**\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };

  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Render email content
 */
export async function handleRenderEmail(args: any, api: CakemailAPI) {
  try {
    const { 
      email_id, 
      as_submitted = false, 
      tracking = false 
    } = args;

    if (!email_id) {
      throw new EmailAPIError('email_id is required', 400);
    }

    const result = await api.email.renderEmail(email_id, {
      as_submitted,
      tracking
    });

    return {
      content: [
        {
          type: 'text',
          text: `🎨 **Email Rendered Successfully**\n\n` +
                `**Email ID:** ${email_id}\n` +
                `**As Submitted:** ${as_submitted}\n` +
                `**Tracking Enabled:** ${tracking}\n\n` +
                `**Rendered Content:**\n${result.substring(0, 500)}${result.length > 500 ? '...' : ''}\n\n` +
                `**Content Length:** ${result.length} characters`,
        },
      ],
    };

  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Get email logs with filtering
 */
export async function handleGetEmailLogs(args: any, api: CakemailAPI) {
  try {
    const {
      log_type = 'all',
      email_id,
      iso_time = false,
      page = 1,
      per_page = 50,
      start_time,
      end_time,
      tags,
      providers,
      sort = '-time'
    } = args;

    const options: any = {
      log_type,
      iso_time,
      page,
      per_page,
      sort
    };

    if (email_id) options.email_id = email_id;
    if (start_time) options.start_time = start_time;
    if (end_time) options.end_time = end_time;
    if (tags) options.tags = tags;
    if (providers) options.providers = providers;

    const result = await api.email.getEmailLogs(options);

    const totalCount = result.pagination?.count || result.data.length;
    const displayLogs = result.data.slice(0, 5); // Show first 5 logs

    return {
      content: [
        {
          type: 'text',
          text: `📋 **Email Logs Retrieved**\n\n` +
                `**Total Logs:** ${totalCount}\n` +
                `**Page:** ${result.pagination?.page || 1}\n` +
                `**Per Page:** ${result.pagination?.per_page || 50}\n` +
                `**Log Type:** ${log_type}\n\n` +
                `**Recent Logs (showing first 5):**\n` +
                (displayLogs.map((log, i) => 
                  `${i + 1}. **${log.type}** - Email ID: ${log.email_id} (${log.time})`
                ).join('\n') || 'No logs found.') +
                (totalCount > 5 ? `\n\n**... and ${totalCount - 5} more logs**` : '') +
                `\n\n**Full Response:**\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };

  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Get email statistics
 */
export async function handleGetEmailStats(args: any, api: CakemailAPI) {
  try {
    const {
      interval: inputInterval = 'day',
      iso_time = false,
      start_time,
      end_time,
      providers,
      tags
    } = args;

    const validIntervals = ['hour', 'day', 'week', 'month'];
    const interval = validIntervals.includes(inputInterval) ? inputInterval : undefined;

    const options: any = {
      interval,
      iso_time
    };

    if (start_time) options.start_time = start_time;
    if (end_time) options.end_time = end_time;
    if (providers) options.providers = providers;
    if (tags) options.tags = tags;

    const result = await api.email.getEmailStats(options);

    const statsEntries = result.data.slice(0, 10); // Show first 10 entries

    return {
      content: [
        {
          type: 'text',
          text: `📊 **Email Statistics Retrieved**\n\n` +
                `**Interval:** ${result.interval || interval}\n` +
                `**Start Time:** ${result.start_time || 'N/A'}\n` +
                `**End Time:** ${result.end_time || 'N/A'}\n` +
                `**Data Points:** ${result.data.length}\n\n` +
                `**Recent Statistics (showing first 10):**\n` +
                (statsEntries.map((entry, i) => 
                  `${i + 1}. Time: ${entry.time} | Delivered: ${entry.delivered || 0} | Opened: ${entry.open || 0}`
                ).join('\n') || 'No statistics found.') +
                (result.data.length > 10 ? `\n\n**... and ${result.data.length - 10} more entries**` : '') +
                `\n\n**Full Response:**\n${JSON.stringify(result, null, 2)}`,
        },
      ],
    };

  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Send transactional email (helper)
 */
export async function handleSendTransactionalEmail(args: any, api: CakemailAPI) {
  try {
    // Force email type to transactional
    const emailArgs = { ...args, email_type: 'transactional' };
    return await handleSendEmail(emailArgs, api);
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Send marketing email (helper)
 */
export async function handleSendMarketingEmail(args: any, api: CakemailAPI) {
  try {
    // Force email type to marketing
    const emailArgs = { ...args, email_type: 'marketing' };
    return await handleSendEmail(emailArgs, api);
  } catch (error) {
    return handleCakemailError(error);
  }
}

/**
 * Get email logs with analysis
 */
export async function handleGetEmailLogsWithAnalysis(args: any, api: CakemailAPI) {
  try {
    const {
      log_type = 'all',
      email_id,
      iso_time = false,
      page = 1,
      per_page = 50,
      start_time,
      end_time,
      tags,
      providers,
      sort = '-time'
    } = args;

    const options: any = {
      log_type,
      iso_time,
      page,
      per_page,
      sort
    };

    if (email_id) options.email_id = email_id;
    if (start_time) options.start_time = start_time;
    if (end_time) options.end_time = end_time;
    if (tags) options.tags = tags;
    if (providers) options.providers = providers;

    const result = await api.email.getEmailLogsWithAnalysis(options);

    const analysis = result.analysis;

    return {
      content: [
        {
          type: 'text',
          text: `📊 **Email Logs with Analysis**\n\n` +
                `**📋 Log Summary:**\n` +
                `• Total Events: ${analysis.totalEvents}\n` +
                `• Delivery Rate: ${analysis.deliveryRate}%\n` +
                `• Engagement Rate: ${analysis.engagementRate}%\n`
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}