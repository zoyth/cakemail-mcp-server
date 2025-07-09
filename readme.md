# Cakemail MCP Server

An enterprise Model Context Protocol (MCP) server for integrating with the Cakemail API. This server provides comprehensive tools for email marketing campaigns, transactional emails, detailed reporting, advanced BEEeditor visual email design, template management, and complete list management through the Cakemail platform.

## 🎯 Version 1.10.0 - Complete Template Management

This version introduces **comprehensive template management functionality**, providing complete lifecycle management for email templates including creation, updating, duplication, and advanced filtering capabilities with support for modern OpenAPI content structures.

## ✨ Currently Implemented Features

### 🎨 Template Management (7 tools)
- ✅ Create, update, and delete email templates with modern content structure
- ✅ List templates with advanced filtering, sorting, and pagination
- ✅ Get individual template details and metadata
- ✅ Duplicate templates with smart naming and tag preservation
- ✅ Render templates for HTML preview and testing
- ✅ **OpenAPI-compliant content structure** (html, text, bee, custom)
- ✅ **Backward compatibility** with legacy template formats
- ✅ **Multi-account support** for enterprise environments
- ✅ **Advanced filtering** by tags, name, ownership status
- ✅ **Template search** by name, tags, or ownership

### 👥 Contact Management

- ✅ Create, update, and delete contacts with custom fields
- ✅ List contacts with filtering by list ID
- ✅ Advanced contact segmentation support
- ✅  Contact engagement metrics

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

### 📊 Enhanced Reporting & Analytics (12 tools)
- ✅ **Modular Reports Architecture** with focused, maintainable modules
- ✅ **Campaign Analytics** with detailed performance insights and link analysis
- ✅ **Email API Statistics** for transactional email performance
- ✅ **List & Account Analytics** with growth metrics and deliverability health
- ✅ **Smart Performance Benchmarking** with industry standard comparisons
- ✅ **Intelligent Link Analysis** with automatic categorization and optimization
- ✅ **Visual Performance Indicators** (🚀👍⚠️🛑) for quick assessment
- ✅ **Actionable Recommendations** based on performance patterns
- ✅ **Export Management** with progress tracking and lifecycle management
- ✅ **Campaign Reports Export** (CSV/XLSX) with comprehensive data
- ✅ **Suppressed Emails Export** for compliance and deliverability
- ✅ **Debug Tools** for API connectivity testing

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

**Total Implemented: 87+ tools across 11 feature categories**

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **Cakemail account** with API access
- **Claude Desktop** or another MCP-compatible client

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/cakemail/cakemail-mcp-server.git
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

### Template Operations
```
"List all my email templates sorted by creation date"

"Create a new template called 'Welcome Email' with modern content structure"

"Get the details of template ID 123 including its content and metadata"

"Update my newsletter template with new HTML content and add marketing tags"

"Duplicate the welcome email template as 'Welcome Email - French'"

"Show me a preview of template 456 by rendering it to HTML"

"Delete the old product launch template that's no longer needed"

"Find all templates tagged with 'newsletter' that I own"
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

"Show me link performance analysis for my newsletter campaign with categorization insights"

"Generate performance benchmarks comparing my open rates to industry standards"
```

### Reports Module Architecture
The reports functionality is built on a **modular architecture** for enhanced maintainability:

- **Campaign Analytics**: Performance insights, link analysis, engagement metrics
- **Email Statistics**: Transactional email performance and delivery tracking  
- **List & Account Analytics**: Growth metrics, subscriber analysis, account health
- **Export Management**: Complete export lifecycle with progress tracking
- **Smart Insights Engine**: Automated performance analysis and recommendations
- **Debug Utilities**: API connectivity testing and troubleshooting

Each module provides focused functionality while sharing common analytics utilities for consistent performance benchmarking and intelligent recommendations.

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

## 🔐 Security

- **OAuth 2.0** authentication with automatic token refresh
- **Input validation** to prevent injection attacks
- **Secure credential storage** using environment variables
- **Rate limiting** to prevent abuse
- **HTTPS-only** API communication

### ⚠️ Important Security Notice

**Never commit credentials to version control!** Always use environment variables for sensitive data:

1. Copy `.env.example` to `.env`
2. Add your actual credentials to `.env`
3. Ensure `.env` is listed in `.gitignore` (already configured)
4. If credentials are accidentally exposed, rotate them immediately in your Cakemail account

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
