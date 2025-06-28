import { CakemailAPI } from '../../cakemail-api.js';
/**
 * Get detailed campaign performance statistics and analytics
 */
export declare function handleGetCampaignStats(args: any, api: CakemailAPI): Promise<{
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
 * Get campaign link click statistics and performance data
 */
export declare function handleGetCampaignLinksStats(args: any, api: CakemailAPI): Promise<{
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
 * Get comprehensive campaign performance summary (convenience method)
 */
export declare function handleGetCampaignPerformanceSummary(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=campaign-analytics.d.ts.map