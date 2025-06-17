# Changelog

All notable changes to the Cakemail MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2025-06-16

### 🎯 Complete Logs API Implementation

This version adds **comprehensive logs functionality** with full integration of the Cakemail `/logs/` API endpoints, providing detailed campaign activity logs, workflow automation tracking, and transactional email delivery logs.

### 🆕 Added

#### **New LogsApi Class**
- Complete implementation of all Cakemail `/logs/` endpoints
- Campaign activity tracking with detailed event categorization
- Workflow automation logs for email sequences
- Transactional email delivery logs and monitoring
- Advanced filtering with smart syntax validation
- Time-based filtering with Unix timestamp support

#### **New MCP Tools (5 additions)**
- **`cakemail_get_campaign_logs`** - Detailed campaign activity tracking (opens, clicks, bounces, unsubscribes) with intelligent event categorization
- **`cakemail_get_workflow_logs`** - Complete workflow automation sequence logging
- **`cakemail_get_workflow_action_logs`** - Action-level tracking for specific automation steps
- **`cakemail_get_transactional_email_logs`** - Individual email delivery tracking and monitoring
- **`cakemail_get_list_logs`** - Contact list activity and engagement logs
- **`cakemail_debug_logs_access`** - Debug and test logs API endpoint availability

#### **Smart Filtering System**
- **Intelligent filter syntax**: `term==value;term2==value2` format
- **Event categorization**: ENGAGEMENT (click, open, view), BOUNCES (hard, soft, blocked), LIST_MANAGEMENT (subscribe, unsubscribe)
- **Endpoint-specific validation**: Different filter terms per API endpoint
- **Backward compatibility**: Existing `type` parameter still supported
- **Graceful handling**: Invalid filters warn but don't fail requests

### 🔧 Enhanced

#### **Comprehensive Parameter Support**
- **Pagination**: Full support for large log datasets with cursor-based pagination
- **Time ranges**: Unix timestamp support for start_time and end_time filtering
- **Sorting options**: Configurable sort fields and direction
- **Type filtering**: Filter logs by specific activity types
- **Advanced options**: Support for all API parameters including totals, uniques, grouping

#### **Integration Quality**
- **Full API integration**: All log methods available through main CakemailAPI client
- **TypeScript interfaces**: Complete type definitions for all log parameters and responses
- **Consistent patterns**: Following existing server architecture and error handling
- **Enhanced responses**: Rich formatting with activity summaries and filter information

### 📋 Technical Implementation

#### **Filter Validation Examples**
```typescript
// Campaign logs - engagement events
filter: "type==click;type==open;type==view"

// Critical issues - hard bounces and spam
filter: "type==bounce_hb;type==spam;type==bounce_mb"

// Temporary failures - soft bounces and DNS issues  
filter: "type==bounce_sb;type==bounce_df;type==bounce_fm"

// List management - subscription changes
filter: "type==subscribe;type==unsubscribe;type==global_unsubscribe"
```

#### **Event Type Categories**
- **ENGAGEMENT**: click, open, view, forward, share (user interactions)
- **BOUNCES**: bounce_hb (hard), bounce_sb (soft), bounce_mb (blocked), bounce_df (DNS), bounce_fm (full mailbox), bounce_tr (transient)
- **LIST_MANAGEMENT**: subscribe, unsubscribe, global_unsubscribe (list changes)
- **DELIVERABILITY_ISSUES**: spam, auto_responder (reputation threats)
- **DELIVERY_PIPELINE**: generating, in_queue, sent, received, skipped (processing status)

### 🔄 Backward Compatibility
- **No breaking changes**: All existing tools continue to work unchanged
- **Enhanced existing tools**: Campaign and analytics tools now have richer log data available
- **Same configuration**: No changes to environment variables or setup required
- **Seamless upgrade**: Drop-in replacement with immediate access to new functionality

---

## [1.5.0] - 2025-06-15

### 🎯 Complete Reports API Implementation

This version adds **comprehensive reporting and analytics functionality** with full integration of the Cakemail `/reports/` API endpoints, providing detailed campaign performance metrics, account analytics, and data export capabilities.

### 🆕 Added

#### **New ReportsApi Integration**
- Complete implementation of all Cakemail `/reports/` endpoints
- Campaign performance statistics with calculated rates
- Link-by-link click tracking and analysis
- Account-wide performance insights and trends
- Contact list growth and engagement metrics
- Export functionality for campaign reports (CSV/XLSX)

#### **New MCP Tools (12 additions)**

**Campaign Analytics:**
- **`cakemail_get_campaign_stats`** - Detailed campaign performance metrics (open/click/bounce rates)
- **`cakemail_get_campaign_links_stats`** - Link click tracking and performance analysis
- **`cakemail_get_campaign_performance_summary`** - Comprehensive campaign overview with top links

**Account & List Analytics:**
- **`cakemail_get_account_stats`** - Account-wide performance statistics
- **`cakemail_get_account_performance_overview`** - Formatted account performance summary
- **`cakemail_get_list_stats`** - Contact list growth and engagement metrics

**Email Analytics:**
- **`cakemail_get_email_stats`** - Transactional email performance for time periods

**Export Management:**
- **`cakemail_list_campaign_reports_exports`** - List all campaign report exports
- **`cakemail_create_campaign_reports_export`** - Create new exports (CSV/XLSX formats)
- **`cakemail_get_campaign_reports_export`** - Check export status and progress
- **`cakemail_download_campaign_reports_export`** - Get download URLs for completed exports
- **`cakemail_delete_campaign_reports_export`** - Clean up completed exports

**Debug Tools:**
- **`cakemail_debug_reports_access`** - Test reports API connectivity and permissions

### 🔧 Enhanced Features

#### **Rich Analytics Data**
- **Performance metrics**: Open rates, click rates, bounce rates with percentages
- **Link analysis**: Click tracking with top performer identification
- **Time-based reporting**: Custom date ranges with Unix timestamp support
- **Trend analysis**: Account performance over time with growth metrics
- **Engagement insights**: List-level subscriber behavior and churn analysis

#### **Export Capabilities**
- **Multiple formats**: CSV and Excel (XLSX) export support
- **Bulk reporting**: Multi-campaign exports in single file
- **Progress monitoring**: Real-time export status and completion tracking
- **Download management**: Secure download URLs with expiration handling
- **Automatic cleanup**: Export lifecycle management

#### **Enhanced User Experience**
- **📊 Rich formatting**: Performance metrics with emojis and clear sections
- **📈 Calculated rates**: Automatic percentage calculations for all metrics
- **🔗 Link insights**: Top-performing link identification and ranking
- **⏱️ Time formatting**: Human-readable date ranges and periods
- **✅ Status indicators**: Clear success/failure/progress indicators

### 📋 API Coverage

All official Cakemail Reports API endpoints now supported:
- `GET /reports/campaigns/{campaign_id}` - Campaign statistics
- `GET /reports/campaigns/{campaign_id}/links` - Link performance
- `GET /reports/accounts/self` - Account performance
- `GET /reports/lists/{list_id}` - List statistics
- `GET /reports/emails` - Transactional email stats
- `GET /reports/campaigns-exports` - Export management
- `POST /reports/campaigns-exports` - Create exports
- `GET /reports/campaigns-exports/{export_id}` - Export status
- `DELETE /reports/campaigns-exports/{export_id}` - Delete exports
- `GET /reports/campaigns-exports/{export_id}/download` - Download exports

### 🔄 Backward Compatibility
- **No breaking changes**: All existing analytics tools enhanced, not replaced
- **Enhanced responses**: Existing analytics now include richer data formatting
- **Same interface**: All existing campaign and account tools work unchanged
- **Added value**: Users get enhanced analytics without changing their workflows

---

## [1.4.0] - 2025-06-10

### 🎯 Enterprise Sub-Account Management

This version introduces **comprehensive sub-account management** capabilities, enabling enterprise and agency functionality for multi-tenant email marketing operations.

### 🆕 Added

#### **New SubAccountApi Class**
- Complete sub-account lifecycle management (create, read, update, delete)
- Advanced filtering, searching, and pagination for account lists
- Account suspension/unsuspension for temporary access control
- Email verification workflows with resend capabilities
- Organization conversion for account type changes
- Debug and troubleshooting utilities for access management

#### **New MCP Tools (14 additions)**

**Core Management:**
- **`cakemail_list_sub_accounts`** - List all sub-accounts with advanced filtering
- **`cakemail_create_sub_account`** - Create new sub-accounts with full profile data
- **`cakemail_get_sub_account`** - Get detailed sub-account information
- **`cakemail_update_sub_account`** - Update sub-account details and settings
- **`cakemail_delete_sub_account`** - Permanently delete sub-accounts

**Lifecycle Management:**
- **`cakemail_suspend_sub_account`** - Temporarily disable accounts
- **`cakemail_unsuspend_sub_account`** - Re-enable suspended accounts
- **`cakemail_confirm_sub_account`** - Complete email verification process
- **`cakemail_resend_verification_email`** - Resend verification emails

**Advanced Operations:**
- **`cakemail_convert_sub_account_to_organization`** - Convert accounts to organizations
- **`cakemail_get_latest_sub_account`** - Get most recently created account
- **`cakemail_search_sub_accounts_by_name`** - Search accounts by name
- **`cakemail_get_sub_accounts_by_status`** - Filter accounts by status
- **`cakemail_debug_sub_account_access`** - Debug access and permissions

### 🏢 Enterprise Features

#### **Multi-Tenant Support**
- **Client separation**: Isolated accounts for different clients/departments
- **Hierarchical management**: Parent accounts can manage sub-accounts
- **Brand isolation**: Separate sender identities and configurations
- **Access control**: Account-level permissions and restrictions

#### **Advanced Filtering & Search**
- **Status filtering**: Active, pending, suspended, inactive accounts
- **Name searching**: Partial matching for account and company names
- **Partner filtering**: Organize by partner account relationships
- **Pagination**: Efficient handling of large account lists

#### **Security & Validation**
- **Email verification**: Required verification workflows for new accounts
- **Password policies**: Minimum 8 characters with complexity requirements
- **Input sanitization**: Protection against injection attacks
- **Access isolation**: Sub-accounts cannot access each other's data

### 💼 Use Cases

#### **Digital Marketing Agencies**
- **Client management**: Separate accounts for each client with isolated campaigns
- **Team access**: Different team members access specific client accounts
- **Billing separation**: Track usage and costs per client
- **White-label operations**: Branded experiences for different clients

#### **Large Corporations**
- **Department segmentation**: Marketing, Sales, Support teams get separate accounts
- **Regional operations**: Geographic divisions operate independently
- **Subsidiary management**: Parent company manages multiple subsidiary accounts
- **Compliance separation**: Different accounts for regulatory requirements

### 🔄 API Coverage

**100% coverage** of Cakemail sub-account management endpoints:
- `GET /accounts` - List sub-accounts
- `POST /accounts` - Create sub-account
- `GET /accounts/{id}` - Get sub-account details
- `PATCH /accounts/{id}` - Update sub-account
- `DELETE /accounts/{id}` - Delete sub-account
- `POST /accounts/{id}/suspend` - Suspend account
- `POST /accounts/{id}/unsuspend` - Unsuspend account
- `POST /accounts/{id}/confirm` - Confirm account
- `POST /accounts/resend-verification-email` - Resend verification
- `POST /accounts/{id}/convert-to-organization` - Convert to organization

---

## [1.2.0] - 2024-12-20

### 🎯 Enhanced User Experience

This version focuses on improving the user experience with intelligent defaults, better formatting, and enhanced campaign management capabilities.

### 🆕 Added

#### **New Tools**
- **`cakemail_get_latest_campaign`** - Get most recent campaign with optional analytics
  - Optional status filtering (draft, sent, scheduled, etc.)
  - Integrated performance metrics for sent campaigns
  - Human-readable formatting with emojis and context

#### **Enhanced Default Behavior**
- **Latest-first sorting**: All list operations now default to `sort=created_on&order=desc`
- **Smart parameters**: User parameters override defaults when specified
- **Contextual responses**: Responses show applied sorting and filters

### 🔧 Enhanced

#### **Response Formatting**
- **Human-readable output**: Campaign summaries with emojis and clear structure
- **Performance integration**: Analytics automatically included when available
- **Status awareness**: Different outputs based on campaign status
- **Context indicators**: "Latest first" and filter information shown

#### **API Methods**
- **`getCampaignsWithDefaults()`** - Enhanced campaign listing with intelligent defaults
- **`getLatestCampaign(status?, analytics?)`** - Get single latest campaign
- **`formatCampaignSummary()`** - Human-readable campaign formatting
- **`formatCampaignAnalytics()`** - Performance metrics formatting

#### **Production Features**
- **Retry logic**: Exponential backoff with jitter for failed requests
- **Rate limiting**: Automatic handling of API rate limits and server responses
- **Circuit breaker**: Automatic failure detection and recovery
- **Request queuing**: Concurrency control for batch operations

### 📊 User Experience Improvements

#### **Before vs After**
| Issue | Before | After |
|-------|--------|---------|
| **Campaign Order** | Random/unpredictable | Latest first automatically |
| **Latest Campaign** | Manual filtering needed | Dedicated tool with analytics |
| **Data Format** | Raw JSON dumps | Human-readable summaries |
| **Analytics** | Separate API calls | Integrated with campaign data |
| **Context** | No sorting indicators | Clear "latest first" labels |

#### **Smart Defaults Applied To**
- `cakemail_get_campaigns` - Campaigns latest first
- `cakemail_get_lists` - Lists latest first
- `cakemail_get_contacts` - Contacts latest first  
- `cakemail_get_templates` - Templates latest first

### 🔄 Backward Compatibility
- **Fully backward compatible**: All existing tools work unchanged
- **Enhanced responses**: Better formatting without breaking existing flows
- **Parameter override**: Users can still specify custom sorting when needed
- **Same configuration**: No changes to environment variables or setup

---

## [1.1.0] - 2024-12-15

### 🎯 Major Improvements - API Alignment

This release brings the Cakemail MCP server into full compliance with the official Cakemail API documentation, fixing critical inconsistencies and adding extensive new functionality.

### ✅ Fixed

#### **Critical API Structure Issues**
- **Campaign Creation**: Fixed data structure to use flat format instead of nested (aligns with API docs)
- **List ID Handling**: Fixed `list_id` parameter to remain as string (not converted to integer)
- **Transactional Email**: Simplified structure to match documented API format
- **Campaign Update**: Unified structure between create and update operations

#### **Authentication & Security**
- **Refresh Token Support**: Added proper OAuth 2.0 refresh token handling
- **Token Management**: Improved token expiry detection and automatic renewal
- **Error Handling**: Enhanced error messages with actual API response details
- **Security**: Removed static key risks with proper token rotation

#### **Input Validation**
- **Email Validation**: Added comprehensive email format checking
- **Date Validation**: Enforced YYYY-MM-DD format for date parameters
- **Pagination Limits**: Added API limit enforcement (max 50 campaigns per page)
- **Parameter Validation**: Type checking and format validation before API calls

### 🚀 Added

#### **New API Categories**
- **Template Management**: Complete CRUD operations for email templates
- **Enhanced Analytics**: Campaign, list, account, and transactional analytics
- **Automation Workflows**: Create, manage, and control automation sequences
- **Extended Sender Management**: Full sender lifecycle management
- **Enhanced List Management**: Complete list CRUD operations
- **Advanced Contact Management**: Extended contact handling capabilities

#### **New Tools (20+ additions)**

**Health Monitoring:**
- `cakemail_health_check` - API connectivity and authentication status

**Template Management:**
- `cakemail_get_templates` - List all email templates
- `cakemail_get_template` - Get specific template details
- `cakemail_create_template` - Create new email template
- `cakemail_update_template` - Update existing template
- `cakemail_delete_template` - Delete template

**Enhanced Sender Management:**
- `cakemail_get_sender` - Get specific sender details
- `cakemail_update_sender` - Update sender information
- `cakemail_delete_sender` - Delete sender

**Enhanced List Management:**
- `cakemail_get_list` - Get specific list details
- `cakemail_update_list` - Update list information
- `cakemail_delete_list` - Delete contact list

**Advanced Contact Management:**
- `cakemail_get_contact` - Get specific contact details
- `cakemail_update_contact` - Update contact information
- `cakemail_delete_contact` - Delete contact

**Enhanced Analytics:**
- `cakemail_get_campaign_analytics` - Detailed campaign performance metrics
- `cakemail_get_transactional_analytics` - Transactional email analytics
- `cakemail_get_list_analytics` - List performance and growth metrics
- `cakemail_get_account_analytics` - Account-wide analytics and insights

**Automation Workflows:**
- `cakemail_get_automations` - List automation workflows
- `cakemail_get_automation` - Get specific automation details
- `cakemail_create_automation` - Create new automation workflow
- `cakemail_start_automation` - Start automation workflow
- `cakemail_stop_automation` - Stop automation workflow

### 🔧 Enhanced

#### **Error Handling**
- **Detailed Messages**: API errors now show specific Cakemail error descriptions
- **Validation Errors**: Clear client-side validation messages before API calls
- **HTTP Status Codes**: Proper status code handling and reporting
- **Empty Response Handling**: Better handling of DELETE and other operations

#### **Response Quality**
- **Structured Responses**: Consistent and informative success messages
- **Verification Details**: Campaign creation now shows detailed verification info
- **Parameter Echoing**: Applied filters and parameters shown in responses
- **Count Information**: Pagination and total count information where available

#### **Code Quality**
- **TypeScript**: Full type safety throughout the codebase
- **Input Sanitization**: Automatic cleanup of undefined parameters
- **Consistent Patterns**: Unified approach across all API operations
- **Error Boundaries**: Comprehensive try-catch with detailed error reporting

### 🧪 Testing & Validation

#### **New Testing Infrastructure**
- **Integration Tests**: Automated testing script for core functionality
- **Health Checks**: API connectivity and authentication validation
- **Tool Discovery**: Verification of all available tools
- **Environment Validation**: Credential and setup checking

#### **New Scripts**
- `npm run test` - Run full integration test suite
- `npm run test:integration` - Run integration tests specifically
- `npm run validate` - Build and inspect server
- `npm run rebuild` - Clean build process

### 📚 Documentation

#### **Migration Support**
- **Migration Guide**: Step-by-step upgrade instructions
- **Breaking Changes**: Detailed list of changes and fixes required
- **Testing Instructions**: How to validate the migration
- **Rollback Plan**: Safe rollback procedures if needed

#### **API Documentation**
- **Tool Reference**: Complete documentation of all 30+ tools
- **Parameter Validation**: Input requirements and format specifications
- **Error Handling**: Common errors and troubleshooting
- **Best Practices**: Recommended usage patterns

### 🔄 Backward Compatibility

#### **Maintained Compatibility**
- **Existing Tools**: All original tools continue to work unchanged
- **Claude Desktop**: No configuration changes required
- **Authentication**: Same credential requirements
- **Response Formats**: Enhanced but compatible response structures

#### **Seamless Migration**
- **Zero Downtime**: Replace files and rebuild
- **No Config Changes**: Same environment variables and setup
- **Enhanced Functionality**: Immediate access to new features
- **Same Interface**: Existing Claude Desktop integrations work unchanged

### 🐛 Bug Fixes

- Fixed campaign creation data structure inconsistency
- Fixed transactional email parameter formatting
- Fixed pagination limit validation
- Fixed date format validation
- Fixed error message propagation
- Fixed token refresh logic
- Fixed undefined parameter handling
- Fixed response parsing for DELETE operations

### 🔐 Security Improvements

- Enhanced OAuth 2.0 flow with refresh token support
- Removed static authentication key risks
- Added input validation to prevent injection attacks
- Improved error handling to avoid information leakage
- Better token expiry management

### 📈 Performance Improvements

- Reduced unnecessary API calls through better token management
- Faster error detection with client-side validation
- Optimized request structures for better API performance
- Improved response parsing and handling

### 🎨 Developer Experience

- Better error messages for faster debugging
- Comprehensive input validation with helpful error messages
- Consistent API patterns across all operations
- Enhanced logging and debugging capabilities
- Complete TypeScript support for better development experience

---

## [1.0.0] - 2024-12-01

### Added
- Initial release of Cakemail MCP Server
- Basic campaign management (create, list, send, delete)
- Contact management (create, list)
- List management (create, list)
- Sender management (create, list)
- Transactional email sending
- OAuth 2.0 authentication
- Claude Desktop integration
- Basic error handling

### Features
- 14 core tools for Cakemail API integration
- MCP protocol compliance
- Environment-based configuration
- TypeScript implementation
- npm package structure

---

## Migration Notes

### From 1.0.0 to 1.1.0

**This is a backward-compatible upgrade** that enhances existing functionality while adding extensive new features.

**What's Changed:**
- Campaign data structure now matches official API documentation
- Better error messages and validation
- 20+ new tools for extended functionality
- Enhanced security with refresh token support

**Migration Steps:**
1. Replace source files with new versions
2. Run `npm run rebuild`
3. Test with `npm run test` (optional)
4. All existing integrations continue to work unchanged

**New Capabilities Available:**
- Complete template management
- Advanced analytics and reporting
- Automation workflow control
- Enhanced CRUD operations for all resources
- Health monitoring and diagnostics

**No Breaking Changes:**
- All existing tools maintain the same interface
- No Claude Desktop configuration changes needed
- Same authentication requirements
- Enhanced but compatible responses
