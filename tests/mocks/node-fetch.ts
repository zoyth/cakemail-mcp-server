// Mock for node-fetch to prevent real API calls during tests
import { jest } from '@jest/globals';

export const mockFetch = jest.fn();

// Mock response helper
export const createMockResponse = (
  data: any,
  status: number = 200,
  statusText: string = 'OK',
  contentType: string = 'application/json'
) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText,
  headers: {
    get: (key: string) => {
      if (key.toLowerCase() === 'content-type') {
        return contentType;
      }
      return null;
    }
  },
  json: async () => data,
  text: async () => typeof data === 'string' ? data : JSON.stringify(data)
});

// Mock error response helper
export const createMockErrorResponse = (
  status: number,
  statusText: string,
  errorData: any = null
) => ({
  ok: false,
  status,
  statusText,
  headers: {
    get: (key: string) => {
      if (key.toLowerCase() === 'content-type') {
        return 'application/json';
      }
      return null;
    }
  },
  json: async () => errorData || { detail: statusText },
  text: async () => errorData ? JSON.stringify(errorData) : statusText
});

// Reset fetch mock
export const resetFetchMock = () => {
  mockFetch.mockReset();
};

// Setup fetch mock with default behavior
export const setupFetchMock = () => {
  mockFetch.mockImplementation(async (url: string, options?: any) => {
    // Default to 404 for unhandled routes
    return createMockErrorResponse(404, 'Not Found', {
      detail: 'Endpoint not mocked'
    });
  });
};

// Export as default to replace node-fetch
export default mockFetch;
