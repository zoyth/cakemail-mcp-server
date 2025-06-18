# Changelog

All notable changes to the Cakemail MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.9.0] - 2025-06-17

### 🎯 Comprehensive List Management Integration

This version introduces **complete list management functionality**, providing full lifecycle management for contact lists including creation, updating, archiving, and performance analytics.

### 🆕 Added

#### **New ListApi Class**
- Complete list lifecycle management (create, read, update, delete, archive)
- Advanced filtering, sorting, and pagination for list collections
- Performance statistics and analytics for list engagement
- Comprehensive webhook and redirection configuration
- Multi-language support and sender management
- Account-scoped access for enterprise environments

#### **New MCP Tools (7 additions)**

**Core List Management:**
- **`cakemail_list_lists`** - List all contact lists with advanced filtering and pagination
- **`cakemail_create_list`** - Create new contact lists with full configuration options
- **`cakemail_get_list`** - Get detailed information about specific lists
- **`cakemail_update_list`** - Update list settings, senders, and configurations
- **`cakemail_delete_list`** - Permanently delete contact lists
- **`cakemail_archive_list`** - Archive lists while preserving data
- **`cakemail_get_list_stats`** - Get comprehensive performance statistics

#### **Advanced List Features**

**Configuration Management:**
- **Default sender setup**: Configure name and email for list communications
- **Multi-language support**: Set list language (en_US, fr_FR, etc.)
- **Redirection URLs**: Configure subscription, unsubscription, and update pages
- **Webhook integration**: Real-time event notifications for list activities
- **Account scoping**: Enterprise support for sub-account list management

**Performance Analytics:**
- **Growth metrics**: Track subscriber growth and churn rates
- **Engagement analysis**: Open rates, click rates, and interaction metrics
- **Contact statistics**: Active, unsubscribed, and bounced contact counts
- **Time-based analysis**: Performance trends over custom date ranges
- **Campaign correlation**: List performance in relation to sent campaigns

**List Lifecycle Management:**
- **Status tracking**: Active, archived, and suspended list states
- **Data preservation**: Archive lists without losing historical data
- **Bulk operations**: Efficient management of multiple lists
- **Search and filtering**: Find lists by name, status, or creation date

### 🏢 Enterprise & Agency Features

#### **Multi-Client Support**
- **Client segmentation**: Separate lists for different clients or departments
- **Brand isolation**: Individual sender configurations per list
- **Permission management**: Account-level access control for list operations
- **Bulk management**: Efficiently handle large numbers of client lists

#### **Advanced Filtering & Organization**
- **Status filtering**: Active, archived, suspended lists
- **Name searching**: Partial matching for list names
- **Date-based filtering**: Created or updated within specific timeframes
- **Performance sorting**: Order by subscriber count, growth rate, or engagement
- **Pagination**: Handle large list collections efficiently

#### **Webhook & Integration Support**
- **Real-time notifications**: Subscribe to list events (subscribe, unsubscribe, update)
- **Custom actions**: Configure which events trigger webhooks
- **URL validation**: Ensure webhook endpoints are properly formatted
- **Event filtering**: Choose specific activities for webhook delivery

### 💼 Common Use Cases

#### **Email Marketing Operations**
```javascript
// Create segmented marketing lists
const productList = await cakemail_create_list({
  name: 'Product Newsletter',
  default_sender: { name: 'Product Team', email: 'product@company.com' },
  redirections: {
    subscribe: 'https://company.com/welcome-product',
    unsubscribe: 'https://company.com/goodbye-product'
  }
});

// Monitor list performance
const stats = await cakemail_get_list_stats({
  list_id: productList.data.id,
  interval: 'month'
});
```

#### **Agency Client Management**
```javascript
// Create client-specific lists
const clientLists = ['Client A', 'Client B', 'Client C'];
for (const client of clientLists) {
  await cakemail_create_list({
    name: `${client} - Newsletter`,
    default_sender: { name: client, email: `${client.toLowerCase()}@agency.com` }
  });
}

// Archive inactive lists
const allLists = await cakemail_list_lists({ status: 'active' });
for (const list of allLists.data) {
  if (list.contacts_count === 0) {
    await cakemail_archive_list({ list_id: list.id });
  }
}
```

#### **Performance Monitoring**
```javascript
// Automated list health monitoring
const performanceLists = await cakemail_list_lists({ per_page: 100 });
for (const list of performanceLists.data) {
  const stats = await cakemail_get_list_stats({ list_id: list.id });
  
  if (stats.data.unsubscribe_rate > 5) {
    console.warn(`High unsubscribe rate for ${list.name}: ${stats.data.unsubscribe_rate}%`);
  }
  
  if (stats.data.growth_rate < -10) {
    console.warn(`Declining growth for ${list.name}: ${stats.data.growth_rate}%`);
  }
}
```

### 📊 Performance Analytics Features

#### **Growth & Engagement Metrics**
- **Subscriber Growth**: Track new subscriptions over time
- **Churn Analysis**: Monitor unsubscribe rates and patterns
- **Engagement Rates**: Open and click rates for list subscribers
- **Activity Trends**: Time-based analysis of list performance
- **Conversion Tracking**: Campaign effectiveness per list

#### **Contact Statistics**
- **Total Contacts**: Complete subscriber count
- **Active Subscribers**: Engaged and deliverable contacts
- **Unsubscribed Count**: Opt-out tracking
- **Bounced Contacts**: Delivery failure tracking
- **New Additions**: Recent subscriber growth

### 🔧 Technical Implementation

#### **API Integration**
- **Complete coverage**: All Cakemail `/lists/` endpoints implemented
- **Type safety**: Full TypeScript interfaces for all operations
- **Error handling**: Comprehensive validation and error reporting
- **Response formatting**: Rich, user-friendly output with emojis and structure
- **Parameter validation**: Input checking before API calls

#### **Data Validation**
- **Email format checking**: Validates sender email addresses
- **Required field validation**: Ensures all mandatory parameters provided
- **URL validation**: Checks redirection and webhook URLs
- **Account scoping**: Proper account ID handling for enterprise usage
- **Graceful degradation**: Handles partial updates and optional parameters

### 📚 Documentation & Examples

#### **Comprehensive Documentation**
- **Complete API reference**: All functions with parameters and examples
- **Use case scenarios**: Real-world implementation examples
- **Best practices**: Recommended patterns for list management
- **Error handling**: Common issues and solutions
- **Integration guides**: Agency and enterprise setup instructions

#### **Ready-to-Use Examples**
- **Basic list creation**: Simple list setup with minimal configuration
- **Enterprise setup**: Multi-client list management with webhooks
- **Performance monitoring**: Automated health checks and alerts
- **Data migration**: Moving lists from other platforms
- **Bulk operations**: Managing multiple lists efficiently

### 🔄 API Endpoints Reference

The list management tools map to these Cakemail API endpoints:
- `GET /lists` - List all contact lists
- `POST /lists` - Create new contact list
- `GET /lists/{list_id}` - Get specific list details
- `PATCH /lists/{list_id}` - Update list configuration
- `DELETE /lists/{list_id}` - Delete contact list
- `POST /lists/{list_id}/archive` - Archive list
- `GET /lists/{list_id}/stats` - Get list performance statistics

### 🔄 Backward Compatibility
- **No breaking changes**: All existing tools continue to work unchanged
- **Enhanced campaign tools**: Better list integration for campaign creation
- **Same configuration**: No changes to environment variables or setup
- **Seamless upgrade**: Drop-in replacement with immediate access to new functionality
- **Type safety**: Enhanced TypeScript definitions for better development experience

### 📦 Package Updates
- **Version**: Updated to 1.9.0
- **Description**: Enhanced to highlight list management capabilities
- **Keywords**: Added list-management, contact-lists, performance-analytics
- **Dependencies**: No new dependencies required

---

## [1.8.0] - 2025-06-17

### 🎯 BEEeditor Visual Email Design Integration

This version introduces **comprehensive BEEeditor integration**, transforming the Cakemail MCP Server into a powerful visual email design platform. Users can now create professional newsletters and campaigns using structured JSON templates instead of writing HTML manually.

### 🆕 Added

#### **Complete BEEeditor Schema Support**
- **Schema Integration**: Added `simple_unified.schema.json` with complete BEE specification
- **Type System**: 40+ TypeScript interfaces for all BEE components and modules
- **Validation Engine**: Real-time schema validation with detailed error reporting
- **Template Structure**: Support for rows, columns, and 10 different module types

#### **Visual Design Module Types**
- **Content Modules**: Title, paragraph, list, HTML content blocks
- **Interactive Elements**: Buttons with hover effects, linked images
- **Layout Components**: Dividers, spacing controls, responsive columns
- **Media Support**: Images with responsive sizing and linking
- **Navigation**: Menu systems and icon arrays

#### **New MCP Tools (3 additions)**
- **`cakemail_create_bee_template`** - Create basic BEEeditor template structures
  - Customizable colors, width, and background settings
  - Professional template metadata (title, subject, preheader)
  - Responsive design with mobile optimization
  
- **`cakemail_create_bee_newsletter`** - Generate complete newsletter templates
  - Automated header, content sections, and footer layout
  - Multi-section content with images, buttons, and text
  - Professional styling with consistent branding
  
- **`cakemail_validate_bee_template`** - Validate BEE JSON templates against schema
  - Comprehensive validation with specific error messages
  - Template structure visualization for debugging
  - Schema compliance verification

#### **Enhanced Campaign Tools**
- **`cakemail_create_campaign`** - Now supports both HTML and BEEeditor JSON formats
  - `content_type` parameter: 'html', 'bee', or 'auto-detect'
  - `json_content` parameter for BEE templates
  - Automatic template validation before campaign creation
  
- **`cakemail_update_campaign`** - Can update campaigns with BEE content
  - Support for switching between HTML and BEE formats
  - Template structure preservation during updates
  - Validation feedback for content changes

### 🎨 Visual Design Capabilities

#### **Layout System**
- **Flexible Grid**: 1-12 column responsive layout system
- **Row Structure**: Organized content sections with customizable spacing
- **Mobile Responsive**: Automatic column stacking and responsive behavior
- **Visual Hierarchy**: Proper heading structure (H1, H2, H3) support

#### **Styling Features**
- **Color Management**: Brand-consistent color schemes and palettes
- **Typography Control**: Font sizes, weights, spacing, and alignment
- **Spacing System**: Precise padding and margin controls (0-60px range)
- **Border Styling**: Customizable borders, radius, and colors
- **Background Support**: Colors, images, and positioning options

#### **Content Management**
- **Rich Text**: Formatted paragraphs with line height and spacing control
- **Interactive Buttons**: Call-to-action buttons with hover effects
- **Image Integration**: Responsive images with alt text and linking
- **Lists and Menus**: Organized content with custom styling
- **Dividers**: Visual separation elements with customizable appearance

### 🛠️ Technical Implementation

#### **Utility Library (15+ Functions)**
- **Template Creation**: `createBasicBEETemplate()`, `createNewsletterTemplate()`
- **Module Builders**: `createBEETitleModule()`, `createBEEButtonModule()`, etc.
- **Template Manipulation**: `addModuleToTemplate()`, `addRowToTemplate()`
- **Validation**: `validateBEETemplate()` with comprehensive error checking
- **Debugging**: `printBEETemplateStructure()` for visual template inspection

#### **Type Safety & Validation**
- **Complete TypeScript Support**: Full type definitions for all BEE components
- **Schema Validation**: Real-time validation against BEE specification
- **Error Handling**: Detailed validation messages with fix suggestions
- **Range Validation**: Automatic checking of padding, borders, and sizing values

#### **API Integration**
- **Seamless Workflow**: BEE templates integrate with existing Cakemail API
- **Content Type Detection**: Automatic format detection and handling
- **Backward Compatibility**: Full support for existing HTML workflows
- **Error Recovery**: Graceful handling of invalid templates with helpful feedback

### 📚 Comprehensive Documentation

#### **Documentation Files Created**
- **`/docs/BEE_EDITOR_INTEGRATION.md`** - Complete integration guide (100+ pages)
  - Overview of BEE integration and capabilities
  - Tool documentation with detailed examples
  - Template structure explanations and best practices
  - Troubleshooting guide and common solutions
  
- **`/examples/bee-templates.md`** - Ready-to-use template examples
  - Welcome email template with professional styling
  - Product newsletter with images and call-to-action
  - Event invitation with rich formatting and buttons
  - Usage instructions and customization tips
  
- **`/BEE_IMPLEMENTATION_SUMMARY.md`** - Technical implementation details
- **Updated README.md** - BEE integration information and examples

### 💼 Business Value

#### **For Email Marketers**
- **Visual Design**: Create professional emails without HTML knowledge
- **Consistency**: Maintain brand standards across all campaigns
- **Efficiency**: Generate newsletter layouts in minutes vs hours
- **Flexibility**: Easy content updates without developer assistance

#### **For Developers**
- **Type Safety**: Full TypeScript support prevents runtime errors
- **Validation**: Comprehensive error checking before deployment
- **Integration**: Seamless workflow with existing Cakemail tools
- **Debugging**: Template structure visualization and error reporting

#### **For Agencies & Enterprises**
- **Brand Management**: Consistent templates across multiple clients
- **Collaboration**: Non-technical team members can create content
- **Quality Control**: Validation ensures professional output
- **Scalability**: Reusable templates and components

### 🎯 Usage Examples

#### **Create Basic Template**
```
"Create a basic BEE template for welcome emails with blue theme"
```

#### **Generate Newsletter**
```
"Create a BEE newsletter with sections for product announcements and customer testimonials"
```

#### **Create Campaign with BEE**
```
"Create a campaign using BEE format with a professional newsletter layout"
```

#### **Validate Template**
```
"Validate this BEE template and show me the structure"
```

### 🔄 Backward Compatibility
- **No Breaking Changes**: All existing HTML workflows continue unchanged
- **Enhanced Tools**: Campaign tools now support both HTML and BEE formats
- **Same Configuration**: No changes to environment variables or setup
- **Seamless Migration**: Immediate access to visual design capabilities

### 📦 Package Updates
- **Version**: Updated to 1.8.0
- **Keywords**: Added bee-editor, visual-design, newsletter, json-templates
- **Description**: Enhanced to highlight BEEeditor visual email design capabilities

---

### 🎯 Advanced Event Sequence Analysis

This version introduces **advanced event sequence analysis** for campaign logs, transforming basic log viewing into enterprise-level email marketing intelligence with deep insights into user journey tracking, timing analysis, and funnel optimization.

### 🆕 Enhanced

#### **Advanced Campaign Logs Analysis (`cakemail_get_campaign_logs`)**

**🔄 Email Journey Funnel Tracking**
- **Complete funnel visualization**: Tracks exact progression through sent → delivered → opened → clicked
- **Unique user tracking**: Counts unique emails at each stage (not just event counts)
- **Conversion rate calculations**: Precise percentages between each funnel stage
- **Visual funnel display**: Clear progression with counts and percentages

**👥 User Journey Analysis**
- **Journey categorization**: Complete journey vs partial completion tracking
- **Drop-off identification**: Exactly where users stop in the funnel
- **Journey types tracked**:
  - Complete journey (sent → delivered → opened → clicked)
  - Opened but not clicked
  - Delivered but not opened  
  - Bounced immediately

**⏰ Advanced Timing Analysis**
- **Time-to-open tracking**: Average time from delivery to first open
- **Time-to-click tracking**: Average time from opening to first click
- **Peak engagement detection**: Hour of day with highest engagement
- **Engagement pattern recognition**:
  - **Immediate**: 70%+ open within 1 hour
  - **Delayed**: 70%+ open after 1 hour
  - **Mixed**: Balanced immediate/delayed behavior

**📉 Drop-off Analysis**
- **Stage-specific drop-off rates**: Percentage lost at delivery, opening, clicking
- **Primary bottleneck identification**: Automatically identifies biggest loss point
- **Conversion optimization**: Targeted recommendations for each drop-off stage

**🎯 Key Conversion Metrics**
- **Click-to-open rate**: Engagement quality among openers
- **Delivery rate**: Successful delivery percentage
- **Funnel efficiency**: Overall funnel performance scoring

#### **Enhanced Insights & Recommendations**

**💡 Intelligent Insights Generation**
- **Funnel performance analysis**: Automatic assessment of each stage
- **Timing behavior insights**: Understanding of user engagement patterns
- **Journey completion analysis**: Success rate tracking and optimization
- **Engagement depth assessment**: Quality vs quantity analysis

**🎯 Stage-Specific Optimization Recommendations**
- **Delivery stage**: Domain authentication, list cleaning, reputation monitoring
- **Opening stage**: Subject line optimization, sender name, send timing
- **Clicking stage**: CTA improvement, content relevance, design optimization
- **Timing-based**: Follow-up sequences, optimal send times
- **Journey-specific**: Content matching, expectation alignment

#### **Rich Visual Output Enhancement**

**New Display Sections Added:**
1. **🔄 Email Journey Funnel** - Visual progression with emojis and percentages
2. **👥 User Journey Analysis** - Complete vs incomplete journey tracking
3. **⏰ Timing Analysis** - Time metrics and engagement patterns
4. **📉 Drop-off Analysis** - Primary bottleneck identification
5. **🎯 Key Conversion Metrics** - Critical performance indicators

**Enhanced Formatting:**
- **Performance indicators**: Visual emojis for quick assessment
- **Percentage displays**: Clear conversion rates at each stage
- **Time formatting**: Human-readable time metrics (hours/minutes)
- **Pattern recognition**: Engagement behavior categorization

### 📊 Technical Implementation

#### **Advanced Sequence Processing**
- **Email grouping**: Groups log events by email address/contact ID
- **Temporal sequencing**: Orders events by timestamp for accurate journey mapping
- **State tracking**: Tracks which funnel stage each email reached
- **Timing calculations**: Measures precise time between key events
- **Pattern analysis**: Analyzes engagement timing patterns across users

#### **Journey Classification Algorithm**
- **Funnel progression tracking**: Records unique advancement through each stage
- **Time window analysis**: Categorizes engagement as immediate vs delayed
- **Drop-off calculation**: Identifies loss percentages between stages
- **Performance benchmarking**: Compares against optimization thresholds

### 💼 Business Value

#### **For Email Marketers**
- **Bottleneck identification**: Precisely identify where campaigns lose effectiveness
- **Timing optimization**: Discover optimal send times for your audience
- **Content optimization**: Understand which elements drive engagement
- **ROI improvement**: Focus optimization efforts on highest-impact areas

#### **For Data Analysts**
- **Funnel analysis**: Complete conversion funnel with precise metrics
- **Behavioral segmentation**: Immediate vs delayed engagement patterns
- **Performance benchmarking**: Stage-by-stage optimization opportunities
- **Predictive insights**: Understanding of user engagement behaviors

#### **For Campaign Managers**
- **Campaign diagnosis**: Instant identification of campaign performance issues
- **Optimization roadmap**: Clear next steps for campaign improvement
- **Performance comparison**: Before/after analysis for optimization efforts
- **Strategic planning**: Data-driven decision making for future campaigns

### 🔄 Backward Compatibility
- **No breaking changes**: All existing log functionality remains unchanged
- **Enhanced responses**: Basic log analysis enhanced with sequence intelligence
- **Same parameters**: No changes to function parameters or configuration
- **Added value**: Users get advanced analytics without changing workflows

### 🚀 Performance Impact
- **Efficient processing**: Optimized algorithms for large log datasets
- **Memory management**: Efficient grouping and analysis of log events
- **Response formatting**: Rich output without performance degradation
- **Scalable analysis**: Handles campaigns with millions of log events

---

## [1.7.0] - 2025-06-17

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

### 🔄 Backward Compatibility
- **No breaking changes**: All existing tools continue to work unchanged
- **Enhanced functionality**: New enterprise capabilities without affecting existing workflows
- **Same configuration**: No changes to environment variables or setup required
- **Seamless upgrade**: Drop-in replacement with immediate access to new functionality

---

## [1.6.1] - 2025-06-16

### 🧹 Code Cleanup - Analytics API Removal

This minor version removes the legacy Analytics API in favor of the comprehensive Reports API that was introduced in version 1.5.0.

### 🗑️ Removed

#### **Legacy Analytics API**
- Removed `AnalyticsApi` class and all related functionality
- Removed analytics-related types and interfaces
- Removed analytics method proxies from main `CakemailAPI` class
- All analytics files moved to archive for historical reference

#### **Reason for Removal**
The standalone Analytics API has been superseded by the Reports API which provides:
- More comprehensive analytics data
- Standardized reporting endpoints 
- Export functionality (CSV/XLSX)
- Better time-range filtering
- Enhanced performance metrics
- Consistent response formats

### ✅ Migration Path

**All analytics functionality is still available** through the Reports API introduced in v1.5.0:

| Old Analytics Tool | New Reports Tool | Enhanced Features |
|-------------------|------------------|-------------------|
| `getCampaignAnalytics()` | `cakemail_get_campaign_stats` | ✅ Rates, better formatting |
| `getAccountAnalytics()` | `cakemail_get_account_stats` | ✅ Time ranges, overview |
| `getListAnalytics()` | `cakemail_get_list_stats` | ✅ Growth metrics |
| `getTransactionalAnalytics()` | `cakemail_get_email_stats` | ✅ Time-based filtering |
| N/A | `cakemail_get_campaign_links_stats` | 🆕 Link-by-link tracking |
| N/A | `cakemail_get_campaign_performance_summary` | 🆕 Comprehensive summaries |

### 🔄 Backward Compatibility
- **No user-facing changes**: All analytics functionality available through Reports API
- **No tool changes**: No analytics tools were exposed at the MCP level
- **No configuration changes**: Same setup and environment variables
- **Enhanced functionality**: Users get better analytics through Reports API

---

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
