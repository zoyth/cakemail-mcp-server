export const logTools = [
    {
        name: 'cakemail_get_campaign_logs',
        description: 'Get detailed campaign logs with intelligent event categorization and smart filtering',
        inputSchema: {
            type: 'object',
            properties: {
                campaign_id: { type: 'string', description: 'Campaign ID to get logs for' },
                account_id: { type: 'number', description: 'Optional account ID for scoped access' },
                page: { type: 'number', description: 'Page number for pagination (default: 1)' },
                per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
                with_count: { type: 'boolean', description: 'Include total count in response' },
                sort: { type: 'string', description: 'Sort field for results' },
                order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction' },
                cursor: { type: 'string', description: 'Pagination cursor for large result sets' },
                filter: { type: 'string', description: 'Smart filter using syntax: term==value;term2==value2' },
                type: { type: 'string', description: 'Filter by single log type' },
                start_time: { type: 'number', description: 'Start time for log filtering (Unix timestamp)' },
                end_time: { type: 'number', description: 'End time for log filtering (Unix timestamp)' },
            },
            required: ['campaign_id'],
        },
    },
    // ... other log tools
];
//# sourceMappingURL=log-tools.js.map