import type { BEETemplate, BEERow, BEEModule, BEECampaignData, BEEButtonModule, BEEParagraphModule, BEETitleModule, BEEImageModule, BEEDividerModule } from '../types/bee-editor.js';
import type { CreateCampaignRequest } from '../types/cakemail-types.js';
/**
 * Creates a basic BEEeditor template structure
 */
export declare function createBasicBEETemplate(options: {
    title?: string;
    subject?: string;
    preheader?: string;
    backgroundColor?: string;
    contentAreaBackgroundColor?: string;
    width?: number;
}): BEETemplate;
/**
 * Creates a BEE row with specified columns
 */
export declare function createBEERow(options: {
    name: string;
    columns: number;
    backgroundColor?: string;
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}): BEERow;
/**
 * Creates a BEE title/heading module
 */
export declare function createBEETitleModule(options: {
    text: string;
    title?: 'h1' | 'h2' | 'h3';
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    size?: number;
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}): BEETitleModule;
/**
 * Creates a BEE paragraph module
 */
export declare function createBEEParagraphModule(options: {
    text: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    size?: number;
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}): BEEParagraphModule;
/**
 * Creates a BEE button module
 */
export declare function createBEEButtonModule(options: {
    text: string;
    href: string;
    align?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    color?: string;
    size?: number;
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    target?: '_blank' | '_self' | '_top';
}): BEEButtonModule;
/**
 * Creates a BEE image module
 */
export declare function createBEEImageModule(options: {
    src: string;
    alt?: string;
    href?: string;
    target?: '_blank' | '_self' | '_top';
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}): BEEImageModule;
/**
 * Creates a BEE divider module
 */
export declare function createBEEDividerModule(options: {
    color?: string;
    height?: number;
    width?: number;
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
}): BEEDividerModule;
/**
 * Adds a module to a specific column in a BEE template
 */
export declare function addModuleToTemplate(template: BEETemplate, rowIndex: number, columnIndex: number, module: BEEModule): BEETemplate;
/**
 * Adds a row to a BEE template
 */
export declare function addRowToTemplate(template: BEETemplate, row: BEERow): BEETemplate;
/**
 * Creates a complete newsletter template with header, content, and footer
 */
export declare function createNewsletterTemplate(options: {
    title: string;
    subject: string;
    preheader?: string;
    headerText?: string;
    contentSections?: Array<{
        title: string;
        content: string;
        imageUrl?: string;
        buttonText?: string;
        buttonUrl?: string;
    }>;
    footerText?: string;
    backgroundColor?: string;
    contentAreaBackgroundColor?: string;
}): BEETemplate;
/**
 * Converts BEE campaign data to Cakemail create campaign request
 */
export declare function beeCampaignToCakemailRequest(beeData: BEECampaignData): CreateCampaignRequest;
/**
 * Validates a BEE template against the schema
 */
export declare function validateBEETemplate(template: BEETemplate): {
    valid: boolean;
    errors: string[];
};
/**
 * Pretty-prints a BEE template structure for debugging
 */
export declare function printBEETemplateStructure(template: BEETemplate): string;
//# sourceMappingURL=bee-editor.d.ts.map