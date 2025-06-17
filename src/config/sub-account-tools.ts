export const subAccountTools = [
  {
    name: 'cakemail_list_sub_accounts',
    description: 'List all sub-accounts with filtering and pagination (Enterprise feature)',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number (default: 1)' },
        per_page: { type: 'number', description: 'Items per page (default: 50, max: 100)' },
        status: { type: 'string', enum: ['pending', 'active', 'suspended', 'inactive'], description: 'Filter by account status' },
        name: { type: 'string', description: 'Filter by account name (partial match)' },
        recursive: { type: 'boolean', description: 'Include sub-accounts of sub-accounts' },
        partner_account_id: { type: 'number', description: 'Filter by partner account ID' },
      },
      required: [],
    },
  },
  {
    name: 'cakemail_create_sub_account',
    description: 'Create a new sub-account (Enterprise feature)',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Account holder name' },
        email: { type: 'string', description: 'Account email address' },
        password: { type: 'string', description: 'Account password (minimum 8 characters)' },
        company: { type: 'string', description: 'Company name' },
        language: { type: 'string', description: 'Account language (e.g., en_US)' },
        timezone: { type: 'string', description: 'Account timezone' },
        country: { type: 'string', description: 'Country code' },
        phone: { type: 'string', description: 'Phone number' },
        website: { type: 'string', description: 'Website URL' },
        description: { type: 'string', description: 'Account description' },
        partner_account_id: { type: 'number', description: 'Partner account ID' },
        skip_verification: { type: 'boolean', description: 'Skip email verification (default: false)' },
      },
      required: ['name', 'email', 'password'],
    },
  },
  // ... other sub-account tools
];
