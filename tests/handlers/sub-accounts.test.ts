import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  handleListSubAccounts,
  handleGetSubAccount,
  handleCreateSubAccount,
  handleUpdateSubAccount,
  handleDeleteSubAccount,
  handleSuspendSubAccount,
  handleUnsuspendSubAccount,
  handleConfirmSubAccount,
  handleResendVerificationEmail,
  handleConvertSubAccountToOrganization,
  handleGetLatestSubAccount,
  handleSearchSubAccountsByName,
  handleGetSubAccountsByStatus,
  handleVerifySubAccountEmail,
  handleDebugSubAccountAccess,
  handleExportSubAccounts
} from '../../src/handlers/sub-accounts.js';
import { CakemailAPI } from '../../src/cakemail-api.js';

describe('Sub-Account Handlers', () => {
  let mockApi: jest.Mocked<CakemailAPI>;

  beforeEach(() => {
    mockApi = {
      subAccounts: {
        listSubAccounts: jest.fn(),
        getSubAccount: jest.fn(),
        createSubAccount: jest.fn(),
        updateSubAccount: jest.fn(),
        deleteSubAccount: jest.fn(),
        suspendSubAccount: jest.fn(),
        unsuspendSubAccount: jest.fn(),
        confirmSubAccount: jest.fn(),
        resendVerificationEmail: jest.fn(),
        convertToOrganization: jest.fn(),
        searchByName: jest.fn(),
        getByStatus: jest.fn(),
        verifyEmail: jest.fn(),
        exportSubAccounts: jest.fn(),
        getLatestSubAccount: jest.fn(),
      },
    } as any;
  });

  describe('handleListSubAccounts', () => {
    it('should list sub-accounts successfully', async () => {
      const mockSubAccounts = {
        data: [
          {
            id: 'sub-1',
            name: 'Sub Account 1',
            status: 'active',
            account_owner: { email: 'owner1@example.com', name: 'Owner 1' },
            created_on: '2024-01-01'
          },
          {
            id: 'sub-2',
            name: 'Sub Account 2',
            status: 'suspended',
            account_owner: { email: 'owner2@example.com', name: 'Owner 2' },
            created_on: '2024-01-02'
          }
        ],
        pagination: { count: 2 }
      };
      
      mockApi.subAccounts.listSubAccounts.mockResolvedValue(mockSubAccounts);
      
      const result = await handleListSubAccounts({}, mockApi);
      
      expect(mockApi.subAccounts.listSubAccounts).toHaveBeenCalledWith({});
      expect(result.content[0].text).toContain('Sub-Accounts');
      expect(result.content[0].text).toContain('Sub Account 1');
      expect(result.content[0].text).toContain('active');
    });

    it('should handle filters and pagination', async () => {
      const mockSubAccounts = { data: [], pagination: {} };
      mockApi.subAccounts.listSubAccounts.mockResolvedValue(mockSubAccounts);
      
      await handleListSubAccounts({
        page: 2,
        per_page: 25,
        status: 'active',
        name: 'Test',
        recursive: true
      }, mockApi);
      
      expect(mockApi.subAccounts.listSubAccounts).toHaveBeenCalledWith({
        pagination: { page: 2, per_page: 25, with_count: true },
        filters: { status: 'active', name: 'Test' },
        recursive: true
      });
    });

    it('should handle API errors', async () => {
      mockApi.subAccounts.listSubAccounts.mockRejectedValue(new Error('API Error'));
      
      const result = await handleListSubAccounts({}, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error');
    });
  });

  describe('handleGetSubAccount', () => {
    it('should get sub-account successfully', async () => {
      const mockSubAccount = {
        data: {
          id: 'sub-123',
          name: 'Test Sub Account',
          status: 'active',
          account_owner: { email: 'owner@example.com', name: 'Owner' },
          usage_limits: {
            emails_per_month: 10000,
            contacts: 5000
          }
        }
      };
      
      mockApi.subAccounts.getSubAccount.mockResolvedValue(mockSubAccount);
      
      const result = await handleGetSubAccount({ sub_account_id: 'sub-123' }, mockApi);
      
      expect(mockApi.subAccounts.getSubAccount).toHaveBeenCalledWith('sub-123');
      expect(result.content[0].text).toContain('Sub-Account Details');
      expect(result.content[0].text).toContain('Test Sub Account');
    });

    it('should require sub_account_id', async () => {
      const result = await handleGetSubAccount({}, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('sub_account_id is required');
      expect(mockApi.subAccounts.getSubAccount).not.toHaveBeenCalled();
    });
  });

  describe('handleCreateSubAccount', () => {
    it('should create sub-account successfully', async () => {
      const mockSubAccount = {
        data: {
          id: 'sub-new',
          name: 'New Sub Account',
          account_owner: { email: 'new@example.com' }
        }
      };
      
      mockApi.subAccounts.createSubAccount.mockResolvedValue(mockSubAccount);
      
      const result = await handleCreateSubAccount({
        name: 'New Sub Account',
        owner_email: 'new@example.com',
        owner_name: 'New Owner'
      }, mockApi);
      
      expect(mockApi.subAccounts.createSubAccount).toHaveBeenCalledWith({
        name: 'New Sub Account',
        account_owner: {
          email: 'new@example.com',
          name: 'New Owner'
        }
      });
      expect(result.content[0].text).toContain('Sub-Account Created');
      expect(result.content[0].text).toContain('sub-new');
    });

    it('should require name and owner_email', async () => {
      const result = await handleCreateSubAccount({ name: 'Missing Email' }, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('name and owner_email are required');
      expect(mockApi.subAccounts.createSubAccount).not.toHaveBeenCalled();
    });
  });

  describe('handleUpdateSubAccount', () => {
    it('should update sub-account successfully', async () => {
      const mockSubAccount = {
        data: {
          id: 'sub-123',
          name: 'Updated Name',
          status: 'active'
        }
      };
      
      mockApi.subAccounts.updateSubAccount.mockResolvedValue(mockSubAccount);
      
      const result = await handleUpdateSubAccount({
        sub_account_id: 'sub-123',
        name: 'Updated Name'
      }, mockApi);
      
      expect(mockApi.subAccounts.updateSubAccount).toHaveBeenCalledWith(
        'sub-123',
        { name: 'Updated Name' }
      );
      expect(result.content[0].text).toContain('Sub-Account Updated');
    });

    it('should require sub_account_id', async () => {
      const result = await handleUpdateSubAccount({ name: 'No ID' }, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('sub_account_id is required');
      expect(mockApi.subAccounts.updateSubAccount).not.toHaveBeenCalled();
    });
  });

  describe('handleDeleteSubAccount', () => {
    it('should delete sub-account successfully', async () => {
      mockApi.subAccounts.deleteSubAccount.mockResolvedValue({ success: true });
      
      const result = await handleDeleteSubAccount({ sub_account_id: 'sub-123' }, mockApi);
      
      expect(mockApi.subAccounts.deleteSubAccount).toHaveBeenCalledWith('sub-123');
      expect(result.content[0].text).toContain('Sub-Account Deleted');
    });

    it('should require sub_account_id', async () => {
      const result = await handleDeleteSubAccount({}, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('sub_account_id is required');
      expect(mockApi.subAccounts.deleteSubAccount).not.toHaveBeenCalled();
    });
  });

  describe('handleSuspendSubAccount', () => {
    it('should suspend sub-account successfully', async () => {
      mockApi.subAccounts.suspendSubAccount.mockResolvedValue({ success: true });
      
      const result = await handleSuspendSubAccount({ sub_account_id: 'sub-123' }, mockApi);
      
      expect(mockApi.subAccounts.suspendSubAccount).toHaveBeenCalledWith('sub-123', {});
      expect(result.content[0].text).toContain('Sub-Account Suspended');
    });
  });

  describe('handleUnsuspendSubAccount', () => {
    it('should unsuspend sub-account successfully', async () => {
      mockApi.subAccounts.unsuspendSubAccount.mockResolvedValue({ success: true });
      
      const result = await handleUnsuspendSubAccount({ sub_account_id: 'sub-123' }, mockApi);
      
      expect(mockApi.subAccounts.unsuspendSubAccount).toHaveBeenCalledWith('sub-123');
      expect(result.content[0].text).toContain('Sub-Account Unsuspended');
    });
  });

  describe('handleConfirmSubAccount', () => {
    it('should confirm sub-account successfully', async () => {
      mockApi.subAccounts.confirmSubAccount.mockResolvedValue({ success: true });
      
      const result = await handleConfirmSubAccount({ sub_account_id: 'sub-123', confirmation_code: '123456' }, mockApi);
      
      expect(mockApi.subAccounts.confirmSubAccount).toHaveBeenCalledWith('sub-123', { confirmation_code: '123456' });
      expect(result.content[0].text).toContain('Sub-Account Confirmed');
    });

    it('should require sub_account_id and confirmation_code', async () => {
      const result = await handleConfirmSubAccount({ sub_account_id: 'sub-123' }, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('sub_account_id and confirmation_code are required');
    });
  });

  describe('handleResendVerificationEmail', () => {
    it('should resend verification email successfully', async () => {
      mockApi.subAccounts.resendVerificationEmail.mockResolvedValue({ success: true });
      
      const result = await handleResendVerificationEmail({ sub_account_id: 'sub-123' }, mockApi);
      
      expect(mockApi.subAccounts.resendVerificationEmail).toHaveBeenCalledWith('sub-123');
      expect(result.content[0].text).toContain('Verification Email Sent');
    });
  });

  describe('handleConvertSubAccountToOrganization', () => {
    it('should convert to organization successfully', async () => {
      const mockOrganization = {
        data: {
          id: 'org-123',
          name: 'New Organization',
          type: 'organization'
        }
      };
      
      mockApi.subAccounts.convertToOrganization.mockResolvedValue(mockOrganization);
      
      const result = await handleConvertSubAccountToOrganization({ sub_account_id: 'sub-123' }, mockApi);
      
      expect(mockApi.subAccounts.convertToOrganization).toHaveBeenCalledWith('sub-123', {});
      expect(result.content[0].text).toContain('Converted to Organization');
    });
  });

  describe('handleGetLatestSubAccount', () => {
    it('should get latest sub-account successfully', async () => {
      const mockSubAccounts = {
        data: [
          { id: 'sub-latest', name: 'Latest Sub Account', created_on: '2024-01-10' }
        ]
      };
      
      mockApi.subAccounts.listSubAccounts.mockResolvedValue(mockSubAccounts);
      
      const result = await handleGetLatestSubAccount({}, mockApi);
      
      expect(mockApi.subAccounts.listSubAccounts).toHaveBeenCalledWith({
        pagination: { page: 1, per_page: 1 }
      });
      expect(result.content[0].text).toContain('Latest Sub-Account');
    });
  });

  describe('handleSearchSubAccountsByName', () => {
    it('should search by name successfully', async () => {
      const mockSubAccounts = {
        data: [
          { id: 'sub-1', name: 'Test Account 1' },
          { id: 'sub-2', name: 'Test Account 2' }
        ]
      };
      
      mockApi.subAccounts.listSubAccounts.mockResolvedValue(mockSubAccounts);
      
      const result = await handleSearchSubAccountsByName({ name: 'Test' }, mockApi);
      
      expect(mockApi.subAccounts.listSubAccounts).toHaveBeenCalledWith({
        filters: { name: 'Test' }
      });
      expect(result.content[0].text).toContain('Search Results');
      expect(result.content[0].text).toContain('Test Account 1');
    });

    it('should require name parameter', async () => {
      const result = await handleSearchSubAccountsByName({}, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('name parameter is required');
    });
  });

  describe('handleGetSubAccountsByStatus', () => {
    it('should get by status successfully', async () => {
      const mockSubAccounts = {
        data: [
          { id: 'sub-1', name: 'Active Account 1', status: 'active' },
          { id: 'sub-2', name: 'Active Account 2', status: 'active' }
        ]
      };
      
      mockApi.subAccounts.listSubAccounts.mockResolvedValue(mockSubAccounts);
      
      const result = await handleGetSubAccountsByStatus({ status: 'active' }, mockApi);
      
      expect(mockApi.subAccounts.listSubAccounts).toHaveBeenCalledWith({
        filters: { status: 'active' }
      });
      expect(result.content[0].text).toContain('Sub-Accounts by Status');
      expect(result.content[0].text).toContain('active');
    });
  });

  describe('handleVerifySubAccountEmail', () => {
    it('should verify email successfully', async () => {
      mockApi.subAccounts.verifyEmail = jest.fn().mockResolvedValue({ verified: true });
      
      const result = await handleVerifySubAccountEmail({ sub_account_id: 'sub-123', email: 'test@example.com' }, mockApi);
      
      expect(mockApi.subAccounts.verifyEmail).toHaveBeenCalledWith('sub-123', { email: 'test@example.com' });
      expect(result.content[0].text).toContain('Email Verified');
    });

    it('should require sub_account_id and email', async () => {
      const result = await handleVerifySubAccountEmail({ sub_account_id: 'sub-123' }, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('sub_account_id and email are required');
    });
  });

  describe('handleDebugSubAccountAccess', () => {
    it('should debug access successfully', async () => {
      const mockDebug = {
        permission_tests: {
          list: true,
          create: true,
          update: true,
          delete: false
        },
        account_info: {
          type: 'organization',
          tier: 'enterprise'
        }
      };
      
      // Mock the debug implementation
      mockApi.subAccounts.listSubAccounts.mockResolvedValue({ data: [] });
      
      const result = await handleDebugSubAccountAccess({}, mockApi);
      
      expect(result.content[0].text).toContain('Sub-Account Access Debug');
    });
  });

  describe('handleExportSubAccounts', () => {
    it('should export sub-accounts successfully', async () => {
      const mockSubAccounts = {
        data: [
          { id: 'sub-1', name: 'Account 1' },
          { id: 'sub-2', name: 'Account 2' }
        ]
      };
      
      mockApi.subAccounts.listSubAccounts.mockResolvedValue(mockSubAccounts);
      
      const result = await handleExportSubAccounts({ format: 'csv' }, mockApi);
      
      expect(mockApi.subAccounts.listSubAccounts).toHaveBeenCalled();
      expect(result.content[0].text).toContain('Sub-Accounts Export');
    });
  });
});