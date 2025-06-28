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
export { handleGetCampaignStats, handleGetCampaignLinksStats } from './campaign-analytics.js';
export { handleGetEmailStats } from './email-stats.js';
export { handleGetListStats, handleGetAccountStats, handleGetActionStats } from './list-account-stats.js';
export { handleListCampaignReportsExports, handleCreateCampaignReportsExport, handleGetCampaignReportsExport, handleDownloadCampaignReportsExport, handleDeleteCampaignReportsExport, handleListSuppressedEmailsExports, handleCreateSuppressedEmailsExport, handleGetSuppressedEmailsExport, handleDownloadSuppressedEmailsExport, handleDeleteSuppressedEmailsExport } from './exports.js';
export { handleDebugReportsAccess } from './debug.js';
export * from './insights.js';
//# sourceMappingURL=index.d.ts.map