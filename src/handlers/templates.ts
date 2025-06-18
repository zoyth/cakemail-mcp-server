// Template Operations Handler Implementation

import { CakemailAPI } from '../cakemail-api.js';
import { handleCakemailError } from '../utils/errors.js';

export async function handleListTemplates(args: any, api: CakemailAPI) {
  try {
    const { 
      page = 1, 
      per_page = 50, 
      with_count = false,
      filter,
      sort = 'id',
      account_id 
    } = args;
    
    const params: any = {
      page,
      per_page,
      with_count
    };
    
    if (filter) params.filter = filter;
    if (sort) params.sort = sort;
    if (account_id) params.account_id = account_id;
    
    const templates = await api.templates.getTemplates(params);
    
    return {
      content: [
        {
          type: 'text',
          text: `Templates retrieved successfully:\n${JSON.stringify(templates, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleCreateTemplate(args: any, api: CakemailAPI) {
  try {
    const { 
      name, 
      description,
      content: templateContent,
      tags,
      account_id 
    } = args;
    
    if (!name) {
      throw new Error('Template name is required');
    }
    
    if (!templateContent) {
      throw new Error('Template content is required');
    }
    
    // Validate template content structure
    if (!templateContent.type) {
      throw new Error('Template content type is required');
    }
    
    const createData: any = {
      name,
      content: templateContent
    };
    
    if (description) createData.description = description;
    if (tags && Array.isArray(tags)) createData.tags = tags;
    if (account_id) createData.account_id = account_id;
    
    const template = await api.templates.createTemplate(createData);
    
    return {
      content: [
        {
          type: 'text',
          text: `Template created successfully:\n${JSON.stringify(template, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleGetTemplate(args: any, api: CakemailAPI) {
  try {
    const { template_id, account_id } = args;
    
    if (!template_id) {
      throw new Error('Template ID is required');
    }
    
    // Enhanced template API call with account_id support
    const template = await api.templates.getTemplate(template_id, account_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Template details:\n${JSON.stringify(template, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleUpdateTemplate(args: any, api: CakemailAPI) {
  try {
    const { 
      template_id, 
      name,
      description,
      content: templateContent,
      tags,
      account_id 
    } = args;
    
    if (!template_id) {
      throw new Error('Template ID is required');
    }
    
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (templateContent) updateData.content = templateContent;
    if (tags && Array.isArray(tags)) updateData.tags = tags;
    if (account_id) updateData.account_id = account_id;
    
    const template = await api.templates.updateTemplate(template_id, updateData);
    
    return {
      content: [
        {
          type: 'text',
          text: `Template updated successfully:\n${JSON.stringify(template, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDeleteTemplate(args: any, api: CakemailAPI) {
  try {
    const { template_id, account_id } = args;
    
    if (!template_id) {
      throw new Error('Template ID is required');
    }
    
    await api.templates.deleteTemplate(template_id, account_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Template ${template_id} deleted successfully`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleDuplicateTemplate(args: any, api: CakemailAPI) {
  try {
    const { 
      template_id, 
      new_name,
      new_description,
      account_id 
    } = args;
    
    if (!template_id) {
      throw new Error('Template ID is required');
    }
    
    if (!new_name) {
      throw new Error('New template name is required for duplication');
    }
    
    // First, get the original template
    const originalTemplate = await api.templates.getTemplate(template_id, account_id);
    
    if (!originalTemplate?.data) {
      throw new Error('Original template not found');
    }
    
    // Create the duplicate with modified name and optional description
    const duplicateData: any = {
      name: new_name,
      content: originalTemplate.data.content
    };
    
    if (new_description) {
      duplicateData.description = new_description;
    } else if (originalTemplate.data.description) {
      duplicateData.description = `Copy of ${originalTemplate.data.description}`;
    } else {
      duplicateData.description = `Copy of ${originalTemplate.data.name}`;
    }
    
    // Copy tags if they exist
    if (originalTemplate.data.tags && originalTemplate.data.tags.length > 0) {
      duplicateData.tags = [...originalTemplate.data.tags];
    }
    
    if (account_id) duplicateData.account_id = account_id;
    
    const duplicatedTemplate = await api.templates.createTemplate(duplicateData);
    
    return {
      content: [
        {
          type: 'text',
          text: `Template duplicated successfully:\nOriginal: ${originalTemplate.data.name} (ID: ${template_id})\nDuplicate: ${new_name} (ID: ${duplicatedTemplate.data?.id})\n\nDuplicate details:\n${JSON.stringify(duplicatedTemplate, null, 2)}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}

export async function handleRenderTemplate(args: any, api: CakemailAPI) {
  try {
    const { template_id, account_id } = args;
    
    if (!template_id) {
      throw new Error('Template ID is required');
    }
    
    // Call the render endpoint
    const rendered = await api.templates.renderTemplate(template_id, account_id);
    
    return {
      content: [
        {
          type: 'text',
          text: `Template rendered successfully:\n${rendered}`,
        },
      ],
    };
  } catch (error) {
    return handleCakemailError(error);
  }
}
