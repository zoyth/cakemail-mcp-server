export declare const campaignTools: ({
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
            type: {
                type: string;
                description: string;
            };
            list_id: {
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
            count?: never;
            campaign_id?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            sender_id?: never;
            from_name?: never;
            reply_to?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            count: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            name?: never;
            type?: never;
            list_id?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            account_id?: never;
            campaign_id?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            sender_id?: never;
            from_name?: never;
            reply_to?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
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
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            type?: never;
            list_id?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            account_id?: never;
            count?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            sender_id?: never;
            from_name?: never;
            reply_to?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
        };
        required: string[];
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
            subject: {
                type: string;
                description: string;
            };
            html_content: {
                type: string;
                description: string;
            };
            text_content: {
                type: string;
                description: string;
            };
            list_id: {
                type: string;
                description: string;
            };
            sender_id: {
                type: string;
                description: string;
            };
            from_name: {
                type: string;
                description: string;
            };
            reply_to: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            type?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            account_id?: never;
            count?: never;
            campaign_id?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
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
            name: {
                type: string;
                description: string;
            };
            subject: {
                type: string;
                description: string;
            };
            html_content: {
                type: string;
                description: string;
            };
            text_content: {
                type: string;
                description: string;
            };
            from_name: {
                type: string;
                description: string;
            };
            reply_to: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            type?: never;
            list_id?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            account_id?: never;
            count?: never;
            sender_id?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
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
            contact_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            type?: never;
            list_id?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            account_id?: never;
            count?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            sender_id?: never;
            from_name?: never;
            reply_to?: never;
            emails?: never;
            scheduled_for?: never;
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
            emails: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            type?: never;
            list_id?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            account_id?: never;
            count?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            sender_id?: never;
            from_name?: never;
            reply_to?: never;
            contact_id?: never;
            scheduled_for?: never;
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
            scheduled_for: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            status?: never;
            name?: never;
            type?: never;
            list_id?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            account_id?: never;
            count?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            sender_id?: never;
            from_name?: never;
            reply_to?: never;
            contact_id?: never;
            emails?: never;
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
            status?: never;
            name?: never;
            type?: never;
            list_id?: never;
            sort?: never;
            order?: never;
            account_id?: never;
            count?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            sender_id?: never;
            from_name?: never;
            reply_to?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
        };
        required: string[];
    };
})[];
//# sourceMappingURL=campaign-tools.d.ts.map