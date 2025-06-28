import { healthTools } from './health-tools.js';
import { authTools } from './auth-tools.js';
import { senderTools } from './sender-tools.js';
import { campaignTools } from './campaign-tools.js';
import { subAccountTools } from './sub-account-tools.js';
import { emailTools } from './email-tools.js';
import { accountTools } from './account-tools.js';
import { reportTools } from './report-tools.js';
import { logTools } from './log-tools.js';
import { listTools } from './list-tools.js';
import { templateTools } from './template-tools.js';
import { contactTools } from './contact-tools.js';
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
            account_id: {
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
            count?: never;
            audience?: never;
            tracking?: never;
            sender?: never;
            reply_to_email?: never;
            content?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
            title?: never;
            subject?: never;
            preheader?: never;
            backgroundColor?: never;
            contentAreaBackgroundColor?: never;
            width?: never;
            headerText?: never;
            contentSections?: never;
            footerText?: never;
            json_content?: never;
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
            audience: {
                type: string;
                properties: {
                    list_id: {
                        type: string;
                        description: string;
                    };
                    segment_id: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
                required: string[];
            };
            tracking: {
                type: string;
                properties: {
                    opens: {
                        type: string;
                        description: string;
                    };
                    clicks_html: {
                        type: string;
                        description: string;
                    };
                    clicks_text: {
                        type: string;
                        description: string;
                    };
                    additional_params: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
            };
            sender: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    name: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
                required: string[];
            };
            reply_to_email: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                properties: {
                    subject: {
                        type: string;
                        description: string;
                    };
                    html: {
                        type: string;
                        description: string;
                    };
                    text: {
                        type: string;
                        description: string;
                    };
                    json: {
                        type: string;
                        description: string;
                    };
                    type: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    encoding: {
                        type: string;
                        description: string;
                    };
                    template: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                        };
                        description: string;
                    };
                    blueprint: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                        };
                        description: string;
                    };
                    default_unsubscribe_link: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
            };
            account_id: {
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
            count?: never;
            campaign_id?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
            title?: never;
            subject?: never;
            preheader?: never;
            backgroundColor?: never;
            contentAreaBackgroundColor?: never;
            width?: never;
            headerText?: never;
            contentSections?: never;
            footerText?: never;
            json_content?: never;
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
            audience: {
                type: string;
                properties: {
                    list_id: {
                        type: string;
                        description: string;
                    };
                    segment_id: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
                required?: never;
            };
            tracking: {
                type: string;
                properties: {
                    opens: {
                        type: string;
                        description: string;
                    };
                    clicks_html: {
                        type: string;
                        description: string;
                    };
                    clicks_text: {
                        type: string;
                        description: string;
                    };
                    additional_params: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
            };
            sender: {
                type: string;
                properties: {
                    id: {
                        type: string;
                        description: string;
                    };
                    name: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
                required?: never;
            };
            reply_to_email: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                properties: {
                    subject: {
                        type: string;
                        description: string;
                    };
                    html: {
                        type: string;
                        description: string;
                    };
                    text: {
                        type: string;
                        description: string;
                    };
                    json: {
                        type: string;
                        description: string;
                    };
                    type: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    encoding: {
                        type: string;
                        description: string;
                    };
                    template: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                        };
                        description: string;
                    };
                    blueprint: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                                description: string;
                            };
                        };
                        description: string;
                    };
                    default_unsubscribe_link: {
                        type: string;
                        description: string;
                    };
                };
                description: string;
            };
            account_id: {
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
            count?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
            title?: never;
            subject?: never;
            preheader?: never;
            backgroundColor?: never;
            contentAreaBackgroundColor?: never;
            width?: never;
            headerText?: never;
            contentSections?: never;
            footerText?: never;
            json_content?: never;
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
            account_id: {
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
            count?: never;
            audience?: never;
            tracking?: never;
            sender?: never;
            reply_to_email?: never;
            content?: never;
            emails?: never;
            scheduled_for?: never;
            title?: never;
            subject?: never;
            preheader?: never;
            backgroundColor?: never;
            contentAreaBackgroundColor?: never;
            width?: never;
            headerText?: never;
            contentSections?: never;
            footerText?: never;
            json_content?: never;
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
            account_id: {
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
            count?: never;
            audience?: never;
            tracking?: never;
            sender?: never;
            reply_to_email?: never;
            content?: never;
            contact_id?: never;
            scheduled_for?: never;
            title?: never;
            subject?: never;
            preheader?: never;
            backgroundColor?: never;
            contentAreaBackgroundColor?: never;
            width?: never;
            headerText?: never;
            contentSections?: never;
            footerText?: never;
            json_content?: never;
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
            account_id: {
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
            count?: never;
            audience?: never;
            tracking?: never;
            sender?: never;
            reply_to_email?: never;
            content?: never;
            contact_id?: never;
            emails?: never;
            title?: never;
            subject?: never;
            preheader?: never;
            backgroundColor?: never;
            contentAreaBackgroundColor?: never;
            width?: never;
            headerText?: never;
            contentSections?: never;
            footerText?: never;
            json_content?: never;
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
            account_id: {
                type: string;
                description: string;
            };
            status?: never;
            name?: never;
            type?: never;
            list_id?: never;
            sort?: never;
            order?: never;
            count?: never;
            audience?: never;
            tracking?: never;
            sender?: never;
            reply_to_email?: never;
            content?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
            title?: never;
            subject?: never;
            preheader?: never;
            backgroundColor?: never;
            contentAreaBackgroundColor?: never;
            width?: never;
            headerText?: never;
            contentSections?: never;
            footerText?: never;
            json_content?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            json_content: {
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
            campaign_id?: never;
            audience?: never;
            tracking?: never;
            sender?: never;
            reply_to_email?: never;
            content?: never;
            contact_id?: never;
            emails?: never;
            scheduled_for?: never;
            title?: never;
            subject?: never;
            preheader?: never;
            backgroundColor?: never;
            contentAreaBackgroundColor?: never;
            width?: never;
            headerText?: never;
            contentSections?: never;
            footerText?: never;
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
} | {
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
            email: {
                type: string;
                format: string;
                description: string;
            };
            first_name: {
                type: string;
                description: string;
            };
            last_name: {
                type: string;
                description: string;
            };
            custom_fields: {
                type: string;
                description: string;
                additionalProperties: {
                    type: string;
                };
            };
            status: {
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
            sort?: never;
            order?: never;
            with_count?: never;
            contact_id?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            contact_id: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            list_id?: never;
            page?: never;
            per_page?: never;
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            contact_id: {
                type: string;
                description: string;
            };
            email: {
                type: string;
                format: string;
                description: string;
            };
            first_name: {
                type: string;
                description: string;
            };
            last_name: {
                type: string;
                description: string;
            };
            custom_fields: {
                type: string;
                description: string;
                additionalProperties: {
                    type: string;
                };
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            list_id?: never;
            page?: never;
            per_page?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
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
            contact_id: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
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
            contacts: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        email: {
                            type: string;
                            format: string;
                            description: string;
                        };
                        first_name: {
                            type: string;
                            description: string;
                        };
                        last_name: {
                            type: string;
                            description: string;
                        };
                        custom_fields: {
                            type: string;
                            description: string;
                            additionalProperties: {
                                type: string;
                            };
                        };
                    };
                    required: string[];
                };
            };
            update_existing: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            page?: never;
            per_page?: never;
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contact_id?: never;
            contact_ids?: never;
            tags?: never;
            query?: never;
            filters?: never;
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
            contact_ids: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            tags: {
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
            page?: never;
            per_page?: never;
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contact_id?: never;
            contacts?: never;
            update_existing?: never;
            query?: never;
            filters?: never;
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
            query: {
                type: string;
                description: string;
            };
            filters: {
                type: string;
                description: string;
                properties: {
                    status: {
                        type: string;
                        enum: string[];
                        description: string;
                    };
                    tags: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                    created_after: {
                        type: string;
                        format: string;
                        description: string;
                    };
                    created_before: {
                        type: string;
                        format: string;
                        description: string;
                    };
                };
            };
            page: {
                type: string;
                description: string;
            };
            per_page: {
                type: string;
                description: string;
            };
            account_id: {
                type: string;
                description: string;
            };
            email?: never;
            status?: never;
            sort?: never;
            order?: never;
            with_count?: never;
            first_name?: never;
            last_name?: never;
            custom_fields?: never;
            contact_id?: never;
            contacts?: never;
            update_existing?: never;
            contact_ids?: never;
            tags?: never;
        };
        required: string[];
    };
})[];
export { healthTools, authTools, senderTools, campaignTools, subAccountTools, emailTools, accountTools, reportTools, logTools, listTools, templateTools, contactTools };
//# sourceMappingURL=tools.d.ts.map