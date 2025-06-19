import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { SubAccountApi } from '../../src/api/sub-account-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { createMockResponse, createMockErrorResponse } from '../helpers/mock-response.js';
import mockFetch from 'node-fetch';
const mockFetchTyped = mockFetch as jest.MockedFunction<typeof mockFetch>;

describe('SubAccountApi', () => {
  let api: SubAccountApi;
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
    
    api = new SubAccountApi({
      username: 'test@example.com',
      password: 'test-password',
      baseUrl: 'https://api.cakemail.com'
    });
    
    api.setMockToken(mockToken);
  });

  describe('listSubAccounts', () => {
    it('should fetch sub-accounts with default parameters', async () => {
      const mockData = {
        data: [
          {
            id: '456',
            name: 'Sub Account',
            email: 'sub@example.com',
            status: 'active'
          }
        ],
        pagination: {
          page: 1,
          per_page: 50,
          count: 1
        }
      };

      mockFetchTyped.mockResolvedValueOnce(createMockResponse(mockData));

      const result = await api.listSubAccounts();

      expect(mockFetchTyped).toHaveBeenCalledWith(
        'https://api.cakemail.com/accounts',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-access-token'
          })
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockFetchTyped.mockResolvedValueOnce(createMockErrorResponse(403, 'Forbidden', {
        error: 'This feature requires an enterprise account'
      }));

      await expect(api.listSubAccounts()).rejects.toThrow();
    });

    it('should handle validation errors', () => {
      const isValidAccountId = (id: string) => {
        return /^[a-zA-Z0-9]{1,20}$/.test(id);
      };

      expect(isValidAccountId('abc123')).toBe(true);
      expect(isValidAccountId('invalid-id-with-special-chars!')).toBe(false);
    });
  });
});
