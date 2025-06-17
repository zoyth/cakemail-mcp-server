// Test fixtures with realistic data for comprehensive testing

export const senderFixtures = [
  {
    id: 'sender-marketing-001',
    name: 'Marketing Team',
    email: 'marketing@acme-corp.com',
    language: 'en_US',
    status: 'verified',
    created_at: '2024-01-15T10:00:00Z',
    verified_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'sender-support-002',
    name: 'Customer Support',
    email: 'support@acme-corp.com',
    language: 'en_US',
    status: 'verified',
    created_at: '2024-01-16T09:15:00Z',
    verified_at: '2024-01-16T09:45:00Z'
  },
  {
    id: 'sender-sales-003',
    name: 'Sales Team',
    email: 'sales@acme-corp.com',
    language: 'fr_FR',
    status: 'pending',
    created_at: '2024-01-17T14:20:00Z'
  }
];

export const campaignFixtures = [
  {
    id: 'campaign-welcome-001',
    name: 'Welcome Series - Email 1',
    subject: 'Welcome to Acme Corp! 🎉',
    status: 'sent',
    type: 'regular',
    sender_id: 'sender-marketing-001',
    list_id: 'list-new-users',
    created_at: '2024-01-10T09:00:00Z',
    sent_at: '2024-01-10T10:00:00Z',
    stats: {
      sent: 1245,
      delivered: 1220,
      bounced: 25,
      opened: 610,
      clicked: 183,
      unsubscribed: 3,
      spam_reports: 1
    }
  },
  {
    id: 'campaign-newsletter-002',
    name: 'Monthly Newsletter - February',
    subject: 'New features and updates this month',
    status: 'scheduled',
    type: 'regular',
    sender_id: 'sender-marketing-001',
    list_id: 'list-subscribers',
    created_at: '2024-01-25T11:30:00Z',
    scheduled_for: '2024-02-01T08:00:00Z'
  },
  {
    id: 'campaign-promo-003',
    name: 'Flash Sale - 24 Hours Only',
    subject: '⚡ 50% OFF Everything - Limited Time!',
    status: 'draft',
    type: 'promotional',
    sender_id: 'sender-marketing-001',
    created_at: '2024-01-28T16:45:00Z'
  }
];

export const emailFixtures = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'john.doe@example.com',
    subject: 'Welcome to our platform!',
    status: 'delivered',
    sender: {
      id: 'sender-marketing-001',
      name: 'Marketing Team',
      email: 'marketing@acme-corp.com'
    },
    content: {
      html: '<h1>Welcome!</h1><p>Thanks for joining us.</p>',
      text: 'Welcome!\n\nThanks for joining us.',
      type: 'marketing'
    },
    tracking: {
      open: true,
      click: true
    },
    created_at: '2024-01-15T10:00:00Z',
    delivered_at: '2024-01-15T10:01:30Z',
    opened_at: '2024-01-15T11:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'jane.smith@company.com',
    subject: 'Password reset request',
    status: 'delivered',
    sender: {
      id: 'sender-support-002',
      name: 'Customer Support',
      email: 'support@acme-corp.com'
    },
    content: {
      html: '<p>Click <a href="#reset">here</a> to reset your password.</p>',
      text: 'Click here to reset your password: [reset link]',
      type: 'transactional'
    },
    tracking: {
      open: true,
      click: true
    },
    created_at: '2024-01-16T14:22:00Z',
    delivered_at: '2024-01-16T14:22:45Z',
    opened_at: '2024-01-16T14:25:12Z',
    clicked_at: '2024-01-16T14:25:30Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'bounce@invalid-domain.xyz',
    subject: 'Newsletter signup confirmation',
    status: 'bounced',
    sender: {
      id: 'sender-marketing-001',
      name: 'Marketing Team',
      email: 'marketing@acme-corp.com'
    },
    content: {
      html: '<p>Please confirm your newsletter subscription.</p>',
      text: 'Please confirm your newsletter subscription.',
      type: 'marketing'
    },
    created_at: '2024-01-17T09:15:00Z',
    bounced_at: '2024-01-17T09:15:30Z',
    bounce_reason: 'Domain does not exist'
  }
];

export const logFixtures = [
  {
    id: 'log-001',
    email_id: '550e8400-e29b-41d4-a716-446655440001',
    type: 'submitted',
    time: 1705314000,
    message: 'Email submitted for delivery',
    provider: 'sendgrid'
  },
  {
    id: 'log-002',
    email_id: '550e8400-e29b-41d4-a716-446655440001',
    type: 'delivered',
    time: 1705314090,
    message: 'Email delivered successfully',
    provider: 'sendgrid'
  },
  {
    id: 'log-003',
    email_id: '550e8400-e29b-41d4-a716-446655440001',
    type: 'open',
    time: 1705319400,
    message: 'Email opened by recipient',
    provider: 'sendgrid',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    ip_address: '192.168.1.100'
  },
  {
    id: 'log-004',
    email_id: '550e8400-e29b-41d4-a716-446655440002',
    type: 'click',
    time: 1705319418,
    message: 'Link clicked in email',
    provider: 'sendgrid',
    url: 'https://acme-corp.com/reset-password?token=abc123',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    ip_address: '192.168.1.100'
  },
  {
    id: 'log-005',
    email_id: '550e8400-e29b-41d4-a716-446655440003',
    type: 'bounce',
    time: 1705408530,
    message: 'Email bounced due to invalid domain',
    provider: 'sendgrid',
    bounce_type: 'hard',
    bounce_reason: 'Domain does not exist'
  }
];

export const accountFixtures = [
  {
    id: 12345,
    name: 'Acme Corporation',
    email: 'admin@acme-corp.com',
    status: 'active',
    plan: 'professional',
    limits: {
      emails_per_month: 50000,
      emails_used: 12450,
      senders_max: 10,
      senders_used: 3
    },
    created_at: '2023-06-01T00:00:00Z',
    last_login: '2024-01-28T09:30:00Z'
  }
];

export const errorScenarios = [
  {
    name: 'Authentication Failure',
    request: { username: 'invalid', password: 'wrong' },
    response: {
      status: 401,
      body: {
        error: 'invalid_credentials',
        error_description: 'The provided credentials are invalid'
      }
    }
  },
  {
    name: 'Invalid Email Format',
    request: { email: 'not-an-email' },
    response: {
      status: 400,
      body: {
        error: 'validation_error',
        message: 'Invalid email address format',
        field: 'email'
      }
    }
  },
  {
    name: 'Rate Limit Exceeded',
    request: { rapid_requests: true },
    response: {
      status: 429,
      body: {
        error: 'rate_limit_exceeded',
        message: 'Too many requests. Please try again later.',
        retry_after: 60
      }
    }
  },
  {
    name: 'Resource Not Found',
    request: { id: 'non-existent-id' },
    response: {
      status: 404,
      body: {
        error: 'not_found',
        message: 'The requested resource was not found'
      }
    }
  }
];

// Helper function to get fixture by ID
export const getFixtureById = (fixtures: any[], id: string) => {
  return fixtures.find(fixture => fixture.id === id);
};

// Helper function to create paginated response
export const createPaginatedResponse = (data: any[], page = 1, perPage = 10) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedData = data.slice(start, end);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      per_page: perPage,
      total: data.length,
      total_pages: Math.ceil(data.length / perPage)
    }
  };
};

// Helper function to simulate API delays
export const simulateDelay = (ms: number = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
