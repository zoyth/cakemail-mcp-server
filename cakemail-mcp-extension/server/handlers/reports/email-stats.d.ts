import { CakemailAPI } from '../../cakemail-api.js';
/**
 * Get email statistics for the transactional email API
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
//# sourceMappingURL=email-stats.d.ts.map