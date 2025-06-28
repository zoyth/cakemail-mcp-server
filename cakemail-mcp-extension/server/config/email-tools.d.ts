export declare const emailTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            email: {
                type: string;
                description: string;
                format: string;
            };
            sender_id: {
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
            template_id: {
                type: string;
                description: string;
            };
            list_id: {
                type: string;
                description: string;
            };
            email_type: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            email_id?: never;
            as_submitted?: never;
            tracking?: never;
            log_type?: never;
            iso_time?: never;
            page?: never;
            per_page?: never;
            start_time?: never;
            end_time?: never;
            tags?: never;
            providers?: never;
            sort?: never;
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
            email_id: {
                type: string;
                description: string;
                format: string;
            };
            email?: never;
            sender_id?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            template_id?: never;
            list_id?: never;
            email_type?: never;
            as_submitted?: never;
            tracking?: never;
            log_type?: never;
            iso_time?: never;
            page?: never;
            per_page?: never;
            start_time?: never;
            end_time?: never;
            tags?: never;
            providers?: never;
            sort?: never;
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
            email_id: {
                type: string;
                description: string;
                format: string;
            };
            as_submitted: {
                type: string;
                description: string;
                default: boolean;
            };
            tracking: {
                type: string;
                description: string;
                default: boolean;
            };
            email?: never;
            sender_id?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            template_id?: never;
            list_id?: never;
            email_type?: never;
            log_type?: never;
            iso_time?: never;
            page?: never;
            per_page?: never;
            start_time?: never;
            end_time?: never;
            tags?: never;
            providers?: never;
            sort?: never;
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
            log_type: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            email_id: {
                type: string;
                description: string;
                format: string;
            };
            iso_time: {
                type: string;
                description: string;
                default: boolean;
            };
            page: {
                type: string;
                minimum: number;
                description: string;
                default: number;
            };
            per_page: {
                type: string;
                minimum: number;
                maximum: number;
                description: string;
                default: number;
            };
            start_time: {
                type: string;
                description: string;
            };
            end_time: {
                type: string;
                description: string;
            };
            tags: {
                type: string;
                description: string;
            };
            providers: {
                type: string;
                description: string;
            };
            sort: {
                type: string;
                description: string;
                default: string;
            };
            email?: never;
            sender_id?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            template_id?: never;
            list_id?: never;
            email_type?: never;
            as_submitted?: never;
            tracking?: never;
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
            interval: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            iso_time: {
                type: string;
                description: string;
                default: boolean;
            };
            start_time: {
                type: string;
                description: string;
            };
            end_time: {
                type: string;
                description: string;
            };
            providers: {
                type: string;
                description: string;
            };
            tags: {
                type: string;
                description: string;
            };
            email?: never;
            sender_id?: never;
            subject?: never;
            html_content?: never;
            text_content?: never;
            template_id?: never;
            list_id?: never;
            email_type?: never;
            email_id?: never;
            as_submitted?: never;
            tracking?: never;
            log_type?: never;
            page?: never;
            per_page?: never;
            sort?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            email: {
                type: string;
                description: string;
                format: string;
            };
            sender_id: {
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
            template_id: {
                type: string;
                description: string;
            };
            list_id: {
                type: string;
                description: string;
            };
            email_type?: never;
            email_id?: never;
            as_submitted?: never;
            tracking?: never;
            log_type?: never;
            iso_time?: never;
            page?: never;
            per_page?: never;
            start_time?: never;
            end_time?: never;
            tags?: never;
            providers?: never;
            sort?: never;
            interval?: never;
        };
        required: string[];
    };
})[];
//# sourceMappingURL=email-tools.d.ts.map