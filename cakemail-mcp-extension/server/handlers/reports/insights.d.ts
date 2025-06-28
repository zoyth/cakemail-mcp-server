/**
 * Utility functions for generating insights and recommendations from email marketing data
 */
/**
 * Generate insights for email performance
 */
export declare function generateEmailInsights(stats: any): string[];
/**
 * Generate recommendations for email performance
 */
export declare function generateEmailRecommendations(stats: any): string[];
/**
 * Generate insights for list performance
 */
export declare function generateListInsights(stats: any): string[];
/**
 * Generate recommendations for list performance
 */
export declare function generateListRecommendations(stats: any): string[];
/**
 * Generate insights for account performance
 */
export declare function generateAccountInsights(stats: any): string[];
/**
 * Generate recommendations for account performance
 */
export declare function generateAccountRecommendations(stats: any): string[];
/**
 * Generate insights for action performance
 */
export declare function generateActionInsights(stats: any): string[];
/**
 * Generate recommendations for action performance
 */
export declare function generateActionRecommendations(stats: any): string[];
/**
 * Analyze link statistics to generate summary metrics
 */
export declare function analyzeLinkStats(links: any[]): {
    totalUniqueClicks: number;
    totalClicks: number;
    avgUniqueRate: number;
    avgTotalRate: number;
    clickThroughRatio: number;
    topPerformingCount: number;
};
/**
 * Categorize links by type/domain for analysis
 */
export declare function categorizeLinks(links: any[]): Record<string, any[]>;
/**
 * Generate insights based on link performance data
 */
export declare function generateLinkInsights(links: any[], stats: any): string[];
/**
 * Generate recommendations based on link performance
 */
export declare function generateLinkRecommendations(links: any[], stats: any): string[];
/**
 * Generate insights based on campaign statistics
 */
export declare function generateCampaignInsights(stats: any): string[];
/**
 * Generate recommendations based on campaign statistics
 */
export declare function generateCampaignRecommendations(stats: any): string[];
//# sourceMappingURL=insights.d.ts.map