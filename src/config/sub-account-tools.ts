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
        with_count: { type: 'boolean', description: 'Include total count in response (default: true)' },
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
  {
    name: 'cakemail_get_sub_account',
    description: 'Get specific sub-account details',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Sub-account ID (alphanumeric, 1-20 characters)' },
      },
      required: ['account_id'],
    },
  },
  {
    name: 'cakemail_update_sub_account',
    description: 'Update sub-account information',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Sub-account ID (must be convertible to integer for updates)' },
        name: { type: 'string', description: 'Account holder name' },
        email: { type: 'string', description: 'Account email address' },
        company: { type: 'string', description: 'Company name' },
        language: { type: 'string', description: 'Account language (e.g., en_US)' },
        timezone: { type: 'string', description: 'Account timezone' },
        country: { type: 'string', description: 'Country code' },
        phone: { type: 'string', description: 'Phone number' },
        website: { type: 'string', description: 'Website URL' },
        description: { type: 'string', description: 'Account description' },
      },
      required: ['account_id'],
    },
  },
  {
    name: 'cakemail_delete_sub_account',
    description: 'Delete a sub-account (permanent action)',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Sub-account ID (alphanumeric, 1-20 characters)' },
      },
      required: ['account_id'],
    },
  },
  {
    name: 'cakemail_suspend_sub_account',
    description: 'Suspend sub-account access',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Sub-account ID (must be convertible to integer for suspend operations)' },
      },
      required: ['account_id'],
    },
  },
  {
    name: 'cakemail_unsuspend_sub_account',
    description: 'Restore sub-account access',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Sub-account ID (must be convertible to integer for unsuspend operations)' },
      },
      required: ['account_id'],
    },
  },
  {
    name: 'cakemail_verify_sub_account_email',
    description: 'Email verification workflows - either verify with code or resend verification email',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Sub-account ID (alphanumeric, 1-20 characters)' },
        verification_code: { type: 'string', description: 'Verification code received via email (to confirm email)' },
        email: { type: 'string', description: 'Email address (to resend verification email)' },
      },
      required: ['account_id'],
    },
  },
  {
    name: 'cakemail_resend_sub_account_verification',
    description: 'Resend verification emails',
    inputSchema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', description: 'Email address to resend verification to' },
      },
      required: ['email'],
    },
  },
  {
    name: 'cakemail_convert_sub_account_to_organization',
    description: 'Account type conversion - convert sub-account to organization',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Sub-account ID (must be convertible to integer for conversion)' },
        migrate_owner: { type: 'boolean', description: 'Migrate account owner (default: true)' },
      },
      required: ['account_id'],
    },
  },
  {
    name: 'cakemail_debug_sub_account_access',
    description: 'Debug sub-account permissions and access',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: { type: 'string', description: 'Optional: specific sub-account ID to test access for' },
      },
      required: [],
    },
  },
];
