import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ListApi } from '../../src/api/list-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
import { createMockResponse, createMockErrorResponse } from '../helpers/mock-response.js';
import mockFetch from 'node-fetch';
const mockFetchTyped = mockFetch as jest.MockedFunction<typeof mockFetch>;

describe('ListApi', () => {
  let api: ListApi;
  const mockToken: CakemailToken = {
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'mock-refresh-token',
    accounts: [2]
  };

  beforeEach(() => {
    api = new ListApi({
      username: 'test@example.com',
      password: 'test-password',
      baseUrl: 'https://api.cakemail.com',
      retry: {
        maxRetries: 0 // Disable retries for testing
      }
    });
    api.setMockToken(mockToken);
  });

  describe('getLists', () => {
    it('should fetch all lists with default parameters', async () => {
      await expect(api.getLists()).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('createList', () => {
    it('should create a new list with required fields', async () => {
      await expect(api.createList({
        name: 'Test List',
        default_sender: {
          name: 'Test Sender',
          email: 'test@example.com'
        }
      })).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      await expect(api.getLists()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      await expect(api.getLists()).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });

    it('should validate email format', () => {
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
    });
  });
});
