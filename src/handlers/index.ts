import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';
import { HandlerRegistry } from '../types/tools.js';

// Import individual handlers
import { handleHealthCheck } from './health.js';
import { 
  handleGetSenders, 
  handleCreateSender, 
  handleGetSender, 
  handleUpdateSender, 
  handleDeleteSender 
} from './senders.js';
import { 
  handleListCampaigns
} from './campaigns.js';
import {
  handleSendEmail,
  handleGetEmail,
  handleRenderEmail,
  handleGetEmailLogs,
  handleGetEmailStats,
  handleSendTransactionalEmail,
  handleSendMarketingEmail,
  handleGetEmailLogsWithAnalysis,
  handleDebugEmailAccess
} from './email.js';
import {
  handleGetCampaignLogs
} from './logs.js';
import {
  handleGetCampaignStats,
  handleGetCampaignLinksStats
} from './reports.js';

// Create the handler registry (phase 1 - core handlers only)
export const handlerRegistry: HandlerRegistry = {
  // Health
  'cakemail_health_check': handleHealthCheck,
  
  // Senders
  'cakemail_get_senders': handleGetSenders,
  'cakemail_create_sender': handleCreateSender,
  'cakemail_get_sender': handleGetSender,
  'cakemail_update_sender': handleUpdateSender,
  'cakemail_delete_sender': handleDeleteSender,
  
  // Campaigns (basic implementation)
  'cakemail_list_campaigns': handleListCampaigns,
  
  // Email API v2
  'cakemail_send_email': handleSendEmail,
  'cakemail_get_email': handleGetEmail,
  'cakemail_render_email': handleRenderEmail,
  'cakemail_get_email_logs': handleGetEmailLogs,
  'cakemail_get_email_stats': handleGetEmailStats,
  'cakemail_send_transactional_email': handleSendTransactionalEmail,
  'cakemail_send_marketing_email': handleSendMarketingEmail,
  'cakemail_get_email_logs_with_analysis': handleGetEmailLogsWithAnalysis,
  'cakemail_debug_email_access': handleDebugEmailAccess,
  
  // Logs
  'cakemail_get_campaign_logs': handleGetCampaignLogs,
  
  // Reports
  'cakemail_get_campaign_stats': handleGetCampaignStats,
  'cakemail_get_campaign_links_stats': handleGetCampaignLinksStats,
  
  // Note: Additional handlers will be added incrementally as they are fully implemented
};

// Main handler dispatcher
export async function handleToolCall(request: any, api: CakemailAPI) {
  const { name, arguments: args } = request.params;
  
  const handler = handlerRegistry[name];
  if (!handler) {
    return {
      content: [
        {
          type: 'text',
          text: `❌ **Unknown Tool**: ${name}\n\nThis tool is not recognized. Please check the tool name and try again.`,
        },
      ],
      isError: true,
    };
  }
  
  try {
    return await handler(args, api);
  } catch (error) {
    return handleCakemailError(error);
  }
}
