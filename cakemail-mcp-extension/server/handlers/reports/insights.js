/**
 * Utility functions for generating insights and recommendations from email marketing data
 */
/**
 * Generate insights for email performance
 */
export function generateEmailInsights(stats) {
    const insights = [];
    if (stats.delivery_rate !== undefined) {
        const deliveryRate = stats.delivery_rate * 100;
        if (deliveryRate >= 98) {
            insights.push('Excellent delivery rate - your sender reputation is very strong');
        }
        else if (deliveryRate < 90) {
            insights.push('Low delivery rate detected - investigate bounce causes and sender reputation');
        }
    }
    if (stats.open_rate !== undefined) {
        const openRate = stats.open_rate * 100;
        if (openRate >= 25) {
            insights.push('Outstanding open rate - your subject lines are very effective');
        }
        else if (openRate < 15) {
            insights.push('Low open rate - consider improving subject lines and send timing');
        }
    }
    return insights;
}
/**
 * Generate recommendations for email performance
 */
export function generateEmailRecommendations(stats) {
    const recommendations = [];
    if (stats.bounce_rate !== undefined && stats.bounce_rate * 100 > 5) {
        recommendations.push('High bounce rate - implement list cleaning and validation');
    }
    if (stats.spam_rate !== undefined && stats.spam_rate * 100 > 0.5) {
        recommendations.push('Monitor content for spam triggers and ensure clear unsubscribe options');
    }
    return recommendations;
}
/**
 * Generate insights for list performance
 */
export function generateListInsights(stats) {
    const insights = [];
    if (stats.net_growth !== undefined) {
        if (stats.net_growth > 0) {
            insights.push('Positive list growth - your acquisition efforts are working');
        }
        else if (stats.net_growth < 0) {
            insights.push('Negative list growth - review content relevance and frequency');
        }
    }
    return insights;
}
/**
 * Generate recommendations for list performance
 */
export function generateListRecommendations(stats) {
    const recommendations = [];
    if (stats.unsubscribe_rate !== undefined && stats.unsubscribe_rate * 100 > 2) {
        recommendations.push('High unsubscribe rate - review email frequency and content relevance');
    }
    return recommendations;
}
/**
 * Generate insights for account performance
 */
export function generateAccountInsights(stats) {
    const insights = [];
    if (stats.open_rate !== undefined && stats.click_rate !== undefined) {
        const openRate = stats.open_rate * 100;
        const clickRate = stats.click_rate * 100;
        if (openRate >= 20 && clickRate >= 3) {
            insights.push('Strong overall engagement - both opens and clicks are performing well');
        }
        else if (openRate >= 20 && clickRate < 2) {
            insights.push('Good open rates but low clicks - focus on improving content and CTAs');
        }
    }
    return insights;
}
/**
 * Generate recommendations for account performance
 */
export function generateAccountRecommendations(stats) {
    const recommendations = [];
    if (stats.emails_usage !== undefined && stats.emails_usage > 0.9) {
        recommendations.push('High email usage - consider upgrading your plan or optimizing send frequency');
    }
    if (stats.contacts_usage !== undefined && stats.contacts_usage > 0.9) {
        recommendations.push('High contact usage - consider upgrading your plan or cleaning inactive contacts');
    }
    return recommendations;
}
/**
 * Generate insights for action performance
 */
export function generateActionInsights(stats) {
    const insights = [];
    if (stats.sent_emails !== undefined && stats.unique_opens !== undefined) {
        const openRate = (stats.unique_opens / stats.sent_emails) * 100;
        if (openRate >= 25) {
            insights.push('Excellent action performance - recipients are highly engaged');
        }
        else if (openRate < 15) {
            insights.push('Low engagement - review action triggers and content relevance');
        }
    }
    return insights;
}
/**
 * Generate recommendations for action performance
 */
export function generateActionRecommendations(stats) {
    const recommendations = [];
    if (stats.bounces !== undefined && stats.sent_emails !== undefined) {
        const bounceRate = (stats.bounces / stats.sent_emails) * 100;
        if (bounceRate > 5) {
            recommendations.push('High bounce rate in automation - implement contact validation in workflow');
        }
    }
    return recommendations;
}
/**
 * Analyze link statistics to generate summary metrics
 */
export function analyzeLinkStats(links) {
    const totalUniqueClicks = links.reduce((sum, link) => sum + (link.unique || 0), 0);
    const totalClicks = links.reduce((sum, link) => sum + (link.total || 0), 0);
    const avgUniqueRate = links.reduce((sum, link) => sum + ((link.unique_rate || 0) * 100), 0) / links.length;
    const avgTotalRate = links.reduce((sum, link) => sum + ((link.total_rate || 0) * 100), 0) / links.length;
    const clickThroughRatio = totalUniqueClicks > 0 ? totalClicks / totalUniqueClicks : 0;
    const topPerformingCount = links.filter(link => (link.unique || 0) >= 10).length;
    return {
        totalUniqueClicks,
        totalClicks,
        avgUniqueRate,
        avgTotalRate,
        clickThroughRatio,
        topPerformingCount
    };
}
/**
 * Categorize links by type/domain for analysis
 */
export function categorizeLinks(links) {
    const categories = {};
    links.forEach(link => {
        let category = 'Other';
        const url = link.link.toLowerCase();
        try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            const domain = urlObj.hostname;
            // Social media platforms
            if (domain.includes('facebook') || domain.includes('fb.com')) {
                category = 'Social Media (Facebook)';
            }
            else if (domain.includes('twitter') || domain.includes('x.com')) {
                category = 'Social Media (Twitter/X)';
            }
            else if (domain.includes('linkedin')) {
                category = 'Social Media (LinkedIn)';
            }
            else if (domain.includes('instagram')) {
                category = 'Social Media (Instagram)';
            }
            else if (domain.includes('youtube')) {
                category = 'Video (YouTube)';
            }
            else if (domain.includes('vimeo')) {
                category = 'Video (Vimeo)';
            }
            // E-commerce
            else if (domain.includes('shop') || domain.includes('store') || domain.includes('buy') ||
                domain.includes('cart') || domain.includes('checkout') || domain.includes('amazon') ||
                domain.includes('ebay')) {
                category = 'E-commerce';
            }
            // Content/Blog
            else if (domain.includes('blog') || domain.includes('news') || domain.includes('article')) {
                category = 'Content/Blog';
            }
            // External domains
            else if (!domain.includes('localhost') && !domain.includes('127.0.0.1')) {
                category = `External (${domain})`;
            }
            // Internal links
            else {
                category = 'Internal Links';
            }
        }
        catch (e) {
            // If URL parsing fails, categorize by content
            if (url.includes('unsubscribe')) {
                category = 'Unsubscribe';
            }
            else if (url.includes('social')) {
                category = 'Social Media';
            }
            else if (url.includes('shop') || url.includes('buy') || url.includes('product')) {
                category = 'E-commerce';
            }
        }
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(link);
    });
    return categories;
}
/**
 * Generate insights based on link performance data
 */
export function generateLinkInsights(links, stats) {
    const insights = [];
    // Overall performance insights
    if (stats.totalUniqueClicks === 0) {
        insights.push('No clicks recorded - consider reviewing link placement and call-to-action effectiveness');
    }
    else if (stats.topPerformingCount === 0) {
        insights.push('All links have low engagement - content may need optimization');
    }
    else if (stats.topPerformingCount >= links.length * 0.5) {
        insights.push('Strong overall link performance - good content engagement');
    }
    // Click distribution insights
    const sortedLinks = links.sort((a, b) => (b.unique || 0) - (a.unique || 0));
    if (sortedLinks.length >= 3) {
        const topLink = sortedLinks[0];
        const topClicks = topLink.unique || 0;
        const totalClicks = stats.totalUniqueClicks;
        if (topClicks > totalClicks * 0.5) {
            insights.push('One link dominates clicks - consider distributing engagement across multiple CTAs');
        }
        else if (topClicks < totalClicks * 0.2 && sortedLinks.length > 5) {
            insights.push('Even click distribution - good variety of engaging content');
        }
    }
    // Repeat click insights
    if (stats.clickThroughRatio > 2) {
        insights.push('High repeat click rate - users are very engaged with your links');
    }
    else if (stats.clickThroughRatio < 1.1) {
        insights.push('Low repeat clicks - links may not be providing expected value');
    }
    // Category-based insights
    const categories = categorizeLinks(links);
    const socialLinks = Object.keys(categories).filter(cat => cat.includes('Social')).length;
    const ecommerceLinks = Object.keys(categories).filter(cat => cat.includes('E-commerce')).length;
    if (socialLinks > 0 && ecommerceLinks > 0) {
        insights.push('Good mix of social and commercial links - balanced engagement strategy');
    }
    else if (socialLinks > 3) {
        insights.push('Heavy focus on social media - consider adding more direct conversion links');
    }
    else if (ecommerceLinks > links.length * 0.8) {
        insights.push('Sales-focused campaign - monitor conversion rates alongside click rates');
    }
    return insights;
}
/**
 * Generate recommendations based on link performance
 */
export function generateLinkRecommendations(links, stats) {
    const recommendations = [];
    // Low overall performance
    if (stats.totalUniqueClicks < links.length * 2) {
        recommendations.push('Consider A/B testing different link text and button designs');
        recommendations.push('Review link placement - ensure CTAs are visible and compelling');
        recommendations.push('Simplify your message - too many links can reduce individual performance');
    }
    // Uneven distribution
    const sortedLinks = links.sort((a, b) => (b.unique || 0) - (a.unique || 0));
    const zeroClickLinks = links.filter(link => (link.unique || 0) === 0);
    if (zeroClickLinks.length > 0) {
        recommendations.push('Remove or optimize links with zero clicks - they may be confusing or irrelevant');
        recommendations.push('Consider consolidating similar links to reduce choice paralysis');
    }
    if (zeroClickLinks.length > links.length * 0.3) {
        recommendations.push('Too many ineffective links - focus on 2-3 primary CTAs per email');
    }
    // Repeat clicks
    if (stats.clickThroughRatio < 1.2) {
        recommendations.push('Improve landing page experience - users may not find what they expect');
        recommendations.push('Ensure link promises match landing page content');
    }
    // Performance-based recommendations
    if (stats.avgUniqueRate < 1) {
        recommendations.push('Low click rates overall - consider more compelling call-to-action copy');
        recommendations.push('Test different link colors, sizes, and button styles');
        recommendations.push('Add urgency or scarcity elements to increase click motivation');
    }
    // Link categorization recommendations
    const categories = categorizeLinks(links);
    if (Object.keys(categories).length === 1) {
        recommendations.push('Diversify link types - include social proof, content, and conversion links');
    }
    // Top performer analysis
    if (sortedLinks.length > 0 && sortedLinks[0].unique > 0) {
        const topPerformer = sortedLinks[0];
        recommendations.push(`Top link: "${topPerformer.link}" - analyze what makes this effective and apply to other links`);
    }
    return recommendations;
}
/**
 * Generate insights based on campaign statistics
 */
export function generateCampaignInsights(stats) {
    const insights = [];
    // Open rate insights
    if (stats.open_rate !== undefined) {
        const openRate = stats.open_rate * 100;
        if (openRate >= 25) {
            insights.push('Excellent open rate - your subject line and sender reputation are performing well');
        }
        else if (openRate >= 20) {
            insights.push('Good open rate - above industry average');
        }
        else if (openRate >= 15) {
            insights.push('Average open rate - room for improvement in subject lines');
        }
        else if (openRate < 15) {
            insights.push('Low open rate - consider improving subject lines and sender reputation');
        }
    }
    // Click rate insights
    if (stats.click_rate !== undefined) {
        const clickRate = stats.click_rate * 100;
        if (clickRate >= 5) {
            insights.push('Outstanding click rate - your content is highly engaging');
        }
        else if (clickRate >= 3) {
            insights.push('Good click rate - content is resonating with your audience');
        }
        else if (clickRate >= 2) {
            insights.push('Average click rate - consider improving call-to-action placement');
        }
        else if (clickRate < 2) {
            insights.push('Low click rate - content may need optimization');
        }
    }
    // Bounce rate insights
    if (stats.bounce_rate !== undefined) {
        const bounceRate = stats.bounce_rate * 100;
        if (bounceRate <= 2) {
            insights.push('Excellent delivery rate - your list quality is very good');
        }
        else if (bounceRate <= 5) {
            insights.push('Good delivery rate - minimal bounce issues');
        }
        else if (bounceRate > 10) {
            insights.push('High bounce rate detected - list cleaning recommended');
        }
    }
    // Engagement ratio insights
    if (stats.opens !== undefined && stats.clicks !== undefined && stats.opens > 0) {
        const engagementRatio = (stats.clicks / stats.opens) * 100;
        if (engagementRatio >= 15) {
            insights.push('High engagement ratio - recipients who open are very likely to click');
        }
        else if (engagementRatio < 5) {
            insights.push('Low engagement ratio - content may not match reader expectations');
        }
    }
    return insights;
}
/**
 * Generate recommendations based on campaign statistics
 */
export function generateCampaignRecommendations(stats) {
    const recommendations = [];
    // Open rate recommendations
    if (stats.open_rate !== undefined && stats.open_rate * 100 < 20) {
        recommendations.push('Try A/B testing different subject lines to improve open rates');
        recommendations.push('Consider optimizing send times based on your audience timezone');
        recommendations.push('Review sender name and "from" address for trust and recognition');
    }
    // Click rate recommendations
    if (stats.click_rate !== undefined && stats.click_rate * 100 < 3) {
        recommendations.push('Strengthen your call-to-action buttons with more compelling copy');
        recommendations.push('Consider simplifying your email design to highlight key actions');
        recommendations.push('Test different content formats (images vs text, length, etc.)');
    }
    // Bounce rate recommendations
    if (stats.bounce_rate !== undefined && stats.bounce_rate * 100 > 5) {
        recommendations.push('Implement list cleaning to remove invalid email addresses');
        recommendations.push('Use double opt-in for new subscribers to ensure email validity');
        recommendations.push('Regular list hygiene - remove addresses that consistently bounce');
    }
    // Spam rate recommendations
    if (stats.spam_rate !== undefined && stats.spam_rate * 100 > 0.5) {
        recommendations.push('Review email content for spam trigger words');
        recommendations.push('Ensure clear unsubscribe options are prominently displayed');
        recommendations.push('Monitor sender reputation and consider authentication (SPF, DKIM)');
    }
    // Unsubscribe rate recommendations
    if (stats.unsubscribe_rate !== undefined && stats.unsubscribe_rate * 100 > 2) {
        recommendations.push('Review email frequency - you may be sending too often');
        recommendations.push('Segment your audience for more targeted, relevant content');
        recommendations.push('Survey unsubscribers to understand their reasons for leaving');
    }
    // General recommendations based on overall performance
    if (stats.open_rate !== undefined && stats.click_rate !== undefined) {
        const openRate = stats.open_rate * 100;
        const clickRate = stats.click_rate * 100;
        if (openRate >= 20 && clickRate < 2) {
            recommendations.push('Good open rate but low clicks - focus on improving email content and CTAs');
        }
        if (openRate < 15 && clickRate >= 3) {
            recommendations.push('Good engagement from openers - work on subject lines to increase opens');
        }
    }
    return recommendations;
}
//# sourceMappingURL=insights.js.map