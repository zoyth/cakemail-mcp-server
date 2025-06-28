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
                default?: never;
            };
            partner_account_id: {
                type: string;
                description: string;
            };
            with_count: {
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
            account_id?: never;
            verification_code?: never;
            migrate_owner?: never;
            format?: never;
            include_usage_stats?: never;
            include_contact_counts?: never;
            include_owner_details?: never;
            status_filter?: never;
            filename?: never;
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
                format?: never;
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
            with_count?: never;
            account_id?: never;
            verification_code?: never;
            migrate_owner?: never;
            format?: never;
            include_usage_stats?: never;
            include_contact_counts?: never;
            include_owner_details?: never;
            status_filter?: never;
            filename?: never;
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
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            recursive?: never;
            partner_account_id?: never;
            with_count?: never;
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
            verification_code?: never;
            migrate_owner?: never;
            format?: never;
            include_usage_stats?: never;
            include_contact_counts?: never;
            include_owner_details?: never;
            status_filter?: never;
            filename?: never;
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
            name: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                description: string;
                format?: never;
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
            page?: never;
            per_page?: never;
            status?: never;
            recursive?: never;
            partner_account_id?: never;
            with_count?: never;
            password?: never;
            skip_verification?: never;
            verification_code?: never;
            migrate_owner?: never;
            format?: never;
            include_usage_stats?: never;
            include_contact_counts?: never;
            include_owner_details?: never;
            status_filter?: never;
            filename?: never;
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
            verification_code: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                description: string;
                format?: never;
            };
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            recursive?: never;
            partner_account_id?: never;
            with_count?: never;
            password?: never;
            company?: never;
            language?: never;
            timezone?: never;
            country?: never;
            phone?: never;
            website?: never;
            description?: never;
            skip_verification?: never;
            migrate_owner?: never;
            format?: never;
            include_usage_stats?: never;
            include_contact_counts?: never;
            include_owner_details?: never;
            status_filter?: never;
            filename?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            email: {
                type: string;
                format: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            recursive?: never;
            partner_account_id?: never;
            with_count?: never;
            password?: never;
            company?: never;
            language?: never;
            timezone?: never;
            country?: never;
            phone?: never;
            website?: never;
            description?: never;
            skip_verification?: never;
            account_id?: never;
            verification_code?: never;
            migrate_owner?: never;
            format?: never;
            include_usage_stats?: never;
            include_contact_counts?: never;
            include_owner_details?: never;
            status_filter?: never;
            filename?: never;
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
            migrate_owner: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            recursive?: never;
            partner_account_id?: never;
            with_count?: never;
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
            verification_code?: never;
            format?: never;
            include_usage_stats?: never;
            include_contact_counts?: never;
            include_owner_details?: never;
            status_filter?: never;
            filename?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            format: {
                type: string;
                enum: string[];
                default: string;
                description: string;
            };
            include_usage_stats: {
                type: string;
                default: boolean;
                description: string;
            };
            include_contact_counts: {
                type: string;
                default: boolean;
                description: string;
            };
            include_owner_details: {
                type: string;
                default: boolean;
                description: string;
            };
            status_filter: {
                type: string;
                enum: string[];
                description: string;
            };
            recursive: {
                type: string;
                default: boolean;
                description: string;
            };
            partner_account_id: {
                type: string;
                description: string;
            };
            filename: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            with_count?: never;
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
            account_id?: never;
            verification_code?: never;
            migrate_owner?: never;
        };
        required: never[];
    };
})[];
//# sourceMappingURL=sub-account-tools.d.ts.map