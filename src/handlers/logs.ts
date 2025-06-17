import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';
import { formatSectionHeader, formatKeyValue, formatList } from '../utils/formatting.js';
import type { GetCampaignLogsParams } from '../api/logs-api.js';

/**
 * Get campaign logs with intelligent event categorization and smart filtering
 */
export async function handleGetCampaignLogs(args: any, api: CakemailAPI) {
  try {
    const { campaign_id, account_id, page, per_page, with_count, sort, order, cursor, filter, type, start_time, end_time } = args;
    
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
    const params: GetCampaignLogsParams = {
      page: page || 1,
      per_page: per_page || 50,
      with_count: with_count !== false // Default to true
    };
    
    if (account_id) params.account_id = account_id;
    if (cursor) params.cursor = cursor;
    if (type) params.type = type;
    if (start_time) params.start_time = start_time;
    if (end_time) params.end_time = end_time;
    
    // Handle sorting
    if (sort) {
      const direction = order === 'asc' ? '+' : '-';
      params.sort = `${direction}${sort}`;
    }
    
    // Handle custom filter
    if (filter) {
      params.filter = filter;
    }
    
    // Get logs with analysis
    const result = await api.logs.getCampaignLogsWithAnalysis(campaign_id, params);
    
    // Format the response
    let response = `${formatSectionHeader('📊 Campaign Logs Analysis')}\n\n`;
    
    // Summary section
    const { summary, insights, recommendations, sequence_analysis } = result.analysis;
    response += `${formatSectionHeader('📈 Summary')}\n`;
    response += `${formatKeyValue('Total Events', summary.total_events.toLocaleString())}\n`;
    
    if (summary.time_range.start && summary.time_range.end) {
      const startDate = new Date(summary.time_range.start * 1000).toLocaleString();
      const endDate = new Date(summary.time_range.end * 1000).toLocaleString();
      response += `${formatKeyValue('Time Range', `${startDate} → ${endDate}`)}\n`;
    }
    
    // Advanced sequence analysis section
    if (sequence_analysis) {
      response += `\n${formatSectionHeader('🔄 Email Journey Funnel')}\n`;
      const funnel = sequence_analysis.funnel_metrics;
      response += `${formatKeyValue('📤 Sent', funnel.sent.toLocaleString())}\n`;
      response += `${formatKeyValue('📧 Delivered', `${funnel.delivered.toLocaleString()} (${sequence_analysis.conversion_rates.delivery_rate.toFixed(1)}%)`)}\n`;
      response += `${formatKeyValue('👀 Opened', `${funnel.opened.toLocaleString()} (${sequence_analysis.conversion_rates.open_rate.toFixed(1)}%)`)}\n`;
      response += `${formatKeyValue('🖱️ Clicked', `${funnel.clicked.toLocaleString()} (${sequence_analysis.conversion_rates.click_through_rate.toFixed(1)}%)`)}\n`;
      
      if (funnel.bounced > 0) {
        response += `${formatKeyValue('⚠️ Bounced', `${funnel.bounced.toLocaleString()} (${sequence_analysis.conversion_rates.bounce_rate.toFixed(1)}%)`)}\n`;
      }
      if (funnel.unsubscribed > 0) {
        response += `${formatKeyValue('🚫 Unsubscribed', `${funnel.unsubscribed.toLocaleString()} (${sequence_analysis.conversion_rates.unsubscribe_rate.toFixed(1)}%)`)}\n`;
      }
      
      // User Journey Analysis
      response += `\n${formatSectionHeader('👥 User Journey Analysis')}\n`;
      const journeys = sequence_analysis.user_journeys;
      response += `${formatKeyValue('Complete Journey', `${journeys.complete_journey.toLocaleString()} users (sent → delivered → opened → clicked)`)}\n`;
      response += `${formatKeyValue('Opened, Not Clicked', `${journeys.opened_not_clicked.toLocaleString()} users`)}\n`;
      response += `${formatKeyValue('Delivered, Not Opened', `${journeys.delivered_not_opened.toLocaleString()} users`)}\n`;
      if (journeys.bounced_immediately > 0) {
        response += `${formatKeyValue('Bounced Immediately', `${journeys.bounced_immediately.toLocaleString()} users`)}\n`;
      }
      
      // Timing Analysis
      const timing = sequence_analysis.timing_analysis;
      if (timing.avg_time_to_open || timing.avg_time_to_click || timing.engagement_pattern !== 'unknown') {
        response += `\n${formatSectionHeader('⏰ Timing Analysis')}\n`;
        
        if (timing.avg_time_to_open) {
          const avgOpenHours = (timing.avg_time_to_open / 3600).toFixed(1);
          response += `${formatKeyValue('Avg Time to Open', `${avgOpenHours} hours`)}\n`;
        }
        
        if (timing.avg_time_to_click) {
          const avgClickMinutes = (timing.avg_time_to_click / 60).toFixed(1);
          response += `${formatKeyValue('Avg Time to Click', `${avgClickMinutes} minutes`)}\n`;
        }
        
        if (timing.peak_engagement_hour !== undefined) {
          response += `${formatKeyValue('Peak Engagement Hour', `${timing.peak_engagement_hour}:00`)}\n`;
        }
        
        response += `${formatKeyValue('Engagement Pattern', timing.engagement_pattern)}\n`;
      }
      
      // Drop-off Analysis
      response += `\n${formatSectionHeader('📉 Drop-off Analysis')}\n`;
      const dropOff = sequence_analysis.drop_off_analysis;
      response += `${formatKeyValue('Primary Drop-off Stage', dropOff.primary_drop_off_stage)}\n`;
      response += `${formatKeyValue('Delivery Drop-off', `${dropOff.delivery_drop_off.toFixed(1)}%`)}\n`;
      response += `${formatKeyValue('Open Drop-off', `${dropOff.open_drop_off.toFixed(1)}%`)}\n`;
      response += `${formatKeyValue('Click Drop-off', `${dropOff.click_drop_off.toFixed(1)}%`)}\n`;
      
      // Key Conversion Metrics
      response += `\n${formatSectionHeader('🎯 Key Conversion Metrics')}\n`;
      response += `${formatKeyValue('Click-to-Open Rate', `${sequence_analysis.conversion_rates.click_to_open_rate.toFixed(1)}%`)}\n`;
    }
    
    // Event types breakdown
    if (Object.keys(summary.event_types).length > 0) {
      response += `\n${formatSectionHeader('📋 Event Types')}\n`;
      Object.entries(summary.event_types)
        .sort(([,a], [,b]) => b - a)
        .forEach(([eventType, count]) => {
          const percentage = ((count / summary.total_events) * 100).toFixed(1);
          response += `${formatKeyValue(eventType, `${count} (${percentage}%)`)}\n`;
        });
    }
    
    // Insights
    if (insights.length > 0) {
      response += `\n${formatSectionHeader('💡 Insights')}\n`;
      response += formatList(insights);
    }
    
    // Recommendations  
    if (recommendations.length > 0) {
      response += `\n${formatSectionHeader('🎯 Recommendations')}\n`;
      response += formatList(recommendations);
    }
    
    // Pagination info
    if (result.logs.pagination) {
      const p = result.logs.pagination;
      response += `\n${formatSectionHeader('📄 Pagination')}\n`;
      response += `${formatKeyValue('Page', `${p.page} (${result.logs.data.length} items)`)}\n`;
      if (p.count !== undefined) {
        response += `${formatKeyValue('Total', p.count.toLocaleString())}\n`;
      }
      if (p.has_more) {
        response += `${formatKeyValue('Has More', 'Yes')}\n`;
      }
      if (p.cursor) {
        response += `${formatKeyValue('Next Cursor', p.cursor)}\n`;
      }
    }
    
    // Recent logs sample (if any)
    if (result.logs.data.length > 0) {
      response += `\n${formatSectionHeader('📝 Recent Log Entries')}\n`;
      const sampleLogs = result.logs.data.slice(0, 5);
      sampleLogs.forEach((log, index) => {
        const timestamp = log.time ? new Date(log.time * 1000).toLocaleString() : 'Unknown';
        response += `**${index + 1}.** ${log.type || 'Unknown'} - ${log.email || 'No email'} (${timestamp})\n`;
        if (log.additional_info) {
          response += `   *${log.additional_info}*\n`;
        }
      });
      
      if (result.logs.data.length > 5) {
        response += `\n*... and ${result.logs.data.length - 5} more entries*\n`;
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

export async function handleGetWorkflowActionLogs(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetWorkflowLogs(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetTransactionalEmailLogs(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetListLogs(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDebugLogsAccess(_args: any, _api: CakemailAPI) {
  try {
    return { content: [{ type: 'text', text: 'Not implemented yet' }] };
  } catch (error) {
    return handleCakemailError(error);
  }
}
