export declare const reportTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            campaign_id: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            start_time?: never;
            end_time?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            interval?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
            description?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            campaign_id: {
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
            page: {
                type: string;
                description: string;
            };
            per_page: {
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
            interval?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
            description?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
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
            interval: {
                type: string;
                enum: string[];
                description: string;
            };
            campaign_id?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
            description?: never;
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
            campaign_id?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
            description?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            account_id: {
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
            campaign_id?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            interval?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
            description?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            workflow_id: {
                type: string;
                description: string;
            };
            action_id: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            campaign_id?: never;
            start_time?: never;
            end_time?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            interval?: never;
            list_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
            description?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            account_id: {
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
            status: {
                type: string;
                description: string;
            };
            progress: {
                type: string;
                description: string;
            };
            campaign_id?: never;
            start_time?: never;
            end_time?: never;
            sort?: never;
            order?: never;
            interval?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
            description?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            campaign_ids: {
                type: string;
                items: {
                    type: string;
                };
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
            format: {
                type: string;
                enum: string[];
                description: string;
            };
            fields: {
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
            campaign_id?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            interval?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            export_id?: never;
            description?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            export_id: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            campaign_id?: never;
            start_time?: never;
            end_time?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            interval?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            description?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            account_id: {
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
            campaign_id?: never;
            start_time?: never;
            end_time?: never;
            sort?: never;
            order?: never;
            interval?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
            description?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            description: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            campaign_id?: never;
            start_time?: never;
            end_time?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            interval?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            campaign_id: {
                type: string;
                description: string;
            };
            account_id?: never;
            start_time?: never;
            end_time?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            interval?: never;
            list_id?: never;
            workflow_id?: never;
            action_id?: never;
            status?: never;
            progress?: never;
            campaign_ids?: never;
            format?: never;
            fields?: never;
            export_id?: never;
            description?: never;
        };
        required: never[];
    };
})[];
//# sourceMappingURL=report-tools.d.ts.map