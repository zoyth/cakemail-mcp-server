export declare const subAccountTools: ({
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
                enum: string[];
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            recursive: {
                type: string;
                description: string;
            };
            partner_account_id: {
                type: string;
                description: string;
            };
            email?: never;
            password?: never;
            company?: never;
            language?: never;
            timezone?: never;
            country?: never;
            phone?: never;
            website?: never;
            description?: never;
            skip_verification?: never;
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
            email: {
                type: string;
                description: string;
            };
            password: {
                type: string;
                description: string;
            };
            company: {
                type: string;
                description: string;
            };
            language: {
                type: string;
                description: string;
            };
            timezone: {
                type: string;
                description: string;
            };
            country: {
                type: string;
                description: string;
            };
            phone: {
                type: string;
                description: string;
            };
            website: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            partner_account_id: {
                type: string;
                description: string;
            };
            skip_verification: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            recursive?: never;
        };
        required: string[];
    };
})[];
//# sourceMappingURL=sub-account-tools.d.ts.map