# List Management API

The Cakemail MCP Server provides comprehensive list management functionality for managing contact lists, including creation, updating, archiving, and performance analytics.

## Available Functions

### `cakemail_list_lists`
List all contact lists with filtering, sorting and pagination.

**Parameters:**
- `page` (number, optional): Page number (default: 1)
- `per_page` (number, optional): Items per page (default: 50, max: 100)
- `status` (string, optional): Filter by list status
- `name` (string, optional): Filter by list name
- `sort` (string, optional): Sort field - `name`, `created_on`, `updated_on`, `status` (default: created_on)
- `order` (string, optional): Sort direction - `asc`, `desc` (default: desc)
- `with_count` (boolean, optional): Include total count in response
- `account_id` (number, optional): Account ID for scoped access

**Example:**
```javascript
await cakemail_list_lists({
  page: 1,
  per_page: 20,
  status: 'active',
  sort: 'name',
  order: 'asc'
});
```

### `cakemail_create_list`
Create a new contact list.

**Parameters:**
- `name` (string, required): List name
- `default_sender` (object, required): Default sender configuration
  - `name` (string, required): Sender name
  - `email` (string, required): Sender email address
- `language` (string, optional): List language (default: en_US)
- `redirections` (object, optional): Redirection URLs for various actions
  - `subscribe` (string, optional): Subscription confirmation URL
  - `unsubscribe` (string, optional): Unsubscription confirmation URL
  - `update` (string, optional): Profile update confirmation URL
- `webhook` (object, optional): Webhook configuration
  - `url` (string, optional): Webhook URL
  - `actions` (array, optional): List of actions to trigger webhook
- `account_id` (number, optional): Account ID for scoped access

**Example:**
```javascript
await cakemail_create_list({
  name: 'Newsletter Subscribers',
  default_sender: {
    name: 'Marketing Team',
    email: 'marketing@company.com'
  },
  language: 'en_US',
  redirections: {
    subscribe: 'https://company.com/welcome',
    unsubscribe: 'https://company.com/goodbye'
  },
  webhook: {
    url: 'https://company.com/webhooks/list-events',
    actions: ['subscribe', 'unsubscribe']
  }
});
```

### `cakemail_get_list`
Get details of a specific contact list.

**Parameters:**
- `list_id` (string, required): List ID to retrieve
- `account_id` (number, optional): Account ID for scoped access

**Example:**
```javascript
await cakemail_get_list({
  list_id: '12345'
});
```

### `cakemail_update_list`
Update an existing contact list.

**Parameters:**
- `list_id` (string, required): List ID to update
- `name` (string, optional): List name
- `default_sender` (object, optional): Default sender configuration
- `language` (string, optional): List language
- `redirections` (object, optional): Redirection URLs
- `webhook` (object, optional): Webhook configuration
- `account_id` (number, optional): Account ID for scoped access

**Example:**
```javascript
await cakemail_update_list({
  list_id: '12345',
  name: 'Updated Newsletter List',
  default_sender: {
    name: 'New Marketing Team',
    email: 'newmarketing@company.com'
  },
  language: 'fr_FR'
});
```

### `cakemail_delete_list`
Delete a contact list (permanent action).

**Parameters:**
- `list_id` (string, required): List ID to delete
- `account_id` (number, optional): Account ID for scoped access

**Example:**
```javascript
await cakemail_delete_list({
  list_id: '12345'
});
```

⚠️ **Warning:** This action is permanent and cannot be undone.

### `cakemail_archive_list`
Archive a contact list (remove from active list but keep data).

**Parameters:**
- `list_id` (string, required): List ID to archive
- `account_id` (number, optional): Account ID for scoped access

**Example:**
```javascript
await cakemail_archive_list({
  list_id: '12345'
});
```

### `cakemail_get_list_stats`
Get performance statistics for a contact list.

**Parameters:**
- `list_id` (string, required): List ID to get statistics for
- `start_time` (number, optional): Start time as Unix timestamp
- `end_time` (number, optional): End time as Unix timestamp
- `interval` (string, optional): Time interval for aggregation - `hour`, `day`, `week`, `month` (default: day)
- `account_id` (number, optional): Account ID for scoped access

**Example:**
```javascript
await cakemail_get_list_stats({
  list_id: '12345',
  start_time: 1672531200, // January 1, 2023
  end_time: 1704067200,   // January 1, 2024
  interval: 'month'
});
```

## Common Use Cases

### 1. Creating a Marketing List
```javascript
// Create a comprehensive marketing list with all features
const newList = await cakemail_create_list({
  name: 'Product Launch Subscribers',
  default_sender: {
    name: 'Product Team',
    email: 'product@company.com'
  },
  language: 'en_US',
  redirections: {
    subscribe: 'https://company.com/product-launch/welcome',
    unsubscribe: 'https://company.com/product-launch/unsubscribe',
    update: 'https://company.com/product-launch/preferences'
  },
  webhook: {
    url: 'https://company.com/api/webhooks/product-launch',
    actions: ['subscribe', 'unsubscribe', 'update']
  }
});
```

### 2. Managing Multiple Lists
```javascript
// List all active lists for review
const activeLists = await cakemail_list_lists({
  status: 'active',
  sort: 'created_on',
  order: 'desc',
  per_page: 50
});

// Archive old lists
for (const list of activeLists.data) {
  if (list.contacts_count === 0) {
    await cakemail_archive_list({ list_id: list.id });
  }
}
```

### 3. Performance Analysis
```javascript
// Get comprehensive stats for a list
const stats = await cakemail_get_list_stats({
  list_id: '12345',
  interval: 'week',
  start_time: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60), // Last week
  end_time: Math.floor(Date.now() / 1000)
});

// Analyze performance metrics
console.log(`Growth Rate: ${stats.data.growth_rate}%`);
console.log(`Open Rate: ${stats.data.open_rate}%`);
console.log(`Click Rate: ${stats.data.click_rate}%`);
```

## Error Handling

All list management functions include comprehensive error handling:

- **Validation Errors**: Missing required fields, invalid email formats
- **Authentication Errors**: Invalid credentials or permissions
- **API Errors**: Network issues, rate limiting, server errors
- **Business Logic Errors**: Attempting to delete non-empty lists, permission conflicts

### Common Error Responses

```javascript
// Missing required fields
{
  "content": [{
    "type": "text",
    "text": "❌ **Missing Required Fields**\n\nRequired: name, default_sender (with name and email)"
  }],
  "isError": true
}

// Invalid email format
{
  "content": [{
    "type": "text", 
    "text": "❌ **Invalid Default Sender**\n\ndefault_sender must include both name and email fields"
  }],
  "isError": true
}
```

## Response Format

All list management functions return responses in a consistent format:

```javascript
{
  "content": [{
    "type": "text",
    "text": "Formatted response with emojis and structured information"
  }]
}
```

The response text includes:
- ✅ Success indicators or ❌ error indicators
- 📋 Structured data with clear sections
- 📊 Performance metrics and statistics
- 🔄 Status updates and confirmations
- **Full Response** section with complete API response

## Integration Examples

### Agency Workflow
Managing multiple client lists:

```javascript
// Create client-specific lists
const clientLists = [
  { name: 'Client A - Newsletter', sender: 'clienta@agency.com' },
  { name: 'Client B - Promotions', sender: 'clientb@agency.com' },
  { name: 'Client C - Updates', sender: 'clientc@agency.com' }
];

for (const client of clientLists) {
  await cakemail_create_list({
    name: client.name,
    default_sender: {
      name: 'Agency Team',
      email: client.sender
    },
    language: 'en_US'
  });
}
```

### Performance Monitoring
Automated list health checks:

```javascript
// Monitor all lists performance
const allLists = await cakemail_list_lists({ per_page: 100 });

for (const list of allLists.data) {
  const stats = await cakemail_get_list_stats({
    list_id: list.id,
    interval: 'month'
  });
  
  // Alert if performance is declining
  if (stats.data.growth_rate < -10) {
    console.warn(`List ${list.name} has negative growth: ${stats.data.growth_rate}%`);
  }
  
  if (stats.data.unsubscribe_rate > 5) {
    console.warn(`List ${list.name} has high unsubscribe rate: ${stats.data.unsubscribe_rate}%`);
  }
}
```

### Data Migration
Moving from another email platform:

```javascript
// Recreate existing list structure
const existingLists = [
  {
    name: 'Main Newsletter',
    contacts: 15000,
    sender: { name: 'Marketing', email: 'marketing@company.com' }
  },
  {
    name: 'Product Updates', 
    contacts: 8500,
    sender: { name: 'Product Team', email: 'product@company.com' }
  }
];

for (const existingList of existingLists) {
  // Create the list first
  const newList = await cakemail_create_list({
    name: existingList.name,
    default_sender: existingList.sender,
    language: 'en_US',
    redirections: {
      subscribe: `https://company.com/lists/${existingList.name.toLowerCase().replace(' ', '-')}/welcome`,
      unsubscribe: `https://company.com/lists/${existingList.name.toLowerCase().replace(' ', '-')}/goodbye`
    }
  });
  
  console.log(`Created list: ${newList.data.name} (ID: ${newList.data.id})`);
  // Note: Contact import would be handled separately with contact management tools
}
```

## Best Practices

### 1. List Naming Convention
- Use descriptive, consistent naming: `[Brand] - [Purpose] - [Audience]`
- Examples: `Acme Corp - Newsletter - Customers`, `Acme Corp - Promotions - VIP Members`

### 2. Sender Configuration
- Use role-based email addresses: `marketing@company.com` vs personal emails
- Ensure sender email is verified and has good reputation
- Match sender name to your brand for recognition

### 3. Webhook Setup
- Configure webhooks for real-time event tracking
- Use HTTPS endpoints with proper authentication
- Handle webhook retries and failures gracefully

### 4. Performance Monitoring
- Regular stats review (weekly/monthly)
- Set up alerts for unusual metrics (high unsubscribe rates, negative growth)
- Benchmark against industry standards

### 5. List Lifecycle Management
- Archive inactive lists instead of deleting
- Regular cleanup of zero-contact lists
- Document list purposes and ownership

## API Endpoints Reference

The list management tools map to these Cakemail API endpoints:

- `GET /lists` - List all lists
- `POST /lists` - Create new list
- `GET /lists/{list_id}` - Get specific list
- `PATCH /lists/{list_id}` - Update list
- `DELETE /lists/{list_id}` - Delete list
- `POST /lists/{list_id}/archive` - Archive list
- `GET /lists/{list_id}/stats` - Get list statistics

## Troubleshooting

### Common Issues

1. **"Missing Required Fields" Error**
   - Ensure `name` and `default_sender` (with name and email) are provided
   - Check that email format is valid

2. **"Invalid Default Sender" Error**
   - Verify both `name` and `email` are included in `default_sender` object
   - Check email address format

3. **Permission Errors**
   - Verify account_id is correct for sub-account access
   - Check API credentials have necessary permissions

4. **List Not Found Errors**
   - Confirm list_id is correct and list exists
   - Check if list has been archived or deleted

5. **Rate Limiting**
   - Implement delays between requests
   - Use pagination for large data sets
   - Monitor API usage quotas

### Debug Mode
Enable detailed logging to troubleshoot issues:

```javascript
// Add debug information to requests
const debugList = await cakemail_get_list({
  list_id: '12345',
  account_id: 67890  // Explicit account context
});
console.log('Full response:', debugList);
```

---

*For more information about other Cakemail MCP Server features, see the main [README.md](../README.md) or other documentation files in the `docs/` directory.*
