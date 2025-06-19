import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { 
  handleGetSenders, 
  handleCreateSender, 
  handleGetSender, 
  handleUpdateSender, 
  handleDeleteSender 
} from '../../src/handlers/senders.js';
import { CakemailAPI } from '../../src/cakemail-api.js';

describe('Sender Handlers', () => {
  let mockApi: jest.Mocked<CakemailAPI>;

  beforeEach(() => {
    mockApi = {
      senders: {
        getSenders: jest.fn(),
        createSender: jest.fn(),
        getSender: jest.fn(),
        updateSender: jest.fn(),
        deleteSender: jest.fn(),
      },
    } as any;
  });

  describe('handleGetSenders', () => {
    it('should retrieve senders successfully', async () => {
      const mockSenders = {
        data: [
          { id: 1, name: 'Test Sender', email: 'test@example.com', status: 'active' },
          { id: 2, name: 'Another Sender', email: 'another@example.com', status: 'active' }
        ],
        pagination: { page: 1, per_page: 50, total: 2 }
      };
      
      mockApi.senders.getSenders.mockResolvedValue(mockSenders);

      const result = await handleGetSenders({}, mockApi);

      expect(mockApi.senders.getSenders).toHaveBeenCalledTimes(1);
      expect(result.content[0].text).toContain('Senders:');
      expect(result.content[0].text).toContain('"id": 1');
      expect(result.content[0].text).toContain('"name": "Test Sender"');
    });

    it('should handle empty senders list', async () => {
      const mockSenders = {
        data: [],
        pagination: { page: 1, per_page: 50, total: 0 }
      };
      
      mockApi.senders.getSenders.mockResolvedValue(mockSenders);

      const result = await handleGetSenders({}, mockApi);

      expect(result.content[0].text).toContain('"data": []');
      expect(result.content[0].text).toContain('"total": 0');
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Failed to fetch senders');
      mockApi.senders.getSenders.mockRejectedValue(mockError);

      const result = await handleGetSenders({}, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Failed to fetch senders');
    });
  });

  describe('handleCreateSender', () => {
    it('should create sender successfully', async () => {
      const mockSender = {
        data: {
          id: 3,
          name: 'New Sender',
          email: 'new@example.com',
          language: 'en_US',
          status: 'active'
        }
      };
      
      mockApi.senders.createSender.mockResolvedValue(mockSender);

      const result = await handleCreateSender({
        name: 'New Sender',
        email: 'new@example.com',
        language: 'en_US'
      }, mockApi);

      expect(mockApi.senders.createSender).toHaveBeenCalledWith({
        name: 'New Sender',
        email: 'new@example.com',
        language: 'en_US'
      });
      expect(result.content[0].text).toContain('Sender created successfully:');
      expect(result.content[0].text).toContain('"id": 3');
    });

    it('should use default language when not provided', async () => {
      const mockSender = {
        data: {
          id: 4,
          name: 'Default Language Sender',
          email: 'default@example.com',
          language: 'en_US',
          status: 'active'
        }
      };
      
      mockApi.senders.createSender.mockResolvedValue(mockSender);

      const result = await handleCreateSender({
        name: 'Default Language Sender',
        email: 'default@example.com'
      }, mockApi);

      expect(mockApi.senders.createSender).toHaveBeenCalledWith({
        name: 'Default Language Sender',
        email: 'default@example.com',
        language: 'en_US'
      });
    });

    it('should validate email format', async () => {
      const result = await handleCreateSender({
        name: 'Invalid Email Sender',
        email: 'invalid-email'
      }, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Invalid email format');
      expect(mockApi.senders.createSender).not.toHaveBeenCalled();
    });

    it('should handle API creation errors', async () => {
      const mockError = new Error('Email already exists');
      mockApi.senders.createSender.mockRejectedValue(mockError);

      const result = await handleCreateSender({
        name: 'Duplicate Sender',
        email: 'duplicate@example.com'
      }, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Email already exists');
    });
  });

  describe('handleGetSender', () => {
    it('should retrieve single sender successfully', async () => {
      const mockSender = {
        data: {
          id: 1,
          name: 'Test Sender',
          email: 'test@example.com',
          language: 'en_US',
          status: 'active',
          created_on: '2023-01-01T00:00:00Z'
        }
      };
      
      mockApi.senders.getSender.mockResolvedValue(mockSender);

      const result = await handleGetSender({ sender_id: 1 }, mockApi);

      expect(mockApi.senders.getSender).toHaveBeenCalledWith(1);
      expect(result.content[0].text).toContain('Sender details:');
      expect(result.content[0].text).toContain('"id": 1');
      expect(result.content[0].text).toContain('"name": "Test Sender"');
    });

    it('should handle sender not found', async () => {
      const mockError = new Error('Sender not found');
      mockApi.senders.getSender.mockRejectedValue(mockError);

      const result = await handleGetSender({ sender_id: 999 }, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Sender not found');
    });
  });

  describe('handleUpdateSender', () => {
    it('should update sender successfully', async () => {
      const mockUpdatedSender = {
        data: {
          id: 1,
          name: 'Updated Sender',
          email: 'updated@example.com',
          language: 'fr_FR',
          status: 'active'
        }
      };
      
      mockApi.senders.updateSender.mockResolvedValue(mockUpdatedSender);

      const result = await handleUpdateSender({
        sender_id: 1,
        name: 'Updated Sender',
        email: 'updated@example.com',
        language: 'fr_FR'
      }, mockApi);

      expect(mockApi.senders.updateSender).toHaveBeenCalledWith(1, {
        name: 'Updated Sender',
        email: 'updated@example.com',
        language: 'fr_FR'
      });
      expect(result.content[0].text).toContain('Sender updated successfully:');
      expect(result.content[0].text).toContain('"name": "Updated Sender"');
    });

    it('should update only provided fields', async () => {
      const mockUpdatedSender = {
        data: {
          id: 1,
          name: 'Partial Update Sender',
          email: 'partial@example.com',
          language: 'en_US',
          status: 'active'
        }
      };
      
      mockApi.senders.updateSender.mockResolvedValue(mockUpdatedSender);

      const result = await handleUpdateSender({
        sender_id: 1,
        name: 'Partial Update Sender'
      }, mockApi);

      expect(mockApi.senders.updateSender).toHaveBeenCalledWith(1, {
        name: 'Partial Update Sender'
      });
    });

    it('should validate email format when updating', async () => {
      const result = await handleUpdateSender({
        sender_id: 1,
        email: 'invalid-email'
      }, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Invalid email format');
      expect(mockApi.senders.updateSender).not.toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      const mockError = new Error('Sender not found');
      mockApi.senders.updateSender.mockRejectedValue(mockError);

      const result = await handleUpdateSender({
        sender_id: 999,
        name: 'Non-existent Sender'
      }, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Sender not found');
    });
  });

  describe('handleDeleteSender', () => {
    it('should delete sender successfully', async () => {
      mockApi.senders.deleteSender.mockResolvedValue({ success: true, status: 200 });

      const result = await handleDeleteSender({ sender_id: 1 }, mockApi);

      expect(mockApi.senders.deleteSender).toHaveBeenCalledWith(1);
      expect(result.content[0].text).toContain('Sender 1 deleted successfully');
    });

    it('should handle deletion errors', async () => {
      const mockError = new Error('Cannot delete sender with active campaigns');
      mockApi.senders.deleteSender.mockRejectedValue(mockError);

      const result = await handleDeleteSender({ sender_id: 1 }, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Cannot delete sender with active campaigns');
    });

    it('should handle sender not found during deletion', async () => {
      const mockError = new Error('Sender not found');
      mockApi.senders.deleteSender.mockRejectedValue(mockError);

      const result = await handleDeleteSender({ sender_id: 999 }, mockApi);

      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Sender not found');
    });
  });
});
