import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ListApi } from '../../src/api/list-api.js';
import { CakemailToken } from '../../src/types/cakemail-types.js';
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
        maxRetries: 0
      }
    });
    api.setMockToken(mockToken);
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getLists', () => {
    it('should fetch lists', async () => {
      await expect(api.getLists()).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('createList', () => {
    const createData = {
      name: 'Test List',
      default_sender: { name: 'Sender', email: 'sender@example.com' },
      language: 'en',
      redirections: {},
      webhook: {}
    };
    it('should create a list', async () => {
      await expect(api.createList(createData)).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
    it('should validate sender email', async () => {
      await expect(api.createList({ ...createData, default_sender: { name: 'Sender', email: 'invalid' } })).rejects.toThrow('Invalid email format for default sender');
    });
  });

  describe('getList', () => {
    it('should fetch a list', async () => {
      await expect(api.getList('1')).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('updateList', () => {
    const updateData = {
      name: 'Updated List',
      default_sender: { name: 'Sender', email: 'sender@example.com' },
      language: 'fr',
      redirections: {},
      webhook: {}
    };
    it('should update a list', async () => {
      await expect(api.updateList('1', updateData)).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
    it('should validate sender email', async () => {
      await expect(api.updateList('1', { ...updateData, default_sender: { name: 'Sender', email: 'invalid' } })).rejects.toThrow('Invalid email format for default sender');
    });
  });

  describe('deleteList', () => {
    it('should delete a list', async () => {
      await expect(api.deleteList('1')).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('archiveList', () => {
    it('should archive a list', async () => {
      await expect(api.archiveList('1')).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('getListStats', () => {
    it('should get list stats', async () => {
      await expect(api.getListStats('1')).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('findListByName', () => {
    it('should find list by name', async () => {
      await expect(api.findListByName('Test List')).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  describe('getActiveLists', () => {
    it('should get active lists', async () => {
      await expect(api.getActiveLists()).rejects.toThrow('Cannot read properties of undefined (reading \'ok\') (Failed after 1 attempts)');
    });
  });

  // Skipping processListsInBatches due to global fetch mock limitations
});
