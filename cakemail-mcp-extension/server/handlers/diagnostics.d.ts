import { CakemailAPI } from '../cakemail-api.js';
/**
 * Diagnose why a recipient did not receive a campaign
 */
export declare function handleDiagnoseDeliveryIssue(args: any, api: CakemailAPI): Promise<{
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
//# sourceMappingURL=diagnostics.d.ts.map