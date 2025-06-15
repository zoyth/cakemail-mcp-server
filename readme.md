# Cakemail MCP Server

A Model Context Protocol (MCP) server for integrating with the Cakemail API. This server provides tools for email marketing campaigns, contact management, transactional emails, and analytics through the Cakemail platform.

## Features

### Campaign Management
- ✅ Create email campaigns
- ✅ List campaigns with pagination
- ✅ Send campaigns
- ✅ Get campaign analytics

### Contact Management
- ✅ Create contacts with custom fields
- ✅ List contacts by list ID
- ✅ Update contact information
- ✅ Contact segmentation support

### Transactional Email
- ✅ Send individual transactional emails
- ✅ Template support
- ✅ HTML and plain text content
- ✅ SMTP relay capabilities

### List Management
- ✅ Create contact lists
- ✅ List management with pagination
- ✅ Multi-language support

### Sender Management
- ✅ Create verified senders
- ✅ List all senders
- ✅ Sender authentication support

### Analytics
- ✅ Campaign performance metrics
- ✅ Transactional email analytics
- ✅ Delivery monitoring

## Prerequisites

- **Node.js** 20 or higher
- **Cakemail account** with API access
- **Claude Desktop** or another MCP-compatible client

## Installation

1. **Clone or create the project directory:**
```bash
mkdir cakemail-mcp-server
cd cakemail-mcp-server
```

2. **Initialize the project:**
```bash
npm init -y
```

3. **Install dependencies:**
```bash
npm install @modelcontextprotocol/sdk node-fetch zod
npm install -D @types/node typescript
```

4. **Copy the source files** from the provided implementation into the `src/` directory.

5. **Create the configuration files** (package.json, tsconfig.json) as shown in the configuration artifact.

6. **Build the project:**
```bash
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file in the project root (or configure environment variables in your MCP client):

```env
CAKEMAIL_USERNAME=your-email@example.com
CAKEMAIL_PASSWORD=your-password
CAKEMAIL_BASE_URL=https://api.cakemail.dev
```

### Claude Desktop Setup

Add the server to your Claude Desktop configuration file (`claude_desktop_config.json`):

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "cakemail": {
      "command": "node",
      "args": ["/absolute/path/to/your/cakemail-mcp-server/build/index.js"],
      "env": {
        "CAKEMAIL_USERNAME": "your-email@example.com",
        "CAKEMAIL_PASSWORD": "your-password"
      }
    }
  }
}
```

## Usage

### Testing with MCP Inspector

Before connecting to Claude Desktop, test your server with the MCP Inspector:

```bash
npm run inspector
```

This will start the inspector at `http://localhost:5173` where you can:
- View available tools
- Test tool calls interactively
- Debug connection issues

### Available Tools

#### Campaign Tools
- `cakemail_create_campaign` - Create a new email campaign
- `cakemail_get_campaigns` - List campaigns with pagination
- `cakemail_send_campaign` - Send a campaign to recipients
- `cakemail_get_campaign_analytics` - Get campaign performance metrics

#### Contact Tools
- `cakemail_create_contact` - Add new contacts to lists
- `cakemail_get_contacts` - List contacts with filtering options

#### Transactional Email
- `cakemail_send_transactional_email` - Send individual emails

#### List Management
- `cakemail_create_list` - Create new contact lists
- `cakemail_get_lists` - List all contact lists

#### Sender Management
- `cakemail_create_sender` - Create verified sender identities
- `cakemail_get_senders` - List all senders

### Example Usage in Claude

Once connected to Claude Desktop, you can use natural language to interact with Cakemail:

**Creating a campaign:**
```
"Create a new email campaign called 'Welcome Series' with the subject 'Welcome to our newsletter!' and send it to my main contact list"
```

**Sending transactional emails:**
```
"Send a welcome email to john@example.com using my verified sender with the subject 'Thank you for signing up'"
```

**Managing contacts:**
```
"Add a new contact with email sara@example.com to my newsletter list"
```

**Analytics:**
```
"Show me the performance metrics for my latest campaign"
```

## API Integration Details

This MCP server integrates with the Cakemail Next-gen API, which features:

- **OAuth 2.0 authentication** for enhanced security
- **OpenAPI specification** compliance
- **RESTful API design** with CORS support
- **Canadian data hosting** for privacy compliance
- **High-performance infrastructure** for email delivery

### Authentication Flow

1. The server automatically handles OAuth 2.0 token generation using your credentials
2. Tokens are automatically refreshed when they expire
3. All API calls include proper authentication headers

### Error Handling

The server includes comprehensive error handling for:
- Authentication failures
- API rate limiting
- Network connectivity issues
- Invalid parameters
- Server errors

## Development

### Project Structure

```
src/
├── index.ts           # Main server entry point with MCP setup
├── cakemail-api.ts    # Cakemail API client with authentication
└── tools/
    └── index.ts       # Tool definitions and implementations
```

### Adding New Tools

To add new tools, extend the `initializeCakemailTools` function in `src/tools/index.ts`:

```typescript
server.tool(
  'cakemail_your_new_tool',
  {
    // Define parameters using Zod schemas
    param1: z.string().describe('Parameter description'),
    param2: z.number().optional().describe('Optional parameter')
  },
  async ({ param1, param2 }) => {
    try {
      // Implement your tool logic here
      const result = await api.yourNewMethod(param1, param2);
      return {
        content: [{
          type: 'text',
          text: `Success: ${JSON.stringify(result, null, 2)}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }]
      };
    }
  }
);
```

### Extending the API Client

Add new methods to the `CakemailAPI` class in `src/cakemail-api.ts`:

```typescript
async yourNewMethod(param: string) {
  return this.makeRequest(`/your-endpoint/${param}`, {
    method: 'POST',
    body: JSON.stringify({ data: param })
  });
}
```

## Security Considerations

1. **Credentials Management:** Never commit credentials to version control
2. **Token Security:** Tokens are automatically managed and expire appropriately
3. **API Rate Limiting:** The server respects Cakemail's rate limits
4. **HTTPS Only:** All API calls use HTTPS encryption
5. **Input Validation:** All tool parameters are validated using Zod schemas

## Troubleshooting

### Common Issues

**Authentication Errors:**
- Verify your Cakemail username and password
- Ensure your account has API access enabled
- Check for typos in environment variables

**Connection Issues:**
- Verify the server builds successfully (`npm run build`)
- Check the absolute path in your Claude Desktop configuration
- Restart Claude Desktop after configuration changes

**Tool Execution Errors:**
- Use the MCP Inspector to test tools individually
- Check server logs for detailed error messages
- Verify required parameters are provided

### Debug Mode

Enable detailed logging by setting the environment variable:
```bash
DEBUG=mcp:* npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For Cakemail API questions, visit: https://cakemail.dev
For MCP protocol questions, visit: https://github.com/modelcontextprotocol