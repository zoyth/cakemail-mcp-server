# Cakemail MCP Server

A comprehensive Model Context Protocol (MCP) server for integrating with the Cakemail API. This server provides tools for email marketing campaigns, contact management, transactional emails, templates, automation, and analytics through the Cakemail platform.

## 🎯 Version 1.2.0 - Fully API Compliant

This version brings the MCP server into **full compliance** with the official Cakemail API documentation, with enhanced reliability, comprehensive error handling, and intelligent retry logic for production use.

## ✨ Features

### 📧 Campaign Management
- ✅ Create, update, and delete email campaigns
- ✅ List campaigns with advanced filtering and pagination
- ✅ Send campaigns to contact lists
- ✅ Campaign analytics and performance metrics
- ✅ Get latest campaign with one command

### 👥 Contact Management
- ✅ Create, update, and delete contacts with custom fields
- ✅ List contacts with filtering by list ID
- ✅ Advanced contact segmentation support
- ✅ Contact analytics and engagement metrics

### 📨 Transactional Email
- ✅ Send individual transactional emails
- ✅ Template support for consistent messaging
- ✅ HTML and plain text content
- ✅ Delivery analytics and tracking

### 📋 List Management
- ✅ Create, update, and delete contact lists
- ✅ List management with pagination and sorting
- ✅ Multi-language support
- ✅ List performance analytics

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

### 📊 Advanced Analytics
- ✅ Campaign performance metrics (opens, clicks, bounces)
- ✅ Transactional email analytics
- ✅ List growth and engagement analytics
- ✅ Account-wide performance insights

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

### Analytics & Automation
- Analytics: Campaign, transactional, list, and account analytics
- Automation: Create and manage email automation workflows
- Transactional: Send individual emails with template support

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

### Analytics
```
"Show me the performance metrics for my latest campaign including open rates and click rates"
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