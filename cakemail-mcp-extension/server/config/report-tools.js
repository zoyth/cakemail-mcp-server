export const reportTools = [
    // Campaign Analytics
    {
        name: 'cakemail_get_campaign_stats',
        description: 'Get detailed campaign performance statistics and analytics',
        inputSchema: {
            type: 'object',
            properties: {
                campaign_id: { type: 'string', description: 'Campaign ID to get stats for' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: ['campaign_id'],
        },
    },
    {
        name: 'cakemail_get_campaign_links_stats',
        description: 'Get campaign link click statistics and performance data',
        inputSchema: {
            type: 'object',
            properties: {
                campaign_id: { type: 'string', description: 'Campaign ID to get link stats for' },
                start_time: { type: 'number', description: 'Start time for the report (Unix timestamp)' },
                end_time: { type: 'number', description: 'End time for the report (Unix timestamp)' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
                page: { type: 'number', description: 'Page number (default: 1)' },
                per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
                sort: { type: 'string', enum: ['unique', 'total', 'link'], description: 'Sort field' },
                order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction' },
            },
            required: ['campaign_id'],
        },
    },
    // Email Statistics
    {
        name: 'cakemail_get_reports_email_stats',
        description: 'Get email statistics for transactional emails within a time range',
        inputSchema: {
            type: 'object',
            properties: {
                start_time: { type: 'number', description: 'Start time for the report (Unix timestamp)' },
                end_time: { type: 'number', description: 'End time for the report (Unix timestamp)' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
                interval: { type: 'string', enum: ['hour', 'day', 'week', 'month'], description: 'Time interval for aggregation' },
            },
            required: ['start_time', 'end_time'],
        },
    },
    // List Analytics
    {
        name: 'cakemail_get_reports_list_stats',
        description: 'Get performance statistics for a contact list',
        inputSchema: {
            type: 'object',
            properties: {
                list_id: { type: 'string', description: 'List ID to get stats for' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
                start_time: { type: 'number', description: 'Optional start time for the report (Unix timestamp)' },
                end_time: { type: 'number', description: 'Optional end time for the report (Unix timestamp)' },
                interval: { type: 'string', enum: ['hour', 'day', 'week', 'month'], description: 'Time interval for aggregation' },
            },
            required: ['list_id'],
        },
    },
    // Account Overview
    {
        name: 'cakemail_get_account_stats',
        description: 'Get account-wide statistics and performance metrics',
        inputSchema: {
            type: 'object',
            properties: {
                account_id: { type: 'string', description: 'Account ID to get stats for (optional, defaults to self)' },
                start_time: { type: 'number', description: 'Optional start time for the report (Unix timestamp)' },
                end_time: { type: 'number', description: 'Optional end time for the report (Unix timestamp)' },
            },
            required: [],
        },
    },
    // Workflow Analytics
    {
        name: 'cakemail_get_action_stats',
        description: 'Get statistics for a workflow action',
        inputSchema: {
            type: 'object',
            properties: {
                workflow_id: { type: 'string', description: 'Workflow ID' },
                action_id: { type: 'string', description: 'Action ID' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: ['workflow_id', 'action_id'],
        },
    },
    // Campaign Report Exports
    {
        name: 'cakemail_list_campaign_reports_exports',
        description: 'List available campaign report exports',
        inputSchema: {
            type: 'object',
            properties: {
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
                page: { type: 'number', description: 'Page number (default: 1)' },
                per_page: { type: 'number', description: 'Items per page (default: 50)' },
                status: { type: 'string', description: 'Filter by export status' },
                progress: { type: 'number', description: 'Filter by export progress' },
            },
            required: [],
        },
    },
    {
        name: 'cakemail_create_campaign_reports_export',
        description: 'Create a new campaign reports export for download',
        inputSchema: {
            type: 'object',
            properties: {
                campaign_ids: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of campaign IDs to include in the export'
                },
                start_time: { type: 'number', description: 'Optional start time for the report (Unix timestamp)' },
                end_time: { type: 'number', description: 'Optional end time for the report (Unix timestamp)' },
                format: { type: 'string', enum: ['csv', 'xlsx'], description: 'Export format (default: csv)' },
                fields: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Optional array of fields to include'
                },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: ['campaign_ids'],
        },
    },
    {
        name: 'cakemail_get_campaign_reports_export',
        description: 'Get status and details of a campaign reports export',
        inputSchema: {
            type: 'object',
            properties: {
                export_id: { type: 'string', description: 'Export ID to check status for' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: ['export_id'],
        },
    },
    {
        name: 'cakemail_download_campaign_reports_export',
        description: 'Get download URL for a completed campaign reports export',
        inputSchema: {
            type: 'object',
            properties: {
                export_id: { type: 'string', description: 'Export ID to download' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: ['export_id'],
        },
    },
    {
        name: 'cakemail_delete_campaign_reports_export',
        description: 'Delete a campaign reports export',
        inputSchema: {
            type: 'object',
            properties: {
                export_id: { type: 'string', description: 'Export ID to delete' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: ['export_id'],
        },
    },
    // Suppressed Emails Exports
    {
        name: 'cakemail_list_suppressed_emails_exports',
        description: 'List available suppressed emails exports',
        inputSchema: {
            type: 'object',
            properties: {
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
                page: { type: 'number', description: 'Page number (default: 1)' },
                per_page: { type: 'number', description: 'Items per page (default: 50)' },
            },
            required: [],
        },
    },
    {
        name: 'cakemail_create_suppressed_emails_export',
        description: 'Create a new suppressed emails export for download',
        inputSchema: {
            type: 'object',
            properties: {
                description: { type: 'string', description: 'Optional description for the export' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: [],
        },
    },
    {
        name: 'cakemail_get_suppressed_emails_export',
        description: 'Get status and details of a suppressed emails export',
        inputSchema: {
            type: 'object',
            properties: {
                export_id: { type: 'string', description: 'Export ID to check status for' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: ['export_id'],
        },
    },
    {
        name: 'cakemail_download_suppressed_emails_export',
        description: 'Get download URL for a completed suppressed emails export',
        inputSchema: {
            type: 'object',
            properties: {
                export_id: { type: 'string', description: 'Export ID to download' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: ['export_id'],
        },
    },
    {
        name: 'cakemail_delete_suppressed_emails_export',
        description: 'Delete a suppressed emails export',
        inputSchema: {
            type: 'object',
            properties: {
                export_id: { type: 'string', description: 'Export ID to delete' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
            },
            required: ['export_id'],
        },
    },
    // Debug
    {
        name: 'cakemail_debug_reports_access',
        description: 'Debug reports API access and test endpoint availability',
        inputSchema: {
            type: 'object',
            properties: {
                campaign_id: { type: 'string', description: 'Optional campaign ID to test with' },
            },
            required: [],
        },
    },
];
//# sourceMappingURL=report-tools.js.map