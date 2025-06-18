export const campaignTools = [
  {
    name: 'cakemail_list_campaigns',
    description: 'List campaigns with filtering, sorting and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        per_page: { type: 'number', description: 'Items per page (default: 10, max: 50)' },
        status: { type: 'string', description: 'Filter by campaign status' },
        name: { type: 'string', description: 'Filter by campaign name' },
        type: { type: 'string', description: 'Filter by campaign type' },
        list_id: { type: 'string', description: 'Filter by list ID' },
        sort: { type: 'string', enum: ['name', 'created_on', 'scheduled_for', 'scheduled_on', 'updated_on', 'type'], description: 'Sort field (default: created_on)' },
        order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort direction (default: desc)' },
        with_count: { type: 'boolean', description: 'Include total count in response' },
        account_id: { type: 'number', description: 'Account ID for scoped access' },
      },
      required: [],
    },
  },
  {
    name: 'cakemail_get_latest_campaigns',
    description: 'Get the latest campaigns (shortcut for recent campaigns)',
    inputSchema: {
      type: 'object',
      properties: {
        count: { type: 'number', description: 'Number of latest campaigns to retrieve (default: 10, max: 50)' },
        status: { type: 'string', description: 'Filter by status (optional)' },
      },
      required: [],
    },
  },
  {
    name: 'cakemail_get_campaign',
    description: 'Get details of a specific campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to retrieve' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_create_campaign',
    description: 'Create a new email campaign (supports both HTML and BEEeditor JSON formats)',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Campaign name' },
        subject: { type: 'string', description: 'Email subject line' },
        html_content: { type: 'string', description: 'HTML email content (for HTML format)' },
        text_content: { type: 'string', description: 'Plain text email content (for HTML format)' },
        json_content: { type: 'object', description: 'BEEeditor JSON template (for BEE format)' },
        content_type: { type: 'string', enum: ['html', 'bee', 'auto-detect'], description: 'Content format type (default: html)' },
        list_id: { type: 'string', description: 'List ID to send to' },
        sender_id: { type: 'string', description: 'Sender ID to use' },
        from_name: { type: 'string', description: 'From name (optional)' },
        reply_to: { type: 'string', description: 'Reply-to email address (optional)' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['name', 'subject', 'list_id', 'sender_id'],
    },
  },
  {
    name: 'cakemail_update_campaign',
    description: 'Update an existing campaign (supports both HTML and BEEeditor JSON formats)',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to update' },
        name: { type: 'string', description: 'Campaign name' },
        subject: { type: 'string', description: 'Email subject line' },
        html_content: { type: 'string', description: 'HTML email content' },
        text_content: { type: 'string', description: 'Plain text email content' },
        json_content: { type: 'object', description: 'BEEeditor JSON template' },
        from_name: { type: 'string', description: 'From name' },
        reply_to: { type: 'string', description: 'Reply-to email address' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_send_campaign',
    description: 'Send or schedule a campaign for delivery',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to send' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_delete_campaign',
    description: 'Delete a campaign (permanent action)',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to delete' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_debug_campaign_access',
    description: 'Debug campaign access and test different access patterns',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Optional: specific campaign ID to test access' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: [],
    },
  },
  // Additional Campaign Operations
  {
    name: 'cakemail_render_campaign',
    description: 'Render a campaign for preview (get campaign content with personalization)',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to render' },
        contact_id: { type: 'number', description: 'Optional: Contact ID for personalization' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_send_test_email',
    description: 'Send test email(s) for a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to test' },
        emails: { type: 'array', items: { type: 'string' }, description: 'List of email addresses to send test to' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id', 'emails'],
    },
  },
  {
    name: 'cakemail_schedule_campaign',
    description: 'Schedule a campaign for future delivery',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to schedule' },
        scheduled_for: { type: 'string', description: 'Optional: Schedule datetime (ISO format). If not provided, sends immediately' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_unschedule_campaign',
    description: 'Unschedule a previously scheduled campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to unschedule' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_reschedule_campaign',
    description: 'Reschedule a campaign to a new datetime',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to reschedule' },
        scheduled_for: { type: 'string', description: 'New schedule datetime (ISO format)' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id', 'scheduled_for'],
    },
  },
  {
    name: 'cakemail_suspend_campaign',
    description: 'Suspend a running campaign (temporarily stop delivery)',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to suspend' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_resume_campaign',
    description: 'Resume a suspended campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to resume' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_cancel_campaign',
    description: 'Cancel a campaign (permanently stop and cannot be resumed)',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to cancel' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_archive_campaign',
    description: 'Archive a campaign (remove from active list but keep data)',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to archive' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_unarchive_campaign',
    description: 'Unarchive a campaign (restore to active list)',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to unarchive' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_get_campaign_revisions',
    description: 'Get revision history for a campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to get revisions for' },
        page: { type: 'number', description: 'Page number (default: 1)' },
        per_page: { type: 'number', description: 'Items per page (default: 50)' },
        with_count: { type: 'boolean', description: 'Include total count in response' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  {
    name: 'cakemail_get_campaign_links',
    description: 'Get all links in a campaign for tracking purposes',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string', description: 'Campaign ID to get links for' },
        page: { type: 'number', description: 'Page number (default: 1)' },
        per_page: { type: 'number', description: 'Items per page (default: 50)' },
        with_count: { type: 'boolean', description: 'Include total count in response' },
        account_id: { type: 'number', description: 'Optional Account ID for scoped access' },
      },
      required: ['campaign_id'],
    },
  },
  
  // BEEeditor specific tools
  {
    name: 'cakemail_create_bee_template',
    description: 'Create a basic BEEeditor template structure for newsletters',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Template title (default: Newsletter)' },
        subject: { type: 'string', description: 'Email subject (default: Newsletter Subject)' },
        preheader: { type: 'string', description: 'Email preheader text (optional)' },
        backgroundColor: { type: 'string', description: 'Background color (default: #f5f5f5)' },
        contentAreaBackgroundColor: { type: 'string', description: 'Content area background color (default: #ffffff)' },
        width: { type: 'number', description: 'Template width in pixels (default: 600, min: 320, max: 1440)' },
      },
      required: [],
    },
  },
  {
    name: 'cakemail_create_bee_newsletter',
    description: 'Create a complete BEEeditor newsletter template with header, content sections, and footer',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Newsletter title (default: Newsletter)' },
        subject: { type: 'string', description: 'Email subject (default: Newsletter Subject)' },
        preheader: { type: 'string', description: 'Email preheader text (optional)' },
        headerText: { type: 'string', description: 'Header text (defaults to title)' },
        contentSections: { 
          type: 'array', 
          description: 'Content sections for the newsletter',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Section title' },
              content: { type: 'string', description: 'Section content text' },
              imageUrl: { type: 'string', description: 'Optional image URL' },
              buttonText: { type: 'string', description: 'Optional button text' },
              buttonUrl: { type: 'string', description: 'Optional button URL' }
            },
            required: ['title', 'content']
          }
        },
        footerText: { type: 'string', description: 'Footer text (default: Thank you for reading!)' },
        backgroundColor: { type: 'string', description: 'Background color (default: #f5f5f5)' },
        contentAreaBackgroundColor: { type: 'string', description: 'Content area background color (default: #ffffff)' },
      },
      required: [],
    },
  },
  {
    name: 'cakemail_validate_bee_template',
    description: 'Validate a BEEeditor JSON template against the schema',
    inputSchema: {
      type: 'object',
      properties: {
        json_content: { type: 'object', description: 'BEEeditor JSON template to validate' },
      },
      required: ['json_content'],
    },
  },
];
