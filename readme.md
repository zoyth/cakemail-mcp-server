# Cakemail MCP Server

A comprehensive Model Context Protocol (MCP) server for integrating with the Cakemail API. This server provides tools for email marketing campaigns, contact management, transactional emails, templates, automation, and analytics through the Cakemail platform.

## 🎯 Version 1.1.0 - Fully API Compliant

This version brings the MCP server into **full compliance** with the official Cakemail API documentation, fixing critical inconsistencies and adding extensive new functionality.

## ✨ Features

### 📧 Campaign Management
- ✅ Create, update, and delete email campaigns
- ✅ List campaigns with advanced filtering and pagination
- ✅ Send campaigns to contact lists
- ✅ Campaign analytics and performance metrics

### 👥 Contact Management
- ✅ Create, update, and delete contacts with custom fields
- ✅ List contacts with filtering by list ID
- ✅ Advanced contact segmentation support
- ✅ Contact analytics and engagement metrics

### 📨 Transactional Email
- ✅ Send individual transactional emails
- ✅ Template support for consistent messaging
- ✅ HTML and plain text content
- ✅ SMTP relay capabilities
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
- ✅ Domain management capabilities

### 🎨 Template Management
- ✅ Create, update, and delete email templates
- ✅ Template library management
- ✅ Use templates in campaigns and transactional emails
- ✅ Version control and template analytics

### 🤖 Automation Workflows
- ✅ Create and manage automation sequences
- ✅ Trigger-based email automation
- ✅ Drip campaigns and email series
- ✅ Start/stop automation controls

### 📊 Advanced Analytics
- ✅ Campaign performance metrics (opens, clicks, bounces)
- ✅ Transactional email analytics
- ✅ List growth and engagement analytics
- ✅ Account-wide performance insights
- ✅ Custom date range reporting

### 🏥 Health Monitoring
- ✅ API connectivity monitoring
- ✅ Authentication status checking
- ✅ Real-time health diagnostics

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

### Integration Tests

Test the server functionality:

```bash
npm run test
```

### MCP Inspector

Debug with the MCP Inspector:

```bash
npm run inspector
```

This opens `http://localhost:5173` for interactive testing.

### Health Check

Test API connectivity:

```bash
# In Claude Desktop
"Check my Cakemail API health status"
```

## 🛠 Available Tools

### Health & Diagnostics
- `cakemail_health_check` - Check API connection and authentication status

### Sender Management
- `cakemail_get_senders` - List all verified senders
- `cakemail_create_sender` - Create new sender identity
- `cakemail_get_sender` - Get specific sender details
- `cakemail_update_sender` - Update sender information
- `cakemail_delete_sender` - Delete sender

### List Management
- `cakemail_get_lists` - List contact lists with filtering
- `cakemail_create_list` - Create new contact list
- `cakemail_get_list` - Get specific list details
- `cakemail_update_list` - Update list information
- `cakemail_delete_list` - Delete contact list

### Contact Management
- `cakemail_get_contacts` - List contacts with filtering
- `cakemail_create_contact` - Add new contacts to lists
- `cakemail_get_contact` - Get specific contact details
- `cakemail_update_contact` - Update contact information
- `cakemail_delete_contact` - Delete contact

### Campaign Management
- `cakemail_get_campaigns` - List campaigns with advanced filtering
- `cakemail_create_campaign` - Create new email campaigns
- `cakemail_get_campaign` - Get specific campaign details
- `cakemail_update_campaign` - Update campaign content
- `cakemail_send_campaign` - Send campaign to recipients
- `cakemail_delete_campaign` - Delete draft campaigns

### Transactional Email
- `cakemail_send_transactional_email` - Send individual emails

### Template Management
- `cakemail_get_templates` - List email templates
- `cakemail_get_template` - Get specific template details
- `cakemail_create_template` - Create new email template
- `cakemail_update_template` - Update template content
- `cakemail_delete_template` - Delete template

### Analytics & Reporting
- `cakemail_get_campaign_analytics` - Campaign performance metrics
- `cakemail_get_transactional_analytics` - Transactional email analytics
- `cakemail_get_list_analytics` - List performance metrics
- `cakemail_get_account_analytics` - Account-wide analytics

### Automation Workflows
- `cakemail_get_automations` - List automation workflows
- `cakemail_get_automation` - Get specific automation details
- `cakemail_create_automation` - Create new automation
- `cakemail_start_automation` - Start automation workflow
- `cakemail_stop_automation` - Stop automation workflow

## 💡 Usage Examples

### Creating a Campaign
```
"Create a new email campaign called 'Holiday Sale 2024' with the subject 'Save 50% on Everything!' and send it to my newsletter list"
```

### Sending Transactional Emails
```
"Send a welcome email to john@example.com using my verified sender with the subject 'Welcome to our platform!'"
```

### Managing Contacts
```
"Add a new contact with email sara@example.com and first name Sara to my main contact list"
```

### Analytics and Reporting
```
"Show me the performance metrics for my latest campaign including open rates and click rates"
```

### Template Management
```
"Create a new email template called 'Welcome Series Part 1' with HTML content for new user onboarding"
```

### Automation Workflows
```
"Create an automation that sends a welcome series to new subscribers over 3 days"
```

## 🔧 API Integration Details

This MCP server integrates with the **Cakemail Next-gen API**, featuring:

- **OAuth 2.0 authentication** with refresh token support
- **OpenAPI specification** compliance for reliable integration
- **RESTful API design** with CORS support
- **Canadian data hosting** for privacy compliance
- **High-performance infrastructure** for email delivery
- **Comprehensive error handling** with detailed API responses

### Authentication Flow

1. Automatic OAuth 2.0 token generation using credentials
2. Intelligent token refresh to minimize re-authentication
3. Secure token storage with proper expiry handling
4. Fallback to password authentication when needed

### Data Validation

- **Email format validation** before API calls
- **Date format validation** (YYYY-MM-DD)
- **Parameter type checking** and sanitization
- **API limit enforcement** (e.g., max 50 campaigns per page)

## 🔄 Migration from v1.0.0

### What's New in v1.1.0

✅ **Fixed API Compliance Issues:**
- Campaign data structure now matches official API
- Consistent parameter handling across all operations
- Proper error message propagation from API

✅ **Enhanced Security:**
- OAuth 2.0 refresh token support
- Better token management and rotation
- Input validation to prevent common errors

✅ **Expanded Functionality:**
- 20+ new tools for complete API coverage
- Template management system
- Automation workflow control
- Advanced analytics suite

### Migration Steps

1. **Backup current version** (optional):
```bash
cp -r cakemail-mcp-server cakemail-mcp-server-backup
```

2. **Update source files** with new versions

3. **Rebuild the project**:
```bash
npm run rebuild
```

4. **Test functionality**:
```bash
npm run test
```

5. **No configuration changes needed** - all existing integrations continue to work

### Backward Compatibility

- ✅ All existing tools maintain the same interface
- ✅ No Claude Desktop configuration changes required
- ✅ Same authentication requirements
- ✅ Enhanced but compatible response formats

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors:**
- Verify Cakemail username and password
- Ensure API access is enabled on your account
- Check environment variable names

**Build Errors:**
```bash
npm run clean && npm run rebuild
```

**Tool Discovery Issues:**
```bash
npm run inspector
# Check that all tools are listed correctly
```

**API Connectivity:**
```bash
# Test health check in Claude Desktop
"Check my Cakemail API connection"
```

### Debug Mode

Enable detailed logging:

```bash
DEBUG=mcp:* npm start
```

### Getting Help

1. **Check the health status**: Use `cakemail_health_check` tool
2. **Review error messages**: API errors now include detailed descriptions
3. **Test with MCP Inspector**: Use `npm run inspector` for debugging
4. **Check API limits**: Ensure you're within rate limits and pagination bounds

## 📚 Documentation

- **API Reference**: https://cakemail.dev
- **MCP Protocol**: https://github.com/modelcontextprotocol
- **Migration Guide**: See CHANGELOG.md for detailed migration instructions

## 🔐 Security

- **OAuth 2.0** authentication with automatic token refresh
- **Input validation** to prevent injection attacks
- **Secure credential storage** using environment variables
- **Canadian data hosting** with privacy law compliance
- **HTTPS-only** API communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Support

For Cakemail API questions: https://cakemail.dev  
For MCP protocol questions: https://github.com/modelcontextprotocol  
For issues with this server: https://github.com/zoyth/cakemail-mcp-server/issues

## 🎉 Acknowledgments

- **Cakemail Team** for providing comprehensive API documentation
- **Anthropic** for the Model Context Protocol
- **Community Contributors** for feedback and improvements

---

**Ready to enhance your email marketing with AI?** Get started with the Cakemail MCP Server today! 🚀
