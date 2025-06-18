# Cakemail MCP Server

An enterprise Model Context Protocol (MCP) server for integrating with the Cakemail API. This server provides comprehensive tools for email marketing campaigns, transactional emails, detailed reporting, advanced BEEeditor visual email design, and complete list management through the Cakemail platform.

## 🎯 Version 1.9.0 - Complete List Management Integration

This version introduces **comprehensive list management functionality**, providing complete lifecycle management for contact lists including creation, updating, archiving, and performance analytics.

## ✨ Currently Implemented Features

### 📧 Campaign Management (21 tools)
- ✅ Create, update, and delete email campaigns
- ✅ List campaigns with advanced filtering and pagination
- ✅ Send campaigns to contact lists
- ✅ Campaign performance metrics (via Reports API)
- ✅ Get latest campaign with one command
- ✅ **BEEeditor integration** for visual email design
- ✅ **JSON-based email templates** with drag-and-drop structure
- ✅ **Newsletter template generation** with automated layout
- ✅ Campaign scheduling, suspension, and lifecycle management
- ✅ Campaign testing, preview, and revision history
- ✅ Campaign archiving and link tracking

### 📋 List Management (7 tools)
- ✅ Create, update, and delete contact lists
- ✅ List all lists with advanced filtering and pagination
- ✅ Get detailed list information and statistics
- ✅ Archive lists while preserving data
- ✅ Comprehensive list performance analytics
- ✅ Multi-language support and sender configuration
- ✅ Webhook integration for real-time list events
- ✅ Account scoping for enterprise environments

### 📨 Transactional Email (10 tools)
- ✅ Send individual transactional and marketing emails
- ✅ Email status tracking and delivery monitoring
- ✅ HTML and plain text content support
- ✅ Email rendering and preview capabilities
- ✅ Comprehensive email activity logs with filtering
- ✅ Email statistics with time-based analytics
- ✅ Advanced email logs with performance analysis
- ✅ Debug tools for email API testing

### 🏢 Enterprise Sub-Account Management (14 tools)
- ✅ Create, update, and delete sub-accounts
- ✅ Multi-tenant support for agencies
- ✅ Account suspension/unsuspension
- ✅ Organization conversion
- ✅ Email verification workflows
- ✅ Advanced filtering and search capabilities
- ✅ Debug and troubleshooting utilities

### 📊 Enhanced Reporting & Exports (12 tools)
- ✅ Account-wide performance insights
- ✅ Campaign reports export (CSV/XLSX)
- ✅ Contact list growth analytics
- ✅ Suppressed emails export
- ✅ Export management with progress tracking
- ✅ Multiple export formats and bulk reporting
- ✅ Download management and automatic cleanup

### 📋 Logs & Event Tracking (6 tools)
- ✅ Campaign activity logs with advanced sequence analysis
- ✅ Workflow automation logs
- ✅ Transactional email delivery logs
- ✅ Contact list activity logs
- ✅ Smart filtering and event categorization
- ✅ Debug tools for logs API testing

### 👤 Sender Management (5 tools)
- ✅ Create, update, and delete verified senders
- ✅ List all senders with verification status
- ✅ Complete sender authentication support

### 🎨 BEEeditor Visual Design (3 tools)
- ✅ Create basic BEEeditor template structures
- ✅ Generate complete newsletter templates with sections
- ✅ Validate BEE JSON templates against schema
- ✅ Drag-and-drop email design capabilities

### 🏢 Account Management (2 tools)
- ✅ Get current account details and information
- ✅ View retry configuration and API settings
- ✅ Account health monitoring and diagnostics

### 🏥 Production Infrastructure
- ✅ Health monitoring and API connection validation
- ✅ OAuth 2.0 authentication with automatic token refresh
- ✅ Retry logic with exponential backoff
- ✅ Rate limiting and circuit breaker protection
- ✅ Request queuing and concurrency control
- ✅ Comprehensive error handling

**Total Implemented: 80+ tools across 10 feature categories**

## 🔄 Planned Features (Coming Soon)

### 👥 Contact Management
- 🔄 Create, update, and delete contacts with custom fields
- 🔄 List contacts with filtering by list ID
- 🔄 Advanced contact segmentation support
- 🔄 Contact engagement metrics

### 🤖 Automation Workflows
- 🔄 Create and manage automation sequences
- 🔄 Trigger-based email automation
- 🔄 Start/stop automation controls
- 🔄 Workflow performance tracking

### 🎨 Template Management
- 🔄 Create, update, and delete email templates
- 🔄 Template library management
- 🔄 Template usage in campaigns

**Planned: 8+ additional tools** (API endpoints available, implementation needed)

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **Cakemail account** with API access
- **Claude Desktop** or another MCP-compatible client

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/zoyth/cakemail-mcp-server.git
cd cakemail-mcp-server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the project:**
```bash
npm run build
```

### Configuration

#### Environment Variables

Create a `.env` file in the project root:

```env
CAKEMAIL_USERNAME=your-email@example.com
CAKEMAIL_PASSWORD=your-password
CAKEMAIL_BASE_URL=https://api.cakemail.dev
```

#### Claude Desktop Setup

Add the server to your Claude Desktop configuration:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cakemail": {
      "command": "node",
      "args": ["/absolute/path/to/cakemail-mcp-server/build/index.js"],
      "env": {
        "CAKEMAIL_USERNAME": "your-email@example.com",
        "CAKEMAIL_PASSWORD": "your-password"
      }
    }
  }
}
```

## 🧪 Testing

### Quick Test
```bash
npm run test
```

### Debug with MCP Inspector
```bash
npm run inspector
```

### Health Check
In Claude Desktop: `"Check my Cakemail API health status"`

## 🛠 Available Tools

### Essential Tools
- `cakemail_health_check` - Check API connection and authentication
- `cakemail_get_latest_campaigns` - Get your most recent campaigns
- `cakemail_list_campaigns` - List campaigns (latest first by default)
- `cakemail_create_campaign` - Create new email campaigns (HTML or BEE format)
- `cakemail_send_campaign` - Send campaigns to recipients

### List Management
- `cakemail_list_lists` - List all contact lists with filtering and pagination
- `cakemail_create_list` - Create new contact lists with full configuration
- `cakemail_get_list` - Get detailed list information and statistics
- `cakemail_update_list` - Update list settings and configurations
- `cakemail_delete_list` - Permanently delete contact lists
- `cakemail_archive_list` - Archive lists while preserving data
- `cakemail_get_list_stats` - Get comprehensive performance analytics

### Sub-Account Management
- Sub-Account CRUD: `create`, `get`, `update`, `delete`, `list` sub-accounts
- Account Control: `suspend`, `unsuspend`, `confirm`, `convert_to_organization`
- Account Discovery: `search_by_name`, `get_by_status`, `get_latest`
- Debug Tools: `debug_sub_account_access`, `resend_verification_email`

### Account Tools
- `cakemail_get_self_account` - Get current account details
- `cakemail_get_retry_config` - View retry configuration and API settings

### BEEeditor Tools
- `cakemail_create_bee_template` - Create basic BEEeditor template structure
- `cakemail_create_bee_newsletter` - Generate complete newsletter templates
- `cakemail_validate_bee_template` - Validate BEE JSON templates

### Campaign Management
- Campaign CRUD: `create`, `get`, `update`, `delete`, `list` campaigns
- Campaign Control: `send`, `schedule`, `suspend`, `resume`, `cancel`
- Campaign Analysis: `render`, `send_test_email`, `get_revisions`, `get_links`

### Email & Sender Management
- Transactional Emails: `send_email`, `send_transactional_email`, `send_marketing_email`
- Email Tracking: `get_email`, `render_email`, `get_email_logs`, `get_email_stats`
- Sender Management: `create`, `get`, `update`, `delete`, `list` senders

### Reporting & Analytics
- **Campaign Analysis**: `cakemail_get_campaign_stats` - Comprehensive performance metrics
- **Link Intelligence**: `cakemail_get_campaign_links_stats` - Link-by-link performance analysis
- **Export Management**: `create`, `list`, `get`, `download`, `delete` campaign report exports
- **Event Sequence Analysis**: `cakemail_get_campaign_logs` - Advanced user journey tracking with:
  - 🔄 **Email funnel analysis** (sent → delivered → opened → clicked)
  - 👥 **User journey mapping** and drop-off identification  
  - ⏰ **Timing intelligence** (time-to-open, peak engagement hours)
  - 📉 **Drop-off analysis** with bottleneck identification
  - 🎯 **Stage-specific optimization** recommendations

### Logs & Event Tracking
- **Campaign Logs**: `cakemail_get_campaign_logs` - Advanced sequence analysis
- **Workflow Logs**: `cakemail_get_workflow_logs`, `cakemail_get_workflow_action_logs`
- **Email Logs**: `cakemail_get_transactional_email_logs`, `cakemail_get_list_logs`
- **Debug Tools**: `cakemail_debug_logs_access`

## 💡 Usage Examples

### Quick Campaign Check
```
"Show me my latest campaigns with analytics"
```

### Account Information
```
"Show me my account details"

"What's my current retry configuration?"
```

### Sub-Account Management
```
"Create a new sub-account for our client 'Acme Corp' with the email admin@acmecorp.com"

"List all active sub-accounts and show their verification status"

"Suspend the sub-account for client XYZ temporarily"

"Convert sub-account 12345 to an organization"
```

### List Management Examples
```
"Create a new contact list called 'Newsletter Subscribers' with our marketing team as the default sender"

"Show me all my contact lists with their subscriber counts"

"Get performance statistics for my main newsletter list"

"Archive the old product launch list but keep the data"

"Update the sender information for my customer list"
```

### Create and Send Campaign
```
"Create a new email campaign called 'Holiday Sale 2024' with the subject 'Save 50% on Everything!' and send it to my newsletter list"
```

### BEEeditor Templates
```
"Create a BEE newsletter template with sections for product announcements and customer testimonials"

"Generate a basic BEE template for welcome emails with our brand colors"

"Validate my custom BEE template and show me the structure"

"Create a campaign using BEE format with a professional newsletter layout"
```

### Transactional Emails
```
"Send a transactional welcome email to sara@example.com with our onboarding template"
```

### List Operations
```
"List all my contact lists sorted by creation date"

"Create a contact list for VIP customers with webhook notifications"

"Show me the performance stats for list ID 12345 over the last month"

"Archive all lists that have zero subscribers"
```

### Advanced Analytics & Exports
```
"Show me the performance metrics for my latest campaign including open rates and click rates"

"Create a CSV export of all my campaign performance data for the last quarter"

"Get detailed campaign logs for campaign 12345 with advanced sequence analysis to see the complete user journey"

"Analyze campaign 789 logs to identify drop-off points and get optimization recommendations"

"Export the performance data for all my campaigns this year in Excel format"
```

## 🔧 Advanced Configuration

### Retry and Rate Limiting
The server includes production-ready features:

- **Automatic Retry**: Exponential backoff with jitter
- **Rate Limiting**: Respects API limits and server responses
- **Circuit Breaker**: Automatic failure detection and recovery
- **Request Queuing**: Concurrency control for batch operations

### Error Handling
Comprehensive error types with detailed messages:

- **Authentication Errors**: Clear credential guidance
- **Validation Errors**: Field-specific error details
- **Rate Limit Errors**: Automatic retry timing
- **Network Errors**: Connection and timeout handling

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors:**
- Verify `CAKEMAIL_USERNAME` and `CAKEMAIL_PASSWORD`
- Ensure API access is enabled on your account

**Build Errors:**
```bash
npm run clean && npm run rebuild
```

**New Tools Not Showing:**
- Restart Claude Desktop completely
- Wait for full load, then test new commands

**API Connectivity:**
```bash
# Test in Claude Desktop
"Check my Cakemail API connection"
```

### Debug Mode
```bash
DEBUG=mcp:* npm start
```

## 📝 Recent Changes

### Version 1.9.0 - Complete List Management (Current)
- ✅ **Comprehensive list management** with full CRUD operations
- ✅ **List performance analytics** with growth and engagement metrics
- ✅ **Advanced filtering and pagination** for list collections
- ✅ **Multi-language and webhook support** for list configuration
- ✅ **Account scoping** for enterprise and agency environments
- ✅ **Archive functionality** for non-destructive list management

### Version 1.8.0 - BEEeditor Integration & Account Tools
- ✅ **BEEeditor visual email design** with JSON template support
- ✅ **Newsletter template generation** with automated sections
- ✅ **Template validation** and schema compliance checking
- ✅ **Enhanced campaign creation** with BEE format support
- ✅ **Account management tools** - Get account details and retry configuration

### Version 1.7.0 - Enterprise Sub-Account Management
- ✅ **Complete sub-account management** with 14 tools for enterprise operations
- ✅ **Multi-tenant support** for agencies and large corporations
- ✅ **Account lifecycle management** including suspension and organization conversion
- ✅ **Advanced filtering and search** capabilities for account discovery

### Version 1.6.0 - Complete Logs API & Reporting
- ✅ **Comprehensive logs functionality** with 6 tools for event tracking
- ✅ **Complete reporting and analytics** with 12 tools for performance insights
- ✅ **Export functionality** for campaign reports in CSV/XLSX formats
- ✅ **Advanced event sequence analysis** with user journey tracking

### Version 1.2.0 - Production Ready
- ✅ Enhanced UX with latest-first default sorting
- ✅ Production-ready retry and rate limiting
- ✅ Comprehensive error handling
- ✅ OAuth 2.0 authentication improvements

## 🔐 Security

- **OAuth 2.0** authentication with automatic token refresh
- **Input validation** to prevent injection attacks
- **Secure credential storage** using environment variables
- **Rate limiting** to prevent abuse
- **HTTPS-only** API communication

## 📚 Support

- **Cakemail API**: https://cakemail.dev
- **List Management Guide**: [docs/list-management.md](docs/list-management.md)
- **BEEeditor Integration**: [docs/BEE_EDITOR_INTEGRATION.md](docs/BEE_EDITOR_INTEGRATION.md)
- **MCP Protocol**: https://github.com/modelcontextprotocol
- **Issues**: https://github.com/cakemail/cakemail-mcp-server/issues

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to enhance your email marketing with AI?** Get started with the Cakemail MCP Server today! 🚀
