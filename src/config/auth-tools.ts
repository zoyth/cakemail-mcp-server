export const authTools = [
  {
    name: 'cakemail_get_token_status',
    description: 'Get current authentication token status and expiry information',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'cakemail_refresh_token',
    description: 'Manually refresh the authentication token',
    inputSchema: {
      type: 'object',
      properties: {
        force: {
          type: 'boolean',
          description: 'Force token refresh even if current token is still valid',
          default: false
        }
      },
      required: [],
    },
  },
  {
    name: 'cakemail_validate_token',
    description: 'Validate current token by making a test API call',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'cakemail_get_token_scopes',
    description: 'Get the scopes and permissions for the current token',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  }
];
