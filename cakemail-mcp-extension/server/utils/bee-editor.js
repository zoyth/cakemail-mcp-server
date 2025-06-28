// Utility functions for working with BEEeditor templates
/**
 * Creates a basic BEEeditor template structure
 */
export function createBasicBEETemplate(options) {
    return {
        template: {
            type: 'email',
            rows: [],
            settings: {
                'background-color': options.backgroundColor || '#f0f0f0',
                contentAreaBackgroundColor: options.contentAreaBackgroundColor || '#ffffff',
                width: options.width || 600,
                linkColor: '#007BFF'
            },
            metadata: {
                title: options.title || 'Newsletter',
                subject: options.subject || 'Newsletter Subject',
                preheader: options.preheader || '',
                lang: 'en'
            }
        }
    };
}
/**
 * Creates a BEE row with specified columns
 */
export function createBEERow(options) {
    const { name, columns, backgroundColor, padding = {} } = options;
    // Calculate column weights (equal distribution)
    const columnWeight = Math.floor(12 / columns);
    const remainder = 12 % columns;
    const beeColumns = [];
    for (let i = 0; i < columns; i++) {
        const weight = columnWeight + (i < remainder ? 1 : 0);
        beeColumns.push({
            weight,
            modules: [],
            'padding-top': 10,
            'padding-right': 10,
            'padding-bottom': 10,
            'padding-left': 10
        });
    }
    return {
        name,
        columns: beeColumns,
        ...(backgroundColor && { 'background-color': backgroundColor }),
        'padding-top': padding.top || 20,
        'padding-right': padding.right || 0,
        'padding-bottom': padding.bottom || 20,
        'padding-left': padding.left || 0,
        'vertical-align': 'top'
    };
}
/**
 * Creates a BEE title/heading module
 */
export function createBEETitleModule(options) {
    const { text, title = 'h1', align = 'left', color = '#333333', size = 24, padding = {} } = options;
    return {
        type: 'title',
        text,
        title,
        align,
        color,
        size,
        'padding-top': padding.top || 10,
        'padding-right': padding.right || 0,
        'padding-bottom': padding.bottom || 10,
        'padding-left': padding.left || 0,
        bold: true,
        'line-height': 1.2
    };
}
/**
 * Creates a BEE paragraph module
 */
export function createBEEParagraphModule(options) {
    const { text, align = 'left', color = '#333333', size = 14, padding = {} } = options;
    return {
        type: 'paragraph',
        text,
        align,
        color,
        size,
        'padding-top': padding.top || 5,
        'padding-right': padding.right || 0,
        'padding-bottom': padding.bottom || 15,
        'padding-left': padding.left || 0,
        'line-height': 1.5
    };
}
/**
 * Creates a BEE button module
 */
export function createBEEButtonModule(options) {
    const { text, href, align = 'center', backgroundColor = '#007BFF', color = '#ffffff', size = 14, padding = {}, target = '_blank' } = options;
    return {
        type: 'button',
        text,
        href,
        align,
        'background-color': backgroundColor,
        color,
        size,
        target,
        'padding-top': padding.top || 15,
        'padding-right': padding.right || 0,
        'padding-bottom': padding.bottom || 15,
        'padding-left': padding.left || 0,
        'border-radius': 4,
        contentPaddingTop: 12,
        contentPaddingRight: 20,
        contentPaddingBottom: 12,
        contentPaddingLeft: 20
    };
}
/**
 * Creates a BEE image module
 */
export function createBEEImageModule(options) {
    const { src, alt = '', href, target = '_blank', padding = {} } = options;
    return {
        type: 'image',
        src,
        alt,
        ...(href && { href }),
        target,
        'padding-top': padding.top || 10,
        'padding-right': padding.right || 0,
        'padding-bottom': padding.bottom || 10,
        'padding-left': padding.left || 0
    };
}
/**
 * Creates a BEE divider module
 */
export function createBEEDividerModule(options) {
    const { color = '#e0e0e0', height = 1, width = 100, padding = {} } = options;
    return {
        type: 'divider',
        color,
        height,
        width,
        'padding-top': padding.top || 15,
        'padding-right': padding.right || 0,
        'padding-bottom': padding.bottom || 15,
        'padding-left': padding.left || 0
    };
}
/**
 * Adds a module to a specific column in a BEE template
 */
export function addModuleToTemplate(template, rowIndex, columnIndex, module) {
    if (!template.template.rows[rowIndex]) {
        throw new Error(`Row index ${rowIndex} does not exist`);
    }
    if (!template.template.rows[rowIndex].columns[columnIndex]) {
        throw new Error(`Column index ${columnIndex} does not exist in row ${rowIndex}`);
    }
    // Create a deep copy to avoid mutations
    const updatedTemplate = JSON.parse(JSON.stringify(template));
    updatedTemplate.template.rows[rowIndex].columns[columnIndex].modules.push(module);
    return updatedTemplate;
}
/**
 * Adds a row to a BEE template
 */
export function addRowToTemplate(template, row) {
    // Create a deep copy to avoid mutations
    const updatedTemplate = JSON.parse(JSON.stringify(template));
    updatedTemplate.template.rows.push(row);
    return updatedTemplate;
}
/**
 * Creates a complete newsletter template with header, content, and footer
 */
export function createNewsletterTemplate(options) {
    const { title, subject, preheader = '', headerText = title, contentSections = [], footerText = 'Thank you for reading!', backgroundColor = '#f5f5f5', contentAreaBackgroundColor = '#ffffff' } = options;
    // Create base template
    let template = createBasicBEETemplate({
        title,
        subject,
        preheader,
        backgroundColor,
        contentAreaBackgroundColor
    });
    // Add header row
    const headerRow = createBEERow({
        name: 'Header',
        columns: 1,
        backgroundColor: contentAreaBackgroundColor,
        padding: { top: 30, bottom: 20 }
    });
    template = addRowToTemplate(template, headerRow);
    template = addModuleToTemplate(template, 0, 0, createBEETitleModule({
        text: headerText,
        title: 'h1',
        align: 'center',
        color: '#333333',
        size: 28,
        padding: { bottom: 20 }
    }));
    // Add content sections
    contentSections.forEach((section, index) => {
        // Content row
        const contentRow = createBEERow({
            name: `Content ${index + 1}`,
            columns: section.imageUrl ? 2 : 1,
            backgroundColor: contentAreaBackgroundColor,
            padding: { top: 20, bottom: 20 }
        });
        template = addRowToTemplate(template, contentRow);
        const currentRowIndex = template.template.rows.length - 1;
        if (section.imageUrl) {
            // Two-column layout with image
            template = addModuleToTemplate(template, currentRowIndex, 0, createBEEImageModule({
                src: section.imageUrl,
                alt: section.title,
                padding: { right: 10 }
            }));
            template = addModuleToTemplate(template, currentRowIndex, 1, createBEETitleModule({
                text: section.title,
                title: 'h2',
                color: '#333333',
                size: 20,
                padding: { bottom: 10 }
            }));
            template = addModuleToTemplate(template, currentRowIndex, 1, createBEEParagraphModule({
                text: section.content,
                color: '#666666',
                size: 14,
                padding: { bottom: 15 }
            }));
            if (section.buttonText && section.buttonUrl) {
                template = addModuleToTemplate(template, currentRowIndex, 1, createBEEButtonModule({
                    text: section.buttonText,
                    href: section.buttonUrl
                }));
            }
        }
        else {
            // Single-column layout
            template = addModuleToTemplate(template, currentRowIndex, 0, createBEETitleModule({
                text: section.title,
                title: 'h2',
                color: '#333333',
                size: 20,
                padding: { bottom: 10 }
            }));
            template = addModuleToTemplate(template, currentRowIndex, 0, createBEEParagraphModule({
                text: section.content,
                color: '#666666',
                size: 14,
                padding: { bottom: 15 }
            }));
            if (section.buttonText && section.buttonUrl) {
                template = addModuleToTemplate(template, currentRowIndex, 0, createBEEButtonModule({
                    text: section.buttonText,
                    href: section.buttonUrl
                }));
            }
        }
        // Add divider between sections (except for the last one)
        if (index < contentSections.length - 1) {
            const dividerRow = createBEERow({
                name: `Divider ${index + 1}`,
                columns: 1,
                backgroundColor: contentAreaBackgroundColor
            });
            template = addRowToTemplate(template, dividerRow);
            template = addModuleToTemplate(template, template.template.rows.length - 1, 0, createBEEDividerModule({
                color: '#e0e0e0',
                padding: { top: 20, bottom: 20 }
            }));
        }
    });
    // Add footer row
    const footerRow = createBEERow({
        name: 'Footer',
        columns: 1,
        backgroundColor: contentAreaBackgroundColor,
        padding: { top: 30, bottom: 30 }
    });
    template = addRowToTemplate(template, footerRow);
    template = addModuleToTemplate(template, template.template.rows.length - 1, 0, createBEEParagraphModule({
        text: footerText,
        align: 'center',
        color: '#999999',
        size: 12
    }));
    return template;
}
/**
 * Converts BEE campaign data to Cakemail create campaign request
 */
export function beeCampaignToCakemailRequest(beeData) {
    const request = {
        name: beeData.name,
        subject: beeData.subject,
        list_id: beeData.list_id,
        sender_id: beeData.sender_id
    };
    // Only add optional fields if they have values
    if (beeData.from_name) {
        request.from_name = beeData.from_name;
    }
    if (beeData.reply_to) {
        request.reply_to = beeData.reply_to;
    }
    return request;
}
/**
 * Validates a BEE template against the schema
 */
export function validateBEETemplate(template) {
    const errors = [];
    // Check required fields
    if (!template.template) {
        errors.push('Template object is required');
        return { valid: false, errors };
    }
    if (!template.template.type) {
        errors.push('Template type is required');
    }
    else if (!['email', 'page', 'popup'].includes(template.template.type)) {
        errors.push('Template type must be email, page, or popup');
    }
    if (!template.template.rows) {
        errors.push('Template rows are required');
    }
    else if (!Array.isArray(template.template.rows) || template.template.rows.length === 0) {
        errors.push('Template must have at least one row');
    }
    else {
        // Validate rows
        template.template.rows.forEach((row, rowIndex) => {
            if (!row.name) {
                errors.push(`Row ${rowIndex}: name is required`);
            }
            if (!row.columns || !Array.isArray(row.columns) || row.columns.length === 0) {
                errors.push(`Row ${rowIndex}: must have at least one column`);
            }
            else if (row.columns.length > 12) {
                errors.push(`Row ${rowIndex}: cannot have more than 12 columns`);
            }
            else {
                // Validate columns
                row.columns.forEach((column, columnIndex) => {
                    if (typeof column.weight !== 'number' || column.weight < 1 || column.weight > 12) {
                        errors.push(`Row ${rowIndex}, Column ${columnIndex}: weight must be between 1 and 12`);
                    }
                    if (!column.modules || !Array.isArray(column.modules)) {
                        errors.push(`Row ${rowIndex}, Column ${columnIndex}: modules array is required`);
                    }
                    else {
                        // Validate modules
                        column.modules.forEach((module, moduleIndex) => {
                            if (!module.type) {
                                errors.push(`Row ${rowIndex}, Column ${columnIndex}, Module ${moduleIndex}: type is required`);
                            }
                            else if (!['button', 'divider', 'heading', 'html', 'icons', 'image', 'list', 'menu', 'paragraph', 'title'].includes(module.type)) {
                                errors.push(`Row ${rowIndex}, Column ${columnIndex}, Module ${moduleIndex}: invalid module type "${module.type}"`);
                            }
                        });
                    }
                });
            }
        });
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Pretty-prints a BEE template structure for debugging
 */
export function printBEETemplateStructure(template) {
    const lines = [];
    if (!template || !template.template) {
        lines.push('Invalid BEE Template: missing template structure');
        return lines.join('\n');
    }
    const metadata = template.template.metadata || {};
    lines.push(`BEE Template: ${metadata.title || 'Untitled'}`);
    lines.push(`Type: ${template.template.type}`);
    lines.push(`Subject: ${metadata.subject || 'No subject'}`);
    lines.push('');
    template.template.rows.forEach((row, rowIndex) => {
        lines.push(`Row ${rowIndex + 1}: ${row.name} (${row.columns.length} columns)`);
        row.columns.forEach((column, columnIndex) => {
            lines.push(`  Column ${columnIndex + 1} (weight: ${column.weight}, ${column.modules.length} modules)`);
            column.modules.forEach((module, moduleIndex) => {
                let moduleDesc = `    Module ${moduleIndex + 1}: ${module.type}`;
                if (module.type === 'title' || module.type === 'heading') {
                    const titleModule = module;
                    moduleDesc += ` - "${titleModule.text || 'No text'}"`;
                }
                else if (module.type === 'paragraph') {
                    const paragraphModule = module;
                    const text = paragraphModule.text || 'No text';
                    moduleDesc += ` - "${text.length > 50 ? text.substring(0, 50) + '...' : text}"`;
                }
                else if (module.type === 'button') {
                    const buttonModule = module;
                    moduleDesc += ` - "${buttonModule.text || 'No text'}" -> ${buttonModule.href || 'No URL'}`;
                }
                else if (module.type === 'image') {
                    const imageModule = module;
                    moduleDesc += ` - ${imageModule.src || 'No source'}`;
                }
                lines.push(moduleDesc);
            });
        });
        lines.push('');
    });
    return lines.join('\n');
}
//# sourceMappingURL=bee-editor.js.map