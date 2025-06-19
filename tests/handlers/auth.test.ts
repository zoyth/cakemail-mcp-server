import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { 
  handleGetTokenStatus, 
  handleRefreshToken, 
  handleValidateToken, 
  handleGetTokenScopes 
} from '../../src/handlers/auth.js';
import { CakemailAPI } from '../../src/cakemail-api.js';

describe('Auth Handlers', () => {
  let mockApi: jest.Mocked<CakemailAPI>;

  beforeEach(() => {
    mockApi = {
      getTokenStatus: jest.fn(),
      forceRefreshToken: jest.fn(),
      validateToken: jest.fn(),
      getTokenScopes: jest.fn(),
    } as any;
  });

  describe('handleGetTokenStatus', () => {
    it('should return token status successfully', async () => {
      const mockStatus = {
        hasToken: true,
        isExpired: false,
        expiresAt: new Date('2023-12-31T23:59:59Z'),
        timeUntilExpiry: 86400000, // 24 hours in ms
        needsRefresh: false,
        tokenType: 'Bearer',
        hasRefreshToken: true
      };
      
      mockApi.getTokenStatus.mockReturnValue(mockStatus);

      const result = await handleGetTokenStatus({}, mockApi);

      expect(mockApi.getTokenStatus).toHaveBeenCalledTimes(1);
      expect(result.content[0].text).toContain('Token Status:');
      expect(result.content[0].text).toContain('"hasToken": true');
      expect(result.content[0].text).toContain('"isExpired": false');
      expect(result.content[0].text).toContain('"expiresAt": "2023-12-31T23:59:59.000Z"');
      expect(result.content[0].text).toContain('"timeUntilExpiryMinutes": 1440');
    });

    it('should handle expired token', async () => {
      const mockStatus = {
        hasToken: true,
        isExpired: true,
        expiresAt: new Date('2023-01-01T00:00:00Z'),
        timeUntilExpiry: -86400000, // Expired 24 hours ago
        needsRefresh: true,
        tokenType: 'Bearer',
        hasRefreshToken: true
      };
      
      mockApi.getTokenStatus.mockReturnValue(mockStatus);

      const result = await handleGetTokenStatus({}, mockApi);

      expect(result.content[0].text).toContain('"isExpired": true');
      expect(result.content[0].text).toContain('"needsRefresh": true');
      expect(result.content[0].text).toContain('"timeUntilExpiryMinutes": -1440');
    });

    it('should handle missing token', async () => {
      const mockStatus = {
        hasToken: false,
        isExpired: true,
        expiresAt: null,
        timeUntilExpiry: null,
        needsRefresh: true,
        tokenType: null,
        hasRefreshToken: false
      };
      
      mockApi.getTokenStatus.mockReturnValue(mockStatus);

      const result = await handleGetTokenStatus({}, mockApi);

      expect(result.content[0].text).toContain('"hasToken": false');
      expect(result.content[0].text).toContain('"hasRefreshToken": false');
    });
  });

  describe('handleRefreshToken', () => {
    it('should refresh token when needed', async () => {
      const mockStatus = {
        hasToken: true,
        isExpired: false,
        expiresAt: new Date('2023-12-01T10:00:00Z'),
        timeUntilExpiry: 300000, // 5 minutes
        needsRefresh: true,
        tokenType: 'Bearer',
        hasRefreshToken: true
      };
      
      const mockRefreshResult = {
        success: true,
        newToken: { token_type: 'Bearer', expires_in: 3600 },
        previousExpiry: new Date('2023-12-01T10:00:00Z'),
        newExpiry: new Date('2023-12-01T11:00:00Z')
      };
      
      mockApi.getTokenStatus.mockReturnValue(mockStatus);
      mockApi.forceRefreshToken.mockResolvedValue(mockRefreshResult);

      const result = await handleRefreshToken({}, mockApi);

      expect(mockApi.getTokenStatus).toHaveBeenCalledTimes(1);
      expect(mockApi.forceRefreshToken).toHaveBeenCalledTimes(1);
      expect(result.content[0].text).toContain('Token Refresh Result:');
      expect(result.content[0].text).toContain('"success": true');
    });

    it('should not refresh token when not needed', async () => {
      const mockStatus = {
        hasToken: true,
        isExpired: false,
        expiresAt: new Date('2023-12-31T23:59:59Z'),
        timeUntilExpiry: 86400000, // 24 hours
        needsRefresh: false,
        tokenType: 'Bearer',
        hasRefreshToken: true
      };
      
      mockApi.getTokenStatus.mockReturnValue(mockStatus);

      const result = await handleRefreshToken({}, mockApi);

      expect(mockApi.getTokenStatus).toHaveBeenCalledTimes(1);
      expect(mockApi.forceRefreshToken).not.toHaveBeenCalled();
      expect(result.content[0].text).toContain('Token refresh not needed');
      expect(result.content[0].text).toContain('Use force=true to refresh anyway');
    });

    it('should force refresh when force=true', async () => {
      const mockStatus = {
        hasToken: true,
        isExpired: false,
        expiresAt: new Date('2023-12-31T23:59:59Z'),
        timeUntilExpiry: 86400000,
        needsRefresh: false,
        tokenType: 'Bearer',
        hasRefreshToken: true
      };
      
      const mockRefreshResult = {
        success: true,
        newToken: { token_type: 'Bearer', expires_in: 3600 },
        previousExpiry: new Date('2023-12-01T10:00:00Z'),
        newExpiry: new Date('2023-12-01T11:00:00Z')
      };
      
      mockApi.getTokenStatus.mockReturnValue(mockStatus);
      mockApi.forceRefreshToken.mockResolvedValue(mockRefreshResult);

      const result = await handleRefreshToken({ force: true }, mockApi);

      expect(mockApi.forceRefreshToken).toHaveBeenCalledTimes(1);
      expect(result.content[0].text).toContain('Token Refresh Result:');
    });

    it('should handle refresh failure', async () => {
      const mockStatus = {
        hasToken: true,
        isExpired: false,
        expiresAt: new Date('2023-12-01T10:00:00Z'),
        timeUntilExpiry: 300000,
        needsRefresh: true,
        tokenType: 'Bearer',
        hasRefreshToken: true
      };
      
      const mockRefreshResult = {
        success: false,
        newToken: null,
        previousExpiry: new Date('2023-12-01T10:00:00Z'),
        newExpiry: null,
        error: 'Refresh token expired'
      };
      
      mockApi.getTokenStatus.mockReturnValue(mockStatus);
      mockApi.forceRefreshToken.mockResolvedValue(mockRefreshResult);

      const result = await handleRefreshToken({}, mockApi);

      expect(result.content[0].text).toContain('"success": false');
      expect(result.content[0].text).toContain('"error": "Refresh token expired"');
    });
  });

  describe('handleValidateToken', () => {
    it('should validate token successfully', async () => {
      const mockValidation = {
        isValid: true,
        statusCode: 200,
        accountInfo: {
          id: 123,
          email: 'test@example.com',
          name: 'Test Account'
        }
      };
      
      mockApi.validateToken.mockResolvedValue(mockValidation);

      const result = await handleValidateToken({}, mockApi);

      expect(mockApi.validateToken).toHaveBeenCalledTimes(1);
      expect(result.content[0].text).toContain('Token Validation:');
      expect(result.content[0].text).toContain('"isValid": true');
      expect(result.content[0].text).toContain('"statusCode": 200');
    });

    it('should handle invalid token', async () => {
      const mockValidation = {
        isValid: false,
        statusCode: 401,
        error: 'Token has expired'
      };
      
      mockApi.validateToken.mockResolvedValue(mockValidation);

      const result = await handleValidateToken({}, mockApi);

      expect(result.content[0].text).toContain('"isValid": false');
      expect(result.content[0].text).toContain('"error": "Token has expired"');
    });

    it('should handle validation errors', async () => {
      const mockError = new Error('Network error during validation');
      mockApi.validateToken.mockRejectedValue(mockError);

      const result = await handleValidateToken({}, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Network error during validation');
    });
  });

  describe('handleGetTokenScopes', () => {
    it('should return token scopes successfully', async () => {
      const mockScopes = {
        accounts: [123, 456],
        scopes: null,
        permissions: ['account_access', 'email_send', 'campaign_management']
      };
      
      mockApi.getTokenScopes.mockReturnValue(mockScopes);

      const result = await handleGetTokenScopes({}, mockApi);

      expect(mockApi.getTokenScopes).toHaveBeenCalledTimes(1);
      expect(result.content[0].text).toContain('Token Scopes and Permissions:');
      expect(result.content[0].text).toContain('"accounts": [');
      expect(result.content[0].text).toContain('123');
      expect(result.content[0].text).toContain('456');
      expect(result.content[0].text).toContain('"permissions": [');
      expect(result.content[0].text).toContain('"account_access"');
      expect(result.content[0].text).toContain('"email_send"');
      expect(result.content[0].text).toContain('"campaign_management"');
    });

    it('should handle empty scopes', async () => {
      const mockScopes = {
        accounts: [],
        scopes: null,
        permissions: []
      };
      
      mockApi.getTokenScopes.mockReturnValue(mockScopes);

      const result = await handleGetTokenScopes({}, mockApi);

      expect(result.content[0].text).toContain('"accounts": []');
      expect(result.content[0].text).toContain('"permissions": []');
    });
  });
}); 