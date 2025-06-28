import { CakemailAPI } from '../cakemail-api.js';
export declare function handleHealthCheck(_args: any, api: CakemailAPI): Promise<{
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
//# sourceMappingURL=health.d.ts.map