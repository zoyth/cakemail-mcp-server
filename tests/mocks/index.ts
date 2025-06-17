// Enhanced mock utilities and test data for Cakemail API testing

export const createMockResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: async () => data,
  text: async () => JSON.stringify(data),
  headers: new Map([['content-type', 'application/json']]),
});

// Mock authentication tokens
export const mockTokens = {
  valid: {
    access_token: 'mock_access_token_12345',
    refresh_token: 'mock_refresh_token_67890',
    expires_in: 3600,
    token_type: 'bearer'
  },
  expired: {
    access_token: 'expired_token',
    refresh_token: 'expired_refresh',
    expires_in: -1,
    token_type: 'bearer'
  }
};

// Mock sender data
export const mockSenders = {
  list: {
    data: [
      { 
        id: 'sender-001', 
        name: 'Marketing Team', 
        email: 'f+marketing@cakemail.com',
        language: 'en_US',
        status: 'verified',
        created_at: '2024-01-15T10:00:00Z'
      },
      { 
        id: 'sender-002', 
        name: 'Support Team', 
        email: 'f+support@cakemail.com',
        language: 'en_US',
        status: 'pending',
        created_at: '2024-01-16T11:30:00Z'
      }
    ],
    pagination: {
      page: 1,
      per_page: 10,
      total: 2,
      total_pages: 1
    }
  },
  single: {
    id: 'sender-001',
    name: 'Marketing Team',
    email: 'f+marketing@cakemail.com',
    language: 'en_US',
    status: 'verified',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  created: {
    id: 'sender-003',
    name: 'New Sender',
    email: 'f+new@cakemail.com',
    language: 'en_US',
    status: 'pending',
    created_at: new Date().toISOString()
  }
};

// Mock campaign data
export const mockCampaigns = {
  list: {
    data: [
      {
        id: 'campaign-001',
        name: 'Welcome Series',
        subject: 'Welcome to our platform!',
        status: 'sent',
        type: 'regular',
        created_at: '2024-01-10T09:00:00Z',
        sent_at: '2024-01-10T10:00:00Z',
        stats: {
          sent: 1000,
          delivered: 980,
          opened: 245,
          clicked: 89
        }
      },
      {
        id: 'campaign-002',
        name: 'Product Update',
        subject: 'New features available',
        status: 'draft',
        type: 'regular',
        created_at: '2024-01-12T14:30:00Z'
      }
    ],
    pagination: {
      page: 1,
      per_page: 10,
      total: 2,
      total_pages: 1
    }
  }
};

// Mock email data (Email API v2)
export const mockEmails = {
  submitResponse: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    status: 'queued',
    created_at: new Date().toISOString(),
    email: 'recipient@example.com'
  },
  getResponse: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    status: 'delivered',
    email: 'recipient@example.com',
    subject: 'Test Email',
    created_at: '2024-01-15T10:00:00Z',
    delivered_at: '2024-01-15T10:01:30Z',
    sender: {
      id: 'sender-001',
      name: 'Marketing Team',
      email: 'f+marketing@cakemail.com'
    }
  },
  logs: {
    data: [
      {
        id: 'log-001',
        email_id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'submitted',
        time: 1705316400,
        message: 'Email submitted for delivery'
      },
      {
        id: 'log-002',
        email_id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'delivered',
        time: 1705316490,
        message: 'Email delivered successfully'
      },
      {
        id: 'log-003',
        email_id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'open',
        time: 1705316800,
        message: 'Email opened by recipient'
      }
    ],
    pagination: {
      page: 1,
      per_page: 50,
      total: 3,
      total_pages: 1
    }
  }
};

// Mock account data
export const mockAccount = {
  self: {
    data: {
      id: 12345,
      name: 'Test Company',
      email: 'f+admin@cakemail.com',
      status: 'active',
      plan: 'professional',
      created_at: '2023-06-01T00:00:00Z'
    }
  }
};

// Mock health check responses
export const mockHealthChecks = {
  healthy: {
    status: 'healthy',
    authenticated: true,
    accountId: 12345,
    apiCompliance: 'v1.18.25',
    components: {
      retryManager: { 
        enabled: true,
        maxRetries: 3, 
        delay: 1000 
      },
      rateLimiter: 'disabled',
      circuitBreaker: {
        state: 'CLOSED',
        failureCount: 0,
        nextAttempt: null
      },
      requestQueue: { 
        pending: 0, 
        completed: 15,
        failed: 0
      },
      timeout: 30000
    },
    timestamp: new Date().toISOString()
  },
  unhealthy: {
    status: 'unhealthy',
    error: 'Authentication failed',
    errorType: 'CakemailAuthenticationError',
    statusCode: 401,
    authenticated: false,
    components: {
      circuitBreaker: {
        state: 'OPEN',
        failureCount: 5,
        nextAttempt: Date.now() + 60000
      },
      requestQueue: { 
        pending: 3, 
        completed: 8,
        failed: 5 
      }
    },
    timestamp: new Date().toISOString()
  }
};

// Mock error responses
export const mockErrors = {
  authentication: {
    error: 'invalid_credentials',
    error_description: 'The provided credentials are invalid'
  },
  notFound: {
    error: 'not_found',
    message: 'The requested resource was not found'
  },
  validation: {
    error: 'validation_error',
    message: 'Invalid email address format',
    details: {
      field: 'email',
      code: 'INVALID_FORMAT'
    }
  },
  rateLimit: {
    error: 'rate_limit_exceeded',
    message: 'Too many requests. Please try again later.',
    retry_after: 60
  }
};

// Consolidated export for easy access
export const mockCakemailResponses = {
  tokens: mockTokens,
  senders: mockSenders,
  campaigns: mockCampaigns,
  emails: mockEmails,
  account: mockAccount,
  health: mockHealthChecks,
  errors: mockErrors
};

// Utility functions for test scenarios
export const createTestScenarios = {
  // Create a successful email sending flow
  emailSendingFlow: () => [
    mockTokens.valid,           // Authentication
    mockAccount.self,           // Account verification
    mockEmails.submitResponse   // Email submission
  ],
  
  // Create an authentication failure scenario
  authFailureFlow: () => [
    mockErrors.authentication  // Auth failure
  ],
  
  // Create a sender management flow
  senderManagementFlow: () => [
    mockTokens.valid,          // Authentication
    mockSenders.list,          // Get senders
    mockSenders.created        // Create new sender
  ]
};

// Mock timing utilities
export const mockTiming = {
  // Fast response (successful operation)
  fast: () => new Promise(resolve => setTimeout(resolve, 10)),
  
  // Slow response (network delay)
  slow: () => new Promise(resolve => setTimeout(resolve, 2000)),
  
  // Timeout simulation
  timeout: () => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), 5000)
  )
};
