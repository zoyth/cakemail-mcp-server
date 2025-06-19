import { jest } from '@jest/globals';

export const createMockResponse = (data: any, options: {
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
  
  const mockResponse = {
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
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data)),
    clone: () => mockResponse,
    body: null,
    bodyUsed: false,
    url: 'https://api.cakemail.com',
    type: 'basic' as ResponseType,
    redirected: false,
    size: 0,
    buffer: () => Promise.resolve(Buffer.from('')),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    blob: () => Promise.resolve(new Blob())
  };
  
  return mockResponse as any;
};

export const createMockErrorResponse = (status: number, message: string, detail?: any) => {
  const errorData = detail || { error: message, detail: message };
  
  return createMockResponse(errorData, {
    status,
    statusText: message
  });
};
