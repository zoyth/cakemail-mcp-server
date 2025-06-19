import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  handleListContacts,
  handleCreateContact,
  handleGetContact,
  handleUpdateContact,
  handleDeleteContact
} from '../../src/handlers/contacts.js';
import { CakemailAPI } from '../../src/cakemail-api.js';

describe('Contact Handlers', () => {
  let mockApi: jest.Mocked<CakemailAPI>;

  beforeEach(() => {
    mockApi = {
      contacts: {
        getContacts: jest.fn(),
        createContact: jest.fn(),
        getContact: jest.fn(),
        updateContact: jest.fn(),
        deleteContact: jest.fn(),
      },
    } as any;
  });

  describe('handleListContacts', () => {
    it('should list contacts successfully', async () => {
      const mockContacts = {
        data: [
          { id: 1, email: 'a@example.com', first_name: 'A', last_name: 'One', status: 'active', created_on: '2023-01-01', updated_on: '2023-01-02', tags: ['vip'] },
          { id: 2, email: 'b@example.com', first_name: 'B', last_name: 'Two', status: 'inactive', created_on: '2023-01-03', updated_on: '2023-01-04', tags: [] }
        ],
        pagination: { count: 2, page: 1, per_page: 50, total_pages: 1 }
      };
      mockApi.contacts.getContacts.mockResolvedValue(mockContacts);
      const result = await handleListContacts({ list_id: 123 }, mockApi);
      expect(mockApi.contacts.getContacts).toHaveBeenCalled();
      expect(result.content[0].text).toContain('Contacts (2 total)');
      expect(result.content[0].text).toContain('a@example.com');
      expect(result.content[0].text).toContain('b@example.com');
    });
    it('should handle API errors', async () => {
      mockApi.contacts.getContacts.mockRejectedValue(new Error('Failed to fetch contacts'));
      const result = await handleListContacts({ list_id: 123 }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Failed to fetch contacts');
    });
  });

  describe('handleCreateContact', () => {
    it('should create contact successfully', async () => {
      const mockContact = { data: { id: 10, email: 'new@example.com' } };
      mockApi.contacts.createContact.mockResolvedValue(mockContact);
      const result = await handleCreateContact({ list_id: 1, email: 'new@example.com', first_name: 'New', last_name: 'Contact' }, mockApi);
      expect(mockApi.contacts.createContact).toHaveBeenCalled();
      expect(result.content[0].text).toContain('Contact Created Successfully');
      expect(result.content[0].text).toContain('new@example.com');
    });
    it('should require list_id and email', async () => {
      const result = await handleCreateContact({ first_name: 'NoList' }, mockApi);
      expect(result.content[0].text).toContain('Missing Required Fields');
      expect(mockApi.contacts.createContact).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.contacts.createContact.mockRejectedValue(new Error('Create failed'));
      const result = await handleCreateContact({ list_id: 1, email: 'fail@example.com' }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Create failed');
    });
  });

  describe('handleGetContact', () => {
    it('should get contact successfully', async () => {
      const mockContact = { data: { id: 1, email: 'a@example.com', first_name: 'A', last_name: 'One', status: 'active', created_on: '2023-01-01', updated_on: '2023-01-02', tags: ['vip'] } };
      mockApi.contacts.getContact.mockResolvedValue(mockContact);
      const result = await handleGetContact({ contact_id: 1 }, mockApi);
      expect(mockApi.contacts.getContact).toHaveBeenCalledWith(1);
      expect(result.content[0].text).toContain('Contact Details');
      expect(result.content[0].text).toContain('a@example.com');
    });
    it('should require contact_id', async () => {
      const result = await handleGetContact({}, mockApi);
      expect(result.content[0].text).toContain('Missing Required Field');
      expect(mockApi.contacts.getContact).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.contacts.getContact.mockRejectedValue(new Error('Not found'));
      const result = await handleGetContact({ contact_id: 999 }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Not found');
    });
  });

  describe('handleUpdateContact', () => {
    it('should update contact successfully', async () => {
      mockApi.contacts.updateContact.mockResolvedValue({ data: { id: 1, email: 'updated@example.com' } });
      const result = await handleUpdateContact({ contact_id: 1, email: 'updated@example.com' }, mockApi);
      expect(mockApi.contacts.updateContact).toHaveBeenCalledWith(1, { email: 'updated@example.com' });
      expect(result.content[0].text).toContain('Updated Successfully');
    });
    it('should require contact_id', async () => {
      const result = await handleUpdateContact({ email: 'noid@example.com' }, mockApi);
      expect(result.content[0].text).toContain('Missing Required Field');
      expect(mockApi.contacts.updateContact).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.contacts.updateContact.mockRejectedValue(new Error('Update failed'));
      const result = await handleUpdateContact({ contact_id: 1, email: 'fail@example.com' }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Update failed');
    });
  });

  describe('handleDeleteContact', () => {
    it('should delete contact successfully', async () => {
      mockApi.contacts.deleteContact.mockResolvedValue({ success: true, status: 200 });
      const result = await handleDeleteContact({ contact_id: 1 }, mockApi);
      expect(mockApi.contacts.deleteContact).toHaveBeenCalledWith(1);
      expect(result.content[0].text).toContain('deleted'); // Handler may need to be checked for actual text
    });
    it('should require contact_id', async () => {
      const result = await handleDeleteContact({}, mockApi);
      expect(result.content[0].text).toContain('Missing Required Field');
      expect(mockApi.contacts.deleteContact).not.toHaveBeenCalled();
    });
    it('should handle API errors', async () => {
      mockApi.contacts.deleteContact.mockRejectedValue(new Error('Delete failed'));
      const result = await handleDeleteContact({ contact_id: 1 }, mockApi);
      expect('isError' in result).toBe(true);
      expect((result as any).isError).toBe(true);
      expect(result.content[0].text).toContain('Delete failed');
    });
  });
}); 