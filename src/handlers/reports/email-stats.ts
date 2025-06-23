import { CakemailAPI } from '../../cakemail-api.js';
import { handleCakemailError } from '../../utils/errors.js';
import { formatSectionHeader, formatKeyValue, formatList } from '../../utils/formatting.js';
import { generateEmailInsights, generateEmailRecommendations } from './insights.js';

/**
 * Get email statistics for the transactional email API
 */
export async function handleGetEmailStats(args: any, api: CakemailAPI) {
  try {
    const { start_time, end_time, account_id } = args;
    
    if (!start_time || !end_time) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameters**: start_time and end_time are required'
        }],
        isError: true
      };
    }
    
    const options: any = {};
    if (account_id) options.account_id = Number(account_id);
    
    // Get email stats
    const result = await api.reports.getEmailStats(start_time, end_time, options);
    
    // Format the response
    let response = `${formatSectionHeader('📊 Email API Statistics')}\n\n`;
    
    // Time range
    response += `${formatSectionHeader('📅 Report Period')}\n`;
    response += `${formatKeyValue('Start Time', new Date(start_time * 1000).toLocaleString())}\n`;
    response += `${formatKeyValue('End Time', new Date(end_time * 1000).toLocaleString())}\n`;
    
    if (result.data) {
      const stats = result.data;
      
      // Overall delivery metrics
      response += `\n${formatSectionHeader('📧 Delivery Performance')}\n`;
      if (stats.submitted !== undefined) {
        response += `${formatKeyValue('Emails Submitted', stats.submitted.toLocaleString())}\n`;
      }
      if (stats.delivered !== undefined) {
        response += `${formatKeyValue('Emails Delivered', stats.delivered.toLocaleString())}\n`;
      }
      if (stats.delivery_rate !== undefined) {
        const deliveryRate = (stats.delivery_rate * 100).toFixed(2);
        const deliveryEmoji = parseFloat(deliveryRate) >= 95 ? '✅' : parseFloat(deliveryRate) >= 90 ? '👍' : '⚠️';
        response += `${formatKeyValue('Delivery Rate', `${deliveryRate}% ${deliveryEmoji}`)}\n`;
      }
      
      // Engagement metrics
      response += `\n${formatSectionHeader('💭 Engagement Metrics')}\n`;
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
      
      // Delivery issues
      response += `\n${formatSectionHeader('⚠️ Delivery Issues')}\n`;
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
      
      if (stats.unsubscribes !== undefined) {
        response += `${formatKeyValue('Unsubscribes', stats.unsubscribes.toLocaleString())}\n`;
      }
      
      // Processing metrics
      if (stats.rejected !== undefined || stats.queued !== undefined) {
        response += `\n${formatSectionHeader('🔄 Processing Status')}\n`;
        if (stats.rejected !== undefined) {
          response += `${formatKeyValue('Rejected', stats.rejected.toLocaleString())}\n`;
        }
        if (stats.queued !== undefined) {
          response += `${formatKeyValue('Queued', stats.queued.toLocaleString())}\n`;
        }
      }
      
      // Generate insights for email performance
      const insights = generateEmailInsights(stats);
      if (insights.length > 0) {
        response += `\n${formatSectionHeader('💡 Performance Insights')}\n`;
        response += formatList(insights);
      }
      
      const recommendations = generateEmailRecommendations(stats);
      if (recommendations.length > 0) {
        response += `\n${formatSectionHeader('🎯 Optimization Recommendations')}\n`;
        response += formatList(recommendations);
      }
    } else {
      response += `\n${formatSectionHeader('ℹ️ No Data')}\n`;
      response += 'No email statistics found for the specified time period.\n';
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
