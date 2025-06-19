import { jest } from '@jest/globals';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { EnhancedCakemailConfig } from '../../src/api/base-client.js';

export const createMockToken = (): CakemailToken => ({
  access_token: 'mock-access-token',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh-token',
  accounts: [12345]
});

export const createMockConfig = (overrides?: Partial<EnhancedCakemailConfig>): EnhancedCakemailConfig => ({
  username: 'test@example.com',
  password: 'test-password',
  baseUrl: 'https://mock-api.test', // Use a mock base URL to prevent real requests
  debug: false, // Disable debug logging in tests
  timeout: 5000, // Reasonable timeout for tests
  retry: {
    enabled: false, // Disable retries in tests
    maxRetries: 0,
    initialDelay: 0,
    maxDelay: 0,
    backoffMultiplier: 1,
    retryableStatuses: [] // Don't retry any status codes
  },
  rateLimit: {
    enabled: false, // Disable rate limiting in tests
    requestsPerSecond: 1000,
    burst: 1000
  },
  circuitBreaker: {
    enabled: false, // Disable circuit breaker in tests
    failureThreshold: 100,
    resetTimeout: 0
  },
  ...overrides
});

export const setupMockApi = <T extends { setMockToken: (token: CakemailToken) => void }>(
  ApiClass: new (...args: any[]) => T,
  configOverrides?: Partial<EnhancedCakemailConfig>
): T => {
  const config = createMockConfig(configOverrides);
  const api = new ApiClass(config);
  api.setMockToken(createMockToken());
  return api;
};

// Helper to create mock responses that match the Response interface
export const createMockResponse = (data: any, options?: {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
}) => {
  const status = options?.status || 200;
  const statusText = options?.statusText || 'OK';
  const headers = {
    'content-type': 'application/json',
    ...options?.headers
  };
  
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: {
      get: (key: string) => headers[key.toLowerCase()] || null,
      has: (key: string) => key.toLowerCase() in headers,
      forEach: (callback: (value: string, key: string) => void) => {
        Object.entries(headers).forEach(([key, value]) => callback(value, key));
      }
    },
    json: jest.fn().mockResolvedValue(data),
    text: jest.fn().mockResolvedValue(typeof data === 'string' ? data : JSON.stringify(data)),
    blob: jest.fn().mockResolvedValue(new Blob([JSON.stringify(data)])),
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    clone: jest.fn().mockReturnThis(),
    body: null,
    bodyUsed: false,
    url: options?.headers?.url || 'https://mock-api.test',
    type: 'basic',
    redirected: false
  });
};

// Helper to create error responses
export const createErrorResponse = (status: number, message: string, detail?: any) => {
  const errorData = detail || { error: message, detail: message };
  
  return Promise.resolve({
    ok: false,
    status,
    statusText: message,
    headers: {
      get: (key: string) => key.toLowerCase() === 'content-type' ? 'application/json' : null,
      has: (key: string) => key.toLowerCase() === 'content-type',
      forEach: (callback: (value: string, key: string) => void) => {
        callback('application/json', 'content-type');
      }
    },
    json: jest.fn().mockResolvedValue(errorData),
    text: jest.fn().mockResolvedValue(detail ? JSON.stringify(detail) : message),
    blob: jest.fn().mockResolvedValue(new Blob([JSON.stringify(errorData)])),
    arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    clone: jest.fn().mockReturnThis(),
    body: null,
    bodyUsed: false,
    url: 'https://mock-api.test',
    type: 'basic',
    redirected: false
  });
};
