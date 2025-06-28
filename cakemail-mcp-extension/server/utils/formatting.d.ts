export declare function formatCampaignResponse(campaign: any, action?: string): {
    content: {
        type: string;
        text: string;
    }[];
};
export declare function formatSuccessResponse(message: string, data?: any): {
    content: {
        type: string;
        text: string;
    }[];
};
export declare function formatListResponse(items: any[], title: string, formatter: (item: any, index: number) => string): {
    content: {
        type: string;
        text: string;
    }[];
};
export declare function formatSectionHeader(title: string): string;
export declare function formatKeyValue(key: string, value: string): string;
export declare function formatList(items: string[]): string;
//# sourceMappingURL=formatting.d.ts.map