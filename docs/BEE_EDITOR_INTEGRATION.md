# BEEeditor Integration

This document describes the BEEeditor integration in the Cakemail MCP Server, which allows you to create and manage email campaigns using the BEEeditor JSON format.

## Overview

BEEeditor is a drag-and-drop email editor that uses a structured JSON format to define email templates. Our integration supports:

- Creating campaigns with BEEeditor JSON templates
- Updating existing campaigns with BEE content
- Validating BEE templates against the schema
- Creating basic BEE templates programmatically
- Generating newsletter templates with multiple content sections

## Schema Support

The integration is based on the `simple_unified.schema.json` schema file located in `/src/schema/`. This schema defines:

- Template structure with rows and columns
- Module types (button, divider, heading, html, icons, image, list, menu, paragraph, title)
- Styling properties (colors, padding, borders, etc.)
- Content properties (text, links, images)

## Available Tools

### Campaign Tools with BEE Support

#### `cakemail_create_campaign`
Create a new email campaign supporting both HTML and BEEeditor formats.

**Parameters:**
- `name` (string, required): Campaign name
- `subject` (string, required): Email subject line
- `list_id` (string, required): List ID to send to
- `sender_id` (string, required): Sender ID to use
- `html_content` (string, optional): HTML email content (for HTML format)
- `text_content` (string, optional): Plain text content (for HTML format)
- `json_content` (object, optional): BEEeditor JSON template (for BEE format)
- `content_type` (string, optional): Content format type ('html', 'bee', 'auto-detect')
- `from_name` (string, optional): From name
- `reply_to` (string, optional): Reply-to email address

**Example with BEE content:**
```javascript
{
  "name": "Monthly Newsletter",
  "subject": "Our Latest Updates",
  "list_id": "123",
  "sender_id": "456",
  "content_type": "bee",
  "json_content": {
    "template": {
      "type": "email",
      "rows": [
        // BEE template structure
      ],
      "metadata": {
        "subject": "Our Latest Updates",
        "title": "Monthly Newsletter"
      }
    }
  }
}
```

#### `cakemail_update_campaign`
Update an existing campaign with HTML or BEE content.

**Parameters:**
- `campaign_id` (string, required): Campaign ID to update
- `name` (string, optional): Campaign name
- `subject` (string, optional): Email subject line
- `html_content` (string, optional): HTML email content
- `text_content` (string, optional): Plain text content
- `json_content` (object, optional): BEEeditor JSON template
- `from_name` (string, optional): From name
- `reply_to` (string, optional): Reply-to email address

### BEEeditor Specific Tools

#### `cakemail_create_bee_template`
Create a basic BEEeditor template structure.

**Parameters:**
- `title` (string, optional): Template title (default: "Newsletter")
- `subject` (string, optional): Email subject (default: "Newsletter Subject")
- `preheader` (string, optional): Email preheader text
- `backgroundColor` (string, optional): Background color (default: "#f5f5f5")
- `contentAreaBackgroundColor` (string, optional): Content area background (default: "#ffffff")
- `width` (number, optional): Template width in pixels (default: 600, min: 320, max: 1440)

**Example:**
```javascript
{
  "title": "Welcome Email",
  "subject": "Welcome to Our Newsletter!",
  "preheader": "Thanks for joining us",
  "backgroundColor": "#f8f9fa",
  "contentAreaBackgroundColor": "#ffffff",
  "width": 600
}
```

#### `cakemail_create_bee_newsletter`
Create a complete newsletter template with header, content sections, and footer.

**Parameters:**
- `title` (string, optional): Newsletter title
- `subject` (string, optional): Email subject
- `preheader` (string, optional): Email preheader text
- `headerText` (string, optional): Header text (defaults to title)
- `contentSections` (array, optional): Array of content sections
- `footerText` (string, optional): Footer text
- `backgroundColor` (string, optional): Background color
- `contentAreaBackgroundColor` (string, optional): Content area background

**Content Section Structure:**
```javascript
{
  "title": "Section Title",
  "content": "Section content text",
  "imageUrl": "https://example.com/image.jpg", // optional
  "buttonText": "Read More", // optional
  "buttonUrl": "https://example.com/link" // optional
}
```

**Example:**
```javascript
{
  "title": "Monthly Newsletter",
  "subject": "March 2025 Updates",
  "preheader": "See what's new this month",
  "headerText": "March Newsletter",
  "contentSections": [
    {
      "title": "New Product Launch",
      "content": "We're excited to announce our latest product innovation.",
      "imageUrl": "https://example.com/product.jpg",
      "buttonText": "Learn More",
      "buttonUrl": "https://example.com/products"
    },
    {
      "title": "Upcoming Events",
      "content": "Join us for these exciting events happening this month."
    }
  ],
  "footerText": "Thank you for being a valued subscriber!"
}
```

#### `cakemail_validate_bee_template`
Validate a BEEeditor JSON template against the schema.

**Parameters:**
- `json_content` (object, required): BEEeditor JSON template to validate

**Example:**
```javascript
{
  "json_content": {
    "template": {
      "type": "email",
      "rows": [
        // Your BEE template structure
      ]
    }
  }
}
```

## BEE Template Structure

### Basic Structure
```javascript
{
  "template": {
    "type": "email",           // Required: "email", "page", or "popup"
    "rows": [                  // Required: Array of rows
      {
        "name": "Header",      // Required: Row name
        "columns": [           // Required: Array of columns
          {
            "weight": 12,      // Required: Column weight (1-12)
            "modules": [       // Required: Array of modules
              {
                "type": "title", // Required: Module type
                "text": "Welcome",
                "size": 24,
                "color": "#333333"
              }
            ]
          }
        ]
      }
    ],
    "settings": {              // Optional: Global settings
      "background-color": "#f5f5f5",
      "contentAreaBackgroundColor": "#ffffff",
      "width": 600,
      "linkColor": "#007BFF"
    },
    "metadata": {              // Optional: Template metadata
      "title": "Newsletter",
      "subject": "Newsletter Subject",
      "preheader": "Email preview text",
      "lang": "en"
    }
  }
}
```

### Module Types

#### Title Module
```javascript
{
  "type": "title",
  "text": "Heading Text",
  "title": "h1",              // "h1", "h2", or "h3"
  "align": "center",          // "left", "center", "right", "justify"
  "color": "#333333",
  "size": 24,
  "bold": true,
  "italic": false,
  "underline": false,
  "line-height": 1.2,
  "letter-spacing": 0,
  "padding-top": 10,
  "padding-bottom": 10
}
```

#### Paragraph Module
```javascript
{
  "type": "paragraph",
  "text": "Your paragraph content here",
  "align": "left",
  "color": "#666666",
  "size": 14,
  "line-height": 1.5,
  "padding-top": 5,
  "padding-bottom": 15
}
```

#### Button Module
```javascript
{
  "type": "button",
  "text": "Click Here",
  "href": "https://example.com",
  "target": "_blank",         // "_blank", "_self", "_top"
  "align": "center",
  "background-color": "#007BFF",
  "color": "#ffffff",
  "border-radius": 4,
  "padding-top": 15,
  "padding-bottom": 15,
  "contentPaddingTop": 12,
  "contentPaddingRight": 20,
  "contentPaddingBottom": 12,
  "contentPaddingLeft": 20
}
```

#### Image Module
```javascript
{
  "type": "image",
  "src": "https://example.com/image.jpg",
  "alt": "Image description",
  "href": "https://example.com/link",
  "target": "_blank",
  "padding-top": 10,
  "padding-bottom": 10
}
```

#### Divider Module
```javascript
{
  "type": "divider",
  "color": "#e0e0e0",
  "height": 1,
  "width": 100,
  "padding-top": 15,
  "padding-bottom": 15
}
```

## Usage Examples

### Example 1: Creating a Simple Newsletter Campaign

```javascript
// First, create a BEE newsletter template
const newsletterTemplate = await cakemail_create_bee_newsletter({
  "title": "Weekly Update",
  "subject": "This Week's Highlights",
  "preheader": "Don't miss these important updates",
  "contentSections": [
    {
      "title": "Feature Spotlight",
      "content": "Learn about our newest feature that will save you time.",
      "buttonText": "Try It Now",
      "buttonUrl": "https://app.example.com/new-feature"
    },
    {
      "title": "Customer Success Story",
      "content": "See how Company XYZ increased their productivity by 40%.",
      "imageUrl": "https://example.com/customer-photo.jpg"
    }
  ]
});

// Then create the campaign with the template
const campaign = await cakemail_create_campaign({
  "name": "Weekly Newsletter - March 15",
  "subject": "This Week's Highlights",
  "list_id": "123",
  "sender_id": "456",
  "content_type": "bee",
  "json_content": newsletterTemplate.json_content
});
```

### Example 2: Validating a Custom BEE Template

```javascript
const customTemplate = {
  "template": {
    "type": "email",
    "rows": [
      {
        "name": "Header",
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "title",
                "text": "Custom Newsletter",
                "title": "h1",
                "align": "center",
                "color": "#333333",
                "size": 28
              }
            ]
          }
        ]
      }
    ]
  }
};

// Validate the template
const validation = await cakemail_validate_bee_template({
  "json_content": customTemplate
});
```

### Example 3: Updating a Campaign with BEE Content

```javascript
// Update an existing campaign with new BEE content
const updatedCampaign = await cakemail_update_campaign({
  "campaign_id": "789",
  "subject": "Updated Subject Line",
  "json_content": {
    "template": {
      "type": "email",
      "rows": [
        // Updated template structure
      ]
    }
  }
});
```

## Best Practices

1. **Always Validate Templates**: Use `cakemail_validate_bee_template` to ensure your templates are valid before creating campaigns.

2. **Use Semantic Row Names**: Give meaningful names to your rows (e.g., "Header", "Content", "Footer") for better organization.

3. **Responsive Design**: Use appropriate column weights and stacking options for mobile responsiveness.

4. **Color Consistency**: Define a consistent color palette in your template settings.

5. **Content Hierarchy**: Use proper heading levels (h1, h2, h3) and appropriate font sizes.

6. **Accessibility**: Include alt text for images and ensure sufficient color contrast.

7. **Testing**: Always send test emails before launching campaigns.

## Error Handling

The integration includes comprehensive error handling:

- **Schema Validation**: Templates are validated against the BEE schema
- **Required Field Validation**: Missing required fields are clearly identified
- **Type Checking**: Ensures proper data types for all properties
- **Range Validation**: Checks that numeric values are within acceptable ranges

## Troubleshooting

### Common Issues

1. **Invalid Template Structure**
   - Ensure your template has the required `template.type` and `template.rows` properties
   - Check that all rows have `name` and `columns` properties
   - Verify that all columns have `weight` and `modules` properties

2. **Module Type Errors**
   - Use only supported module types: button, divider, heading, html, icons, image, list, menu, paragraph, title
   - Ensure all required properties for each module type are provided

3. **Weight Distribution**
   - Column weights must sum appropriately within each row
   - Individual weights must be between 1 and 12

4. **Padding/Border Values**
   - Padding values must be between 0 and 60
   - Border radius values must be between 0 and 60
   - Border width values must be between 0 and 30

For more specific error messages, use the validation tool to identify and fix issues in your templates.
