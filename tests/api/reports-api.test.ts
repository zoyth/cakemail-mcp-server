import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ReportsApi } from '../../src/api/reports-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { createMockResponse, createMockErrorResponse } from '../helpers/mock-response.js';
import mockFetch from 'node-fetch';
const mockFetchTyped = mockFetch as jest.MockedFunction<typeof mockFetch>;

describe('ReportsApi', () => {
  let api: ReportsApi;
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
    
    api = new ReportsApi({
      username: 'test@example.com',
      password: 'test-password',
      baseUrl: 'https://api.cakemail.com'
    });
    
    api.setMockToken(mockToken);
  });

  describe('getCampaignStats', () => {
    it('should fetch campaign statistics', async () => {
      const mockData = {
        data: {
          campaign_id: '123',
          sent: 1000,
          delivered: 950,
          opened: 400,
          clicked: 100,
          unsubscribed: 5,
          bounced: 50
        }
      };

      mockFetchTyped.mockResolvedValueOnce(createMockResponse(mockData));

      const result = await api.getCampaignStats('123');

      expect(mockFetchTyped).toHaveBeenCalledWith(
        'https://api.cakemail.com/reports/campaigns/123',
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
      mockFetchTyped.mockResolvedValueOnce(createMockErrorResponse(400, 'Bad Request', {
        error: 'Invalid parameters',
        detail: 'Start time must be before end time'
      }));

      await expect(api.getCampaignStats('123')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetchTyped.mockRejectedValueOnce(new Error('Network timeout'));

      await expect(api.getCampaignStats('123')).rejects.toThrow('Network timeout');
    });

    it('should validate log types', () => {
      const validLogTypes = ['all', 'submitted', 'delivered', 'opened', 'clicked', 'bounced', 'unsubscribed'];
      
      const isValidLogType = (type: string) => validLogTypes.includes(type);
      
      expect(isValidLogType('delivered')).toBe(true);
      expect(isValidLogType('invalid')).toBe(false);
    });
  });
});
