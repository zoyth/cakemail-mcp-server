import { healthTools } from './health-tools.js';
import { senderTools } from './sender-tools.js';
import { campaignTools } from './campaign-tools.js';
import { subAccountTools } from './sub-account-tools.js';
import { emailTools } from './email-tools.js';
import { accountTools } from './account-tools.js';
import { reportTools } from './report-tools.js';
import { logTools } from './log-tools.js';
export declare const allTools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {};
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
            language: {
                type: string;
                description: string;
            };
            sender_id?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            sender_id: {
                type: string;
                description: string;
            };
            name?: never;
            email?: never;
            language?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            sender_id: {
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
            };
            language: {
                type: string;
                description: string;
            };
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
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            to_email: {
                type: string;
                description: string;
                format: string;
            };
            to_name: {
                type: string;
                description: string;
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
            to_email?: never;
            to_name?: never;
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
            to_email?: never;
            to_name?: never;
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
            to_email: {
                type: string;
                description: string;
                format: string;
            };
            to_name: {
                type: string;
                description: string;
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
export { healthTools, senderTools, campaignTools, subAccountTools, emailTools, accountTools, reportTools, logTools };
//# sourceMappingURL=tools.d.ts.map