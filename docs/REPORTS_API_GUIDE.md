# Reports and Analytics Documentation

This document provides comprehensive information about the Reports and Analytics functionality in the Cakemail MCP Server v1.5.0.

## Overview

The Reports API integration provides detailed analytics and reporting capabilities for your Cakemail campaigns, lists, and account performance. All reports data is retrieved in real-time from the Cakemail platform.

## Available Tools

### Campaign Reports

#### `cakemail_get_campaign_stats`
Get detailed performance statistics for a specific campaign.

**Parameters:**
- `campaign_id` (required): Campaign ID to analyze
- `account_id` (optional): Account ID for scoped access

**Returns:**
- Sent, delivered, opens, clicks counts
- Bounce, unsubscribe, spam report metrics
- Calculated rates (open, click, bounce, unsubscribe)

**Example Usage:**
```
"Get performance statistics for campaign 12345"
```

#### `cakemail_get_campaign_links_stats`
Analyze link click performance within a campaign.

**Parameters:**
- `campaign_id` (required): Campaign ID to analyze
- `start_time` (optional): Unix timestamp for start date
- `end_time` (optional): Unix timestamp for end date
- `account_id` (optional): Account ID for scoped access
- `page`, `per_page`: Pagination options
- `sort`: Sort by 'unique', 'total', or 'link'
- `order`: 'asc' or 'desc'

**Returns:**
- List of all links in the campaign
- Click counts (total and unique) per link
- Link performance ranking

**Example Usage:**
```
"Show me link click statistics for campaign 12345 for the last 7 days"
```

#### `cakemail_get_campaign_performance_summary`
Get a comprehensive performance overview combining campaign stats and link data.

**Parameters:**
- `campaign_id` (required): Campaign ID to analyze
- `account_id` (optional): Account ID for scoped access

**Returns:**
- Complete campaign metrics
- Top-performing links summary
- Generated timestamp

**Example Usage:**
```
"Get a complete performance summary for campaign 12345"
```

### Account & List Reports

#### `cakemail_get_account_stats`
Get account-wide performance statistics.

**Parameters:**
- `account_id` (optional): Specific account ID (omit for self)
- `start_time` (optional): Unix timestamp for start date
- `end_time` (optional): Unix timestamp for end date

**Returns:**
- Total campaigns and emails sent
- Average performance rates
- List and contact statistics

**Example Usage:**
```
"Show me my account performance for the last 30 days"
```

#### `cakemail_get_account_performance_overview`
Get a formatted account performance overview.

**Parameters:**
- `account_id` (optional): Account ID (omit for self)
- `start_time` (optional): Unix timestamp for start date  
- `end_time` (optional): Unix timestamp for end date

**Returns:**
- Formatted account summary
- Performance trends
- Key metrics highlighting

**Example Usage:**
```
"Get my account performance overview for Q4 2024"
```

#### `cakemail_get_list_stats`
Get contact list performance and growth metrics.

**Parameters:**
- `list_id` (required): List ID to analyze
- `account_id` (optional): Account ID for scoped access

**Returns:**
- Total and active contact counts
- Subscription status breakdown
- Growth and churn rates

**Example Usage:**
```
"Show me statistics for contact list 456"
```

### Email Reports

#### `cakemail_get_email_stats`
Get transactional email statistics for a time period.

**Parameters:**
- `start_time` (required): Unix timestamp for start date
- `end_time` (required): Unix timestamp for end date
- `account_id` (optional): Account ID for scoped access

**Returns:**
- Total emails sent and delivered
- Opens, clicks, bounces, complaints
- Performance rates

**Example Usage:**
```
"Get transactional email stats for the last week"
```

### Export Management

#### `cakemail_list_campaign_reports_exports`
List all campaign report exports with filtering options.

**Parameters:**
- `account_id` (optional): Account ID for scoped access
- `page`, `per_page`: Pagination options
- `status`: Filter by export status
- `progress`: Filter by export progress

**Returns:**
- List of all exports
- Export status and progress
- Creation and update timestamps

#### `cakemail_create_campaign_reports_export`
Create a new campaign reports export for download.

**Parameters:**
- `campaign_ids` (required): Array of campaign IDs to export
- `format` (optional): 'csv' or 'xlsx' (default: csv)
- `description` (optional): Description for the export
- `account_id` (optional): Account ID for scoped access

**Returns:**
- Export ID and status
- Progress indicator
- Estimated completion time

**Example Usage:**
```
"Create an Excel export for campaigns 123, 456, and 789"
```

#### `cakemail_get_campaign_reports_export`
Check the status of a campaign reports export.

**Parameters:**
- `export_id` (required): Export ID to check
- `account_id` (optional): Account ID for scoped access

**Returns:**
- Current export status
- Progress percentage
- Download availability

#### `cakemail_download_campaign_reports_export`
Get download URL for a completed export.

**Parameters:**
- `export_id` (required): Export ID to download
- `account_id` (optional): Account ID for scoped access

**Returns:**
- Download URL
- File size information
- Expiration time

#### `cakemail_delete_campaign_reports_export`
Delete a campaign reports export.

**Parameters:**
- `export_id` (required): Export ID to delete
- `account_id` (optional): Account ID for scoped access

**Returns:**
- Deletion confirmation
- Cleanup status

### Debug Tools

#### `cakemail_debug_reports_access`
Test and debug reports API access.

**Parameters:**
- `campaign_id` (optional): Campaign ID to test specific access

**Returns:**
- API access test results
- Available endpoints status
- Sample data availability

**Example Usage:**
```
"Debug my reports API access and test with campaign 12345"
```

## Common Use Cases

### Campaign Performance Analysis
```
1. "Get performance statistics for my latest campaign"
2. "Show me which links performed best in campaign 12345"
3. "Create a performance summary for campaign 67890"
```

### Account Monitoring
```
1. "Show me my account performance for the last month"
2. "Get statistics for my newsletter list"
3. "What's my transactional email performance this week?"
```

### Report Generation
```
1. "Create a CSV export for campaigns 100, 200, and 300"
2. "Check the status of export abc123"
3. "Download the completed export xyz789"
```

### Performance Optimization
```
1. "Which campaigns have the highest open rates?"
2. "Show me my worst performing links"
3. "What's my average click rate across all campaigns?"
```

## Time Range Formats

When specifying time ranges, use Unix timestamps:

- **Last 7 days**: Use current timestamp minus 604800 seconds
- **Last 30 days**: Use current timestamp minus 2592000 seconds
- **Custom range**: Calculate specific start and end timestamps

**Helper for timestamp conversion:**
```javascript
// Last 30 days
const thirtyDaysAgo = Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000);
const now = Math.floor(Date.now() / 1000);
```

## Error Handling

The reports API includes comprehensive error handling:

- **Authentication errors**: Clear guidance on credential issues
- **Not found errors**: Helpful messages for invalid IDs
- **Rate limiting**: Automatic retry with exponential backoff
- **Validation errors**: Detailed field-specific error messages

## Export Workflow

1. **Create Export**: Use `cakemail_create_campaign_reports_export`
2. **Monitor Progress**: Use `cakemail_get_campaign_reports_export`
3. **Download**: Use `cakemail_download_campaign_reports_export` when ready
4. **Cleanup**: Use `cakemail_delete_campaign_reports_export` when done

## Performance Tips

- Use specific date ranges to limit data volume
- Consider pagination for large result sets
- Cache frequently accessed reports
- Delete old exports to save storage space

## API Limitations

- Export files expire after a certain time
- Large exports may take time to process
- Rate limits apply to all endpoints
- Some metrics require minimum data thresholds

## Troubleshooting

### Common Issues

1. **"Campaign not found"**: Verify campaign ID exists and you have access
2. **"Export failed"**: Check campaign IDs and account permissions
3. **"No data available"**: Ensure campaigns have been sent and have activity
4. **Rate limit errors**: Wait and retry, the system handles this automatically

### Debug Steps

1. Use `cakemail_debug_reports_access` to test API connectivity
2. Verify campaign IDs with `cakemail_get_campaign`
3. Check account access with `cakemail_get_self_account`
4. Test with a known working campaign ID

For additional support, the MCP server includes detailed error messages and automatic retry logic for temporary failures.
