import { CakemailAPI } from '../../cakemail-api.js';
/**
 * Debug reports API access
 */
export declare function handleDebugReportsAccess(args: any, api: CakemailAPI): Promise<{
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
//# sourceMappingURL=debug.d.ts.map