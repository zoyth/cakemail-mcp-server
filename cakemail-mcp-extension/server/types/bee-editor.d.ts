export interface BEETemplate {
    template: {
        type: 'email' | 'page' | 'popup';
        rows: BEERow[];
        settings?: BEETemplateSettings;
        metadata?: BEETemplateMetadata;
    };
}
export interface BEERow {
    name: string;
    locked?: boolean;
    colStackOnMobile?: boolean;
    rowReverseColStackOnMobile?: boolean;
    contentAreaBackgroundColor?: string;
    'background-color'?: string;
    'background-image'?: string;
    'background-position'?: string;
    'background-repeat'?: string;
    customFields?: Record<string, any>;
    'border-radius'?: number;
    'border-color'?: string;
    'border-width'?: number;
    columnsBorderRadius?: number;
    columnsSpacing?: number;
    'vertical-align'?: 'top' | 'middle' | 'bottom';
    'display-condition'?: BEEDisplayCondition;
    metadata?: Record<string, any>;
    'padding-top'?: number;
    'padding-right'?: number;
    'padding-bottom'?: number;
    'padding-left'?: number;
    columns: BEEColumn[];
}
export interface BEEColumn {
    weight: number;
    'background-color'?: string;
    'padding-top'?: number;
    'padding-right'?: number;
    'padding-bottom'?: number;
    'padding-left'?: number;
    'border-color'?: string;
    'border-width'?: number;
    modules: BEEModule[];
    customFields?: Record<string, any>;
}
export interface BEEDisplayCondition {
    type: string;
    label?: string;
    description?: string;
    before?: string;
    after?: string;
}
export interface BEETemplateSettings {
    linkColor?: string;
    'background-color'?: string;
    contentAreaBackgroundColor?: string;
    width?: number;
}
export interface BEETemplateMetadata {
    lang?: string;
    title?: string;
    description?: string;
    subject?: string;
    preheader?: string;
}
export type BEEModuleType = 'button' | 'divider' | 'heading' | 'html' | 'icons' | 'image' | 'list' | 'menu' | 'paragraph' | 'title';
export type BEEModule = BEEButtonModule | BEEDividerModule | BEEHtmlModule | BEEIconsModule | BEEImageModule | BEEListModule | BEEMenuModule | BEEParagraphModule | BEETitleModule;
interface BEEBaseModule {
    type: BEEModuleType;
    locked?: boolean;
    customFields?: Record<string, any>;
    'padding-top'?: number;
    'padding-right'?: number;
    'padding-bottom'?: number;
    'padding-left'?: number;
}
export interface BEEButtonModule extends BEEBaseModule {
    type: 'button';
    label?: string;
    text?: string;
    align?: 'left' | 'center' | 'right';
    href?: string;
    target?: '_blank' | '_self' | '_top';
    size?: number;
    color?: string;
    'background-color'?: string;
    contentPaddingTop?: number;
    contentPaddingRight?: number;
    contentPaddingLeft?: number;
    contentPaddingBottom?: number;
    hoverBackgroundColor?: string;
    hoverColor?: string;
    hoverBorderColor?: string;
    hoverBorderWidth?: number;
    'border-radius'?: number;
    'border-color'?: string;
    'border-width'?: number;
}
export interface BEEDividerModule extends BEEBaseModule {
    type: 'divider';
    color?: string;
    height?: number;
    width?: number;
}
export interface BEEHtmlModule extends BEEBaseModule {
    type: 'html';
    html?: string;
}
export interface BEEIconsModule extends BEEBaseModule {
    type: 'icons';
    icons?: BEEIcon[];
}
export interface BEEIcon {
    alt?: string;
    text?: string;
    title?: string;
    image: string;
    href?: string;
    height: string;
    width: string;
    target?: '_blank' | '_self' | '_top';
    textPosition: 'left' | 'right' | 'top' | 'bottom';
}
export interface BEEImageModule extends BEEBaseModule {
    type: 'image';
    alt?: string;
    href?: string;
    src?: string;
    dynamicSrc?: string;
    target?: '_blank' | '_self' | '_top';
}
export interface BEEListModule extends BEEBaseModule {
    type: 'list';
    underline?: boolean;
    italic?: boolean;
    bold?: boolean;
    html?: string;
    text?: string;
    align?: 'left' | 'center' | 'right';
    tag?: 'ol' | 'ul';
    size?: number;
    color?: string;
    linkColor?: string;
    'letter-spacing'?: number;
    'line-height'?: number;
    direction?: 'ltr' | 'rtl';
}
export interface BEEMenuModule extends BEEBaseModule {
    type: 'menu';
    items?: BEEMenuItem[];
}
export interface BEEMenuItem {
    type: 'menu-item';
    text?: string;
    link?: {
        title?: string;
        href?: string;
        target?: '_blank' | '_self' | '_top';
    };
}
export interface BEEParagraphModule extends BEEBaseModule {
    type: 'paragraph';
    underline?: boolean;
    italic?: boolean;
    bold?: boolean;
    html?: string;
    text?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    size?: number;
    color?: string;
    linkColor?: string;
    'letter-spacing'?: number;
    'line-height'?: number;
    direction?: 'ltr' | 'rtl';
}
export interface BEETitleModule extends BEEBaseModule {
    type: 'title' | 'heading';
    underline?: boolean;
    italic?: boolean;
    bold?: boolean;
    html?: string;
    text?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    title?: 'h1' | 'h2' | 'h3';
    size?: number;
    color?: string;
    linkColor?: string;
    'letter-spacing'?: number;
    'line-height'?: number;
    direction?: 'ltr' | 'rtl';
}
export interface BEECampaignData {
    name: string;
    subject: string;
    json_content: BEETemplate;
    list_id: string | number;
    sender_id: string | number;
    from_name?: string;
    reply_to?: string;
}
export {};
//# sourceMappingURL=bee-editor.d.ts.map