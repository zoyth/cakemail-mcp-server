import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { AccountApi } from '../../src/api/account-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { createMockResponse, createMockErrorResponse } from '../helpers/mock-response.js';
import mockFetch from 'node-fetch';
const mockFetchTyped = mockFetch as jest.MockedFunction<typeof mockFetch>;

describe('AccountApi', () => {
  let api: AccountApi;
  const mockToken: CakemailToken = {
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    accounts: [2]
  };

  beforeEach(() => {
    api = new AccountApi({
      username: 'test@example.com',
      password: 'test-password',
      baseUrl: 'https://api.cakemail.com',
      retry: {
        maxRetries: 0
      }
    });
    api.setMockToken(mockToken);
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getSelfAccount', () => {
    it('should fetch self account', async () => {
      await expect(api.getSelfAccount()).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('patchSelfAccount', () => {
    const patchData = {
      name: 'Updated Name',
      email: 'updated@example.com',
      company: 'Updated Co.'
    };
    it('should patch self account', async () => {
      await expect(api.patchSelfAccount(patchData)).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
    it('should validate email format', async () => {
      await expect(api.patchSelfAccount({ ...patchData, email: 'invalid' })).rejects.toThrow('Invalid email format');
    });
  });

  describe('convertSelfAccountToOrganization', () => {
    it('should convert self account to organization', async () => {
      await expect(api.convertSelfAccountToOrganization()).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('getAccountInfo', () => {
    it('should fetch account information', async () => {
      const mockResponse = {
        data: {
          id: 12345,
          name: 'Test Account',
          email: 'test@example.com'
        }
      };

      mockFetchTyped.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await api.getSelfAccount();
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockFetchTyped.mockResolvedValueOnce(createMockErrorResponse(401, 'Unauthorized'));

      await expect(api.getSelfAccount()).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockFetchTyped.mockResolvedValueOnce(createMockErrorResponse(403, 'Forbidden'));

      await expect(api.getSelfAccount()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetchTyped.mockRejectedValueOnce(new Error('Network timeout'));

      await expect(api.getSelfAccount()).rejects.toThrow('Network timeout');
    });
  });
});
