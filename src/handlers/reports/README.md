# Reports Module

The reports module handles all email marketing analytics and performance reporting for the Cakemail MCP server. This module has been refactored from a single large file into focused, maintainable modules.

## Module Structure

```
src/handlers/reports/
├── index.ts                 # Main exports and module documentation
├── campaign-analytics.ts    # Campaign performance statistics and link analysis
├── email-stats.ts          # Transactional email API statistics
├── list-account-stats.ts   # List performance and account-wide analytics
├── exports.ts              # Campaign and suppressed email exports management
├── insights.ts             # Utility functions for generating insights and recommendations
└── debug.ts                # API access debugging tools
```

## Module Responsibilities

### Campaign Analytics (`campaign-analytics.ts`)
- **`handleGetCampaignStats`**: Detailed campaign performance analysis with engagement metrics, delivery stats, and bounce analysis
- **`handleGetCampaignLinksStats`**: Link click statistics and performance data with categorization and optimization recommendations
- **`handleGetCampaignPerformanceSummary`**: Convenience method that delegates to campaign stats

### Email Statistics (`email-stats.ts`)
- **`handleGetEmailStats`**: Transactional email API statistics including delivery, engagement, and processing metrics

### List & Account Statistics (`list-account-stats.ts`)
- **`handleGetListStats`**: List-specific performance statistics including subscriber metrics and growth analysis
- **`handleGetAccountStats`**: Account-wide performance overview with usage metrics and deliverability health
- **`handleGetActionStats`**: Workflow action performance statistics for automation emails
- **`handleGetAccountPerformanceOverview`**: Comprehensive account performance analysis

### Export Management (`exports.ts`)
- **Campaign Reports Exports**:
  - `handleListCampaignReportsExports`: List available campaign report exports
  - `handleCreateCampaignReportsExport`: Create new campaign report export
  - `handleGetCampaignReportsExport`: Check export status with progress tracking
  - `handleDownloadCampaignReportsExport`: Download completed exports
  - `handleDeleteCampaignReportsExport`: Remove exports
- **Suppressed Emails Exports**:
  - `handleListSuppressedEmailsExports`: List suppressed email exports
  - `handleCreateSuppressedEmailsExport`: Create suppressed email export
  - `handleGetSuppressedEmailsExport`: Check suppressed email export status
  - `handleDownloadSuppressedEmailsExport`: Download suppressed email export
  - `handleDeleteSuppressedEmailsExport`: Remove suppressed email export

### Insights & Analytics (`insights.ts`)
Utility functions for generating performance insights and recommendations:
- **Email Performance**: `generateEmailInsights`, `generateEmailRecommendations`
- **List Performance**: `generateListInsights`, `generateListRecommendations`
- **Account Performance**: `generateAccountInsights`, `generateAccountRecommendations`
- **Campaign Performance**: `generateCampaignInsights`, `generateCampaignRecommendations`
- **Action Performance**: `generateActionInsights`, `generateActionRecommendations`
- **Link Analysis**: `analyzeLinkStats`, `categorizeLinks`, `generateLinkInsights`, `generateLinkRecommendations`

### Debug Utilities (`debug.ts`)
- **`handleDebugReportsAccess`**: API access debugging and connectivity testing

## Key Features

### Smart Analytics
- **Performance Benchmarking**: Automatic comparison against industry standards
- **Emoji Indicators**: Visual performance indicators (🚀 excellent, 👍 good, ⚠️ needs attention, 🛑 critical)
- **Trend Analysis**: Growth metrics and performance trend identification
- **Actionable Insights**: Context-aware recommendations based on performance data

### Link Performance Analysis
- **Click Distribution**: Analysis of how clicks are distributed across links
- **Link Categorization**: Automatic categorization by domain type (social media, e-commerce, content, etc.)
- **Repeat Click Analysis**: Understanding user engagement depth
- **Zero-Click Identification**: Highlighting underperforming links

### Export Management
- **Progress Tracking**: Visual progress bars for export generation
- **Expiry Management**: Clear expiration date tracking and warnings
- **File Size Formatting**: Human-readable file size display
- **Status Management**: Complete lifecycle management from creation to deletion

## Benefits of Modular Structure

### Maintainability
- **Focused Responsibility**: Each module handles a specific aspect of reporting
- **Easier Testing**: Smaller, focused modules are easier to unit test
- **Clear Dependencies**: Insights module provides reusable utility functions
- **Better Organization**: Related functionality is grouped together

### Extensibility
- **Easy Addition**: New report types can be added as new modules
- **Insight Reuse**: Common insight functions can be shared across modules
- **Independent Updates**: Modules can be updated independently
- **Clear API**: Well-defined interfaces between modules

### Performance
- **Reduced Memory**: Only load what's needed for specific operations
- **Better Caching**: Module-level caching strategies
- **Optimized Imports**: Tree-shaking friendly structure

## Usage Examples

### Campaign Analysis
```typescript
// Get comprehensive campaign performance
const campaignStats = await handleGetCampaignStats({ campaign_id: '123' }, api);

// Analyze link performance with insights
const linkStats = await handleGetCampaignLinksStats({ 
  campaign_id: '123',
  sort: 'unique',
  order: 'desc'
}, api);
```

### Export Management
```typescript
// Create and monitor campaign export
const export = await handleCreateCampaignReportsExport({
  campaign_ids: ['123', '456'],
  format: 'csv',
  start_time: startTimestamp,
  end_time: endTimestamp
}, api);

// Check export status
const status = await handleGetCampaignReportsExport({
  export_id: export.data.id
}, api);

// Download when ready
if (status.data.status === 'completed') {
  const download = await handleDownloadCampaignReportsExport({
    export_id: export.data.id
  }, api);
}
```

### Account Analytics
```typescript
// Get account-wide performance overview
const accountStats = await handleGetAccountStats({
  start_time: monthStartTimestamp,
  end_time: monthEndTimestamp
}, api);

// Get list-specific performance
const listStats = await handleGetListStats({
  list_id: '789',
  interval: 'day'
}, api);
```

## Migration Notes

The refactoring maintains complete backward compatibility:
- All existing function signatures remain unchanged
- All handler names remain the same
- Import paths are updated to use the new modular structure
- The main handlers/index.ts file properly re-exports all functions

This modular structure makes the codebase much more maintainable while preserving all existing functionality and adding enhanced analytics capabilities.
