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
//# sourceMappingURL=formatting.d.ts.map