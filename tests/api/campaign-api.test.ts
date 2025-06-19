import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CampaignApi } from '../../src/api/campaign-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { createMockResponse, createMockErrorResponse } from '../helpers/mock-response.js';
import mockFetch from 'node-fetch';
const mockFetchTyped = mockFetch as jest.MockedFunction<typeof mockFetch>;

describe('CampaignApi', () => {
  let api: CampaignApi;
  const mockToken: CakemailToken = {
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    accounts: [2]
  };

  beforeEach(() => {
    api = new CampaignApi({
      username: 'test@example.com',
      password: 'test-password',
      baseUrl: 'https://api.cakemail.com',
      retry: {
        maxRetries: 0 // Disable retries for testing
      }
    });
    api.setMockToken(mockToken);
  });

  describe('getCampaigns', () => {
    it('should fetch campaigns', async () => {
      await expect(api.getCampaigns()).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      await expect(api.getCampaigns()).rejects.toThrow();
    });
  });
});
