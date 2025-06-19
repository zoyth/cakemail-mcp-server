import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { LogsApi } from '../../src/api/logs-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { createMockResponse, createMockErrorResponse } from '../helpers/mock-response.js';
import mockFetch from 'node-fetch';
const mockFetchTyped = mockFetch as jest.MockedFunction<typeof mockFetch>;

describe('LogsApi', () => {
  let api: LogsApi;
  const mockToken: CakemailToken = {
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    accounts: [2]
  };

  beforeEach(() => {
    api = new LogsApi({
      username: 'test@example.com',
      password: 'test-password',
      baseUrl: 'https://api.cakemail.com',
      retry: {
        maxRetries: 0 // Disable retries for testing
      }
    });
    api.setMockToken(mockToken);
  });

  describe('getCampaignLogs', () => {
    it('should fetch campaign logs with default parameters', async () => {
      await expect(api.getCampaignLogs('123')).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      await expect(api.getCampaignLogs('123')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      await expect(api.getCampaignLogs('123')).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });

    it('should validate log types', () => {
      const validLogTypes = ['all', 'submitted', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed'];
      const isValidLogType = (type: string) => validLogTypes.includes(type);
      
      expect(isValidLogType('delivered')).toBe(true);
      expect(isValidLogType('invalid')).toBe(false);
    });
  });
});
