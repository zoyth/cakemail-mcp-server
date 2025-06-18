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
  handleListCampaigns,
  handleCreateCampaign,
  handleUpdateCampaign,
  handleCreateBEETemplate,
  handleCreateBEENewsletter,
  handleValidateBEETemplate
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
import {
  handleGetSelfAccount,
  handleGetRetryConfig
} from './account.js';
import {
  handleListSubAccounts,
  handleCreateSubAccount,
  handleGetSubAccount,
  handleUpdateSubAccount,
  handleDeleteSubAccount,
  handleSuspendSubAccount,
  handleUnsuspendSubAccount,
  handleVerifySubAccountEmail,
  handleResendVerificationEmail,
  handleConvertSubAccountToOrganization,
  handleDebugSubAccountAccess,
  handleExportSubAccounts
} from './sub-accounts.js';
import {
  handleListLists,
  handleCreateList,
  handleGetList,
  handleUpdateList,
  handleDeleteList,
  handleArchiveList,
  handleGetListStats
} from './lists.js';
import {
  handleListTemplates,
  handleCreateTemplate,
  handleGetTemplate,
  handleUpdateTemplate,
  handleDeleteTemplate,
  handleDuplicateTemplate,
  handleRenderTemplate
} from './templates.js';

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
  
  // Campaigns (with BEE support)
  'cakemail_list_campaigns': handleListCampaigns,
  'cakemail_create_campaign': handleCreateCampaign,
  'cakemail_update_campaign': handleUpdateCampaign,
  
  // BEEeditor specific tools
  'cakemail_create_bee_template': handleCreateBEETemplate,
  'cakemail_create_bee_newsletter': handleCreateBEENewsletter,
  'cakemail_validate_bee_template': handleValidateBEETemplate,
  
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
  
  // Account
  'cakemail_get_self_account': handleGetSelfAccount,
  'cakemail_get_retry_config': handleGetRetryConfig,
  
  // Sub-Account Management
  'cakemail_list_sub_accounts': handleListSubAccounts,
  'cakemail_create_sub_account': handleCreateSubAccount,
  'cakemail_get_sub_account': handleGetSubAccount,
  'cakemail_update_sub_account': handleUpdateSubAccount,
  'cakemail_delete_sub_account': handleDeleteSubAccount,
  'cakemail_suspend_sub_account': handleSuspendSubAccount,
  'cakemail_unsuspend_sub_account': handleUnsuspendSubAccount,
  'cakemail_verify_sub_account_email': handleVerifySubAccountEmail,
  'cakemail_resend_sub_account_verification': handleResendVerificationEmail,
  'cakemail_convert_sub_account_to_organization': handleConvertSubAccountToOrganization,
  'cakemail_debug_sub_account_access': handleDebugSubAccountAccess,
  'cakemail_export_sub_accounts': handleExportSubAccounts,
  
  // List Management
  'cakemail_list_lists': handleListLists,
  'cakemail_create_list': handleCreateList,
  'cakemail_get_list': handleGetList,
  'cakemail_update_list': handleUpdateList,
  'cakemail_delete_list': handleDeleteList,
  'cakemail_archive_list': handleArchiveList,
  'cakemail_get_list_stats': handleGetListStats,
  
  // Template Management
  'cakemail_list_templates': handleListTemplates,
  'cakemail_create_template': handleCreateTemplate,
  'cakemail_get_template': handleGetTemplate,
  'cakemail_update_template': handleUpdateTemplate,
  'cakemail_delete_template': handleDeleteTemplate,
  'cakemail_duplicate_template': handleDuplicateTemplate,
  'cakemail_render_template': handleRenderTemplate,
  
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
