export const reportTools = [
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
    // ... other report tools
];
//# sourceMappingURL=report-tools.js.map