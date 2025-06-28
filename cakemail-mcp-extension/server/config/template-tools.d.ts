export declare const templateTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            page: {
                type: string;
                description: string;
                minimum: number;
            };
            per_page: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
            };
            with_count: {
                type: string;
                description: string;
            };
            filter: {
                type: string;
                description: string;
            };
            sort: {
                type: string;
                description: string;
                default: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            name?: never;
            description?: never;
            content?: never;
            tags?: never;
            template_id?: never;
            new_name?: never;
            new_description?: never;
        };
        required?: never;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            name: {
                type: string;
                description: string;
                minLength: number;
            };
            description: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
                properties: {
                    type: {
                        type: string;
                        description: string;
                        enum: string[];
                    };
                    subject: {
                        type: string;
                        description: string;
                    };
                    html: {
                        type: string;
                        description: string;
                        minLength: number;
                    };
                    text: {
                        type: string;
                        description: string;
                        minLength: number;
                    };
                    json: {
                        type: string;
                        description: string;
                    };
                };
                required: string[];
            };
            tags: {
                type: string;
                description: string;
                items: {
                    type: string;
                };
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            with_count?: never;
            filter?: never;
            sort?: never;
            template_id?: never;
            new_name?: never;
            new_description?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            template_id: {
                type: string[];
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            with_count?: never;
            filter?: never;
            sort?: never;
            name?: never;
            description?: never;
            content?: never;
            tags?: never;
            new_name?: never;
            new_description?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            template_id: {
                type: string[];
                description: string;
            };
            name: {
                type: string;
                description: string;
                minLength: number;
            };
            description: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
                properties: {
                    type: {
                        type: string;
                        description: string;
                        enum: string[];
                    };
                    subject: {
                        type: string;
                        description: string;
                    };
                    html: {
                        type: string;
                        description: string;
                        minLength: number;
                    };
                    text: {
                        type: string;
                        description: string;
                        minLength: number;
                    };
                    json: {
                        type: string;
                        description: string;
                    };
                };
                required?: never;
            };
            tags: {
                type: string;
                description: string;
                items: {
                    type: string;
                };
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            with_count?: never;
            filter?: never;
            sort?: never;
            new_name?: never;
            new_description?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            template_id: {
                type: string[];
                description: string;
            };
            new_name: {
                type: string;
                description: string;
                minLength: number;
            };
            new_description: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            with_count?: never;
            filter?: never;
            sort?: never;
            name?: never;
            description?: never;
            content?: never;
            tags?: never;
        };
        required: string[];
    };
})[];
//# sourceMappingURL=template-tools.d.ts.map