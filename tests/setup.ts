import { jest } from '@jest/globals';

// Global test configuration
jest.setTimeout(10000);

// Mock environment variables
process.env.CAKEMAIL_USERNAME = 'test_user';
process.env.CAKEMAIL_PASSWORD = 'test_password';

// Disable console output during tests unless specifically needed
const originalConsole = console;
global.console = {
  ...originalConsole,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  debug: jest.fn(),
};

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
