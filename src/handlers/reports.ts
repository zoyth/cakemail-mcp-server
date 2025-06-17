import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';
import { formatSectionHeader, formatKeyValue, formatList } from '../utils/formatting.js';

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
    const result = await api.reports.getCampaignPerformanceSummary(campaign_id, account_id);
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
 * Analyze link statistics to generate summary metrics
 */
function analyzeLinkStats(links: any[]): {
  totalUniqueClicks: number;
  totalClicks: number;
  avgUniqueRate: number;
  avgTotalRate: number;
  clickThroughRatio: number;
  topPerformingCount: number;
} {
  const totalUniqueClicks = links.reduce((sum, link) => sum + (link.unique || 0), 0);
  const totalClicks = links.reduce((sum, link) => sum + (link.total || 0), 0);
  const avgUniqueRate = links.reduce((sum, link) => sum + ((link.unique_rate || 0) * 100), 0) / links.length;
  const avgTotalRate = links.reduce((sum, link) => sum + ((link.total_rate || 0) * 100), 0) / links.length;
  const clickThroughRatio = totalUniqueClicks > 0 ? totalClicks / totalUniqueClicks : 0;
  const topPerformingCount = links.filter(link => (link.unique || 0) >= 10).length;
  
  return {
    totalUniqueClicks,
    totalClicks,
    avgUniqueRate,
    avgTotalRate,
    clickThroughRatio,
    topPerformingCount
  };
}

/**
 * Categorize links by type/domain for analysis
 */
function categorizeLinks(links: any[]): Record<string, any[]> {
  const categories: Record<string, any[]> = {};
  
  links.forEach(link => {
    let category = 'Other';
    const url = link.link.toLowerCase();
    
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const domain = urlObj.hostname;
      
      // Social media platforms
      if (domain.includes('facebook') || domain.includes('fb.com')) {
        category = 'Social Media (Facebook)';
      } else if (domain.includes('twitter') || domain.includes('x.com')) {
        category = 'Social Media (Twitter/X)';
      } else if (domain.includes('linkedin')) {
        category = 'Social Media (LinkedIn)';
      } else if (domain.includes('instagram')) {
        category = 'Social Media (Instagram)';
      } else if (domain.includes('youtube')) {
        category = 'Video (YouTube)';
      } else if (domain.includes('vimeo')) {
        category = 'Video (Vimeo)';
      }
      // E-commerce
      else if (domain.includes('shop') || domain.includes('store') || domain.includes('buy') || 
               domain.includes('cart') || domain.includes('checkout') || domain.includes('amazon') ||
               domain.includes('ebay')) {
        category = 'E-commerce';
      }
      // Content/Blog
      else if (domain.includes('blog') || domain.includes('news') || domain.includes('article')) {
        category = 'Content/Blog';
      }
      // External domains
      else if (!domain.includes('localhost') && !domain.includes('127.0.0.1')) {
        category = `External (${domain})`;
      }
      // Internal links
      else {
        category = 'Internal Links';
      }
    } catch (e) {
      // If URL parsing fails, categorize by content
      if (url.includes('unsubscribe')) {
        category = 'Unsubscribe';
      } else if (url.includes('social')) {
        category = 'Social Media';
      } else if (url.includes('shop') || url.includes('buy') || url.includes('product')) {
        category = 'E-commerce';
      }
    }
    
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(link);
  });
  
  return categories;
}

/**
 * Generate insights based on link performance data
 */
function generateLinkInsights(links: any[], stats: any): string[] {
  const insights: string[] = [];
  
  // Overall performance insights
  if (stats.totalUniqueClicks === 0) {
    insights.push('No clicks recorded - consider reviewing link placement and call-to-action effectiveness');
  } else if (stats.topPerformingCount === 0) {
    insights.push('All links have low engagement - content may need optimization');
  } else if (stats.topPerformingCount >= links.length * 0.5) {
    insights.push('Strong overall link performance - good content engagement');
  }
  
  // Click distribution insights
  const sortedLinks = links.sort((a, b) => (b.unique || 0) - (a.unique || 0));
  if (sortedLinks.length >= 3) {
    const topLink = sortedLinks[0];
    const topClicks = topLink.unique || 0;
    const totalClicks = stats.totalUniqueClicks;
    
    if (topClicks > totalClicks * 0.5) {
      insights.push('One link dominates clicks - consider distributing engagement across multiple CTAs');
    } else if (topClicks < totalClicks * 0.2 && sortedLinks.length > 5) {
      insights.push('Even click distribution - good variety of engaging content');
    }
  }
  
  // Repeat click insights
  if (stats.clickThroughRatio > 2) {
    insights.push('High repeat click rate - users are very engaged with your links');
  } else if (stats.clickThroughRatio < 1.1) {
    insights.push('Low repeat clicks - links may not be providing expected value');
  }
  
  // Category-based insights
  const categories = categorizeLinks(links);
  const socialLinks = Object.keys(categories).filter(cat => cat.includes('Social')).length;
  const ecommerceLinks = Object.keys(categories).filter(cat => cat.includes('E-commerce')).length;
  
  if (socialLinks > 0 && ecommerceLinks > 0) {
    insights.push('Good mix of social and commercial links - balanced engagement strategy');
  } else if (socialLinks > 3) {
    insights.push('Heavy focus on social media - consider adding more direct conversion links');
  } else if (ecommerceLinks > links.length * 0.8) {
    insights.push('Sales-focused campaign - monitor conversion rates alongside click rates');
  }
  
  return insights;
}

/**
 * Generate recommendations based on link performance
 */
function generateLinkRecommendations(links: any[], stats: any): string[] {
  const recommendations: string[] = [];
  
  // Low overall performance
  if (stats.totalUniqueClicks < links.length * 2) {
    recommendations.push('Consider A/B testing different link text and button designs');
    recommendations.push('Review link placement - ensure CTAs are visible and compelling');
    recommendations.push('Simplify your message - too many links can reduce individual performance');
  }
  
  // Uneven distribution
  const sortedLinks = links.sort((a, b) => (b.unique || 0) - (a.unique || 0));
  const zeroClickLinks = links.filter(link => (link.unique || 0) === 0);
  
  if (zeroClickLinks.length > 0) {
    recommendations.push('Remove or optimize links with zero clicks - they may be confusing or irrelevant');
    recommendations.push('Consider consolidating similar links to reduce choice paralysis');
  }
  
  if (zeroClickLinks.length > links.length * 0.3) {
    recommendations.push('Too many ineffective links - focus on 2-3 primary CTAs per email');
  }
  
  // Repeat clicks
  if (stats.clickThroughRatio < 1.2) {
    recommendations.push('Improve landing page experience - users may not find what they expect');
    recommendations.push('Ensure link promises match landing page content');
  }
  
  // Performance-based recommendations
  if (stats.avgUniqueRate < 1) {
    recommendations.push('Low click rates overall - consider more compelling call-to-action copy');
    recommendations.push('Test different link colors, sizes, and button styles');
    recommendations.push('Add urgency or scarcity elements to increase click motivation');
  }
  
  // Link categorization recommendations
  const categories = categorizeLinks(links);
  if (Object.keys(categories).length === 1) {
    recommendations.push('Diversify link types - include social proof, content, and conversion links');
  }
  
  // Top performer analysis
  if (sortedLinks.length > 0 && sortedLinks[0].unique > 0) {
    const topPerformer = sortedLinks[0];
    recommendations.push(`Top link: "${topPerformer.link}" - analyze what makes this effective and apply to other links`);
  }
  
  return recommendations;
}

/**
 * Generate insights based on campaign statistics
 */
function generateCampaignInsights(stats: any): string[] {
  const insights: string[] = [];
  
  // Open rate insights
  if (stats.open_rate !== undefined) {
    const openRate = stats.open_rate * 100;
    if (openRate >= 25) {
      insights.push('Excellent open rate - your subject line and sender reputation are performing well');
    } else if (openRate >= 20) {
      insights.push('Good open rate - above industry average');
    } else if (openRate >= 15) {
      insights.push('Average open rate - room for improvement in subject lines');
    } else if (openRate < 15) {
      insights.push('Low open rate - consider improving subject lines and sender reputation');
    }
  }
  
  // Click rate insights
  if (stats.click_rate !== undefined) {
    const clickRate = stats.click_rate * 100;
    if (clickRate >= 5) {
      insights.push('Outstanding click rate - your content is highly engaging');
    } else if (clickRate >= 3) {
      insights.push('Good click rate - content is resonating with your audience');
    } else if (clickRate >= 2) {
      insights.push('Average click rate - consider improving call-to-action placement');
    } else if (clickRate < 2) {
      insights.push('Low click rate - content may need optimization');
    }
  }
  
  // Bounce rate insights
  if (stats.bounce_rate !== undefined) {
    const bounceRate = stats.bounce_rate * 100;
    if (bounceRate <= 2) {
      insights.push('Excellent delivery rate - your list quality is very good');
    } else if (bounceRate <= 5) {
      insights.push('Good delivery rate - minimal bounce issues');
    } else if (bounceRate > 10) {
      insights.push('High bounce rate detected - list cleaning recommended');
    }
  }
  
  // Engagement ratio insights
  if (stats.opens !== undefined && stats.clicks !== undefined && stats.opens > 0) {
    const engagementRatio = (stats.clicks / stats.opens) * 100;
    if (engagementRatio >= 15) {
      insights.push('High engagement ratio - recipients who open are very likely to click');
    } else if (engagementRatio < 5) {
      insights.push('Low engagement ratio - content may not match reader expectations');
    }
  }
  
  return insights;
}

/**
 * Generate recommendations based on campaign statistics
 */
function generateCampaignRecommendations(stats: any): string[] {
  const recommendations: string[] = [];
  
  // Open rate recommendations
  if (stats.open_rate !== undefined && stats.open_rate * 100 < 20) {
    recommendations.push('Try A/B testing different subject lines to improve open rates');
    recommendations.push('Consider optimizing send times based on your audience timezone');
    recommendations.push('Review sender name and "from" address for trust and recognition');
  }
  
  // Click rate recommendations
  if (stats.click_rate !== undefined && stats.click_rate * 100 < 3) {
    recommendations.push('Strengthen your call-to-action buttons with more compelling copy');
    recommendations.push('Consider simplifying your email design to highlight key actions');
    recommendations.push('Test different content formats (images vs text, length, etc.)');
  }
  
  // Bounce rate recommendations
  if (stats.bounce_rate !== undefined && stats.bounce_rate * 100 > 5) {
    recommendations.push('Implement list cleaning to remove invalid email addresses');
    recommendations.push('Use double opt-in for new subscribers to ensure email validity');
    recommendations.push('Regular list hygiene - remove addresses that consistently bounce');
  }
  
  // Spam rate recommendations
  if (stats.spam_rate !== undefined && stats.spam_rate * 100 > 0.5) {
    recommendations.push('Review email content for spam trigger words');
    recommendations.push('Ensure clear unsubscribe options are prominently displayed');
    recommendations.push('Monitor sender reputation and consider authentication (SPF, DKIM)');
  }
  
  // Unsubscribe rate recommendations
  if (stats.unsubscribe_rate !== undefined && stats.unsubscribe_rate * 100 > 2) {
    recommendations.push('Review email frequency - you may be sending too often');
    recommendations.push('Segment your audience for more targeted, relevant content');
    recommendations.push('Survey unsubscribers to understand their reasons for leaving');
  }
  
  // General recommendations based on overall performance
  if (stats.open_rate !== undefined && stats.click_rate !== undefined) {
    const openRate = stats.open_rate * 100;
    const clickRate = stats.click_rate * 100;
    
    if (openRate >= 20 && clickRate < 2) {
      recommendations.push('Good open rate but low clicks - focus on improving email content and CTAs');
    }
    
    if (openRate < 15 && clickRate >= 3) {
      recommendations.push('Good engagement from openers - work on subject lines to increase opens');
    }
  }
  
  return recommendations;
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
          // Calculate category totals for potential future use
          // const categoryTotal = links.reduce((sum, link) => sum + (link.total || 0), 0);
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

export async function handleGetEmailStats(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetListStats(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetAccountStats(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetCampaignPerformanceSummary(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetAccountPerformanceOverview(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleListCampaignReportsExports(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleCreateCampaignReportsExport(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetCampaignReportsExport(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDownloadCampaignReportsExport(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDeleteCampaignReportsExport(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDebugReportsAccess(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}
