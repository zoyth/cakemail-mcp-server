export const contactTools = [
    {
        name: 'cakemail_list_contacts',
        description: 'List all contacts with pagination and filtering',
        inputSchema: {
            type: 'object',
            properties: {
                list_id: { type: 'string', description: 'Filter by list ID' },
                page: { type: 'number', description: 'Page number (default: 1)' },
                per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
                email: { type: 'string', description: 'Filter by email address' },
                status: { type: 'string', description: 'Filter by contact status' },
                sort: { type: 'string', enum: ['email', 'created_on', 'updated_on'], description: 'Sort field' },
                order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction (default: desc)' },
                with_count: { type: 'boolean', description: 'Include total count in response' },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: [],
        },
    },
    {
        name: 'cakemail_create_contact',
        description: 'Create a new contact in a list',
        inputSchema: {
            type: 'object',
            properties: {
                list_id: { type: 'number', description: 'List ID to add contact to' },
                email: { type: 'string', format: 'email', description: 'Contact email address' },
                first_name: { type: 'string', description: 'Contact first name' },
                last_name: { type: 'string', description: 'Contact last name' },
                custom_fields: {
                    type: 'object',
                    description: 'Custom field values',
                    additionalProperties: { type: 'string' }
                },
                status: {
                    type: 'string',
                    enum: ['active', 'unsubscribed', 'bounced', 'deleted'],
                    description: 'Contact status (default: active)'
                },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: ['list_id', 'email'],
        },
    },
    {
        name: 'cakemail_get_contact',
        description: 'Get details of a specific contact',
        inputSchema: {
            type: 'object',
            properties: {
                contact_id: { type: 'string', description: 'Contact ID to retrieve' },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: ['contact_id'],
        },
    },
    {
        name: 'cakemail_update_contact',
        description: 'Update an existing contact',
        inputSchema: {
            type: 'object',
            properties: {
                contact_id: { type: 'string', description: 'Contact ID to update' },
                email: { type: 'string', format: 'email', description: 'Contact email address' },
                first_name: { type: 'string', description: 'Contact first name' },
                last_name: { type: 'string', description: 'Contact last name' },
                custom_fields: {
                    type: 'object',
                    description: 'Custom field values',
                    additionalProperties: { type: 'string' }
                },
                status: {
                    type: 'string',
                    enum: ['active', 'unsubscribed', 'bounced', 'deleted'],
                    description: 'Contact status'
                },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: ['contact_id'],
        },
    },
    {
        name: 'cakemail_delete_contact',
        description: 'Delete a contact (permanent action)',
        inputSchema: {
            type: 'object',
            properties: {
                contact_id: { type: 'string', description: 'Contact ID to delete' },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: ['contact_id'],
        },
    },
    {
        name: 'cakemail_unsubscribe_contact',
        description: 'Unsubscribe a contact from a list',
        inputSchema: {
            type: 'object',
            properties: {
                list_id: { type: 'string', description: 'List ID' },
                contact_id: { type: 'string', description: 'Contact ID to unsubscribe' },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: ['list_id', 'contact_id'],
        },
    },
    {
        name: 'cakemail_import_contacts',
        description: 'Import multiple contacts to a list',
        inputSchema: {
            type: 'object',
            properties: {
                list_id: { type: 'string', description: 'List ID to import contacts to' },
                contacts: {
                    type: 'array',
                    description: 'Array of contacts to import',
                    items: {
                        type: 'object',
                        properties: {
                            email: { type: 'string', format: 'email', description: 'Contact email address' },
                            first_name: { type: 'string', description: 'Contact first name' },
                            last_name: { type: 'string', description: 'Contact last name' },
                            custom_fields: {
                                type: 'object',
                                description: 'Custom field values',
                                additionalProperties: { type: 'string' }
                            }
                        },
                        required: ['email']
                    }
                },
                update_existing: {
                    type: 'boolean',
                    description: 'Update existing contacts if found (default: false)'
                },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: ['list_id', 'contacts'],
        },
    },
    {
        name: 'cakemail_tag_contacts',
        description: 'Add tags to multiple contacts',
        inputSchema: {
            type: 'object',
            properties: {
                list_id: { type: 'string', description: 'List ID' },
                contact_ids: {
                    type: 'array',
                    items: { type: 'number' },
                    description: 'Array of contact IDs to tag'
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Tags to add to contacts'
                },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: ['list_id', 'contact_ids', 'tags'],
        },
    },
    {
        name: 'cakemail_untag_contacts',
        description: 'Remove tags from multiple contacts',
        inputSchema: {
            type: 'object',
            properties: {
                list_id: { type: 'string', description: 'List ID' },
                contact_ids: {
                    type: 'array',
                    items: { type: 'number' },
                    description: 'Array of contact IDs to untag'
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Tags to remove from contacts'
                },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: ['list_id', 'contact_ids', 'tags'],
        },
    },
    {
        name: 'cakemail_search_contacts',
        description: 'Search contacts with advanced filtering',
        inputSchema: {
            type: 'object',
            properties: {
                list_id: { type: 'string', description: 'List ID to search within' },
                query: { type: 'string', description: 'Search query string' },
                filters: {
                    type: 'object',
                    description: 'Advanced filter options',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['active', 'unsubscribed', 'bounced', 'deleted'],
                            description: 'Filter by status'
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Filter by tags'
                        },
                        created_after: { type: 'string', format: 'date-time', description: 'Filter by creation date' },
                        created_before: { type: 'string', format: 'date-time', description: 'Filter by creation date' },
                    }
                },
                page: { type: 'number', description: 'Page number (default: 1)' },
                per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
                account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
            },
            required: ['list_id'],
        },
    },
];
//# sourceMappingURL=contact-tools.js.map