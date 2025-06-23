import { CakemailAPI } from '../../cakemail-api.js';
import { handleCakemailError } from '../../utils/errors.js';
import { formatSectionHeader, formatKeyValue, formatList } from '../../utils/formatting.js';
import { 
  generateCampaignInsights, 
  generateCampaignRecommendations,
  analyzeLinkStats,
  generateLinkInsights,
  generateLinkRecommendations,
  categorizeLinks
} from './insights.js';

/**
 * Get detailed campaign performance statistics and analytics
 */
export async function handleGetCampaignStats(args: any, api: CakemailAPI) {
  try {
    const { campaign_id, account_id } = args;
    
    if (!campaign_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: campaign_id is required'
        }],
        isError: true
      };
    }
    
    // Get campaign stats with performance summary
    const result = await api.reports.getCampaignPerformanceSummary(campaign_id, account_id ? Number(account_id) : undefined);
    const stats = result.campaign_stats;
    
    // Format the response with comprehensive analysis
    let response = `${formatSectionHeader('📈 Campaign Performance Analysis')}\n\n`;
    
    // Basic campaign info
    response += `${formatSectionHeader('📊 Campaign Overview')}\n`;
    response += `${formatKeyValue('Campaign ID', campaign_id)}\n`;
    response += `${formatKeyValue('Generated', new Date(result.generated_at).toLocaleString())}\n`;
    
    // Delivery metrics
    response += `\n${formatSectionHeader('📧 Delivery Performance')}\n`;
    response += `${formatKeyValue('Total Sent', stats.sent_emails?.toLocaleString() || '0')}\n`;
    response += `${formatKeyValue('Active Emails', stats.active_emails?.toLocaleString() || '0')}\n`;
    
    if (stats.sent_rate !== undefined) {
      response += `${formatKeyValue('Delivery Rate', `${(stats.sent_rate * 100).toFixed(2)}%`)}\n`;
    }
    
    // Engagement metrics
    response += `\n${formatSectionHeader('💭 Engagement Metrics')}\n`;
    
    // Opens
    if (stats.opens !== undefined) {
      response += `${formatKeyValue('Total Opens', stats.opens.toLocaleString())}\n`;
    }
    if (stats.unique_opens !== undefined) {
      response += `${formatKeyValue('Unique Opens', stats.unique_opens.toLocaleString())}\n`;
    }
    if (stats.open_rate !== undefined) {
      const openRate = (stats.open_rate * 100).toFixed(2);
      const openRateEmoji = parseFloat(openRate) >= 20 ? '🚀' : parseFloat(openRate) >= 15 ? '👍' : '⚠️';
      response += `${formatKeyValue('Open Rate', `${openRate}% ${openRateEmoji}`)}\n`;
    }
    
    // Clicks
    if (stats.clicks !== undefined) {
      response += `${formatKeyValue('Total Clicks', stats.clicks.toLocaleString())}\n`;
    }
    if (stats.unique_clicks !== undefined) {
      response += `${formatKeyValue('Unique Clicks', stats.unique_clicks.toLocaleString())}\n`;
    }
    if (stats.click_rate !== undefined) {
      const clickRate = (stats.click_rate * 100).toFixed(2);
      const clickRateEmoji = parseFloat(clickRate) >= 3 ? '🚀' : parseFloat(clickRate) >= 2 ? '👍' : '⚠️';
      response += `${formatKeyValue('Click Rate', `${clickRate}% ${clickRateEmoji}`)}\n`;
    }
    if (stats.clickthru_rate !== undefined) {
      response += `${formatKeyValue('Click-through Rate', `${(stats.clickthru_rate * 100).toFixed(2)}%`)}\n`;
    }
    
    // Bounces and issues
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
    if (stats.bounce_rate !== undefined) {
      const bounceRate = (stats.bounce_rate * 100).toFixed(2);
      const bounceRateEmoji = parseFloat(bounceRate) <= 2 ? '✅' : parseFloat(bounceRate) <= 5 ? '⚠️' : '🛑';
      response += `${formatKeyValue('Bounce Rate', `${bounceRate}% ${bounceRateEmoji}`)}\n`;
    }
    
    // Spam and unsubscribes
    if (stats.spams !== undefined) {
      response += `${formatKeyValue('Spam Reports', stats.spams.toLocaleString())}\n`;
    }
    if (stats.spam_rate !== undefined) {
      const spamRate = (stats.spam_rate * 100).toFixed(2);
      const spamRateEmoji = parseFloat(spamRate) <= 0.1 ? '✅' : parseFloat(spamRate) <= 0.5 ? '⚠️' : '🛑';
      response += `${formatKeyValue('Spam Rate', `${spamRate}% ${spamRateEmoji}`)}\n`;
    }
    
    if (stats.unsubscribes !== undefined) {
      response += `${formatKeyValue('Unsubscribes', stats.unsubscribes.toLocaleString())}\n`;
    }
    if (stats.unsubscribe_rate !== undefined) {
      const unsubRate = (stats.unsubscribe_rate * 100).toFixed(2);
      const unsubRateEmoji = parseFloat(unsubRate) <= 0.5 ? '✅' : parseFloat(unsubRate) <= 2 ? '⚠️' : '🛑';
      response += `${formatKeyValue('Unsubscribe Rate', `${unsubRate}% ${unsubRateEmoji}`)}\n`;
    }
    
    // Detailed bounce breakdown
    if (stats.bounces_address_changed || stats.bounces_challenge_response || stats.bounces_dns_failure || 
        stats.bounces_full_mailbox || stats.bounces_mail_blocked || stats.bounces_transient) {
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
    
    // Links analysis
    if (result.links_stats.total_links > 0) {
      response += `\n${formatSectionHeader('🔗 Link Performance')}\n`;
      response += `${formatKeyValue('Total Links', result.links_stats.total_links.toLocaleString())}\n`;
      
      if (result.links_stats.links.length > 0) {
        response += `\n**Top Performing Links:**\n`;
        const topLinks = result.links_stats.links
          .sort((a, b) => (b.unique || 0) - (a.unique || 0))
          .slice(0, 5);
        
        topLinks.forEach((link, index) => {
          const linkText = link.link.length > 50 ? link.link.substring(0, 47) + '...' : link.link;
          response += `**${index + 1}.** ${linkText}\n`;
          response += `   • Unique clicks: ${link.unique || 0} (${((link.unique_rate || 0) * 100).toFixed(1)}%)\n`;
          response += `   • Total clicks: ${link.total || 0} (${((link.total_rate || 0) * 100).toFixed(1)}%)\n`;
        });
      }
    }
    
    // Performance insights and recommendations
    const insights = generateCampaignInsights(stats);
    if (insights.length > 0) {
      response += `\n${formatSectionHeader('💡 Performance Insights')}\n`;
      response += formatList(insights);
    }
    
    const recommendations = generateCampaignRecommendations(stats);
    if (recommendations.length > 0) {
      response += `\n${formatSectionHeader('🎯 Optimization Recommendations')}\n`;
      response += formatList(recommendations);
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
 * Get campaign link click statistics and performance data
 */
export async function handleGetCampaignLinksStats(args: any, api: CakemailAPI) {
  try {
    const { campaign_id, start_time, end_time, account_id, page, per_page, sort, order } = args;
    
    if (!campaign_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: campaign_id is required'
        }],
        isError: true
      };
    }
    
    // Build parameters object
    const params: any = {
      page: page || 1,
      per_page: per_page || 50,
      with_count: true // Always include count for links stats
    };
    
    if (account_id) params.account_id = account_id;
    if (start_time) params.start_time = start_time;
    if (end_time) params.end_time = end_time;
    if (sort) params.sort = sort;
    if (order) params.order = order;
    
    // Get campaign links stats
    const result = await api.reports.getCampaignLinksStats(campaign_id, params);
    
    // Format the response with comprehensive analysis
    let response = `${formatSectionHeader('🔗 Campaign Links Performance Analysis')}\n\n`;
    
    // Basic info
    response += `${formatSectionHeader('📊 Overview')}\n`;
    response += `${formatKeyValue('Campaign ID', campaign_id)}\n`;
    response += `${formatKeyValue('Total Links', result.data?.length?.toLocaleString() || '0')}\n`;
    
    if (start_time || end_time) {
      response += `\n${formatSectionHeader('📅 Time Range')}\n`;
      if (start_time) {
        response += `${formatKeyValue('Start Time', new Date(start_time * 1000).toLocaleString())}\n`;
      }
      if (end_time) {
        response += `${formatKeyValue('End Time', new Date(end_time * 1000).toLocaleString())}\n`;
      }
    }
    
    // Pagination info
    if (result.pagination) {
      const p = result.pagination;
      response += `\n${formatSectionHeader('📄 Pagination')}\n`;
      response += `${formatKeyValue('Page', `${p.page} (${result.data?.length || 0} items)`)}\n`;
      if (p.count !== undefined) {
        response += `${formatKeyValue('Total Links', p.count.toLocaleString())}\n`;
      }
    }
    
    if (result.data && result.data.length > 0) {
      // Calculate summary statistics
      const linkStats = analyzeLinkStats(result.data);
      
      // Summary statistics
      response += `\n${formatSectionHeader('📈 Performance Summary')}\n`;
      response += `${formatKeyValue('Total Unique Clicks', linkStats.totalUniqueClicks.toLocaleString())}\n`;
      response += `${formatKeyValue('Total Clicks', linkStats.totalClicks.toLocaleString())}\n`;
      response += `${formatKeyValue('Average Unique Rate', `${linkStats.avgUniqueRate.toFixed(2)}%`)}\n`;
      response += `${formatKeyValue('Average Total Rate', `${linkStats.avgTotalRate.toFixed(2)}%`)}\n`;
      
      if (linkStats.clickThroughRatio > 0) {
        response += `${formatKeyValue('Click-through Ratio', `${linkStats.clickThroughRatio.toFixed(2)}:1`)}\n`;
      }
      
      // Top performing links
      response += `\n${formatSectionHeader('🏆 Top Performing Links')}\n`;
      const topLinks = result.data
        .sort((a, b) => (b.unique || 0) - (a.unique || 0))
        .slice(0, 10);
      
      topLinks.forEach((link, index) => {
        const linkText = link.link.length > 60 ? link.link.substring(0, 57) + '...' : link.link;
        const uniqueClicks = link.unique || 0;
        const totalClicks = link.total || 0;
        const uniqueRate = ((link.unique_rate || 0) * 100).toFixed(2);
        const totalRate = ((link.total_rate || 0) * 100).toFixed(2);
        
        // Performance indicators
        const performanceEmoji = uniqueClicks >= 50 ? '🚀' : uniqueClicks >= 20 ? '👍' : uniqueClicks >= 5 ? '📈' : '📊';
        
        response += `\n**${index + 1}.** ${linkText} ${performanceEmoji}\n`;
        response += `   • **Unique Clicks:** ${uniqueClicks.toLocaleString()} (${uniqueRate}%)\n`;
        response += `   • **Total Clicks:** ${totalClicks.toLocaleString()} (${totalRate}%)\n`;
        
        if (totalClicks > uniqueClicks) {
          const repeatRatio = (totalClicks / uniqueClicks).toFixed(1);
          response += `   • **Repeat Clicks:** ${repeatRatio}x average per user\n`;
        }
      });
      
      // Link categories analysis
      const categorizedLinks = categorizeLinks(result.data);
      if (Object.keys(categorizedLinks).length > 1) {
        response += `\n${formatSectionHeader('🎯 Link Categories Performance')}\n`;
        Object.entries(categorizedLinks).forEach(([category, links]) => {
          const categoryClicks = links.reduce((sum, link) => sum + (link.unique || 0), 0);
          response += `${formatKeyValue(category, `${links.length} links, ${categoryClicks} unique clicks`)}\n`;
        });
      }
      
      // Performance insights
      const insights = generateLinkInsights(result.data, linkStats);
      if (insights.length > 0) {
        response += `\n${formatSectionHeader('💡 Performance Insights')}\n`;
        response += formatList(insights);
      }
      
      // Optimization recommendations
      const recommendations = generateLinkRecommendations(result.data, linkStats);
      if (recommendations.length > 0) {
        response += `\n${formatSectionHeader('🎯 Optimization Recommendations')}\n`;
        response += formatList(recommendations);
      }
      
      // Low performing links (if any)
      const lowPerformingLinks = result.data.filter(link => (link.unique || 0) === 0);
      if (lowPerformingLinks.length > 0) {
        response += `\n${formatSectionHeader('⚠️ Links with No Clicks')}\n`;
        response += `Found ${lowPerformingLinks.length} links with zero clicks:\n\n`;
        lowPerformingLinks.slice(0, 5).forEach((link, index) => {
          const linkText = link.link.length > 70 ? link.link.substring(0, 67) + '...' : link.link;
          response += `**${index + 1}.** ${linkText}\n`;
        });
        
        if (lowPerformingLinks.length > 5) {
          response += `\n*... and ${lowPerformingLinks.length - 5} more*\n`;
        }
      }
      
    } else {
      response += `\n${formatSectionHeader('ℹ️ No Links Found')}\n`;
      response += 'No links were found for this campaign. This could mean:\n\n';
      response += '• The campaign has no clickable links\n';
      response += '• The campaign hasn\'t been sent yet\n';
      response += '• Links haven\'t received any clicks\n';
      response += '• There may be permission or access issues\n';
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
 * Get comprehensive campaign performance summary (convenience method)
 */
export async function handleGetCampaignPerformanceSummary(args: any, api: CakemailAPI) {
  try {
    const { campaign_id } = args;
    
    if (!campaign_id) {
      return {
        content: [{
          type: 'text',
          text: '❌ **Missing Parameter**: campaign_id is required'
        }],
        isError: true
      };
    }
    
    // This function delegates to handleGetCampaignStats which calls the API
    // No need to call the API twice
    return handleGetCampaignStats(args, api);
    
  } catch (error) {
    return handleCakemailError(error);
  }
}
