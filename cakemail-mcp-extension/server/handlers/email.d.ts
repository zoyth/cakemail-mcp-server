import { CakemailAPI } from '../cakemail-api.js';
/**
 * Submit an email using the v2 Email API
 */
export declare function handleSendEmail(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
}>;
/**
 * Retrieve email status by ID
 */
export declare function handleGetEmail(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
}>;
/**
 * Render email content
 */
export declare function handleRenderEmail(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
}>;
/**
 * Get email logs with filtering
 */
export declare function handleGetEmailLogs(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
}>;
/**
 * Get email statistics
 */
export declare function handleGetEmailStats(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
}>;
/**
 * Send transactional email (helper)
 */
export declare function handleSendTransactionalEmail(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
/**
 * Send marketing email (helper)
 */
export declare function handleSendMarketingEmail(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
/**
 * Get email logs with analysis
 */
export declare function handleGetEmailLogsWithAnalysis(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=email.d.ts.map