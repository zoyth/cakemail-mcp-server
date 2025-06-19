import { CakemailAPI } from '../../cakemail-api.js';
import { handleCakemailError } from '../../utils/errors.js';
import { formatSectionHeader, formatKeyValue, formatList } from '../../utils/formatting.js';
import { 
  generateListInsights, 
  generateListRecommendations,
  generateAccountInsights,
  generateAccountRecommendations,
  generateActionInsights,
  generateActionRecommendations
} from './insights.js';

/**
 * Get list-specific performance statistics
 */
export async function handleGetListStats(args: any, api: CakemailAPI) {
  try {
    const { list_id, start_time, end_time, interval, account_id } = args;
    
    if (!list_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: list_id is required'
        }],
        isError: true
      };
    }
    
    // Get list stats
    const result = await api.reports.getListStats(list_id, account_id);
    
    // Format the response
    let response = `${formatSectionHeader('📈 List Performance Statistics')}\n\n`;
    
    // Basic list info
    response += `${formatSectionHeader('📅 List Overview')}\n`;
    response += `${formatKeyValue('List ID', list_id)}\n`;
    
    if (start_time || end_time) {
      response += `\n${formatSectionHeader('📅 Time Range')}\n`;
      if (start_time) {
        response += `${formatKeyValue('Start Time', new Date(start_time * 1000).toLocaleString())}\n`;
      }
      if (end_time) {
        response += `${formatKeyValue('End Time', new Date(end_time * 1000).toLocaleString())}\n`;
      }
      if (interval) {
        response += `${formatKeyValue('Interval', interval)}\n`;
      }
    }
    
    if (result.data) {
      const stats = result.data;
      
      // Subscriber metrics
      response += `\n${formatSectionHeader('👥 Subscriber Metrics')}\n`;
      if (stats.total_contacts !== undefined) {
        response += `${formatKeyValue('Total Contacts', stats.total_contacts.toLocaleString())}\n`;
      }
      if (stats.active_contacts !== undefined) {
        response += `${formatKeyValue('Active Contacts', stats.active_contacts.toLocaleString())}\n`;
      }
      if (stats.unsubscribed_contacts !== undefined) {
        response += `${formatKeyValue('Unsubscribed', stats.unsubscribed_contacts.toLocaleString())}\n`;
      }
      if (stats.bounced_contacts !== undefined) {
        response += `${formatKeyValue('Bounced Contacts', stats.bounced_contacts.toLocaleString())}\n`;
      }
      
      // Growth metrics
      if (stats.new_subscribers !== undefined || stats.unsubscribes !== undefined) {
        response += `\n${formatSectionHeader('📈 Growth Metrics')}\n`;
        if (stats.new_subscribers !== undefined) {
          response += `${formatKeyValue('New Subscribers', stats.new_subscribers.toLocaleString())}\n`;
        }
        if (stats.unsubscribes !== undefined) {
          response += `${formatKeyValue('Unsubscribes', stats.unsubscribes.toLocaleString())}\n`;
        }
        if (stats.net_growth !== undefined) {
          const growthEmoji = stats.net_growth >= 0 ? '📈' : '📉';
          response += `${formatKeyValue('Net Growth', `${stats.net_growth.toLocaleString()} ${growthEmoji}`)}\n`;
        }
      }
      
      // Email performance for this list
      if (stats.emails_sent !== undefined || stats.opens !== undefined || stats.clicks !== undefined) {
        response += `\n${formatSectionHeader('📧 Email Performance')}\n`;
        if (stats.emails_sent !== undefined) {
          response += `${formatKeyValue('Emails Sent', stats.emails_sent.toLocaleString())}\n`;
        }
        if (stats.opens !== undefined) {
          response += `${formatKeyValue('Total Opens', stats.opens.toLocaleString())}\n`;
        }
        if (stats.unique_opens !== undefined) {
          response += `${formatKeyValue('Unique Opens', stats.unique_opens.toLocaleString())}\n`;
        }
        if (stats.open_rate !== undefined) {
          const openRate = (stats.open_rate * 100).toFixed(2);
          const openEmoji = parseFloat(openRate) >= 20 ? '🚀' : parseFloat(openRate) >= 15 ? '👍' : '⚠️';
          response += `${formatKeyValue('Open Rate', `${openRate}% ${openEmoji}`)}\n`;
        }
        
        if (stats.clicks !== undefined) {
          response += `${formatKeyValue('Total Clicks', stats.clicks.toLocaleString())}\n`;
        }
        if (stats.unique_clicks !== undefined) {
          response += `${formatKeyValue('Unique Clicks', stats.unique_clicks.toLocaleString())}\n`;
        }
        if (stats.click_rate !== undefined) {
          const clickRate = (stats.click_rate * 100).toFixed(2);
          const clickEmoji = parseFloat(clickRate) >= 3 ? '🚀' : parseFloat(clickRate) >= 2 ? '👍' : '⚠️';
          response += `${formatKeyValue('Click Rate', `${clickRate}% ${clickEmoji}`)}\n`;
        }
      }
      
      // Deliverability metrics
      if (stats.bounces !== undefined || stats.spam_reports !== undefined) {
        response += `\n${formatSectionHeader('⚠️ Deliverability Issues')}\n`;
        if (stats.bounces !== undefined) {
          response += `${formatKeyValue('Total Bounces', stats.bounces.toLocaleString())}\n`;
        }
        if (stats.hard_bounces !== undefined) {
          response += `${formatKeyValue('Hard Bounces', stats.hard_bounces.toLocaleString())}\n`;
        }
        if (stats.soft_bounces !== undefined) {
          response += `${formatKeyValue('Soft Bounces', stats.soft_bounces.toLocaleString())}\n`;
        }
        if (stats.bounce_rate !== undefined) {
          const bounceRate = (stats.bounce_rate * 100).toFixed(2);
          const bounceEmoji = parseFloat(bounceRate) <= 2 ? '✅' : parseFloat(bounceRate) <= 5 ? '⚠️' : '🛑';
          response += `${formatKeyValue('Bounce Rate', `${bounceRate}% ${bounceEmoji}`)}\n`;
        }
        
        if (stats.spam_reports !== undefined) {
          response += `${formatKeyValue('Spam Reports', stats.spam_reports.toLocaleString())}\n`;
        }
        if (stats.spam_rate !== undefined) {
          const spamRate = (stats.spam_rate * 100).toFixed(2);
          const spamEmoji = parseFloat(spamRate) <= 0.1 ? '✅' : parseFloat(spamRate) <= 0.5 ? '⚠️' : '🛑';
          response += `${formatKeyValue('Spam Rate', `${spamRate}% ${spamEmoji}`)}\n`;
        }
      }
      
      // Generate insights for list performance
      const insights = generateListInsights(stats);
      if (insights.length > 0) {
        response += `\n${formatSectionHeader('💡 Performance Insights')}\n`;
        response += formatList(insights);
      }
      
      const recommendations = generateListRecommendations(stats);
      if (recommendations.length > 0) {
        response += `\n${formatSectionHeader('🎯 Optimization Recommendations')}\n`;
        response += formatList(recommendations);
      }
    } else {
      response += `\n${formatSectionHeader('ℹ️ No Data')}\n`;
      response += 'No list statistics found for the specified list.\n';
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
 * Get account-wide performance statistics
 */
export async function handleGetAccountStats(args: any, api: CakemailAPI) {
  try {
    const { account_id, start_time, end_time } = args;
    
    let result;
    if (account_id) {
      // Get specific account stats
      result = await api.reports.getAccountStats(account_id.toString(), start_time, end_time);
    } else {
      // Get self account stats
      result = await api.reports.getSelfAccountStats(start_time, end_time);
    }
    
    // Format the response
    let response = `${formatSectionHeader('📈 Account Performance Overview')}\n\n`;
    
    // Account info
    response += `${formatSectionHeader('🏢 Account Details')}\n`;
    response += `${formatKeyValue('Account', account_id ? `ID: ${account_id}` : 'Self Account')}\n`;
    response += `${formatKeyValue('Generated', new Date().toLocaleString())}\n`;
    
    if (start_time || end_time) {
      response += `\n${formatSectionHeader('📅 Report Period')}\n`;
      if (start_time) {
        response += `${formatKeyValue('Start Time', new Date(start_time * 1000).toLocaleString())}\n`;
      }
      if (end_time) {
        response += `${formatKeyValue('End Time', new Date(end_time * 1000).toLocaleString())}\n`;
      }
    }
    
    if (result.data) {
      const stats = result.data;
      
      // Contact metrics
      response += `\n${formatSectionHeader('👥 Contact Statistics')}\n`;
      if (stats.active_contacts !== undefined) {
        response += `${formatKeyValue('Active Contacts', stats.active_contacts.toLocaleString())}\n`;
      }
      if (stats.current_lists !== undefined) {
        response += `${formatKeyValue('Total Lists', stats.current_lists.toLocaleString())}\n`;
      }
      
      // Email volume metrics
      response += `\n${formatSectionHeader('📧 Email Volume')}\n`;
      if (stats.sent_emails !== undefined) {
        response += `${formatKeyValue('Total Emails Sent', stats.sent_emails.toLocaleString())}\n`;
      }
      if (stats.sent_campaign_emails !== undefined) {
        response += `${formatKeyValue('Campaign Emails', stats.sent_campaign_emails.toLocaleString())}\n`;
      }
      if (stats.sent_action_emails !== undefined) {
        response += `${formatKeyValue('Action Emails', stats.sent_action_emails.toLocaleString())}\n`;
      }
      if (stats.sent_email_emails !== undefined) {
        response += `${formatKeyValue('API Emails', stats.sent_email_emails.toLocaleString())}\n`;
      }
      
      // Performance metrics
      response += `\n${formatSectionHeader('📊 Performance Metrics')}\n`;
      if (stats.open_rate !== undefined) {
        const openRate = (stats.open_rate * 100).toFixed(2);
        const openEmoji = parseFloat(openRate) >= 20 ? '🚀' : parseFloat(openRate) >= 15 ? '👍' : '⚠️';
        response += `${formatKeyValue('Average Open Rate', `${openRate}% ${openEmoji}`)}\n`;
      }
      if (stats.click_rate !== undefined) {
        const clickRate = (stats.click_rate * 100).toFixed(2);
        const clickEmoji = parseFloat(clickRate) >= 3 ? '🚀' : parseFloat(clickRate) >= 2 ? '👍' : '⚠️';
        response += `${formatKeyValue('Average Click Rate', `${clickRate}% ${clickEmoji}`)}\n`;
      }
      
      // Deliverability metrics
      response += `\n${formatSectionHeader('⚠️ Deliverability Health')}\n`;
      if (stats.bounce_rate !== undefined) {
        const bounceRate = (stats.bounce_rate * 100).toFixed(2);
        const bounceEmoji = parseFloat(bounceRate) <= 2 ? '✅' : parseFloat(bounceRate) <= 5 ? '⚠️' : '🛑';
        response += `${formatKeyValue('Average Bounce Rate', `${bounceRate}% ${bounceEmoji}`)}\n`;
      }
      if (stats.bounces_hard !== undefined) {
        response += `${formatKeyValue('Hard Bounces', stats.bounces_hard.toLocaleString())}\n`;
      }
      if (stats.bounce_hard_rate !== undefined) {
        const hardBounceRate = (stats.bounce_hard_rate * 100).toFixed(2);
        const hardBounceEmoji = parseFloat(hardBounceRate) <= 1 ? '✅' : parseFloat(hardBounceRate) <= 3 ? '⚠️' : '🛑';
        response += `${formatKeyValue('Hard Bounce Rate', `${hardBounceRate}% ${hardBounceEmoji}`)}\n`;
      }
      
      if (stats.spam_rate !== undefined) {
        const spamRate = (stats.spam_rate * 100).toFixed(2);
        const spamEmoji = parseFloat(spamRate) <= 0.1 ? '✅' : parseFloat(spamRate) <= 0.5 ? '⚠️' : '🛑';
        response += `${formatKeyValue('Spam Rate', `${spamRate}% ${spamEmoji}`)}\n`;
      }
      if (stats.spams !== undefined) {
        response += `${formatKeyValue('Total Spam Reports', stats.spams.toLocaleString())}\n`;
      }
      
      if (stats.unsubscribe_rate !== undefined) {
        const unsubRate = (stats.unsubscribe_rate * 100).toFixed(2);
        const unsubEmoji = parseFloat(unsubRate) <= 0.5 ? '✅' : parseFloat(unsubRate) <= 2 ? '⚠️' : '🛑';
        response += `${formatKeyValue('Unsubscribe Rate', `${unsubRate}% ${unsubEmoji}`)}\n`;
      }
      
      // Usage metrics
      if (stats.emails_usage !== undefined || stats.contacts_usage !== undefined) {
        response += `\n${formatSectionHeader('📄 Account Usage')}\n`;
        if (stats.emails_usage !== undefined) {
          const emailUsage = (stats.emails_usage * 100).toFixed(1);
          const usageEmoji = parseFloat(emailUsage) <= 80 ? '✅' : parseFloat(emailUsage) <= 95 ? '⚠️' : '🛑';
          response += `${formatKeyValue('Email Usage', `${emailUsage}% ${usageEmoji}`)}\n`;
        }
        if (stats.contacts_usage !== undefined) {
          const contactUsage = (stats.contacts_usage * 100).toFixed(1);
          const contactUsageEmoji = parseFloat(contactUsage) <= 80 ? '✅' : parseFloat(contactUsage) <= 95 ? '⚠️' : '🛑';
          response += `${formatKeyValue('Contact Usage', `${contactUsage}% ${contactUsageEmoji}`)}\n`;
        }
      }
      
      // Email API specific stats if available
      if (stats.email_api) {
        response += `\n${formatSectionHeader('🚀 Email API Statistics')}\n`;
        const emailApi = stats.email_api;
        if (emailApi.sent !== undefined) {
          response += `${formatKeyValue('API Emails Sent', emailApi.sent.toLocaleString())}\n`;
        }
        if (emailApi.delivered !== undefined) {
          response += `${formatKeyValue('API Emails Delivered', emailApi.delivered.toLocaleString())}\n`;
        }
        if (emailApi.delivery_rate !== undefined) {
          const deliveryRate = (emailApi.delivery_rate * 100).toFixed(2);
          const deliveryEmoji = parseFloat(deliveryRate) >= 95 ? '✅' : parseFloat(deliveryRate) >= 90 ? '⚠️' : '🛑';
          response += `${formatKeyValue('API Delivery Rate', `${deliveryRate}% ${deliveryEmoji}`)}\n`;
        }
      }
      
      // Generate insights for account performance
      const insights = generateAccountInsights(stats);
      if (insights.length > 0) {
        response += `\n${formatSectionHeader('💡 Performance Insights')}\n`;
        response += formatList(insights);
      }
      
      const recommendations = generateAccountRecommendations(stats);
      if (recommendations.length > 0) {
        response += `\n${formatSectionHeader('🎯 Optimization Recommendations')}\n`;
        response += formatList(recommendations);
      }
    } else {
      response += `\n${formatSectionHeader('ℹ️ No Data')}\n`;
      response += 'No account statistics found for the specified parameters.\n';
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
 * Get workflow action performance statistics
 */
export async function handleGetActionStats(args: any, api: CakemailAPI) {
  try {
    const { workflow_id, action_id, account_id } = args;
    
    if (!workflow_id || !action_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameters**: workflow_id and action_id are required'
        }],
        isError: true
      };
    }
    
    // Get action stats
    const result = await api.reports.getActionStats(workflow_id, action_id, account_id);
    
    // Format the response
    let response = `${formatSectionHeader('⚙️ Workflow Action Performance')}\n\n`;
    
    // Basic action info
    response += `${formatSectionHeader('📄 Action Details')}\n`;
    response += `${formatKeyValue('Workflow ID', workflow_id)}\n`;
    response += `${formatKeyValue('Action ID', action_id)}\n`;
    response += `${formatKeyValue('Generated', new Date().toLocaleString())}\n`;
    
    if (result.data) {
      const stats = result.data;
      
      // Email delivery metrics
      response += `\n${formatSectionHeader('📧 Email Delivery')}\n`;
      if (stats.sent_emails !== undefined) {
        response += `${formatKeyValue('Emails Sent', stats.sent_emails.toLocaleString())}\n`;
      }
      
      // Engagement metrics
      response += `\n${formatSectionHeader('💭 Engagement Metrics')}\n`;
      if (stats.opens !== undefined) {
        response += `${formatKeyValue('Total Opens', stats.opens.toLocaleString())}\n`;
      }
      if (stats.unique_opens !== undefined) {
        response += `${formatKeyValue('Unique Opens', stats.unique_opens.toLocaleString())}\n`;
      }
      if (stats.clicks !== undefined) {
        response += `${formatKeyValue('Total Clicks', stats.clicks.toLocaleString())}\n`;
      }
      if (stats.unique_clicks !== undefined) {
        response += `${formatKeyValue('Unique Clicks', stats.unique_clicks.toLocaleString())}\n`;
      }
      if (stats.forwards !== undefined) {
        response += `${formatKeyValue('Forwards', stats.forwards.toLocaleString())}\n`;
      }
      if (stats.implied_opens !== undefined) {
        response += `${formatKeyValue('Implied Opens', stats.implied_opens.toLocaleString())}\n`;
      }
      
      // Delivery issues
      response += `\n${formatSectionHeader('⚠️ Delivery Issues')}\n`;
      if (stats.bounces !== undefined) {
        response += `${formatKeyValue('Total Bounces', stats.bounces.toLocaleString())}\n`;
      }
      if (stats.bounces_hard !== undefined) {
        response += `${formatKeyValue('Hard Bounces', stats.bounces_hard.toLocaleString())}\n`;
      }
      if (stats.bounces_soft !== undefined) {
        response += `${formatKeyValue('Soft Bounces', stats.bounces_soft.toLocaleString())}\n`;
      }
      
      // Detailed bounce breakdown
      if (stats.bounces_address_changed || stats.bounces_challenge_response || 
          stats.bounces_dns_failure || stats.bounces_full_mailbox || 
          stats.bounces_mail_blocked || stats.bounces_transient) {
        response += `\n${formatSectionHeader('🔍 Bounce Analysis')}\n`;
        
        if (stats.bounces_address_changed) {
          response += `${formatKeyValue('Address Changed', stats.bounces_address_changed.toLocaleString())}\n`;
        }
        if (stats.bounces_challenge_response) {
          response += `${formatKeyValue('Challenge Response', stats.bounces_challenge_response.toLocaleString())}\n`;
        }
        if (stats.bounces_dns_failure) {
          response += `${formatKeyValue('DNS Failure', stats.bounces_dns_failure.toLocaleString())}\n`;
        }
        if (stats.bounces_full_mailbox) {
          response += `${formatKeyValue('Full Mailbox', stats.bounces_full_mailbox.toLocaleString())}\n`;
        }
        if (stats.bounces_mail_blocked) {
          response += `${formatKeyValue('Mail Blocked', stats.bounces_mail_blocked.toLocaleString())}\n`;
        }
        if (stats.bounces_transient) {
          response += `${formatKeyValue('Transient Issues', stats.bounces_transient.toLocaleString())}\n`;
        }
      }
      
      // Spam and unsubscribes
      if (stats.spams !== undefined || stats.unsubscribes !== undefined) {
        response += `\n${formatSectionHeader('🚫 User Actions')}\n`;
        if (stats.spams !== undefined) {
          response += `${formatKeyValue('Spam Reports', stats.spams.toLocaleString())}\n`;
        }
        if (stats.spam_rate !== undefined) {
          const spamRate = (stats.spam_rate * 100).toFixed(2);
          const spamEmoji = parseFloat(spamRate) <= 0.1 ? '✅' : parseFloat(spamRate) <= 0.5 ? '⚠️' : '🛑';
          response += `${formatKeyValue('Spam Rate', `${spamRate}% ${spamEmoji}`)}\n`;
        }
        if (stats.unsubscribes !== undefined) {
          response += `${formatKeyValue('Unsubscribes', stats.unsubscribes.toLocaleString())}\n`;
        }
      }
      
      // Calculate and display rates
      if (stats.sent_emails && stats.sent_emails > 0) {
        response += `\n${formatSectionHeader('📊 Calculated Rates')}\n`;
        
        if (stats.unique_opens !== undefined) {
          const openRate = (stats.unique_opens / stats.sent_emails * 100).toFixed(2);
          const openEmoji = parseFloat(openRate) >= 20 ? '🚀' : parseFloat(openRate) >= 15 ? '👍' : '⚠️';
          response += `${formatKeyValue('Open Rate', `${openRate}% ${openEmoji}`)}\n`;
        }
        
        if (stats.unique_clicks !== undefined) {
          const clickRate = (stats.unique_clicks / stats.sent_emails * 100).toFixed(2);
          const clickEmoji = parseFloat(clickRate) >= 3 ? '🚀' : parseFloat(clickRate) >= 2 ? '👍' : '⚠️';
          response += `${formatKeyValue('Click Rate', `${clickRate}% ${clickEmoji}`)}\n`;
        }
        
        if (stats.bounces !== undefined) {
          const bounceRate = (stats.bounces / stats.sent_emails * 100).toFixed(2);
          const bounceEmoji = parseFloat(bounceRate) <= 2 ? '✅' : parseFloat(bounceRate) <= 5 ? '⚠️' : '🛑';
          response += `${formatKeyValue('Bounce Rate', `${bounceRate}% ${bounceEmoji}`)}\n`;
        }
      }
      
      // Generate insights for action performance
      const insights = generateActionInsights(stats);
      if (insights.length > 0) {
        response += `\n${formatSectionHeader('💡 Performance Insights')}\n`;
        response += formatList(insights);
      }
      
      const recommendations = generateActionRecommendations(stats);
      if (recommendations.length > 0) {
        response += `\n${formatSectionHeader('🎯 Optimization Recommendations')}\n`;
        response += formatList(recommendations);
      }
    } else {
      response += `\n${formatSectionHeader('ℹ️ No Data')}\n`;
      response += 'No action statistics found for the specified workflow and action.\n';
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
 * Get comprehensive account performance overview (convenience method)
 */
export async function handleGetAccountPerformanceOverview(args: any, api: CakemailAPI) {
  try {
    const { account_id, start_time, end_time } = args;
    
    // Use the convenience method from the API
    await api.reports.getAccountPerformanceOverview(account_id, start_time, end_time);
    
    // This uses the same formatting as handleGetAccountStats since it returns the same data
    return handleGetAccountStats(args, api);
    
  } catch (error) {
    return handleCakemailError(error);
  }
}
