// Mock node-fetch globally
import { jest } from '@jest/globals';

const mockFetch = jest.fn();

// Create a proper mock Response object
const createMockResponse = (data: any, options: {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
} = {}) => {
  const status = options.status || 200;
  const statusText = options.statusText || 'OK';
  const headers = {
    'content-type': 'application/json',
    ...options.headers
  };
  
  return {
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
    clone: jest.fn().mockReturnThis(),
    body: null,
    bodyUsed: false,
    url: 'https://api.cakemail.com',
    type: 'basic' as ResponseType,
    redirected: false
  };
};

// Add debugging and better default implementation
mockFetch.mockImplementation((url: string, options?: any) => {
  console.log('Mock fetch called with:', { url, options });
  
  // Default successful response
  const defaultResponse = {
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: {
      get: () => 'application/json',
      has: () => true,
      forEach: () => {}
    },
    json: () => Promise.resolve({ data: [] }),
    text: () => Promise.resolve('{}'),
    clone: () => mockFetch(),
    body: null,
    bodyUsed: false,
    url: url || 'https://api.cakemail.com',
    type: 'basic',
    redirected: false,
    size: 0,
    buffer: () => Promise.resolve(Buffer.from('')),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    blob: () => Promise.resolve(new Blob())
  } as any;
  
  return Promise.resolve(defaultResponse);
});

// Export as default (ES module)
export default mockFetch;

// Also export named export for compatibility
export { mockFetch };
