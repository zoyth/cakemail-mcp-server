// Global test setup
import { jest } from '@jest/globals';

// No need to mock node-fetch here; handled by moduleNameMapper
// Export nothing, or export helpers if needed

// Suppress console errors and warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    // Only log if it's not an expected error
    if (!args[0]?.toString().includes('SSL') && 
        !args[0]?.toString().includes('EPROTO') &&
        !args[0]?.toString().includes('handshake failure')) {
      originalError.apply(console, args);
    }
  };
  console.warn = (...args: any[]) => {
    // Only log if it's not an expected warning
    if (!args[0]?.toString().includes('SSL')) {
      originalWarn.apply(console, args);
    }
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
