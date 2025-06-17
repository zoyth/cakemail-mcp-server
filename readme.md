# Cakemail MCP Server

An enterprise Model Context Protocol (MCP) server for integrating with the Cakemail API. This server provides comprehensive tools for email marketing campaigns, contact management, transactional emails, templates, automation, detailed reporting, and enterprise sub-account management through the Cakemail platform.

## 🎯 Version 1.7.0 - Enterprise Sub-Account Management

This version introduces **comprehensive sub-account management** capabilities, enabling enterprise and agency functionality for multi-tenant email marketing operations, along with complete logs functionality and advanced reporting features.

## ✨ Features

### 📧 Campaign Management
- ✅ Create, update, and delete email campaigns
- ✅ List campaigns with advanced filtering and pagination
- ✅ Send campaigns to contact lists
- ✅ Campaign performance metrics (via Reports API)
- ✅ Get latest campaign with one command

### 👥 Contact Management
- ✅ Create, update, and delete contacts with custom fields
- ✅ List contacts with filtering by list ID
- ✅ Advanced contact segmentation support
- ✅ Contact engagement metrics (via Reports API)

### 📨 Transactional Email
- ✅ Send individual transactional emails
- ✅ Template support for consistent messaging
- ✅ HTML and plain text content
- ✅ Delivery tracking and analytics (via Reports API)

### 📋 List Management
- ✅ Create, update, and delete contact lists
- ✅ List management with pagination and sorting
- ✅ Multi-language support
- ✅ List performance analytics (via Reports API)

### 👤 Sender Management
- ✅ Create, update, and delete verified senders
- ✅ List all senders with verification status
- ✅ Sender authentication support

### 🎨 Template Management
- ✅ Create, update, and delete email templates
- ✅ Template library management
- ✅ Use templates in campaigns and transactional emails

### 🤖 Automation Workflows
- ✅ Create and manage automation sequences
- ✅ Trigger-based email automation
- ✅ Start/stop automation controls

### 🏢 Enterprise Sub-Account Management
- ✅ Create, update, and delete sub-accounts with full profile data
- ✅ Advanced filtering, searching, and pagination for account lists
- ✅ Account suspension/unsuspension for temporary access control
- ✅ Email verification workflows with resend capabilities
- ✅ Organization conversion for account type changes
- ✅ Multi-tenant support for agencies and large corporations
- ✅ Hierarchical account management and brand isolation
- ✅ Debug and troubleshooting utilities for access management

### 📊 Advanced Reporting & Analytics
- ✅ Campaign performance metrics (opens, clicks, bounces, rates)
- ✅ Campaign link click tracking and statistics
- ✅ Transactional email analytics with time ranges
- ✅ Contact list growth and engagement analytics
- ✅ Account-wide performance insights and overviews
- ✅ Campaign reports export (CSV/XLSX) with download
- ✅ Suppressed emails export functionality
- ✅ Comprehensive performance summaries
- ✅ Debug tools for reports API access

### 📋 Detailed Logs & Activity Tracking
- ✅ Campaign activity logs (opens, clicks, bounces, unsubscribes)
- ✅ Workflow automation logs for email sequences
- ✅ Workflow action logs for specific automation steps
- ✅ Transactional email delivery logs and tracking
- ✅ Time-based log filtering with Unix timestamps
- ✅ Pagination and sorting for large log datasets
- ✅ Log type filtering (opens, clicks, bounces, etc.)
- ✅ Debug tools for logs API access and testing

### 🏥 Production Features
- ✅ Retry logic with exponential backoff
- ✅ Rate limiting and circuit breaker protection
- ✅ Request queuing and concurrency control
- ✅ Comprehensive error handling
- ✅ Health monitoring and diagnostics

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

## 🛠 Key Tools

### Essential Tools
- `cakemail_health_check` - Check API connection and authentication
- `cakemail_get_latest_campaign` - Get your most recent campaign
- `cakemail_get_campaigns` - List campaigns (latest first by default)
- `cakemail_create_campaign` - Create new email campaigns
- `cakemail_send_campaign` - Send campaigns to recipients

### Management Tools
- Contact Management: `create`, `get`, `update`, `delete`, `list` contacts
- List Management: `create`, `get`, `update`, `delete`, `list` contact lists
- Sender Management: `create`, `get`, `update`, `delete`, `list` senders
- Template Management: `create`, `get`, `update`, `delete`, `list` templates
- Sub-Account Management: `create`, `get`, `update`, `delete`, `list`, `suspend`, `unsuspend` sub-accounts

### Reporting, Logs, Automation & Enterprise
- **Campaign Reports**: Detailed performance metrics, open/click rates, link tracking
- **Campaign Logs**: Complete activity tracking for opens, clicks, bounces, unsubscribes
- **Account Reports**: Performance overviews, growth metrics, time-based statistics
- **Workflow Logs**: Automation sequence tracking and action-level logging
- **Transactional Logs**: Individual email delivery tracking and status monitoring
- **Export Reports**: Generate and download campaign reports in CSV/XLSX formats
- **Automation**: Create and manage email automation workflows
- **Transactional**: Send individual emails with template support
- **Sub-Account Management**: Enterprise multi-tenant account operations and lifecycle management

## 💡 Usage Examples

### Quick Campaign Check
```
"Show me my latest campaign with analytics"
```

### Create and Send Campaign
```
"Create a new email campaign called 'Holiday Sale 2024' with the subject 'Save 50% on Everything!' and send it to my newsletter list"
```

### Contact Management
```
"Add a new contact with email sara@example.com and first name Sara to my main contact list"
```

### Sub-Account Management
```
"Create a new sub-account for client 'Acme Corp' with email admin@acme.com"

"List all active sub-accounts and show their verification status"

"Suspend the sub-account for client 'Beta Inc' temporarily"

"Search for sub-accounts containing 'marketing' in their name"
```

### Reporting & Logs
```
"Show me the performance metrics for my latest campaign including open rates and click rates"

"Get detailed campaign logs for campaign 12345 to see all opens and clicks"

"Show me workflow logs for automation 456 to track email sequence performance"

"Get transactional email logs for the last week filtered by delivered status"

"Create a campaign performance export for campaigns 123, 456, and 789 in Excel format"

"Debug my logs API access to test campaign and workflow log endpoints"
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

### Version 1.7.0
- ✅ Complete sub-account management for enterprise and agency use
- ✅ Multi-tenant support with client isolation and brand separation
- ✅ Advanced account filtering, searching, and lifecycle management
- ✅ Account suspension/unsuspension and verification workflows
- ✅ Hierarchical account management for large organizations
- ✅ Debug tools for sub-account access and permissions
- ✅ 14+ new tools for comprehensive account operations

### Version 1.6.0
- ✅ Complete Logs API integration with 5 new tools
- ✅ Campaign activity logs with detailed tracking
- ✅ Workflow automation logs and action-level tracking
- ✅ Transactional email delivery logs and monitoring
- ✅ Time-based log filtering with pagination support
- ✅ Debug functionality for logs API testing
- ✅ Full integration with existing analytics and reporting

### Version 1.5.0
- ✅ Complete Reports API integration with 12+ new tools
- ✅ Campaign performance statistics and analytics
- ✅ Campaign link click tracking and analysis
- ✅ Account and list performance metrics
- ✅ Export functionality for campaign reports (CSV/XLSX)
- ✅ Time-based reporting with custom date ranges
- ✅ Enhanced error handling for reports API

### Version 1.2.0
- ✅ Enhanced UX with latest-first default sorting
- ✅ New `cakemail_get_latest_campaign` tool
- ✅ Intelligent campaign formatting with analytics
- ✅ Production-ready retry and rate limiting
- ✅ Comprehensive error handling

### Version 1.1.0
- ✅ Full API compliance with official documentation
- ✅ 30+ tools for complete Cakemail functionality
- ✅ Enhanced security with OAuth 2.0 refresh tokens
- ✅ Advanced analytics and automation workflows

## 🔐 Security

- **OAuth 2.0** authentication with automatic token refresh
- **Input validation** to prevent injection attacks
- **Secure credential storage** using environment variables
- **Rate limiting** to prevent abuse
- **HTTPS-only** API communication

## 📚 Support

- **Cakemail API**: https://cakemail.dev
- **MCP Protocol**: https://github.com/modelcontextprotocol
- **Issues**: https://github.com/zoyth/cakemail-mcp-server/issues

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to enhance your email marketing with AI?** Get started with the Cakemail MCP Server today! 🚀