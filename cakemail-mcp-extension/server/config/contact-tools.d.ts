export declare const contactTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            list_id: {
                type: string;
                description: string;
            };
            page: {
                type: string;
                description: string;
            };
            per_page: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                description: string;
                format?: never;
            };
            status: {
                type: string;
                description: string;
                enum?: never;
            };
            sort: {
                type: string;
                enum: string[];
                description: string;
            };
            order: {
                type: string;
                enum: string[];
                description: string;
            };
            with_count: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contact_id?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            list_id: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                format: string;
                description: string;
            };
            first_name: {
                type: string;
                description: string;
            };
            last_name: {
                type: string;
                description: string;
            };
            custom_fields: {
                type: string;
                description: string;
                additionalProperties: {
                    type: string;
                };
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            contact_id?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            contact_id: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            list_id?: never;
            page?: never;
            per_page?: never;
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            contact_id: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                format: string;
                description: string;
            };
            first_name: {
                type: string;
                description: string;
            };
            last_name: {
                type: string;
                description: string;
            };
            custom_fields: {
                type: string;
                description: string;
                additionalProperties: {
                    type: string;
                };
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            list_id?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            list_id: {
                type: string;
                description: string;
            };
            contact_id: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            list_id: {
                type: string;
                description: string;
            };
            contacts: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        email: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        first_name: {
                            type: string;
                            description: string;
                        };
                        last_name: {
                            type: string;
                            description: string;
                        };
                        custom_fields: {
                            type: string;
                            description: string;
                            additionalProperties: {
                                type: string;
                            };
                        };
                    };
                    required: string[];
                };
            };
            update_existing: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contact_id?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            list_id: {
                type: string;
                description: string;
            };
            contact_ids: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            tags: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contact_id?: never;
            contacts?: never;
            update_existing?: never;
            query?: never;
            filters?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            list_id: {
                type: string;
                description: string;
            };
            query: {
                type: string;
                description: string;
            };
            filters: {
                type: string;
                description: string;
                properties: {
                    status: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    tags: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                    created_after: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    created_before: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
            };
            page: {
                type: string;
                description: string;
            };
            per_page: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contact_id?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
        };
        required: string[];
    };
})[];
//# sourceMappingURL=contact-tools.d.ts.map