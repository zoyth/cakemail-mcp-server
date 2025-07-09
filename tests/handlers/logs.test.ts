import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  handleGetCampaignLogs,
  handleGetWorkflowActionLogs,
  handleGetWorkflowLogs,
  handleGetTransactionalEmailLogs,
  handleGetListLogs,
  handleDebugLogsAccess
} from '../../src/handlers/logs.js';
import { CakemailAPI } from '../../src/cakemail-api.js';

describe('Logs Handlers', () => {
  let mockApi: jest.Mocked<CakemailAPI>;

  beforeEach(() => {
    mockApi = {
      logs: {
        getCampaignLogsWithAnalysis: jest.fn(),
        getCampaignLogs: jest.fn(),
        debugLogsAccess: jest.fn(),
      },
    } as any;
  });

  describe('handleGetCampaignLogs', () => {
    it('should get campaign logs successfully', async () => {
      const mockLogs = {
        logs: [
          { id: 1, type: 'opened', email: 'user@example.com', timestamp: '2024-01-01T00:00:00Z' },
          { id: 2, type: 'clicked', email: 'user2@example.com', timestamp: '2024-01-01T01:00:00Z' }
        ],
        analysis: {
          summary: { total: 2, unique_emails: 2 },
          by_type: { opened: 1, clicked: 1 }
        },
        pagination: { page: 1, per_page: 50, total: 2 }
      };
      
      mockApi.logs.getCampaignLogsWithAnalysis.mockResolvedValue(mockLogs);
      
      const result = await handleGetCampaignLogs({ campaign_id: 'campaign-123' }, mockApi);
      
      expect(mockApi.logs.getCampaignLogsWithAnalysis).toHaveBeenCalledWith('campaign-123', expect.any(Object));
      expect(result.content[0].text).toContain('Campaign Logs');
      expect(result.content[0].text).toContain('user@example.com');
    });

    it('should require campaign_id', async () => {
      const result = await handleGetCampaignLogs({}, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Missing Parameter');
      expect(result.content[0].text).toContain('campaign_id is required');
      expect(mockApi.logs.getCampaignLogsWithAnalysis).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      mockApi.logs.getCampaignLogsWithAnalysis.mockRejectedValue(new Error('API Error'));
      
      const result = await handleGetCampaignLogs({ campaign_id: 'campaign-123' }, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error');
    });

    it('should handle pagination parameters', async () => {
      const mockLogs = { logs: [], analysis: {}, pagination: {} };
      mockApi.logs.getCampaignLogsWithAnalysis.mockResolvedValue(mockLogs);
      
      await handleGetCampaignLogs({ 
        campaign_id: 'campaign-123',
        page: 2,
        per_page: 25,
        sort: 'timestamp',
        order: 'desc'
      }, mockApi);
      
      expect(mockApi.logs.getCampaignLogsWithAnalysis).toHaveBeenCalledWith('campaign-123', {
        page: 2,
        per_page: 25,
        with_count: true,
        sort: '-timestamp'
      });
    });
  });

  describe('handleGetWorkflowActionLogs', () => {
    it('should return not implemented message', async () => {
      const result = await handleGetWorkflowActionLogs({}, mockApi);
      
      expect(result.content[0].text).toContain('This feature is not yet implemented');
    });
  });

  describe('handleGetWorkflowLogs', () => {
    it('should return not implemented message', async () => {
      const result = await handleGetWorkflowLogs({}, mockApi);
      
      expect(result.content[0].text).toContain('This feature is not yet implemented');
    });
  });

  describe('handleGetTransactionalEmailLogs', () => {
    it('should return not implemented message', async () => {
      const result = await handleGetTransactionalEmailLogs({}, mockApi);
      
      expect(result.content[0].text).toContain('This feature is not yet implemented');
    });
  });

  describe('handleGetListLogs', () => {
    it('should get list logs successfully', async () => {
      const mockLogs = {
        logs: [
          { type: 'subscribed', email: 'new@example.com', timestamp: '2024-01-01T00:00:00Z' },
          { type: 'unsubscribed', email: 'old@example.com', timestamp: '2024-01-01T01:00:00Z' }
        ],
        pagination: { page: 1, per_page: 50, total: 2 }
      };
      
      mockApi.logs.getCampaignLogs.mockResolvedValue(mockLogs);
      
      const result = await handleGetListLogs({ list_id: 'list-123' }, mockApi);
      
      expect(mockApi.logs.getCampaignLogs).toHaveBeenCalledWith('', expect.objectContaining({
        filter: 'list_id:list-123'
      }));
      expect(result.content[0].text).toContain('List Activity Logs');
    });

    it('should require list_id', async () => {
      const result = await handleGetListLogs({}, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('list_id is required');
    });
  });

  describe('handleDebugLogsAccess', () => {
    it('should debug logs access successfully', async () => {
      const mockDebug = {
        tests: [
          { test: 'API Connection', status: 'passed' },
          { test: 'Logs Endpoint', status: 'passed' },
          { test: 'Permissions', status: 'passed' }
        ],
        timestamp: '2024-01-01T00:00:00Z',
        summary: 'All tests passed'
      };
      
      mockApi.logs.debugLogsAccess.mockResolvedValue(mockDebug);
      
      const result = await handleDebugLogsAccess({}, mockApi);
      
      expect(mockApi.logs.debugLogsAccess).toHaveBeenCalled();
      expect(result.content[0].text).toContain('Logs Access Debug Information');
    });

    it('should handle debug errors', async () => {
      mockApi.logs.debugLogsAccess.mockRejectedValue(new Error('Debug failed'));
      
      const result = await handleDebugLogsAccess({}, mockApi);
      
      expect(result.content[0].text).toContain('Unable to debug logs access');
    });
  });
});