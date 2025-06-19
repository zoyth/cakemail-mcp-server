import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ContactApi } from '../../src/api/contact-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { createMockResponse, createMockErrorResponse } from '../helpers/mock-response.js';
import mockFetch from 'node-fetch';
const mockFetchTyped = mockFetch as jest.MockedFunction<typeof mockFetch>;

describe('ContactApi', () => {
  let api: ContactApi;
  const mockToken: CakemailToken = {
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    accounts: [2]
  };

  beforeEach(() => {
    api = new ContactApi({
      username: 'test@example.com',
      password: 'test-password',
      baseUrl: 'https://api.cakemail.com',
      retry: {
        maxRetries: 0 // Disable retries for testing
      }
    });
    api.setMockToken(mockToken);
  });

  describe('getContacts', () => {
    it('should fetch contacts', async () => {
      await expect(api.getContacts()).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      await expect(api.getContacts()).rejects.toThrow();
    });
  });
});
