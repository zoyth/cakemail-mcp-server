# BEEeditor Template Examples

This file contains complete examples of BEEeditor JSON templates that can be used with the Cakemail MCP Server.

## Example 1: Simple Welcome Email

```json
{
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
                "text": "Welcome to Our Newsletter!",
                "title": "h1",
                "align": "center",
                "color": "#333333",
                "size": 28,
                "bold": true,
                "padding-top": 30,
                "padding-bottom": 20
              }
            ]
          }
        ],
        "background-color": "#ffffff",
        "padding-top": 20,
        "padding-bottom": 20
      },
      {
        "name": "Content",
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "paragraph",
                "text": "Thank you for subscribing to our newsletter. We're excited to share our latest updates, insights, and exclusive offers with you.",
                "align": "center",
                "color": "#666666",
                "size": 16,
                "line-height": 1.5,
                "padding-top": 10,
                "padding-bottom": 20
              },
              {
                "type": "button",
                "text": "Get Started",
                "href": "https://example.com/welcome",
                "target": "_blank",
                "align": "center",
                "background-color": "#007BFF",
                "color": "#ffffff",
                "size": 16,
                "border-radius": 6,
                "padding-top": 20,
                "padding-bottom": 30,
                "contentPaddingTop": 15,
                "contentPaddingRight": 30,
                "contentPaddingBottom": 15,
                "contentPaddingLeft": 30
              }
            ]
          }
        ],
        "background-color": "#ffffff",
        "padding-top": 20,
        "padding-bottom": 20
      },
      {
        "name": "Footer",
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "divider",
                "color": "#e0e0e0",
                "height": 1,
                "width": 80,
                "padding-top": 20,
                "padding-bottom": 20
              },
              {
                "type": "paragraph",
                "text": "© 2025 Your Company. All rights reserved.",
                "align": "center",
                "color": "#999999",
                "size": 12,
                "padding-bottom": 20
              }
            ]
          }
        ],
        "background-color": "#ffffff",
        "padding-top": 20,
        "padding-bottom": 30
      }
    ],
    "settings": {
      "background-color": "#f5f5f5",
      "contentAreaBackgroundColor": "#ffffff",
      "width": 600,
      "linkColor": "#007BFF"
    },
    "metadata": {
      "title": "Welcome Email",
      "subject": "Welcome to Our Newsletter!",
      "preheader": "Thanks for joining our community",
      "lang": "en"
    }
  }
}
```

## Example 2: Product Newsletter with Image

```json
{
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
                "text": "Monthly Product Update",
                "title": "h1",
                "align": "center",
                "color": "#2c3e50",
                "size": 24,
                "bold": true,
                "padding-top": 25,
                "padding-bottom": 15
              }
            ]
          }
        ],
        "background-color": "#ffffff",
        "padding-top": 15,
        "padding-bottom": 15
      },
      {
        "name": "Featured Product",
        "columns": [
          {
            "weight": 6,
            "modules": [
              {
                "type": "image",
                "src": "https://via.placeholder.com/300x200/007BFF/ffffff?text=Product",
                "alt": "Featured Product",
                "href": "https://example.com/products/featured",
                "target": "_blank",
                "padding-top": 10,
                "padding-right": 15,
                "padding-bottom": 10,
                "padding-left": 10
              }
            ]
          },
          {
            "weight": 6,
            "modules": [
              {
                "type": "title",
                "text": "New Feature Launch",
                "title": "h2",
                "align": "left",
                "color": "#2c3e50",
                "size": 20,
                "bold": true,
                "padding-top": 15,
                "padding-bottom": 10,
                "padding-left": 15,
                "padding-right": 10
              },
              {
                "type": "paragraph",
                "text": "We're excited to introduce our latest feature that will revolutionize how you work with our platform.",
                "align": "left",
                "color": "#555555",
                "size": 14,
                "line-height": 1.5,
                "padding-bottom": 15,
                "padding-left": 15,
                "padding-right": 10
              },
              {
                "type": "button",
                "text": "Learn More",
                "href": "https://example.com/features/new",
                "target": "_blank",
                "align": "left",
                "background-color": "#28a745",
                "color": "#ffffff",
                "size": 14,
                "border-radius": 4,
                "padding-left": 15,
                "padding-right": 10,
                "contentPaddingTop": 10,
                "contentPaddingRight": 20,
                "contentPaddingBottom": 10,
                "contentPaddingLeft": 20
              }
            ]
          }
        ],
        "background-color": "#ffffff",
        "padding-top": 20,
        "padding-bottom": 20
      },
      {
        "name": "News Section",
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "title",
                "text": "What's New",
                "title": "h2",
                "align": "center",
                "color": "#2c3e50",
                "size": 18,
                "bold": true,
                "padding-top": 20,
                "padding-bottom": 15
              },
              {
                "type": "paragraph",
                "text": "• Enhanced dashboard with real-time analytics<br>• New integrations with popular tools<br>• Improved mobile experience<br>• Advanced reporting features",
                "align": "left",
                "color": "#555555",
                "size": 14,
                "line-height": 1.6,
                "padding-top": 10,
                "padding-bottom": 20,
                "padding-left": 40,
                "padding-right": 40
              }
            ]
          }
        ],
        "background-color": "#f8f9fa",
        "padding-top": 20,
        "padding-bottom": 20
      },
      {
        "name": "Footer",
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "divider",
                "color": "#dee2e6",
                "height": 1,
                "width": 100,
                "padding-top": 25,
                "padding-bottom": 20
              },
              {
                "type": "paragraph",
                "text": "Follow us on social media for daily updates and tips!",
                "align": "center",
                "color": "#6c757d",
                "size": 14,
                "padding-bottom": 10
              },
              {
                "type": "paragraph",
                "text": "© 2025 Your Company Name. All rights reserved.<br>123 Business St, City, State 12345",
                "align": "center",
                "color": "#999999",
                "size": 12,
                "line-height": 1.4,
                "padding-bottom": 25
              }
            ]
          }
        ],
        "background-color": "#ffffff",
        "padding-top": 20,
        "padding-bottom": 25
      }
    ],
    "settings": {
      "background-color": "#f8f9fa",
      "contentAreaBackgroundColor": "#ffffff",
      "width": 600,
      "linkColor": "#007BFF"
    },
    "metadata": {
      "title": "Product Newsletter",
      "subject": "Monthly Product Update - New Features Available!",
      "preheader": "Check out what's new this month",
      "lang": "en"
    }
  }
}
```

## Example 3: Event Invitation

```json
{
  "template": {
    "type": "email",
    "rows": [
      {
        "name": "Event Header",
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "title",
                "text": "You're Invited!",
                "title": "h1",
                "align": "center",
                "color": "#ffffff",
                "size": 32,
                "bold": true,
                "padding-top": 40,
                "padding-bottom": 10
              },
              {
                "type": "title",
                "text": "Annual Tech Conference 2025",
                "title": "h2",
                "align": "center",
                "color": "#ffffff",
                "size": 20,
                "bold": false,
                "padding-bottom": 40
              }
            ]
          }
        ],
        "background-color": "#6f42c1",
        "padding-top": 20,
        "padding-bottom": 20
      },
      {
        "name": "Event Details",
        "columns": [
          {
            "weight": 8,
            "modules": [
              {
                "type": "title",
                "text": "Event Details",
                "title": "h2",
                "align": "left",
                "color": "#333333",
                "size": 20,
                "bold": true,
                "padding-top": 25,
                "padding-bottom": 15
              },
              {
                "type": "paragraph",
                "text": "<strong>Date:</strong> March 15-16, 2025<br><strong>Time:</strong> 9:00 AM - 5:00 PM<br><strong>Location:</strong> Convention Center<br><strong>Address:</strong> 123 Tech Blvd, Innovation City",
                "align": "left",
                "color": "#555555",
                "size": 14,
                "line-height": 1.6,
                "padding-bottom": 20
              },
              {
                "type": "paragraph",
                "text": "Join industry leaders for two days of cutting-edge presentations, networking opportunities, and hands-on workshops.",
                "align": "left",
                "color": "#666666",
                "size": 14,
                "line-height": 1.5,
                "padding-bottom": 25
              }
            ]
          },
          {
            "weight": 4,
            "modules": [
              {
                "type": "image",
                "src": "https://via.placeholder.com/200x150/6f42c1/ffffff?text=Event",
                "alt": "Tech Conference",
                "padding-top": 25,
                "padding-bottom": 15,
                "padding-left": 20
              }
            ]
          }
        ],
        "background-color": "#ffffff",
        "padding-top": 20,
        "padding-bottom": 20
      },
      {
        "name": "CTA Section",
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "title",
                "text": "Reserve Your Spot Today",
                "title": "h2",
                "align": "center",
                "color": "#333333",
                "size": 22,
                "bold": true,
                "padding-top": 20,
                "padding-bottom": 15
              },
              {
                "type": "paragraph",
                "text": "Early bird pricing ends soon! Save $200 on your registration.",
                "align": "center",
                "color": "#dc3545",
                "size": 16,
                "bold": true,
                "padding-bottom": 20
              },
              {
                "type": "button",
                "text": "Register Now",
                "href": "https://example.com/conference/register",
                "target": "_blank",
                "align": "center",
                "background-color": "#28a745",
                "color": "#ffffff",
                "size": 18,
                "border-radius": 8,
                "padding-top": 10,
                "padding-bottom": 30,
                "contentPaddingTop": 15,
                "contentPaddingRight": 40,
                "contentPaddingBottom": 15,
                "contentPaddingLeft": 40
              }
            ]
          }
        ],
        "background-color": "#f8f9fa",
        "padding-top": 25,
        "padding-bottom": 25
      },
      {
        "name": "Footer",
        "columns": [
          {
            "weight": 12,
            "modules": [
              {
                "type": "paragraph",
                "text": "Questions? Contact us at events@company.com or call (555) 123-4567",
                "align": "center",
                "color": "#666666",
                "size": 14,
                "padding-top": 20,
                "padding-bottom": 10
              },
              {
                "type": "paragraph",
                "text": "© 2025 Tech Conference Organizers. All rights reserved.",
                "align": "center",
                "color": "#999999",
                "size": 12,
                "padding-bottom": 20
              }
            ]
          }
        ],
        "background-color": "#ffffff",
        "padding-top": 15,
        "padding-bottom": 20
      }
    ],
    "settings": {
      "background-color": "#e9ecef",
      "contentAreaBackgroundColor": "#ffffff",
      "width": 600,
      "linkColor": "#6f42c1"
    },
    "metadata": {
      "title": "Event Invitation",
      "subject": "You're Invited to Tech Conference 2025!",
      "preheader": "Reserve your spot for the biggest tech event of the year",
      "lang": "en"
    }
  }
}
```

## Usage with Cakemail MCP Server

### Creating a Campaign with BEE Template

1. **Use one of the above templates in your campaign creation:**

```javascript
// Using the Welcome Email template
await cakemail_create_campaign({
  "name": "Welcome Series - Email 1",
  "subject": "Welcome to Our Newsletter!",
  "list_id": "your-list-id",
  "sender_id": "your-sender-id",
  "content_type": "bee",
  "json_content": {
    // Paste the complete JSON template here
  }
});
```

2. **Validate a template before using:**

```javascript
await cakemail_validate_bee_template({
  "json_content": {
    // Your BEE template JSON
  }
});
```

3. **Generate templates programmatically:**

```javascript
// Create a basic template
const basicTemplate = await cakemail_create_bee_template({
  "title": "Welcome Email",
  "subject": "Welcome!",
  "backgroundColor": "#f8f9fa"
});

// Create a newsletter template
const newsletter = await cakemail_create_bee_newsletter({
  "title": "Monthly Update",
  "subject": "What's New This Month",
  "contentSections": [
    {
      "title": "Feature Update",
      "content": "We've added new functionality to improve your experience."
    }
  ]
});
```

## Template Customization Tips

1. **Colors**: Update the color scheme by changing `color`, `background-color`, and `linkColor` properties
2. **Images**: Replace placeholder URLs with your actual image URLs
3. **Content**: Modify the `text` properties in title and paragraph modules
4. **Links**: Update `href` properties in button and image modules
5. **Layout**: Adjust column `weight` values to change the layout proportions
6. **Spacing**: Modify padding values to adjust white space around elements

Remember to always validate your templates using `cakemail_validate_bee_template` before creating campaigns!
