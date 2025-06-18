// Template Tools Configuration

export const templateTools = [
  {
    name: 'cakemail_list_templates',
    description: 'List available templates with filtering, sorting and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        per_page: {
          type: 'number',
          description: 'Number of templates per page (default: 50, max: 100)',
          minimum: 1,
          maximum: 100
        },
        with_count: {
          type: 'boolean',
          description: 'Include total count in response'
        },
        filter: {
          type: 'string',
          description: 'Filter templates using syntax: term==value;term2==value2. Valid terms: tag, name, is_owner, is_not_owner'
        },
        sort: {
          type: 'string',
          description: 'Sort field with direction using syntax [-|+]term. Valid terms: id, created_on, updated_on, name',
          default: 'id'
        },
        account_id: {
          type: 'number',
          description: 'Optional account ID for scoped access'
        }
      }
    }
  },

  {
    name: 'cakemail_create_template',
    description: 'Create a new email template',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Template name',
          minLength: 1
        },
        description: {
          type: 'string',
          description: 'Template description (optional)'
        },
        content: {
          type: 'object',
          description: 'Template content object',
          properties: {
            type: {
              type: 'string',
              description: 'Content type',
              enum: ['html', 'text', 'bee', 'custom']
            },
            subject: {
              type: 'string',
              description: 'Email subject line'
            },
            html: {
              type: 'string',
              description: 'HTML content',
              minLength: 1
            },
            text: {
              type: 'string',
              description: 'Plain text content',
              minLength: 1
            },
            json: {
              type: 'object',
              description: 'JSON content for advanced templates'
            }
          },
          required: ['type']
        },
        tags: {
          type: 'array',
          description: 'Template tags for organization',
          items: {
            type: 'string'
          }
        },
        account_id: {
          type: 'number',
          description: 'Optional account ID for scoped access'
        }
      },
      required: ['name', 'content']
    }
  },

  {
    name: 'cakemail_get_template',
    description: 'Get details of a specific template',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: ['string', 'number'],
          description: 'Template ID to retrieve'
        },
        account_id: {
          type: 'number',
          description: 'Optional account ID for scoped access'
        }
      },
      required: ['template_id']
    }
  },

  {
    name: 'cakemail_update_template',
    description: 'Update an existing template',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: ['string', 'number'],
          description: 'Template ID to update'
        },
        name: {
          type: 'string',
          description: 'Updated template name',
          minLength: 1
        },
        description: {
          type: 'string',
          description: 'Updated template description'
        },
        content: {
          type: 'object',
          description: 'Updated template content object',
          properties: {
            type: {
              type: 'string',
              description: 'Content type',
              enum: ['html', 'text', 'bee', 'custom']
            },
            subject: {
              type: 'string',
              description: 'Email subject line'
            },
            html: {
              type: 'string',
              description: 'HTML content',
              minLength: 1
            },
            text: {
              type: 'string',
              description: 'Plain text content',
              minLength: 1
            },
            json: {
              type: 'object',
              description: 'JSON content for advanced templates'
            }
          }
        },
        tags: {
          type: 'array',
          description: 'Updated template tags',
          items: {
            type: 'string'
          }
        },
        account_id: {
          type: 'number',
          description: 'Optional account ID for scoped access'
        }
      },
      required: ['template_id']
    }
  },

  {
    name: 'cakemail_delete_template',
    description: 'Delete a template (permanent action)',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: ['string', 'number'],
          description: 'Template ID to delete'
        },
        account_id: {
          type: 'number',
          description: 'Optional account ID for scoped access'
        }
      },
      required: ['template_id']
    }
  },

  {
    name: 'cakemail_duplicate_template',
    description: 'Create a copy of an existing template',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: ['string', 'number'],
          description: 'Template ID to duplicate'
        },
        new_name: {
          type: 'string',
          description: 'Name for the duplicated template',
          minLength: 1
        },
        new_description: {
          type: 'string',
          description: 'Description for the duplicated template (optional, will auto-generate if not provided)'
        },
        account_id: {
          type: 'number',
          description: 'Optional account ID for scoped access'
        }
      },
      required: ['template_id', 'new_name']
    }
  },

  {
    name: 'cakemail_render_template',
    description: 'Render a template to get HTML preview',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: ['string', 'number'],
          description: 'Template ID to render'
        },
        account_id: {
          type: 'number',
          description: 'Optional account ID for scoped access'
        }
      },
      required: ['template_id']
    }
  }
];
