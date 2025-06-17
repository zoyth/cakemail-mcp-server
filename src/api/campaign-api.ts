// Campaign API operations with corrected parameter syntax

import { BaseApiClient } from './base-client.js';
import { 
  Campaign, 
  CreateCampaignData, 
  UpdateCampaignData, 
  CampaignFilters,
  PaginationParams,
  SortParams,
  CampaignsResponse,
  CampaignResponse,
  CreateCampaignResponse,
  PatchCampaignResponse,
  DeleteCampaignResponse
} from '../types/cakemail-types.js';

export class CampaignApi extends BaseApiClient {
  
  // FIXED: Campaign API methods with correct parameter syntax
  async getCampaigns(params?: PaginationParams & SortParams & CampaignFilters & { account_id?: number }): Promise<CampaignsResponse> {
    let apiParams: any = {};
    let filters: string[] = [];
    
    // 1. Handle sorting with correct API syntax ([-|+]term)
    if (params?.sort) {
      const direction = params?.order === 'desc' ? '-' : '+';
      apiParams.sort = `${direction}${params.sort}`;
    } else {
      // Default to latest first using correct API syntax
      apiParams.sort = '-created_on';
    }
    
    // 2. Handle filtering with correct API syntax (term==value;term2==value2)
    if (params?.status) {
      filters.push(`status==${params.status}`);
    }
    if (params?.name) {
      filters.push(`name==${params.name}`);
    }
    if (params?.type) {
      filters.push(`type==${params.type}`);
    }
    if (params?.list_id) {
      filters.push(`list_id==${params.list_id}`);
    }
    
    if (filters.length > 0) {
      apiParams.filter = filters.join(';');
    }
    
    // 3. Handle valid direct parameters
    if (params?.page) apiParams.page = params.page;
    if (params?.per_page) apiParams.per_page = params.per_page;
    if (params?.with_count) apiParams.with_count = params.with_count;
    
    // 4. Add account_id support for proper scoping
    if (params?.account_id) {
      apiParams.account_id = params.account_id;
    } else {
      // Try to get current account ID for better results
      const accountId = await this.getCurrentAccountId();
      if (accountId) {
        apiParams.account_id = accountId;
      }
    }
    
    // 5. Validate parameters against API specification
    const validSortTerms = ['name', 'created_on', 'scheduled_for', 'scheduled_on', 'updated_on', 'type'];
    if (params?.sort && !validSortTerms.includes(params.sort)) {
      throw new Error(`Invalid sort term '${params.sort}'. Valid terms: ${validSortTerms.join(', ')}`);
    }
    
    // 6. Validate pagination limits
    if (apiParams.per_page && apiParams.per_page > 50) {
      throw new Error('per_page cannot exceed 50 (API limit)');
    }
    
    const query = Object.keys(apiParams).length > 0 ? `?${new URLSearchParams(apiParams)}` : '';
    
    if (this.debugMode) {
      console.log(`[Campaign API] Final query parameters:`, apiParams);
      console.log(`[Campaign API] Final URL: GET /campaigns${query}`);
    }
    
    return this.makeRequest(`/campaigns${query}`);
  }

  // Update sendCampaign to use the new scheduleCampaign method
  async sendCampaign(id: string): Promise<{ success: true; status: number }> {
    return this.scheduleCampaign(id);
  }

  // FIXED: Enhanced getLatestCampaign with correct API usage
  async getLatestCampaign(status?: string): Promise<Campaign | null> {
    if (this.debugMode) {
      console.log(`[Campaign API] Getting latest campaign with status filter: ${status || 'none'}`);
    }

    const params: any = {
      sort: 'created_on',
      order: 'desc',  // Will be converted to sort='-created_on'
      per_page: 1,
      page: 1
    };
    
    if (status) {
      params.status = status;  // Will be converted to filter='status==<value>'
    }
    
    // Try with account scoping first
    try {
      const accountId = await this.getCurrentAccountId();
      if (accountId) {
        params.account_id = accountId;
      }
      
      const result = await this.getCampaigns(params);
      
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        if (this.debugMode) {
          console.log(`[Campaign API] Latest campaign found: ${result.data[0].id}`);
        }
        return result.data[0];
      }
    } catch (error: any) {
      if (this.debugMode) {
        console.warn(`[Campaign API] Failed to get latest campaign:`, error.message);
      }
    }
    
    // Fallback: try without account scoping
    if (params.account_id) {
      delete params.account_id;
      try {
        const result = await this.getCampaigns(params);
        
        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          if (this.debugMode) {
            console.log(`[Campaign API] Latest campaign found (fallback): ${result.data[0].id}`);
          }
          return result.data[0];
        }
      } catch (error: any) {
        if (this.debugMode) {
          console.warn(`[Campaign API] Fallback also failed:`, error.message);
        }
      }
    }
    
    if (this.debugMode) {
      console.log(`[Campaign API] No latest campaign found`);
    }
    
    return null;
  }

  // Enhanced getCampaignsWithDefaults for backward compatibility
  async getCampaignsWithDefaults(params?: any): Promise<CampaignsResponse> {
    // Apply smart defaults for better UX
    const enhancedParams = {
      sort: 'created_on',
      order: 'desc',
      ...params
    };
    
    if (this.debugMode) {
      console.log(`[Campaign API] Getting campaigns with defaults:`, enhancedParams);
    }
    
    return this.getCampaigns(enhancedParams);
  }

  // Individual campaign retrieval
  async getCampaign(id: string): Promise<CampaignResponse> {
    // Add account_id for consistency if available
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}${query}`);
  }

  // FIXED: Campaign creation with correct data structure
  async createCampaign(data: CreateCampaignData): Promise<CreateCampaignResponse> {
    // Use flatter structure that matches API documentation
    const campaignData: Record<string, any> = {
      name: data.name,
      subject: data.subject,
      html_content: data.html_content,
      text_content: data.text_content,
      list_id: parseInt(String(data.list_id)), // API expects integer
      sender_id: parseInt(String(data.sender_id)), // API expects integer
      from_name: data.from_name,
      reply_to: data.reply_to
    };
    
    // Remove undefined fields to keep the request clean
    Object.keys(campaignData).forEach(key => {
      if (campaignData[key] === undefined) {
        delete campaignData[key];
      }
    });
    
    // Add account_id if available
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns${query}`, {
      method: 'POST',
      body: JSON.stringify(campaignData)
    });
  }

  // FIXED: Campaign update with correct structure
  async updateCampaign(id: string, data: UpdateCampaignData): Promise<PatchCampaignResponse> {
    const updateData: Record<string, any> = {
      name: data.name,
      subject: data.subject,
      html_content: data.html_content,
      text_content: data.text_content,
      from_name: data.from_name,
      reply_to: data.reply_to
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    // Add account_id if available
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}${query}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  }

  async deleteCampaign(id: string): Promise<DeleteCampaignResponse> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}${query}`, { 
      method: 'DELETE' 
    });
  }

  // Campaign rendering (preview)
  async renderCampaign(id: string, contactId?: number): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const params: any = {};
    if (contactId) params.contact_id = contactId;
    if (accountId) params.account_id = accountId;
    
    const query = Object.keys(params).length > 0 ? `?${new URLSearchParams(params)}` : '';
    
    return this.makeRequest(`/campaigns/${id}/render${query}`);
  }

  // Send test email
  async sendTestEmail(id: string, data: { emails: string[] }): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}/send-test${query}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Campaign scheduling operations
  async scheduleCampaign(id: string, data?: { scheduled_for?: string }): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    const requestOptions: any = {
      method: 'POST'
    };
    
    if (data) {
      requestOptions.body = JSON.stringify(data);
    }
    
    return this.makeRequest(`/campaigns/${id}/schedule${query}`, requestOptions);
  }

  async unscheduleCampaign(id: string): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}/unschedule${query}`, {
      method: 'POST'
    });
  }

  async rescheduleCampaign(id: string, data: { scheduled_for: string }): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}/reschedule${query}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Campaign control operations
  async suspendCampaign(id: string): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}/suspend${query}`, {
      method: 'POST'
    });
  }

  async resumeCampaign(id: string): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}/resume${query}`, {
      method: 'POST'
    });
  }

  async cancelCampaign(id: string): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}/cancel${query}`, {
      method: 'POST'
    });
  }

  // Campaign archiving operations
  async archiveCampaign(id: string): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}/archive${query}`, {
      method: 'POST'
    });
  }

  async unarchiveCampaign(id: string): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const query = accountId ? `?account_id=${accountId}` : '';
    
    return this.makeRequest(`/campaigns/${id}/unarchive${query}`, {
      method: 'POST'
    });
  }

  // Campaign revisions
  async getCampaignRevisions(id: string, params?: PaginationParams): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const apiParams: any = {
      page: params?.page || 1,
      per_page: params?.per_page || 50,
      with_count: params?.with_count !== false
    };
    
    if (accountId) apiParams.account_id = accountId;
    
    const query = `?${new URLSearchParams(apiParams)}`;
    
    return this.makeRequest(`/campaigns/${id}/revisions${query}`);
  }

  // Campaign links
  async getCampaignLinks(id: string, params?: PaginationParams): Promise<any> {
    const accountId = await this.getCurrentAccountId();
    const apiParams: any = {
      page: params?.page || 1,
      per_page: params?.per_page || 50,
      with_count: params?.with_count !== false
    };
    
    if (accountId) apiParams.account_id = accountId;
    
    const query = `?${new URLSearchParams(apiParams)}`;
    
    return this.makeRequest(`/campaigns/${id}/links${query}`);
  }

  // Debug method to test different campaign access patterns
  async debugCampaignAccess(campaignId?: string) {
    const results = {
      timestamp: new Date().toISOString(),
      tests: [] as any[]
    };

    // Test 1: Get campaigns with default parameters
    try {
      const campaigns = await this.getCampaigns();
      results.tests.push({
        test: 'default-campaigns',
        success: true,
        campaignCount: Array.isArray(campaigns.data) ? campaigns.data.length : 0,
        firstCampaignId: Array.isArray(campaigns.data) && campaigns.data.length > 0 ? campaigns.data[0].id : null
      });
    } catch (error: any) {
      results.tests.push({
        test: 'default-campaigns',
        success: false,
        error: error.message
      });
    }

    // Test 2: Get campaigns with explicit account ID
    try {
      const accountId = await this.getCurrentAccountId();
      if (accountId) {
        const campaigns = await this.getCampaigns({ account_id: accountId });
        results.tests.push({
          test: 'account-scoped-campaigns',
          success: true,
          accountId,
          campaignCount: Array.isArray(campaigns.data) ? campaigns.data.length : 0,
          firstCampaignId: Array.isArray(campaigns.data) && campaigns.data.length > 0 ? campaigns.data[0].id : null
        });
      }
    } catch (error: any) {
      results.tests.push({
        test: 'account-scoped-campaigns',
        success: false,
        error: error.message
      });
    }

    // Test 3: Get specific campaign if ID provided
    if (campaignId) {
      try {
        const campaign = await this.getCampaign(campaignId);
        results.tests.push({
          test: 'specific-campaign',
          success: true,
          campaignId,
          found: !!campaign.data
        });
      } catch (error: any) {
        results.tests.push({
          test: 'specific-campaign',
          success: false,
          campaignId,
          error: error.message
        });
      }
    }

    return results;
  }
}
