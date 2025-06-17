import { jest, describe, it, expect } from '@jest/globals';

describe('Sender Handlers', () => {
  const mockCakemailResponses = {
    senders: {
      data: [
        { id: '1', name: 'Test Sender', email: 'test@example.com' }
      ]
    }
  };

  const createMockAPI = () => ({
    senders: {
      getSenders: jest.fn(),
      createSender: jest.fn(),
      getSender: jest.fn(),
      updateSender: jest.fn(),
      deleteSender: jest.fn()
    }
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGetSenders = async (_args: any, api: any) => {
    try {
      const senders = await api.senders.getSenders();
      return {
        content: [
          {
            type: 'text',
            text: `Senders: ${JSON.stringify(senders, null, 2)}`,
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

  const handleCreateSender = async (args: any, api: any) => {
    try {
      const { name: senderName, email, language } = args;
      
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      
      const sender = await api.senders.createSender({
        name: senderName,
        email,
        language: language || 'en_US',
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Sender created successfully: ${JSON.stringify(sender, null, 2)}`,
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

  describe('handleGetSenders', () => {
    it('should retrieve senders successfully', async () => {
      const mockAPI = createMockAPI();
      mockAPI.senders.getSenders.mockResolvedValue(mockCakemailResponses.senders);

      const result = await handleGetSenders({}, mockAPI);

      expect(mockAPI.senders.getSenders).toHaveBeenCalledWith();
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Senders:');
      expect(result.content[0].text).toContain('Test Sender');
    });

    it('should handle API errors gracefully', async () => {
      const mockAPI = createMockAPI();
      mockAPI.senders.getSenders.mockRejectedValue(new Error('API Error'));

      const result = await handleGetSenders({}, mockAPI);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error');
    });
  });

  describe('handleCreateSender', () => {
    it('should create sender successfully', async () => {
      const mockAPI = createMockAPI();
      const senderData = { 
        name: 'Test Sender', 
        email: 'test@example.com',
        language: 'en_US'
      };
      const createdSender = { id: '1', ...senderData };
      
      mockAPI.senders.createSender.mockResolvedValue(createdSender);

      const result = await handleCreateSender(senderData, mockAPI);

      expect(mockAPI.senders.createSender).toHaveBeenCalledWith({
        name: 'Test Sender',
        email: 'test@example.com',
        language: 'en_US'
      });
      expect(result.content[0].text).toContain('Sender created successfully');
      expect(result.content[0].text).toContain('Test Sender');
    });

    it('should use default language when not provided', async () => {
      const mockAPI = createMockAPI();
      const senderData = { 
        name: 'Test Sender', 
        email: 'test@example.com'
      };
      const createdSender = { id: '1', ...senderData, language: 'en_US' };
      
      mockAPI.senders.createSender.mockResolvedValue(createdSender);

      await handleCreateSender(senderData, mockAPI);

      expect(mockAPI.senders.createSender).toHaveBeenCalledWith({
        name: 'Test Sender',
        email: 'test@example.com',
        language: 'en_US'
      });
    });

    it('should validate email format', async () => {
      const mockAPI = createMockAPI();
      const senderData = { 
        name: 'Test Sender', 
        email: 'invalid-email'
      };

      const result = await handleCreateSender(senderData, mockAPI);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Invalid email format');
      expect(mockAPI.senders.createSender).not.toHaveBeenCalled();
    });

    it('should handle API creation errors', async () => {
      const mockAPI = createMockAPI();
      const senderData = { 
        name: 'Test Sender', 
        email: 'test@example.com'
      };
      
      mockAPI.senders.createSender.mockRejectedValue(new Error('Creation failed'));

      const result = await handleCreateSender(senderData, mockAPI);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error');
    });
  });
});
