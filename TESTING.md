# Testing Guide for Cakemail MCP Server

This document provides information about the comprehensive unit testing setup for the Cakemail MCP Server.

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode (for development)
npm run test:watch

# Run tests for CI/CD
npm run test:ci
```

### Alternative Test Runner

You can also use the custom test runner:

```bash
# Run all tests
node test-runner.js

# Run specific test types
node test-runner.js unit
node test-runner.js integration
node test-runner.js coverage
node test-runner.js watch

# Get help
node test-runner.js --help
```

## Test Structure

```
tests/
├── setup.ts                 # Global test configuration
├── mocks/
│   └── index.ts             # Mock utilities and responses
├── api/
│   ├── base-client.test.ts  # Base API client tests
│   ├── email-api.test.ts    # Email API tests
│   └── ...                  # Other API tests
├── handlers/
│   ├── senders.test.ts      # Sender handler tests
│   ├── health.test.ts       # Health handler tests
│   └── ...                  # Other handler tests
└── integration/
    └── mcp-server.test.ts   # Full integration tests
```

## Writing Tests

### Basic Test Structure

```typescript
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('YourComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = yourFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Mocking API Calls

```typescript
import { mockFetch, createMockResponse } from '../mocks/index.js';

// Mock a successful response
mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

// Mock an error response
mockFetch.mockResolvedValueOnce(createMockResponse({ error: 'Not found' }, 404));
```

### Testing Async Functions

```typescript
it('should handle async operations', async () => {
  mockFetch.mockResolvedValueOnce(createMockResponse({ data: 'test' }));
  
  const result = await apiFunction();
  
  expect(result.data).toBe('test');
  expect(mockFetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/endpoint'),
    expect.objectContaining({ method: 'GET' })
  );
});
```

## Coverage Goals

The project aims for the following coverage targets:

- **Lines**: 85%+
- **Functions**: 90%+
- **Branches**: 80%+
- **Statements**: 85%+

View coverage reports in the `coverage/` directory after running `npm run test:coverage`.

## Configuration Files

- `jest.config.js` - Main Jest configuration
- `tsconfig.test.json` - TypeScript configuration for tests
- `tests/setup.ts` - Global test setup and mocks
- `.eslintrc.json` - ESLint configuration including test files

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocking**: Mock external dependencies (APIs, databases, etc.)
3. **Descriptive Names**: Use clear, descriptive test names
4. **AAA Pattern**: Structure tests with Arrange, Act, Assert
5. **Edge Cases**: Test both happy paths and error conditions
6. **Async Testing**: Properly handle async operations with `async/await`

## Continuous Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

The CI pipeline includes:
- Unit tests
- Integration tests
- Code coverage reporting
- Linting
- Build verification

## Debugging Tests

### Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- --testNamePattern="should send email"

# Run tests in a specific file
npm test -- tests/api/email-api.test.ts

# Debug with verbose output
npm test -- --verbose
```

### Common Issues

1. **Mock Not Working**: Ensure `jest.clearAllMocks()` in `beforeEach`
2. **Async Issues**: Use `async/await` and ensure all promises are awaited
3. **Import Errors**: Check module paths and ensure proper TypeScript configuration
4. **Timeout**: Increase timeout for slow operations with `jest.setTimeout()`

## Contributing

When adding new features:

1. Write tests before implementation (TDD)
2. Ensure all tests pass
3. Maintain or improve coverage percentage
4. Follow existing test patterns and naming conventions
5. Update this documentation if needed

## Useful Commands

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Build the project
npm run build

# Clean build artifacts
npm run clean

# Full rebuild
npm run rebuild
```
