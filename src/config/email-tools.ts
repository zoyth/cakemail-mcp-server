export const emailTools = [
  {
    name: 'cakemail_send_email',
    description: 'Send an email using Cakemail Email API (supports both transactional and marketing emails)',
    inputSchema: {
      type: 'object',
      properties: {
        to_email: { type: 'string', description: 'Recipient email address' },
        to_name: { type: 'string', description: 'Recipient name' },
        sender_id: { type: 'string', description: 'Sender ID to use' },
        subject: { type: 'string', description: 'Email subject' },
        html_content: { type: 'string', description: 'HTML email content' },
        text_content: { type: 'string', description: 'Plain text email content' },
        template_id: { type: 'string', description: 'Template ID to use' },
        list_id: { type: 'string', description: 'List ID (optional - will auto-select if not provided)' },
        email_type: { type: 'string', enum: ['transactional', 'marketing'], description: 'Email type (defaults to transactional)' },
      },
      required: ['to_email', 'sender_id', 'subject'],
    },
  }
];
