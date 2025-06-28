/**
 * Cakemail Event Taxonomy
 *
 * Comprehensive classification of email marketing and transactional events
 * for better AI understanding and filtering capabilities.
 */
/**
 * Complete event taxonomy for Cakemail platform
 */
export const CAKEMAIL_EVENT_TAXONOMY = {
    categories: [
        {
            name: "ENGAGEMENT",
            description: "User interaction with email content - indicates campaign effectiveness",
            events: ["click", "clickthru", "open", "view", "forward", "share"],
            priority: "high",
            actionRequired: false
        },
        {
            name: "DELIVERY_PIPELINE",
            description: "Email delivery lifecycle events - system processing stages",
            events: ["generating", "in_queue", "schedule", "sent", "received", "skipped"],
            priority: "medium",
            actionRequired: false
        },
        {
            name: "BOUNCES",
            description: "Delivery failures requiring list maintenance and sender reputation management",
            events: ["bounce", "bounce_hb", "bounce_sb", "bounce_df", "bounce_fm", "bounce_mb", "bounce_tr", "bounce_cr", "bounce_ac", "bounce_ar"],
            priority: "high",
            actionRequired: true
        },
        {
            name: "LIST_MANAGEMENT",
            description: "Subscription and preference changes affecting list composition",
            events: ["subscribe", "unsubscribe", "global_unsubscribe", "unsub_reason"],
            priority: "high",
            actionRequired: true
        },
        {
            name: "DELIVERABILITY_ISSUES",
            description: "Spam and reputation issues requiring immediate attention",
            events: ["spam", "auto_responder"],
            priority: "high",
            actionRequired: true
        },
        {
            name: "ADMINISTRATIVE",
            description: "System and data management events",
            events: ["update", "other"],
            priority: "low",
            actionRequired: false
        }
    ],
    eventTypes: [
        // Engagement Events
        {
            code: "click",
            name: "Link Click",
            category: "ENGAGEMENT",
            description: "Recipient clicked a link in the email (includes clickthru)",
            severity: "info"
        },
        {
            code: "clickthru",
            name: "Click Through",
            category: "ENGAGEMENT",
            description: "Same as click - legacy naming (consolidate to 'click')",
            severity: "info"
        },
        {
            code: "open",
            name: "Email Open",
            category: "ENGAGEMENT",
            description: "Recipient opened the email",
            severity: "info"
        },
        {
            code: "view",
            name: "Email View",
            category: "ENGAGEMENT",
            description: "Email was viewed (may differ from open tracking)",
            severity: "info"
        },
        {
            code: "forward",
            name: "Email Forward",
            category: "ENGAGEMENT",
            description: "Email was forwarded to others",
            severity: "info"
        },
        {
            code: "share",
            name: "Email Share",
            category: "ENGAGEMENT",
            description: "Email was shared via social or other channels",
            severity: "info"
        },
        // Delivery Pipeline Events
        {
            code: "generating",
            name: "Content Generation",
            category: "DELIVERY_PIPELINE",
            description: "Email content is being generated",
            severity: "info"
        },
        {
            code: "in_queue",
            name: "Queued for Delivery",
            category: "DELIVERY_PIPELINE",
            description: "Email is waiting in delivery queue",
            severity: "info"
        },
        {
            code: "schedule",
            name: "Scheduled",
            category: "DELIVERY_PIPELINE",
            description: "Email scheduled for future delivery",
            severity: "info"
        },
        {
            code: "sent",
            name: "Successfully Sent",
            category: "DELIVERY_PIPELINE",
            description: "Email successfully sent to recipient server",
            severity: "info"
        },
        {
            code: "received",
            name: "Delivery Confirmed",
            category: "DELIVERY_PIPELINE",
            description: "Delivery confirmation received",
            severity: "info"
        },
        {
            code: "skipped",
            name: "Delivery Skipped",
            category: "DELIVERY_PIPELINE",
            description: "Email skipped due to suppression list or other filters",
            severity: "warning"
        },
        // Bounce Events
        {
            code: "bounce",
            name: "General Bounce",
            category: "BOUNCES",
            description: "Email bounced - general category",
            severity: "warning",
            permanent: false,
            retryable: true
        },
        {
            code: "bounce_hb",
            name: "Hard Bounce",
            category: "BOUNCES",
            description: "Permanent delivery failure - invalid address or domain",
            severity: "critical",
            permanent: true,
            retryable: false
        },
        {
            code: "bounce_sb",
            name: "Soft Bounce",
            category: "BOUNCES",
            description: "Temporary delivery failure - may succeed later",
            severity: "warning",
            permanent: false,
            retryable: true
        },
        {
            code: "bounce_df",
            name: "DNS Failure",
            category: "BOUNCES",
            description: "DNS resolution problem - temporary issue",
            severity: "warning",
            permanent: false,
            retryable: true
        },
        {
            code: "bounce_fm",
            name: "Mailbox Full",
            category: "BOUNCES",
            description: "Recipient's mailbox is full - temporary issue",
            severity: "warning",
            permanent: false,
            retryable: true
        },
        {
            code: "bounce_mb",
            name: "Email Blocked",
            category: "BOUNCES",
            description: "Server blocking emails from sender - reputation issue",
            severity: "critical",
            permanent: false,
            retryable: false
        },
        {
            code: "bounce_tr",
            name: "Transient Bounce",
            category: "BOUNCES",
            description: "Temporary failure - system still trying delivery",
            severity: "info",
            permanent: false,
            retryable: true
        },
        {
            code: "bounce_cr",
            name: "Challenge/Response",
            category: "BOUNCES",
            description: "Anti-spam system requires sender verification",
            severity: "warning",
            permanent: false,
            retryable: false
        },
        {
            code: "bounce_ac",
            name: "Address Change",
            category: "BOUNCES",
            description: "Recipient moved - automated address change notification",
            severity: "info",
            permanent: true,
            retryable: false
        },
        {
            code: "bounce_ar",
            name: "Auto Reply",
            category: "BOUNCES",
            description: "Out-of-office or automated response - not a true bounce",
            severity: "info",
            permanent: false,
            retryable: true
        },
        // List Management Events
        {
            code: "subscribe",
            name: "Subscription",
            category: "LIST_MANAGEMENT",
            description: "User opted into mailing list",
            severity: "info"
        },
        {
            code: "unsubscribe",
            name: "Unsubscribe",
            category: "LIST_MANAGEMENT",
            description: "User opted out of specific mailing list",
            severity: "warning"
        },
        {
            code: "global_unsubscribe",
            name: "Global Unsubscribe",
            category: "LIST_MANAGEMENT",
            description: "User opted out of all communications",
            severity: "critical"
        },
        {
            code: "unsub_reason",
            name: "Unsubscribe Reason",
            category: "LIST_MANAGEMENT",
            description: "Reason code for unsubscribe action",
            severity: "info"
        },
        // Deliverability Issues
        {
            code: "spam",
            name: "Spam Complaint",
            category: "DELIVERABILITY_ISSUES",
            description: "Recipient marked email as spam - damages sender reputation",
            severity: "critical",
            permanent: true,
            retryable: false
        },
        {
            code: "auto_responder",
            name: "Auto Responder",
            category: "DELIVERABILITY_ISSUES",
            description: "Automated system response received",
            severity: "info"
        },
        // Administrative
        {
            code: "update",
            name: "Record Update",
            category: "ADMINISTRATIVE",
            description: "Contact or campaign data updated",
            severity: "info"
        },
        {
            code: "other",
            name: "Other Event",
            category: "ADMINISTRATIVE",
            description: "Miscellaneous events not covered by other categories",
            severity: "info"
        }
    ],
    filterHelpers: [
        {
            name: "engagement_events",
            description: "Get all user engagement activities (clicks, opens, views)",
            filterQuery: "type==click;type==open;type==view;type==forward;type==share",
            useCase: "Analyze campaign engagement and user interaction patterns"
        },
        {
            name: "delivery_issues",
            description: "Get all delivery problems requiring attention (hard bounces, blocks, spam)",
            filterQuery: "type==bounce_hb;type==bounce_mb;type==spam",
            useCase: "Identify list cleanup needs and reputation issues"
        },
        {
            name: "temporary_failures",
            description: "Get retryable delivery failures (soft bounces, DNS issues, full mailboxes)",
            filterQuery: "type==bounce_sb;type==bounce_df;type==bounce_fm;type==bounce_tr",
            useCase: "Monitor temporary issues that may resolve automatically"
        },
        {
            name: "list_changes",
            description: "Get subscription and unsubscribe activities",
            filterQuery: "type==subscribe;type==unsubscribe;type==global_unsubscribe",
            useCase: "Track list growth and churn patterns"
        },
        {
            name: "reputation_threats",
            description: "Get events that damage sender reputation",
            filterQuery: "type==spam;type==bounce_hb;type==bounce_mb",
            useCase: "Monitor and respond to reputation-damaging events"
        },
        {
            name: "delivery_pipeline",
            description: "Get email processing and delivery status events",
            filterQuery: "type==generating;type==in_queue;type==sent;type==received",
            useCase: "Track email delivery pipeline and processing status"
        },
        {
            name: "clicks_only",
            description: "Get only click-through events",
            filterQuery: "type==click",
            useCase: "Analyze click performance and popular content"
        },
        {
            name: "opens_only",
            description: "Get only email open events",
            filterQuery: "type==open",
            useCase: "Analyze open rates and engagement timing"
        },
        {
            name: "all_bounces",
            description: "Get all bounce types for comprehensive bounce analysis",
            filterQuery: "type==bounce;type==bounce_hb;type==bounce_sb;type==bounce_df;type==bounce_fm;type==bounce_mb;type==bounce_tr;type==bounce_cr;type==bounce_ac;type==bounce_ar",
            useCase: "Complete bounce analysis and categorization"
        },
        {
            name: "critical_events",
            description: "Get events requiring immediate attention",
            filterQuery: "type==spam;type==bounce_hb;type==bounce_mb;type==global_unsubscribe",
            useCase: "Priority monitoring for urgent issues"
        }
    ]
};
/**
 * Helper functions for working with event taxonomy
 */
export class EventTaxonomyHelper {
    /**
     * Get event category for a given event type
     */
    static getEventCategory(eventType) {
        const event = CAKEMAIL_EVENT_TAXONOMY.eventTypes.find(e => e.code === eventType);
        if (!event)
            return undefined;
        return CAKEMAIL_EVENT_TAXONOMY.categories.find(c => c.name === event.category);
    }
    /**
     * Get event details by code
     */
    static getEventDetails(eventType) {
        return CAKEMAIL_EVENT_TAXONOMY.eventTypes.find(e => e.code === eventType);
    }
    /**
     * Get filter helper by name
     */
    static getFilterHelper(name) {
        return CAKEMAIL_EVENT_TAXONOMY.filterHelpers.find(f => f.name === name);
    }
    /**
     * Get all events in a category
     */
    static getEventsInCategory(categoryName) {
        const category = CAKEMAIL_EVENT_TAXONOMY.categories.find(c => c.name === categoryName);
        return category ? category.events : [];
    }
    /**
     * Generate smart filter suggestions based on common use cases
     */
    static getSmartFilterSuggestions() {
        return CAKEMAIL_EVENT_TAXONOMY.filterHelpers.map(helper => ({
            name: helper.name,
            description: helper.description,
            filter: helper.filterQuery
        }));
    }
    /**
     * Validate if an event type exists in our taxonomy
     */
    static isValidEventType(eventType) {
        return CAKEMAIL_EVENT_TAXONOMY.eventTypes.some(e => e.code === eventType);
    }
    /**
     * Get events that require immediate action
     */
    static getCriticalEvents() {
        return CAKEMAIL_EVENT_TAXONOMY.eventTypes
            .filter(e => e.severity === 'critical')
            .map(e => e.code);
    }
    /**
     * Get events that are retryable
     */
    static getRetryableEvents() {
        return CAKEMAIL_EVENT_TAXONOMY.eventTypes
            .filter(e => e.retryable === true)
            .map(e => e.code);
    }
    /**
     * Get permanent failure events (for list cleanup)
     */
    static getPermanentFailureEvents() {
        return CAKEMAIL_EVENT_TAXONOMY.eventTypes
            .filter(e => e.permanent === true && e.severity === 'critical')
            .map(e => e.code);
    }
}
export default CAKEMAIL_EVENT_TAXONOMY;
//# sourceMappingURL=event-taxonomy.js.map