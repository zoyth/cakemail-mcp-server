import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  handleListTemplates,
  handleCreateTemplate,
  handleGetTemplate,
  handleUpdateTemplate,
  handleDeleteTemplate,
  handleDuplicateTemplate,
  handleRenderTemplate
} from '../../src/handlers/templates.js';
import { CakemailAPI } from '../../src/cakemail-api.js';

describe('Template Handlers', () => {
  let mockApi: jest.Mocked<CakemailAPI>;

  beforeEach(() => {
    mockApi = {
      templates: {
        getTemplates: jest.fn(),
        createTemplate: jest.fn(),
        getTemplate: jest.fn(),
        updateTemplate: jest.fn(),
        deleteTemplate: jest.fn(),
        duplicateTemplate: jest.fn(),
        renderTemplate: jest.fn(),
      },
    } as any;
  });

  describe('handleListTemplates', () => {
    it('should list templates successfully', async () => {
      const mockTemplates = {
        data: [
          { id: 1, name: 'Template 1', description: 'First template', tags: ['newsletter'] },
          { id: 2, name: 'Template 2', description: 'Second template', tags: ['promotional'] }
        ],
        pagination: { page: 1, per_page: 50, total: 2 }
      };
      
      mockApi.templates.getTemplates.mockResolvedValue(mockTemplates);
      
      const result = await handleListTemplates({}, mockApi);
      
      expect(mockApi.templates.getTemplates).toHaveBeenCalledWith({
        page: 1,
        per_page: 50,
        with_count: false
      });
      expect(result.content[0].text).toContain('Templates retrieved successfully');
      expect(result.content[0].text).toContain('Template 1');
      expect(result.content[0].text).toContain('Template 2');
    });

    it('should handle pagination and filters', async () => {
      const mockTemplates = { data: [], pagination: {} };
      mockApi.templates.getTemplates.mockResolvedValue(mockTemplates);
      
      await handleListTemplates({ 
        page: 2,
        per_page: 25,
        filter: 'name:Newsletter',
        sort: '-created_on',
        account_id: 123
      }, mockApi);
      
      expect(mockApi.templates.getTemplates).toHaveBeenCalledWith({
        page: 2,
        per_page: 25,
        with_count: false,
        filter: 'name:Newsletter',
        sort: '-created_on',
        account_id: 123
      });
    });

    it('should handle API errors', async () => {
      mockApi.templates.getTemplates.mockRejectedValue(new Error('API Error'));
      
      const result = await handleListTemplates({}, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error');
    });
  });

  describe('handleCreateTemplate', () => {
    it('should create template successfully', async () => {
      const mockTemplate = {
        data: {
          id: 123,
          name: 'New Template',
          description: 'A new template',
          content: { html: '<h1>Hello</h1>' },
          tags: ['welcome']
        }
      };
      
      mockApi.templates.createTemplate.mockResolvedValue(mockTemplate);
      
      const result = await handleCreateTemplate({
        name: 'New Template',
        description: 'A new template',
        content: { html: '<h1>Hello</h1>' },
        tags: ['welcome']
      }, mockApi);
      
      expect(mockApi.templates.createTemplate).toHaveBeenCalledWith({
        name: 'New Template',
        description: 'A new template',
        content: { html: '<h1>Hello</h1>' },
        tags: ['welcome']
      }, {});
      expect(result.content[0].text).toContain('Template created successfully');
      expect(result.content[0].text).toContain('123');
    });

    it('should require name', async () => {
      const result = await handleCreateTemplate({
        description: 'Missing name'
      }, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('name is required');
      expect(mockApi.templates.createTemplate).not.toHaveBeenCalled();
    });

    it('should handle account_id parameter', async () => {
      const mockTemplate = { data: { id: 123, name: 'Test' } };
      mockApi.templates.createTemplate.mockResolvedValue(mockTemplate);
      
      await handleCreateTemplate({
        name: 'Test Template',
        account_id: 456
      }, mockApi);
      
      expect(mockApi.templates.createTemplate).toHaveBeenCalledWith(
        { name: 'Test Template' },
        { account_id: 456 }
      );
    });
  });

  describe('handleGetTemplate', () => {
    it('should get template successfully', async () => {
      const mockTemplate = {
        data: {
          id: 123,
          name: 'Test Template',
          description: 'Test description',
          content: { html: '<h1>Test</h1>' }
        }
      };
      
      mockApi.templates.getTemplate.mockResolvedValue(mockTemplate);
      
      const result = await handleGetTemplate({ template_id: 123 }, mockApi);
      
      expect(mockApi.templates.getTemplate).toHaveBeenCalledWith(123, {});
      expect(result.content[0].text).toContain('Template retrieved successfully');
      expect(result.content[0].text).toContain('Test Template');
    });

    it('should require template_id', async () => {
      const result = await handleGetTemplate({}, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('template_id is required');
      expect(mockApi.templates.getTemplate).not.toHaveBeenCalled();
    });
  });

  describe('handleUpdateTemplate', () => {
    it('should update template successfully', async () => {
      const mockTemplate = {
        data: {
          id: 123,
          name: 'Updated Template',
          description: 'Updated description'
        }
      };
      
      mockApi.templates.updateTemplate.mockResolvedValue(mockTemplate);
      
      const result = await handleUpdateTemplate({
        template_id: 123,
        name: 'Updated Template',
        description: 'Updated description'
      }, mockApi);
      
      expect(mockApi.templates.updateTemplate).toHaveBeenCalledWith(
        123,
        {
          name: 'Updated Template',
          description: 'Updated description'
        },
        {}
      );
      expect(result.content[0].text).toContain('Template updated successfully');
    });

    it('should require template_id', async () => {
      const result = await handleUpdateTemplate({
        name: 'Missing ID'
      }, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('template_id is required');
      expect(mockApi.templates.updateTemplate).not.toHaveBeenCalled();
    });
  });

  describe('handleDeleteTemplate', () => {
    it('should delete template successfully', async () => {
      mockApi.templates.deleteTemplate.mockResolvedValue({ success: true });
      
      const result = await handleDeleteTemplate({ template_id: 123 }, mockApi);
      
      expect(mockApi.templates.deleteTemplate).toHaveBeenCalledWith(123, {});
      expect(result.content[0].text).toContain('Template deleted successfully');
    });

    it('should require template_id', async () => {
      const result = await handleDeleteTemplate({}, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('template_id is required');
      expect(mockApi.templates.deleteTemplate).not.toHaveBeenCalled();
    });
  });

  describe('handleDuplicateTemplate', () => {
    it('should duplicate template successfully', async () => {
      const mockTemplate = {
        data: {
          id: 456,
          name: 'Copy of Template',
          original_id: 123
        }
      };
      
      mockApi.templates.duplicateTemplate.mockResolvedValue(mockTemplate);
      
      const result = await handleDuplicateTemplate({
        template_id: 123,
        new_name: 'Copy of Template'
      }, mockApi);
      
      expect(mockApi.templates.duplicateTemplate).toHaveBeenCalledWith(
        123,
        { new_name: 'Copy of Template' },
        {}
      );
      expect(result.content[0].text).toContain('Template duplicated successfully');
      expect(result.content[0].text).toContain('456');
    });

    it('should require template_id', async () => {
      const result = await handleDuplicateTemplate({
        new_name: 'Missing ID'
      }, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('template_id is required');
      expect(mockApi.templates.duplicateTemplate).not.toHaveBeenCalled();
    });
  });

  describe('handleRenderTemplate', () => {
    it('should render template successfully', async () => {
      const mockRendered = {
        data: {
          html: '<h1>Hello John</h1>',
          text: 'Hello John',
          subject: 'Welcome John'
        }
      };
      
      mockApi.templates.renderTemplate.mockResolvedValue(mockRendered);
      
      const result = await handleRenderTemplate({
        template_id: 123,
        merge_data: { first_name: 'John' }
      }, mockApi);
      
      expect(mockApi.templates.renderTemplate).toHaveBeenCalledWith(
        123,
        { merge_data: { first_name: 'John' } },
        {}
      );
      expect(result.content[0].text).toContain('Template rendered successfully');
      expect(result.content[0].text).toContain('Hello John');
    });

    it('should require template_id', async () => {
      const result = await handleRenderTemplate({
        merge_data: { name: 'Test' }
      }, mockApi);
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('template_id is required');
      expect(mockApi.templates.renderTemplate).not.toHaveBeenCalled();
    });
  });
});