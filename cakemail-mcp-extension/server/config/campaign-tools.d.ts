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
            title: {
                type: string;
                description: string;
            };
            subject: {
                type: string;
                description: string;
            };
            preheader: {
                type: string;
                description: string;
            };
            backgroundColor: {
                type: string;
                description: string;
            };
            contentAreaBackgroundColor: {
                type: string;
                description: string;
            };
            width: {
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
            headerText?: never;
            contentSections?: never;
            footerText?: never;
            json_content?: never;
        };
        required: never[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            title: {
                type: string;
                description: string;
            };
            subject: {
                type: string;
                description: string;
            };
            preheader: {
                type: string;
                description: string;
            };
            headerText: {
                type: string;
                description: string;
            };
            contentSections: {
                type: string;
                description: string;
                items: {
                    type: string;
                    properties: {
                        title: {
                            type: string;
                            description: string;
                        };
                        content: {
                            type: string;
                            description: string;
                        };
                        imageUrl: {
                            type: string;
                            description: string;
                        };
                        buttonText: {
                            type: string;
                            description: string;
                        };
                        buttonUrl: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
            footerText: {
                type: string;
                description: string;
            };
            backgroundColor: {
                type: string;
                description: string;
            };
            contentAreaBackgroundColor: {
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
            width?: never;
            json_content?: never;
        };
        required: never[];
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
})[];
//# sourceMappingURL=campaign-tools.d.ts.map