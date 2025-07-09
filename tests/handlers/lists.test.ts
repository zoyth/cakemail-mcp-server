import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  handleListLists,
  handleCreateList,
  handleGetList,
  handleUpdateList,
  handleDeleteList
} from '../../src/handlers/lists.js';
import { CakemailAPI } from '../../src/cakemail-api.js';

describe('List Handlers', () => {
  let mockApi: jest.Mocked<CakemailAPI>;

  beforeEach(() => {
    mockApi = {
      lists: {
        getLists: jest.fn(),
        createList: jest.fn(),
        getList: jest.fn(),
        updateList: jest.fn(),
        deleteList: jest.fn(),
      },
      senders: {
        ensureSenderExists: jest.fn(),
        getConfirmedSenders: jest.fn(),
      },
      reports: {
        getListStats: jest.fn(),
      },
    } as any;
  });

  describe('handleListLists', () => {
    it('should list lists successfully', async () => {
      const mockLists = {
        data: [
          { id: 1, name: 'List One', status: 'active', language: 'en_US', created_on: '2023-01-01', updated_on: '2023-01-02', default_sender: { name: 'Sender', email: 'sender@example.com' }, contacts_count: 10, active_contacts_count: 8, unsubscribed_contacts_count: 2 },
          { id: 2, name: 'List Two', status: 'inactive', language: 'fr_FR', created_on: '2023-01-03', updated_on: '2023-01-04', default_sender: { name: 'Sender2', email: 'sender2@example.com' }, contacts_count: 5, active_contacts_count: 5, unsubscribed_contacts_count: 0 }
        ],
        pagination: { count: 2, page: 1, per_page: 50, total_pages: 1 }
      };
      mockApi.lists.getLists.mockResolvedValue(mockLists);
      mockApi.reports.getListStats.mockResolvedValue({
        data: {
          total_contacts: 10,
          active_contacts: 8,
          unsubscribed_contacts: 2,
          bounced_contacts: 0
        }
      });
      const result = await handleListLists({}, mockApi);
      expect(mockApi.lists.getLists).toHaveBeenCalled();
      expect(result.content[0].text).toContain('Contact Lists (2 total)');
      expect(result.content[0].text).toContain('List One');
      expect(result.content[0].text).toContain('List Two');
    });
    it('should handle API errors', async () => {
      mockApi.lists.getLists.mockRejectedValue(new Error('Failed to fetch lists'));
      const result = await handleListLists({}, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Failed to fetch lists');
    });
  });

  describe('handleCreateList', () => {
    it('should create list successfully', async () => {
      const mockSender = { id: 123, email: 'sender@example.com', name: 'Sender' };
      const mockList = { data: { id: 10, name: 'New List', default_sender: { name: 'Sender', email: 'sender@example.com' } } };
      mockApi.senders.ensureSenderExists.mockResolvedValue(mockSender);
      mockApi.lists.createList.mockResolvedValue(mockList);
      const result = await handleCreateList({ name: 'New List', default_sender: { name: 'Sender', email: 'sender@example.com' } }, mockApi);
      expect(mockApi.senders.ensureSenderExists).toHaveBeenCalledWith('sender@example.com', 'Sender');
      expect(mockApi.lists.createList).toHaveBeenCalled();
      expect(result.content[0].text).toContain('Contact List Created Successfully');
      expect(result.content[0].text).toContain('New List');
    });
    it('should require name and default_sender', async () => {
      const result = await handleCreateList({ name: 'NoSender' }, mockApi);
      expect(result.content[0].text).toContain('Missing Required Fields');
      expect(mockApi.lists.createList).not.toHaveBeenCalled();
    });
    it('should require default_sender fields', async () => {
      const result = await handleCreateList({ name: 'NoSenderFields', default_sender: { name: 'Sender' } }, mockApi);
      expect(result.content[0].text).toContain('Invalid Default Sender');
      expect(mockApi.lists.createList).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      const mockSender = { id: 123, email: 'fail@example.com', name: 'Sender' };
      mockApi.senders.ensureSenderExists.mockResolvedValue(mockSender);
      mockApi.lists.createList.mockRejectedValue(new Error('Create failed'));
      const result = await handleCreateList({ name: 'Fail', default_sender: { name: 'Sender', email: 'fail@example.com' } }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Error');
    });
  });

  describe('handleGetList', () => {
    it('should get list successfully', async () => {
      const mockList = { data: { id: 1, name: 'List One', status: 'active', language: 'en_US', created_on: '2023-01-01', updated_on: '2023-01-02', default_sender: { name: 'Sender', email: 'sender@example.com' }, contacts_count: 10, active_contacts_count: 8, unsubscribed_contacts_count: 2 } };
      mockApi.lists.getList.mockResolvedValue(mockList);
      const result = await handleGetList({ list_id: 1 }, mockApi);
      expect(mockApi.lists.getList).toHaveBeenCalledWith(1, { account_id: undefined });
      expect(result.content[0].text).toContain('Contact List Details');
      expect(result.content[0].text).toContain('List One');
    });
    it('should require list_id', async () => {
      const result = await handleGetList({}, mockApi);
      expect(result.content[0].text).toContain('Missing Required Field');
      expect(mockApi.lists.getList).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.lists.getList.mockRejectedValue(new Error('Not found'));
      const result = await handleGetList({ list_id: 999 }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Not found');
    });
  });

  describe('handleUpdateList', () => {
    it('should update list successfully', async () => {
      mockApi.lists.updateList.mockResolvedValue({ data: { id: 1, name: 'Updated List', default_sender: { name: 'Sender', email: 'sender@example.com' } } });
      const result = await handleUpdateList({ list_id: 1, name: 'Updated List' }, mockApi);
      expect(mockApi.lists.updateList).toHaveBeenCalledWith(1, { name: 'Updated List' }, { account_id: undefined });
      expect(result.content[0].text).toContain('Updated Successfully');
    });
    it('should require list_id', async () => {
      const result = await handleUpdateList({ name: 'NoId' }, mockApi);
      expect(result.content[0].text).toContain('Missing Required Field');
      expect(mockApi.lists.updateList).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.lists.updateList.mockRejectedValue(new Error('Update failed'));
      const result = await handleUpdateList({ list_id: 1, name: 'Fail' }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Update failed');
    });
  });

  describe('handleDeleteList', () => {
    it('should delete list successfully', async () => {
      mockApi.lists.deleteList.mockResolvedValue({ success: true, status: 200 });
      const result = await handleDeleteList({ list_id: 1 }, mockApi);
      expect(mockApi.lists.deleteList).toHaveBeenCalledWith(1, { account_id: undefined });
      expect(result.content[0].text).toContain('deleted'); // Handler may need to be checked for actual text
    });
    it('should require list_id', async () => {
      const result = await handleDeleteList({}, mockApi);
      expect(result.content[0].text).toContain('Missing Required Field');
      expect(mockApi.lists.deleteList).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.lists.deleteList.mockRejectedValue(new Error('Delete failed'));
      const result = await handleDeleteList({ list_id: 1 }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Delete failed');
    });
  });
}); 