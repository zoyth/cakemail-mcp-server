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
        };
        required: string[];
    };
})[];
//# sourceMappingURL=report-tools.d.ts.map