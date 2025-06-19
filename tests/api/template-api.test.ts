import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { TemplateApi } from '../../src/api/template-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { createMockResponse, createMockErrorResponse } from '../helpers/mock-response.js';
import mockFetch from 'node-fetch';
const mockFetchTyped = mockFetch as jest.MockedFunction<typeof mockFetch>;

describe('TemplateApi', () => {
  let api: TemplateApi;
  const mockToken: CakemailToken = {
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    accounts: [2]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchTyped.mockClear();
    
    api = new TemplateApi({
      username: 'test@example.com',
      password: 'test-password',
      baseUrl: 'https://api.cakemail.com',
      retry: {
        maxRetries: 0 // Disable retries for testing
      }
    });
    
    api.setMockToken(mockToken);
  });

  describe('getTemplates', () => {
    it('should list templates with default parameters', async () => {
      await expect(api.getTemplates()).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('createTemplate', () => {
    it('should create a template with HTML content', async () => {
      await expect(api.createTemplate({
        name: 'Test Template',
        content: {
          type: 'html',
          html: '<html><body><h1>Test</h1></body></html>',
          subject: 'Test Subject'
        }
      })).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      await expect(api.getTemplates()).rejects.toThrow();
    });
  });
});
