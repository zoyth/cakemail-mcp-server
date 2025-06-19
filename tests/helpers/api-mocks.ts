import { jest } from '@jest/globals';

export function setupApiMocks(api: any, mockAccessToken: string, mockAccountId?: number) {
  // Mock authentication methods
  jest.spyOn(api, 'ensureValidToken').mockResolvedValue(mockAccessToken);
  jest.spyOn(api, 'authenticate').mockResolvedValue(mockAccessToken);
  
  if (mockAccountId) {
    jest.spyOn(api, 'getCurrentAccountId').mockResolvedValue(mockAccountId);
  }
  
  // Set token as valid
  api.accessToken = mockAccessToken;
  api.tokenExpiresAt = Date.now() + 3600000; // 1 hour from now
}
