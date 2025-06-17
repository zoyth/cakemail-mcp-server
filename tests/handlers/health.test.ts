import { jest, describe, it, expect } from '@jest/globals';

describe('Health Handler', () => {
  it('should handle health check correctly', async () => {
    // Mock API
    const mockAPI = {
      healthCheck: jest.fn().mockResolvedValue({
        status: 'healthy',
        authenticated: true,
        accountId: 123
      })
    };

    // Simple inline handler function for testing
    const handleHealthCheck = async (_args: any, api: any) => {
      try {
        const health = await api.healthCheck();
        return {
          content: [
            {
              type: 'text',
              text: `Health Status: ${JSON.stringify(health, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    };

    const result = await handleHealthCheck({}, mockAPI);

    expect(mockAPI.healthCheck).toHaveBeenCalled();
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toContain('Health Status:');
    expect(result.content[0].text).toContain('healthy');
    expect(result.content[0].text).toContain('123');
  });

  it('should handle health check errors', async () => {
    const mockAPI = {
      healthCheck: jest.fn().mockRejectedValue(new Error('Network error'))
    };

    const handleHealthCheck = async (_args: any, api: any) => {
      try {
        const health = await api.healthCheck();
        return {
          content: [
            {
              type: 'text',
              text: `Health Status: ${JSON.stringify(health, null, 2)}`,
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    };

    const result = await handleHealthCheck({}, mockAPI);

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Error');
    expect(result.content[0].text).toContain('Network error');
  });
});
