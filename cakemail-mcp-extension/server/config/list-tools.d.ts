export declare const listTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            page: {
                type: string;
                description: string;
            };
            per_page: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                description: string;
            };
            name: {
                type: string;
                description: string;
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
            default_sender?: never;
            language?: never;
            redirections?: never;
            webhook?: never;
            list_id?: never;
            start_time?: never;
            end_time?: never;
            interval?: never;
        };
        required: never[];
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
            };
            default_sender: {
                type: string;
                description: string;
                properties: {
                    name: {
                        type: string;
                        description: string;
                    };
                    email: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
                required: string[];
            };
            language: {
                type: string;
                description: string;
                default: string;
            };
            redirections: {
                type: string;
                description: string;
                properties: {
                    subscribe: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    unsubscribe: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    update: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
            };
            webhook: {
                type: string;
                description: string;
                properties: {
                    url: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    actions: {
                        type: string;
                        items: {
                            type: string;
                            enum: string[];
                        };
                        description: string;
                    };
                };
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            list_id?: never;
            start_time?: never;
            end_time?: never;
            interval?: never;
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
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            default_sender?: never;
            language?: never;
            redirections?: never;
            webhook?: never;
            start_time?: never;
            end_time?: never;
            interval?: never;
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
            name: {
                type: string;
                description: string;
            };
            default_sender: {
                type: string;
                description: string;
                properties: {
                    name: {
                        type: string;
                        description: string;
                    };
                    email: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
                required?: never;
            };
            language: {
                type: string;
                description: string;
                default?: never;
            };
            redirections: {
                type: string;
                description: string;
                properties: {
                    subscribe: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    unsubscribe: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    update: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
            };
            webhook: {
                type: string;
                description: string;
                properties: {
                    url: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    actions: {
                        type: string;
                        items: {
                            type: string;
                            enum: string[];
                        };
                        description: string;
                    };
                };
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            start_time?: never;
            end_time?: never;
            interval?: never;
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
            start_time: {
                type: string;
                description: string;
            };
            end_time: {
                type: string;
                description: string;
            };
            interval: {
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
            status?: never;
            name?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            default_sender?: never;
            language?: never;
            redirections?: never;
            webhook?: never;
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
            start_time: {
                type: string;
                description: string;
            };
            end_time: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            default_sender?: never;
            language?: never;
            redirections?: never;
            webhook?: never;
            interval?: never;
        };
        required: string[];
    };
})[];
//# sourceMappingURL=list-tools.d.ts.map