# Cakemail MCP Server

An enterprise Model Context Protocol (MCP) server for integrating with the Cakemail API. This server provides comprehensive tools for email marketing campaigns, transactional emails, detailed reporting, and advanced BEEeditor visual email design through the Cakemail platform.

## 🎯 Version 1.8.0 - BEEeditor Visual Email Design Integration

This version introduces **comprehensive BEEeditor integration**, transforming the server into a powerful visual email design platform with JSON-based template creation, validation, and newsletter generation capabilities.

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

### 📨 Transactional Email (10 tools)
- ✅ Send individual transactional and marketing emails
- ✅ Email status tracking and delivery monitoring
- ✅ HTML and plain text content support
- ✅ Email rendering and preview capabilities
- ✅ Comprehensive email activity logs with filtering
- ✅ Email statistics with time-based analytics
- ✅ Advanced email logs with performance analysis
- ✅ Debug tools for email API testing

### 👤 Sender Management (5 tools)
- ✅ Create, update, and delete verified senders
- ✅ List all senders with verification status
- ✅ Complete sender authentication support

### 📊 Reporting & Analytics (3 tools)
- ✅ Campaign performance metrics (opens, clicks, bounces, rates)
- ✅ Campaign link click tracking and statistics
- ✅ **Advanced event sequence analysis** with user journey tracking
- ✅ **Email funnel analysis** (sent → delivered → opened → clicked)
- ✅ **Drop-off analysis** with bottleneck identification
- ✅ **Optimization recommendations** based on performance data

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

**Total Implemented: 44 tools across 7 feature categories**

## 🔄 Planned Features (Coming Soon)

### 👥 Contact Management
- 🔄 Create, update, and delete contacts with custom fields
- 🔄 List contacts with filtering by list ID
- 🔄 Advanced contact segmentation support
- 🔄 Contact engagement metrics

### 📋 List Management
- 🔄 Create, update, and delete contact lists
- 🔄 List management with pagination and sorting
- 🔄 Multi-language support
- 🔄 List performance analytics

### 🤖 Automation Workflows
- 🔄 Create and manage automation sequences
- 🔄 Trigger-based email automation
- 🔄 Start/stop automation controls
- 🔄 Workflow performance tracking

### 🎨 Template Management
- 🔄 Create, update, and delete email templates
- 🔄 Template library management
- 🔄 Template usage in campaigns

### 🏢 Enterprise Sub-Account Management
- 🔄 Create, update, and delete sub-accounts
- 🔄 Multi-tenant support for agencies
- 🔄 Account suspension/unsuspension
- 🔄 Organization conversion

### 📊 Enhanced Reporting
- 🔄 Account-wide performance insights
- 🔄 Campaign reports export (CSV/XLSX)
- 🔄 Contact list growth analytics
- 🔄 Suppressed emails export

**Planned: 20+ additional tools** (API endpoints available, implementation needed)

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
- **Event Sequence Analysis**: `cakemail_get_campaign_logs` - Advanced user journey tracking with:
  - 🔄 **Email funnel analysis** (sent → delivered → opened → clicked)
  - 👥 **User journey mapping** and drop-off identification  
  - ⏰ **Timing intelligence** (time-to-open, peak engagement hours)
  - 📉 **Drop-off analysis** with bottleneck identification
  - 🎯 **Stage-specific optimization** recommendations

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

### Advanced Analytics
```
"Show me the performance metrics for my latest campaign including open rates and click rates"

"Get detailed campaign logs for campaign 12345 with advanced sequence analysis to see the complete user journey"

"Analyze campaign 789 logs to identify drop-off points and get optimization recommendations"
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

### Version 1.8.0 - BEEeditor Integration & Account Tools (Current)
- ✅ **BEEeditor visual email design** with JSON template support
- ✅ **Newsletter template generation** with automated sections
- ✅ **Template validation** and schema compliance checking
- ✅ **Enhanced campaign creation** with BEE format support
- ✅ **Account management tools** - Get account details and retry configuration

### Version 1.7.1 - Advanced Event Sequence Analysis
- ✅ **Advanced event sequence analysis** for campaign logs with enterprise-level intelligence
- ✅ **Email journey funnel tracking** with exact user progression
- ✅ **User journey analysis** with complete/incomplete journey identification
- ✅ **Timing analysis** including time-to-open and peak engagement detection
- ✅ **Optimization recommendations** based on funnel performance data

### Version 1.7.0 - Enhanced Analytics
- ✅ Complete campaign performance reporting
- ✅ Link click tracking and analysis
- ✅ Email delivery monitoring and statistics
- ✅ Advanced logging with filtering capabilities

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
- **BEEeditor Integration**: [docs/BEE_EDITOR_INTEGRATION.md](docs/BEE_EDITOR_INTEGRATION.md)
- **MCP Protocol**: https://github.com/modelcontextprotocol
- **Issues**: https://github.com/cakemail/cakemail-mcp-server/issues

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to enhance your email marketing with AI?** Get started with the Cakemail MCP Server today! 🚀
