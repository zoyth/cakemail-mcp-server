import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { AccountApi } from '../../src/api/account-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { createMockResponse, createMockErrorResponse } from '../helpers/mock-response.js';
import mockFetch from 'node-fetch';
const mockFetchTyped = mockFetch as jest.MockedFunction<typeof mockFetch>;

describe('AccountApi', () => {
  let api: AccountApi;
  const mockToken: CakemailToken = {
    access_token: 'test-access-token',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    accounts: [12345]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchTyped.mockClear();
    
    api = new AccountApi({
      username: 'test@example.com',
      password: 'test-password',
      baseUrl: 'https://api.cakemail.com'
    });
    
    api.setMockToken(mockToken);
  });

  describe('getSelfAccount', () => {
    it('should fetch current account details', async () => {
      const mockResponse = {
        data: {
          id: 12345,
          name: 'Test Account',
          email: 'test@example.com',
          company: 'Test Company',
          status: 'active',
          timezone: 'America/New_York',
          language: 'en_US'
        }
      };

      mockFetchTyped.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await api.getSelfAccount();

      expect(mockFetchTyped).toHaveBeenCalledWith(
        'https://api.cakemail.com/accounts/self',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-access-token',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockResponse);
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
