import { CakemailAPI } from '../../cakemail-api.js';
/**
 * Get list-specific performance statistics
 */
export declare function handleGetListStats(args: any, api: CakemailAPI): Promise<{
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
 * Get account-wide performance statistics
 */
export declare function handleGetAccountStats(args: any, api: CakemailAPI): Promise<{
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
 * Get workflow action performance statistics
 */
export declare function handleGetActionStats(args: any, api: CakemailAPI): Promise<{
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
 * Get comprehensive account performance overview (convenience method)
 */
export declare function handleGetAccountPerformanceOverview(args: any, api: CakemailAPI): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
//# sourceMappingURL=list-account-stats.d.ts.map