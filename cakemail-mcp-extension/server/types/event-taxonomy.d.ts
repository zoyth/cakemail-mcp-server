/**
 * Cakemail Event Taxonomy
 *
 * Comprehensive classification of email marketing and transactional events
 * for better AI understanding and filtering capabilities.
 */
export interface EventTaxonomy {
    categories: EventCategory[];
    eventTypes: EventType[];
    filterHelpers: FilterHelper[];
}
export interface EventCategory {
    name: string;
    description: string;
    events: string[];
    priority: 'high' | 'medium' | 'low';
    actionRequired?: boolean;
}
export interface EventType {
    code: string;
    name: string;
    category: string;
    description: string;
    severity?: 'critical' | 'warning' | 'info';
    permanent?: boolean;
    retryable?: boolean;
}
export interface FilterHelper {
    name: string;
    description: string;
    filterQuery: string;
    useCase: string;
}
/**
 * Complete event taxonomy for Cakemail platform
 */
export declare const CAKEMAIL_EVENT_TAXONOMY: EventTaxonomy;
/**
 * Helper functions for working with event taxonomy
 */
export declare class EventTaxonomyHelper {
    /**
     * Get event category for a given event type
     */
    static getEventCategory(eventType: string): EventCategory | undefined;
    /**
     * Get event details by code
     */
    static getEventDetails(eventType: string): EventType | undefined;
    /**
     * Get filter helper by name
     */
    static getFilterHelper(name: string): FilterHelper | undefined;
    /**
     * Get all events in a category
     */
    static getEventsInCategory(categoryName: string): string[];
    /**
     * Generate smart filter suggestions based on common use cases
     */
    static getSmartFilterSuggestions(): Array<{
        name: string;
        description: string;
        filter: string;
    }>;
    /**
     * Validate if an event type exists in our taxonomy
     */
    static isValidEventType(eventType: string): boolean;
    /**
     * Get events that require immediate action
     */
    static getCriticalEvents(): string[];
    /**
     * Get events that are retryable
     */
    static getRetryableEvents(): string[];
    /**
     * Get permanent failure events (for list cleanup)
     */
    static getPermanentFailureEvents(): string[];
}
export default CAKEMAIL_EVENT_TAXONOMY;
//# sourceMappingURL=event-taxonomy.d.ts.map