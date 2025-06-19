/**
 * Reports module - handles all email marketing analytics and performance reporting
 * 
 * This module is organized into several focused areas:
 * - Campaign Analytics: Campaign performance statistics and link analysis
 * - Email Statistics: Transactional email API statistics
 * - List & Account Stats: List performance and account-wide analytics
 * - Exports Management: Campaign and suppressed email exports
 * - Debug Utilities: API access debugging tools
 */

// Campaign analytics and performance
export {
  handleGetCampaignStats,
  handleGetCampaignLinksStats
} from './campaign-analytics.js';

// Email API statistics
export {
  handleGetEmailStats
} from './email-stats.js';

// List and account statistics
export {
  handleGetListStats,
  handleGetAccountStats,
  handleGetActionStats
} from './list-account-stats.js';

// Export management
export {
  handleListCampaignReportsExports,
  handleCreateCampaignReportsExport,
  handleGetCampaignReportsExport,
  handleDownloadCampaignReportsExport,
  handleDeleteCampaignReportsExport,
  handleListSuppressedEmailsExports,
  handleCreateSuppressedEmailsExport,
  handleGetSuppressedEmailsExport,
  handleDownloadSuppressedEmailsExport,
  handleDeleteSuppressedEmailsExport
} from './exports.js';

// Debug utilities
export {
  handleDebugReportsAccess
} from './debug.js';

// Re-export insights utilities for external use if needed
export * from './insights.js';
