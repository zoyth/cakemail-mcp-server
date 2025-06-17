export const senderTools = [
    {
        name: 'cakemail_get_senders',
        description: 'Get list of verified senders',
        inputSchema: {
            type: 'object',
            properties: {},
            required: [],
        },
    },
    {
        name: 'cakemail_create_sender',
        description: 'Create a new sender',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Sender name' },
                email: { type: 'string', description: 'Sender email address' },
                language: { type: 'string', description: 'Sender language (e.g., en_US)' },
            },
            required: ['name', 'email'],
        },
    },
    {
        name: 'cakemail_get_sender',
        description: 'Get details of a specific sender',
        inputSchema: {
            type: 'object',
            properties: {
                sender_id: { type: 'string', description: 'Sender ID to retrieve' },
            },
            required: ['sender_id'],
        },
    },
    {
        name: 'cakemail_update_sender',
        description: 'Update an existing sender',
        inputSchema: {
            type: 'object',
            properties: {
                sender_id: { type: 'string', description: 'Sender ID to update' },
                name: { type: 'string', description: 'Sender name' },
                email: { type: 'string', description: 'Sender email address' },
                language: { type: 'string', description: 'Sender language' },
            },
            required: ['sender_id'],
        },
    },
    {
        name: 'cakemail_delete_sender',
        description: 'Delete a sender',
        inputSchema: {
            type: 'object',
            properties: {
                sender_id: { type: 'string', description: 'Sender ID to delete' },
            },
            required: ['sender_id'],
        },
    }
];
//# sourceMappingURL=sender-tools.js.map