export const listTools = [
  {
    name: 'cakemail_list_lists',
    description: 'List all contact lists with pagination',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
        status: { type: 'string', description: 'Filter by list status' },
        name: { type: 'string', description: 'Filter by list name' },
        sort: { type: 'string', enum: ['name', 'created_on', 'updated_on', 'status'], description: 'Sort field (default: created_on)' },
        order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction (default: desc)' },
        with_count: { type: 'boolean', description: 'Include total count in response' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: [],
    },
  },
  {
    name: 'cakemail_create_list',
    description: 'Create a new contact list',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'List name' },
        default_sender: {
          type: 'object',
          description: 'Default sender for the list',
          properties: {
            name: { type: 'string', description: 'Sender name' },
            email: { type: 'string', format: 'email', description: 'Sender email address' }
          },
          required: ['name', 'email']
        },
        language: { type: 'string', description: 'List language (default: en_US)', default: 'en_US' },
        redirections: {
          type: 'object',
          description: 'Redirection URLs for various actions',
          properties: {
            subscribe: { type: 'string', format: 'uri', description: 'Subscription confirmation URL' },
            unsubscribe: { type: 'string', format: 'uri', description: 'Unsubscription confirmation URL' },
            update: { type: 'string', format: 'uri', description: 'Profile update confirmation URL' }
          }
        },
        webhook: {
          type: 'object',
          description: 'Webhook configuration for list events',
          properties: {
            url: { type: 'string', format: 'uri', description: 'Webhook URL' },
            actions: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['all', 'subscribe', 'unsubscribe', 'update', 'delete', 'spam', 'bounce']
              },
              description: 'List of actions to trigger webhook'
            }
          }
        },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['name', 'default_sender'],
    },
  },
  {
    name: 'cakemail_get_list',
    description: 'Get details of a specific contact list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: { type: 'string', description: 'List ID to retrieve' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['list_id'],
    },
  },
  {
    name: 'cakemail_update_list',
    description: 'Update an existing contact list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: { type: 'string', description: 'List ID to update' },
        name: { type: 'string', description: 'List name' },
        default_sender: {
          type: 'object',
          description: 'Default sender for the list',
          properties: {
            name: { type: 'string', description: 'Sender name' },
            email: { type: 'string', format: 'email', description: 'Sender email address' }
          }
        },
        language: { type: 'string', description: 'List language' },
        redirections: {
          type: 'object',
          description: 'Redirection URLs for various actions',
          properties: {
            subscribe: { type: 'string', format: 'uri', description: 'Subscription confirmation URL' },
            unsubscribe: { type: 'string', format: 'uri', description: 'Unsubscription confirmation URL' },
            update: { type: 'string', format: 'uri', description: 'Profile update confirmation URL' }
          }
        },
        webhook: {
          type: 'object',
          description: 'Webhook configuration for list events',
          properties: {
            url: { type: 'string', format: 'uri', description: 'Webhook URL' },
            actions: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['all', 'subscribe', 'unsubscribe', 'update', 'delete', 'spam', 'bounce']
              },
              description: 'List of actions to trigger webhook'
            }
          }
        },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['list_id'],
    },
  },
  {
    name: 'cakemail_delete_list',
    description: 'Delete a contact list (permanent action)',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: { type: 'string', description: 'List ID to delete' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['list_id'],
    },
  },
  {
    name: 'cakemail_archive_list',
    description: 'Archive a contact list (remove from active list but keep data)',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: { type: 'string', description: 'List ID to archive' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['list_id'],
    },
  },
  {
    name: 'cakemail_get_list_stats',
    description: 'Get performance statistics for a contact list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: { type: 'string', description: 'List ID to get statistics for' },
        start_time: { type: 'number', description: 'Start time as Unix timestamp' },
        end_time: { type: 'number', description: 'End time as Unix timestamp' },
        interval: { 
          type: 'string', 
          enum: ['hour', 'day', 'week', 'month'], 
          description: 'Time interval for statistics aggregation (default: day)' 
        },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['list_id'],
    },
  },
  {
    name: 'cakemail_get_list_stats_time_series',
    description: 'Get time-series movement analysis for a contact list showing monthly trends, subscriber growth, unsubscribes, bounces, and engagement metrics over time',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: { type: 'string', description: 'List ID to analyze movements for' },
        start_time: { type: 'number', description: 'Start time as Unix timestamp (defaults to 12 months ago if not provided)' },
        end_time: { type: 'number', description: 'End time as Unix timestamp (defaults to now if not provided)' },
        interval: { 
          type: 'string', 
          enum: ['hour', 'day', 'week', 'month'], 
          description: 'Time interval for analysis (default: month for movement tracking)' 
        },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['list_id'],
    },
  },
  {
    name: 'cakemail_get_list_movement_logs',
    description: 'Analyze list activity logs to track monthly movements including subscribes, unsubscribes, bounces, spam reports, updates, and deletions. Provides detailed movement analysis based on actual log events.',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: { type: 'string', description: 'List ID to analyze movement logs for' },
        start_time: { type: 'number', description: 'Start time as Unix timestamp (defaults to 12 months ago if not provided)' },
        end_time: { type: 'number', description: 'End time as Unix timestamp (defaults to now if not provided)' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['list_id'],
    },
  },
];
