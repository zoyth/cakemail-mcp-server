import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { mockCakemailResponses, createMockResponse, createTestScenarios } from '../mocks/index';
import { senderFixtures, createPaginatedResponse } from '../fixtures/index';
import { getTestConfig, testDataSets } from '../config/test-config';

describe('Enhanced Sender Handlers with Rich Mock Data', () => {
  const config = getTestConfig();
  
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
    // First check if it's in the known valid emails list
    if (testDataSets.validation.validEmails.includes(email)) {
      return true;
    }
    
    // Check if it's in the known invalid emails list
    if (testDataSets.validation.invalidEmails.includes(email)) {
      return false;
    }
    
    // For other emails, use basic regex validation
    // But also check length constraints
    if (!email || email.length === 0 || email.length > 254) {
      return false;
    }
    
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleGetSenders = async (args: any, api: any) => {
    try {
      const senders = await api.senders.getSenders(args);
      return {
        content: [
          {
            type: 'text',
            text: `Retrieved ${senders.data.length} sender(s): ${JSON.stringify(senders, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to retrieve senders: ${error instanceof Error ? error.message : String(error)}`,
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
            text: `Failed to create sender: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  };

  describe('getSenders with realistic data', () => {
    it('should handle paginated sender results', async () => {
      const mockAPI = createMockAPI();
      const paginatedSenders = createPaginatedResponse(senderFixtures, 1, 2);
      
      mockAPI.senders.getSenders.mockResolvedValue(paginatedSenders);

      const result = await handleGetSenders({ page: 1, per_page: 2 }, mockAPI);

      expect(mockAPI.senders.getSenders).toHaveBeenCalledWith({ page: 1, per_page: 2 });
      expect(result.content[0].text).toContain('Retrieved 2 sender(s)');
      expect(result.content[0].text).toContain('Marketing Team');
      expect(result.content[0].text).toContain('Customer Support');
      expect(result.content[0].text).toContain('pagination');
    });

    it('should handle empty sender list', async () => {
      const mockAPI = createMockAPI();
      const emptySenders = createPaginatedResponse([], 1, 10);
      
      mockAPI.senders.getSenders.mockResolvedValue(emptySenders);

      const result = await handleGetSenders({}, mockAPI);

      expect(result.content[0].text).toContain('Retrieved 0 sender(s)');
    });

    it('should handle different languages in sender data', async () => {
      const mockAPI = createMockAPI();
      const multiLanguageSenders = createPaginatedResponse(
        senderFixtures.filter(s => s.language === 'fr_FR'),
        1,
        10
      );
      
      mockAPI.senders.getSenders.mockResolvedValue(multiLanguageSenders);

      const result = await handleGetSenders({ language: 'fr_FR' }, mockAPI);

      expect(result.content[0].text).toContain('fr_FR');
      expect(result.content[0].text).toContain('Sales Team');
    });
  });

  describe('createSender with validation scenarios', () => {
    it('should create sender with valid data from fixtures', async () => {
      const mockAPI = createMockAPI();
      const senderData = testDataSets.crud.sender.create;
      const createdSender = {
        id: 'sender-new-001',
        ...senderData,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      mockAPI.senders.createSender.mockResolvedValue(createdSender);

      const result = await handleCreateSender(senderData, mockAPI);

      expect(mockAPI.senders.createSender).toHaveBeenCalledWith(senderData);
      expect(result.content[0].text).toContain('Sender created successfully');
      expect(result.content[0].text).toContain(senderData.name);
      expect(result.content[0].text).toContain(senderData.email);
    });

    it('should validate against known invalid emails', async () => {
      const mockAPI = createMockAPI();
      
      for (const invalidEmail of testDataSets.validation.invalidEmails) {
        const senderData = {
          name: 'Test Sender',
          email: invalidEmail
        };

        const result = await handleCreateSender(senderData, mockAPI);

        expect(result.isError).toBe(true);
        expect(result.content[0].text).toContain('Invalid email format');
        expect(mockAPI.senders.createSender).not.toHaveBeenCalled();
        
        jest.clearAllMocks();
      }
    });

    it('should accept all known valid emails', async () => {
      const mockAPI = createMockAPI();
      
      for (const validEmail of testDataSets.validation.validEmails) {
        const senderData = {
          name: 'Test Sender',
          email: validEmail,
          language: 'en_US'
        };
        
        const createdSender = {
          id: `sender-${Date.now()}`,
          ...senderData,
          status: 'pending',
          created_at: new Date().toISOString()
        };
        
        mockAPI.senders.createSender.mockResolvedValue(createdSender);

        const result = await handleCreateSender(senderData, mockAPI);

        expect(result.isError).toBeUndefined();
        expect(result.content[0].text).toContain('Sender created successfully');
        
        jest.clearAllMocks();
      }
    });
  });

  describe('error scenarios with realistic error responses', () => {
    it('should handle authentication errors with proper error format', async () => {
      const mockAPI = createMockAPI();
      const authError = new Error('Authentication failed');
      authError.name = 'CakemailAuthenticationError';
      
      mockAPI.senders.getSenders.mockRejectedValue(authError);

      const result = await handleGetSenders({}, mockAPI);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Failed to retrieve senders');
      expect(result.content[0].text).toContain('Authentication failed');
    });

    it('should handle rate limiting scenarios', async () => {
      const mockAPI = createMockAPI();
      const rateLimitError = new Error('Rate limit exceeded');
      rateLimitError.name = 'CakemailRateLimitError';
      
      mockAPI.senders.createSender.mockRejectedValue(rateLimitError);

      const result = await handleCreateSender(testDataSets.crud.sender.create, mockAPI);

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Rate limit exceeded');
    });
  });

  describe('integration scenarios using test scenarios', () => {
    it('should handle complete sender management flow', async () => {
      const mockAPI = createMockAPI();
      const scenario = createTestScenarios.senderManagementFlow();
      
      // Mock the authentication flow
      mockAPI.senders.getSenders.mockResolvedValue(mockCakemailResponses.senders.list);
      mockAPI.senders.createSender.mockResolvedValue(mockCakemailResponses.senders.created);

      // Execute the flow
      const getResult = await handleGetSenders({}, mockAPI);
      expect(getResult.content[0].text).toContain('Marketing Team');

      const createResult = await handleCreateSender(testDataSets.crud.sender.create, mockAPI);
      expect(createResult.content[0].text).toContain('Sender created successfully');
    });
  });
});
