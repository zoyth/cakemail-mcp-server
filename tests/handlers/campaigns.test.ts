import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  handleListCampaigns,
  handleGetCampaign,
  handleCreateCampaign,
  handleUpdateCampaign,
  handleDeleteCampaign
} from '../../src/handlers/campaigns.js';
import { CakemailAPI } from '../../src/cakemail-api.js';

describe('Campaign Handlers', () => {
  let mockApi: jest.Mocked<CakemailAPI>;

  beforeEach(() => {
    mockApi = {
      campaigns: {
        getCampaigns: jest.fn(),
        getCampaign: jest.fn(),
        createCampaign: jest.fn(),
        updateCampaign: jest.fn(),
        deleteCampaign: jest.fn(),
      },
    } as any;
  });

  describe('handleListCampaigns', () => {
    it('should list campaigns successfully', async () => {
      const mockCampaigns = {
        data: [
          { id: 1, name: 'Campaign One', subject: 'Subject 1', status: 'draft' as 'draft', type: 'newsletter', created_on: '2023-01-01', updated_on: '2023-01-02' },
          { id: 2, name: 'Campaign Two', subject: 'Subject 2', status: 'archived' as 'archived', type: 'promotion', created_on: '2023-01-03', updated_on: '2023-01-04' }
        ],
        pagination: { count: 2, page: 1, per_page: 10, total_pages: 1 }
      };
      mockApi.campaigns.getCampaigns.mockResolvedValue(mockCampaigns);
      const result = await handleListCampaigns({}, mockApi);
      expect(mockApi.campaigns.getCampaigns).toHaveBeenCalled();
      expect(result.content[0].text).toContain('Campaigns (2 total)');
      expect(result.content[0].text).toContain('Campaign One');
      expect(result.content[0].text).toContain('Campaign Two');
    });
    it('should handle API errors', async () => {
      mockApi.campaigns.getCampaigns.mockRejectedValue(new Error('Failed to fetch campaigns'));
      const result = await handleListCampaigns({}, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Failed to fetch campaigns');
    });
  });

  describe('handleGetCampaign', () => {
    it('should get campaign successfully', async () => {
      const mockCampaign = { data: { id: 1, name: 'Campaign One', subject: 'Subject 1', status: 'draft' as 'draft', type: 'newsletter', created_on: '2023-01-01', updated_on: '2023-01-02' } };
      mockApi.campaigns.getCampaign.mockResolvedValue(mockCampaign);
      const result = await handleGetCampaign({ campaign_id: 1 }, mockApi);
      expect(mockApi.campaigns.getCampaign).toHaveBeenCalledWith(1);
      expect(result.content[0].text).toContain('Campaign Details');
      expect(result.content[0].text).toContain('Campaign One');
    });
    it('should require campaign_id', async () => {
      const result = await handleGetCampaign({}, mockApi);
      expect(result.content[0].text).toContain('Missing Required Field');
      expect(mockApi.campaigns.getCampaign).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.campaigns.getCampaign.mockRejectedValue(new Error('Not found'));
      const result = await handleGetCampaign({ campaign_id: 999 }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Not found');
    });
  });

  describe('handleCreateCampaign', () => {
    it('should create campaign successfully', async () => {
      const mockCampaign = { data: { id: 10, name: 'New Campaign' } };
      mockApi.campaigns.createCampaign.mockResolvedValue(mockCampaign);
      const result = await handleCreateCampaign({ name: 'New Campaign' }, mockApi);
      expect(mockApi.campaigns.createCampaign).toHaveBeenCalled();
      expect(result.content[0].text).toContain('Created Successfully');
      expect(result.content[0].text).toContain('New Campaign');
    });
    it('should require name', async () => {
      const result = await handleCreateCampaign({}, mockApi);
      expect(result.content[0].text).toContain('Required: name');
      expect(mockApi.campaigns.createCampaign).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.campaigns.createCampaign.mockRejectedValue(new Error('Create failed'));
      const result = await handleCreateCampaign({ name: 'Fail' }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Create failed');
    });
  });

  describe('handleUpdateCampaign', () => {
    it('should update campaign successfully', async () => {
      mockApi.campaigns.updateCampaign.mockResolvedValue({ data: { id: 1, name: 'Updated Campaign' } });
      const result = await handleUpdateCampaign({ campaign_id: 1, name: 'Updated Campaign' }, mockApi);
      expect(mockApi.campaigns.updateCampaign).toHaveBeenCalledWith(1, { name: 'Updated Campaign' });
      expect(result.content[0].text).toContain('Updated Successfully');
    });
    it('should require campaign_id', async () => {
      const result = await handleUpdateCampaign({ name: 'NoId' }, mockApi);
      expect(result.content[0].text).toContain('Missing Required Field');
      expect(mockApi.campaigns.updateCampaign).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.campaigns.updateCampaign.mockRejectedValue(new Error('Update failed'));
      const result = await handleUpdateCampaign({ campaign_id: 1, name: 'Fail' }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Update failed');
    });
  });

  describe('handleDeleteCampaign', () => {
    it('should delete campaign successfully', async () => {
      mockApi.campaigns.deleteCampaign.mockResolvedValue({ data: { id: 1, deleted: true } });
      const result = await handleDeleteCampaign({ campaign_id: 1 }, mockApi);
      expect(mockApi.campaigns.deleteCampaign).toHaveBeenCalledWith(1);
      expect(result.content[0].text).toContain('deleted');
    });
    it('should require campaign_id', async () => {
      const result = await handleDeleteCampaign({}, mockApi);
      expect(result.content[0].text).toContain('Missing Required Field');
      expect(mockApi.campaigns.deleteCampaign).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.campaigns.deleteCampaign.mockRejectedValue(new Error('Delete failed'));
      const result = await handleDeleteCampaign({ campaign_id: 1 }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Delete failed');
    });
  });
}); 