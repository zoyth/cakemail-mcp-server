// Test configuration for different environments and scenarios

export interface TestConfig {
  apiMode: 'mock' | 'real';
  baseUrl?: string;
  credentials?: {
    username: string;
    password: string;
  };
  timeouts: {
    test: number;
    api: number;
  };
  retries: {
    enabled: boolean;
    maxAttempts: number;
  };
}

// Mock environment configuration
export const mockTestConfig: TestConfig = {
  apiMode: 'mock',
  timeouts: {
    test: 5000,     // 5 second test timeout
    api: 1000       // 1 second API timeout for mocks
  },
  retries: {
    enabled: false,
    maxAttempts: 1
  }
};

// Real API test configuration
export const realTestConfig: TestConfig = {
  apiMode: 'real',
  baseUrl: process.env.CAKEMAIL_TEST_BASE_URL || 'https://api.cakemail.dev',
  credentials: {
    username: process.env.CAKEMAIL_TEST_USERNAME || '',
    password: process.env.CAKEMAIL_TEST_PASSWORD || ''
  },
  timeouts: {
    test: 30000,    // 30 second test timeout
    api: 10000      // 10 second API timeout for real calls
  },
  retries: {
    enabled: true,
    maxAttempts: 3
  }
};

// Get configuration based on environment
export const getTestConfig = (): TestConfig => {
  const testMode = process.env.CAKEMAIL_TEST_MODE || 'mock';
  return testMode === 'real' ? realTestConfig : mockTestConfig;
};

// Test data sets for different scenarios
export const testDataSets = {
  // Basic CRUD operations
  crud: {
    sender: {
      create: {
        name: 'Test Sender',
        email: 'test-sender@example.com',
        language: 'en_US'
      },
      update: {
        name: 'Updated Sender',
        language: 'fr_FR'
      }
    },
    campaign: {
      create: {
        name: 'Test Campaign',
        subject: 'Test Subject',
        html_content: '<h1>Test Content</h1>',
        text_content: 'Test Content'
      }
    }
  },
  
  // Edge cases and validation
  validation: {
    invalidEmails: [
      'invalid',
      'test@',
      '@example.com',
      '',
      'very-long-email-address-that-exceeds-maximum-length@very-long-domain-name-that-should-fail-validation.com'
    ],
    validEmails: [
      'test@example.com',
      'user.name+tag@example.co.uk',
      'simple@domain.org'
    ],
    invalidDates: [
      '2023-02-29',  // Invalid leap year
      '2023-13-01',  // Invalid month
      '2023-01-32',  // Invalid day
      'invalid-date',
      '23-12-25'     // Wrong format
    ],
    validDates: [
      '2023-12-25',
      '2024-02-29',  // Valid leap year
      '2023-01-01'
    ]
  },
  
  // Performance testing
  performance: {
    bulkEmails: Array.from({ length: 100 }, (_, i) => ({
      email: `test${i}@example.com`,
      subject: `Test Email ${i}`,
      content: `Test content for email ${i}`
    })),
    largeLists: Array.from({ length: 1000 }, (_, i) => ({
      id: `item-${i}`,
      name: `Test Item ${i}`,
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    }))
  }
};

// Environment-specific overrides
export const environmentOverrides = {
  development: {
    verbose: true,
    slowMo: 100,  // Slow down operations for debugging
    screenshots: true
  },
  ci: {
    verbose: false,
    parallel: true,
    maxWorkers: 2
  },
  production: {
    verbose: false,
    strictMode: true,
    failFast: true
  }
};
