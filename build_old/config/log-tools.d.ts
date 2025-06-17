export declare const logTools: {
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
            page: {
                type: string;
                description: string;
            };
            per_page: {
                type: string;
                description: string;
            };
            with_count: {
                type: string;
                description: string;
            };
            sort: {
                type: string;
                description: string;
            };
            order: {
                type: string;
                enum: string[];
                description: string;
            };
            cursor: {
                type: string;
                description: string;
            };
            filter: {
                type: string;
                description: string;
            };
            type: {
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
        };
        required: string[];
    };
}[];
//# sourceMappingURL=log-tools.d.ts.map