import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { handleHealthCheck } from '../../src/handlers/health.js';
import { CakemailAPI } from '../../src/cakemail-api.js';

describe('Health Handler', () => {
  let mockApi: jest.Mocked<CakemailAPI>;

  beforeEach(() => {
    mockApi = {
      healthCheck: jest.fn(),
    } as any;
  });

  describe('handleHealthCheck', () => {
    it('should return health status successfully', async () => {
      const mockHealthData = {
        status: 'healthy',
        authenticated: true,
        accountId: 123,
        apiCompliance: 'v1.18.25',
        components: {
          retryManager: {
            maxRetries: 3,
            baseDelay: 1000,
            maxDelay: 30000,
            exponentialBase: 2,
            jitter: true,
            retryableStatusCodes: [429, 500, 502, 503, 504],
            retryableErrors: ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT']
          },
          rateLimiter: 'enabled',
          circuitBreaker: { state: 'CLOSED', failures: 0, lastFailureTime: 0 },
          requestQueue: { active: 0, queued: 0 },
          timeout: 30000
        }
      };
      
      mockApi.healthCheck.mockResolvedValue(mockHealthData);

      const result = await handleHealthCheck({}, mockApi);

      expect(mockApi.healthCheck).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: `Health Status: ${JSON.stringify(mockHealthData, null, 2)}`,
          },
        ],
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Health check failed');
      mockApi.healthCheck.mockRejectedValue(mockError);

      const result = await handleHealthCheck({}, mockApi);

      expect(mockApi.healthCheck).toHaveBeenCalledTimes(1);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Error');
      expect(result.content[0].text).toContain('Health check failed');
    });

    it('should handle network errors', async () => {
      const mockNetworkError = new Error('Network timeout');
      mockApi.healthCheck.mockRejectedValue(mockNetworkError);

      const result = await handleHealthCheck({}, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Network timeout');
    });

    it('should handle unhealthy response', async () => {
      const unhealthyData = {
        status: 'unhealthy',
        error: 'API connection failed',
        errorType: 'ConnectionError',
        authenticated: false,
        components: {
          circuitBreaker: { state: 'OPEN', failures: 5, lastFailureTime: Date.now() },
          requestQueue: { active: 0, queued: 0 }
        }
      };
      
      mockApi.healthCheck.mockResolvedValue(unhealthyData);

      const result = await handleHealthCheck({}, mockApi);

      expect(result.content[0].text).toContain('Health Status:');
      expect(result.content[0].text).toContain('"status": "unhealthy"');
      expect(result.content[0].text).toContain('"error": "API connection failed"');
    });

    it('should handle complex health response', async () => {
      const complexHealthData = {
        status: 'healthy',
        authenticated: true,
        accountId: 456,
        apiCompliance: 'v1.18.25',
        components: {
          retryManager: {
            maxRetries: 5,
            baseDelay: 1000,
            maxDelay: 30000,
            exponentialBase: 2,
            jitter: true,
            retryableStatusCodes: [429, 500, 502, 503, 504],
            retryableErrors: ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT']
          },
          rateLimiter: 'enabled',
          circuitBreaker: { state: 'CLOSED', failures: 0, lastFailureTime: 0 },
          requestQueue: { active: 2, queued: 5 },
          timeout: 60000
        }
      };
      
      mockApi.healthCheck.mockResolvedValue(complexHealthData);

      const result = await handleHealthCheck({}, mockApi);

      expect(result.content[0].text).toContain('Health Status:');
      expect(result.content[0].text).toContain('"status": "healthy"');
      expect(result.content[0].text).toContain('"components"');
    });
  });
});
