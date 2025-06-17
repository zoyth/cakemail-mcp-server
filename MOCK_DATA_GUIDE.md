# Mock Data Configuration Guide

## 📋 Overview

The Cakemail MCP Server testing framework provides a comprehensive mock data system that allows you to test various scenarios without making real API calls. This guide explains how the mock data is structured and how to use it effectively.

## 🗂 File Structure

```
tests/
├── mocks/
│   └── index.ts           # Core mock utilities and responses
├── fixtures/
│   └── index.ts           # Realistic test data fixtures
├── config/
│   └── test-config.ts     # Environment and scenario configurations
└── examples/
    └── enhanced-senders.test.ts  # Example of using rich mock data
```

## 🛠 Mock Data Components

### 1. **Core Mock Utilities** (`tests/mocks/index.ts`)

#### `createMockResponse(data, status)`
Creates mock HTTP responses for API calls:
```typescript
const mockResponse = createMockResponse({ success: true }, 200);
// Returns: { ok: true, status: 200, json: async () => data, ... }
```

#### `mockCakemailResponses`
Pre-defined API responses for common operations:
```typescript
import { mockCakemailResponses } from '../mocks/index.js';

// Use in tests
mockAPI.senders.getSenders.mockResolvedValue(mockCakemailResponses.senders.list);
```

#### `createTestScenarios`
Pre-built test flows for common operations:
```typescript
const emailFlow = createTestScenarios.emailSendingFlow();
// Returns: [authToken, accountData, emailResponse]
```

### 2. **Test Fixtures** (`tests/fixtures/index.ts`)

#### Realistic Data Sets
- **`senderFixtures`**: Complete sender profiles with multiple languages
- **`campaignFixtures`**: Various campaign types (welcome, newsletter, promotional)
- **`emailFixtures`**: Email delivery scenarios (delivered, bounced, opened)
- **`logFixtures`**: Email activity logs with timestamps and metadata

#### Helper Functions
```typescript
import { createPaginatedResponse, getFixtureById } from '../fixtures/index.js';

// Create paginated mock responses
const page1 = createPaginatedResponse(senderFixtures, 1, 10);

// Find specific fixtures
const marketingSender = getFixtureById(senderFixtures, 'sender-marketing-001');
```

### 3. **Test Configuration** (`tests/config/test-config.ts`)

#### Environment Configurations
```typescript
import { getTestConfig, testDataSets } from '../config/test-config.js';

const config = getTestConfig(); // Returns mock or real API config
```

#### Validation Data Sets
```typescript
// Test with known invalid emails
testDataSets.validation.invalidEmails.forEach(email => {
  // Test validation logic
});

// Test with valid emails
testDataSets.validation.validEmails.forEach(email => {
  // Test success scenarios
});
```

## 🎯 Usage Patterns

### Pattern 1: Simple Mock Response
```typescript
it('should handle basic API response', async () => {
  const mockAPI = createMockAPI();
  mockAPI.senders.getSenders.mockResolvedValue({
    data: [{ id: '1', name: 'Test', email: 'test@example.com' }]
  });
  
  const result = await handler({}, mockAPI);
  expect(result.content[0].text).toContain('Test');
});
```

### Pattern 2: Using Fixtures for Realistic Data
```typescript
it('should handle realistic sender data', async () => {
  const mockAPI = createMockAPI();
  const paginatedSenders = createPaginatedResponse(senderFixtures, 1, 5);
  
  mockAPI.senders.getSenders.mockResolvedValue(paginatedSenders);
  
  const result = await handler({ page: 1 }, mockAPI);
  expect(result.content[0].text).toContain('Marketing Team');
});
```

### Pattern 3: Testing Validation with Data Sets
```typescript
it('should validate email formats', async () => {
  const mockAPI = createMockAPI();
  
  for (const invalidEmail of testDataSets.validation.invalidEmails) {
    const result = await createSender({ email: invalidEmail }, mockAPI);
    expect(result.isError).toBe(true);
  }
});
```

### Pattern 4: Error Scenarios
```typescript
it('should handle authentication errors', async () => {
  const mockAPI = createMockAPI();
  mockAPI.senders.getSenders.mockRejectedValue(
    new Error(mockCakemailResponses.errors.authentication.error_description)
  );
  
  const result = await handler({}, mockAPI);
  expect(result.isError).toBe(true);
});
```

### Pattern 5: Complex Scenarios
```typescript
it('should handle complete workflow', async () => {
  const mockAPI = createMockAPI();
  const scenario = createTestScenarios.emailSendingFlow();
  
  // Setup multiple API calls in sequence
  mockAPI.authenticate.mockResolvedValue(scenario[0]);
  mockAPI.account.getSelf.mockResolvedValue(scenario[1]);
  mockAPI.email.sendEmail.mockResolvedValue(scenario[2]);
  
  // Test the workflow
  const result = await completeEmailWorkflow(mockAPI);
  expect(result.success).toBe(true);
});
```

## 🔧 Customizing Mock Data

### Adding New Fixtures
```typescript
// In tests/fixtures/index.ts
export const myCustomFixtures = [
  {
    id: 'custom-001',
    name: 'Custom Test Data',
    // ... your data
  }
];
```

### Creating Custom Scenarios
```typescript
// In tests/mocks/index.ts
export const createCustomScenarios = {
  myWorkflow: () => [
    // Array of mock responses for your specific workflow
  ]
};
```

### Environment-Specific Overrides
```typescript
// In tests/config/test-config.ts
const myTestConfig = {
  ...mockTestConfig,
  timeouts: { test: 10000, api: 2000 }, // Custom timeouts
  customSettings: { enableDebug: true }
};
```

## 📊 Mock Data Categories

### **Authentication & Security**
- Valid/expired tokens
- Authentication failures
- Rate limiting scenarios
- Permission errors

### **Business Objects**
- Senders (verified, pending, multiple languages)
- Campaigns (draft, sent, scheduled, with stats)
- Emails (delivered, bounced, opened, clicked)
- Accounts (active, suspended, with limits)

### **Validation & Edge Cases**
- Invalid email formats
- Invalid date formats
- Boundary value testing
- Malformed request data

### **Performance & Load**
- Bulk operations data
- Large data sets
- Timeout simulations
- Concurrent request scenarios

## 🚀 Best Practices

### 1. **Use Realistic Data**
```typescript
// ❌ Don't use oversimplified data
const sender = { id: '1', name: 'Test' };

// ✅ Use fixture data that matches real API responses
const sender = senderFixtures[0]; // Complete with all fields
```

### 2. **Test Edge Cases**
```typescript
// ✅ Test boundary conditions
testDataSets.validation.invalidEmails.forEach(email => {
  // Test each invalid email format
});
```

### 3. **Mock Realistic Timing**
```typescript
// ✅ Add realistic delays for async operations
await simulateDelay(100); // Simulate network latency
```

### 4. **Use Scenario-Based Testing**
```typescript
// ✅ Test complete workflows, not just individual functions
const scenario = createTestScenarios.emailSendingFlow();
// Test the entire flow from auth to email delivery
```

### 5. **Environment Awareness**
```typescript
// ✅ Configure tests based on environment
const config = getTestConfig();
if (config.apiMode === 'real') {
  // Different behavior for real API tests
}
```

## 🔍 Debugging Mock Data

### Enable Verbose Logging
```typescript
const config = getTestConfig();
if (config.verbose) {
  console.log('Mock API call:', mockAPI.lastCall);
}
```

### Inspect Mock Calls
```typescript
expect(mockAPI.senders.getSenders).toHaveBeenCalledWith({
  page: 1,
  per_page: 10
});
```

### Validate Mock Responses
```typescript
const response = mockAPI.senders.getSenders.mock.results[0].value;
expect(response.data).toBeDefined();
expect(response.pagination).toBeDefined();
```

This comprehensive mock data system provides you with everything needed to test your Cakemail MCP Server thoroughly without relying on external API calls, while still maintaining realistic test scenarios that reflect real-world usage patterns.
