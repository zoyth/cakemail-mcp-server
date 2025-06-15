import fetch, { RequestInit } from 'node-fetch';

export interface CakemailConfig {
  username: string;
  password: string;
  baseUrl?: string;
}

export interface CakemailToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export interface CakemailError {
  error: string;
  error_description?: string;
  message?: string;
}

export class CakemailAPI {
  private config: CakemailConfig;
  private token: CakemailToken | null = null;
  private tokenExpiry: Date | null = null;
  private baseUrl: string;

  constructor(config: CakemailConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.cakemail.dev';
  }

  async authenticate(): Promise<void> {
    // Try refresh token first if available and not expired
    if (this.token?.refresh_token && this.tokenExpiry && new Date() < new Date(this.tokenExpiry.getTime() - 300000)) {
      try {
        await this.refreshToken();
        return;
      } catch (error) {
        console.warn('Refresh token failed, falling back to password authentication');
      }
    }

    // Password authentication
    const response = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: this.config.username,
        password: this.config.password
      }).toString()
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `Authentication failed (${response.status}): ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorBody) as CakemailError;
        errorMessage += ` - ${errorData.error_description || errorData.message || errorData.error}`;
      } catch {
        errorMessage += ` - ${errorBody}`;
      }
      
      throw new Error(errorMessage);
    }

    const tokenData = await response.json() as CakemailToken;
    this.token = tokenData;
    this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000) - 60000); // 1 minute buffer
  }

  private async refreshToken(): Promise<void> {
    if (!this.token?.refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.token.refresh_token
      }).toString()
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const tokenData = await response.json() as CakemailToken;
    this.token = tokenData;
    this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000) - 60000);
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    await this.authenticate();

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.token!.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage = `API request failed (${response.status}): ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorBody) as CakemailError;
        errorMessage += ` - ${errorData.error_description || errorData.message || errorData.error}`;
      } catch {
        if (errorBody) {
          errorMessage += ` - ${errorBody}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    // Handle empty responses (like DELETE operations)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return { success: true, status: response.status };
  }

  // Campaign API methods - Fixed structure
  async createCampaign(data: any) {
    // Use flatter structure that matches API documentation
    const campaignData: Record<string, any> = {
      name: data.name,
      subject: data.subject,
      html_content: data.html_content,
      text_content: data.text_content,
      list_id: data.list_id, // Keep as string - don't parse to int
      sender_id: data.sender_id,
      from_name: data.from_name,
      reply_to: data.reply_to
    };
    
    // Remove undefined fields to keep the request clean
    Object.keys(campaignData).forEach(key => {
      if (campaignData[key] === undefined) {
        delete campaignData[key];
      }
    });
    
    return this.makeRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData)
    });
  }

  async getCampaigns(params?: any) {
    // Validate pagination limits according to docs
    if (params?.per_page && params.per_page > 50) {
      throw new Error('per_page cannot exceed 50 (API limit)');
    }
    
    // Validate date formats
    if (params?.created_after && !this.isValidDate(params.created_after)) {
      throw new Error('created_after must be in YYYY-MM-DD format');
    }
    if (params?.created_before && !this.isValidDate(params.created_before)) {
      throw new Error('created_before must be in YYYY-MM-DD format');
    }
    
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest(`/campaigns${query}`);
  }

  async getCampaign(id: string) {
    return this.makeRequest(`/campaigns/${id}`);
  }

  async sendCampaign(id: string) {
    return this.makeRequest(`/campaigns/${id}/send`, { method: 'POST' });
  }

  async updateCampaign(id: string, data: any) {
    // Use consistent flat structure like create
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
    
    return this.makeRequest(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  async deleteCampaign(id: string) {
    return this.makeRequest(`/campaigns/${id}`, { method: 'DELETE' });
  }

  // Contact API methods
  async createContact(data: any) {
    // Validate email format
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    
    return this.makeRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getContacts(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest(`/contacts${query}`);
  }

  async getContact(id: string) {
    return this.makeRequest(`/contacts/${id}`);
  }

  async updateContact(id: string, data: any) {
    // Validate email format if provided
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    
    return this.makeRequest(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteContact(id: string) {
    return this.makeRequest(`/contacts/${id}`, { method: 'DELETE' });
  }

  // List API methods
  async createList(data: any) {
    return this.makeRequest('/lists', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getLists(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest(`/lists${query}`);
  }

  async getList(id: string) {
    return this.makeRequest(`/lists/${id}`);
  }

  async updateList(id: string, data: any) {
    return this.makeRequest(`/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteList(id: string) {
    return this.makeRequest(`/lists/${id}`, { method: 'DELETE' });
  }

  // Transactional API methods - Fixed structure
  async sendTransactionalEmail(data: any) {
    // Use flatter structure based on documentation examples
    const emailData: Record<string, any> = {
      to_email: data.to_email,
      to_name: data.to_name,
      sender_id: data.sender_id,
      subject: data.subject,
      html_content: data.html_content,
      text_content: data.text_content,
      template_id: data.template_id
    };
    
    // Remove undefined fields
    Object.keys(emailData).forEach(key => {
      if (emailData[key] === undefined) {
        delete emailData[key];
      }
    });
    
    // Validate email format
    if (!this.isValidEmail(emailData.to_email)) {
      throw new Error('Invalid recipient email format');
    }
    
    return this.makeRequest('/transactional/emails', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }

  // Sender API methods - Enhanced
  async createSender(data: any) {
    // Validate email format
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid sender email format');
    }
    
    return this.makeRequest('/brands/default/senders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getSenders() {
    return this.makeRequest('/brands/default/senders');
  }

  async getSender(id: string) {
    return this.makeRequest(`/brands/default/senders/${id}`);
  }

  async updateSender(id: string, data: any) {
    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Invalid sender email format');
    }
    
    return this.makeRequest(`/brands/default/senders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteSender(id: string) {
    return this.makeRequest(`/brands/default/senders/${id}`, { method: 'DELETE' });
  }

  // Template API methods - New functionality
  async getTemplates(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest(`/templates${query}`);
  }

  async getTemplate(id: string) {
    return this.makeRequest(`/templates/${id}`);
  }

  async createTemplate(data: any) {
    return this.makeRequest('/templates', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateTemplate(id: string, data: any) {
    return this.makeRequest(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteTemplate(id: string) {
    return this.makeRequest(`/templates/${id}`, { method: 'DELETE' });
  }

  // Analytics API methods - Enhanced
  async getCampaignAnalytics(id: string) {
    return this.makeRequest(`/campaigns/${id}/analytics`);
  }

  async getTransactionalAnalytics(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest(`/transactional/analytics${query}`);
  }

  async getListAnalytics(id: string) {
    return this.makeRequest(`/lists/${id}/analytics`);
  }

  async getAccountAnalytics(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest(`/analytics${query}`);
  }

  // Automation API methods - New functionality
  async getAutomations(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest(`/automations${query}`);
  }

  async getAutomation(id: string) {
    return this.makeRequest(`/automations/${id}`);
  }

  async createAutomation(data: any) {
    return this.makeRequest('/automations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateAutomation(id: string, data: any) {
    return this.makeRequest(`/automations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteAutomation(id: string) {
    return this.makeRequest(`/automations/${id}`, { method: 'DELETE' });
  }

  async startAutomation(id: string) {
    return this.makeRequest(`/automations/${id}/start`, { method: 'POST' });
  }

  async stopAutomation(id: string) {
    return this.makeRequest(`/automations/${id}/stop`, { method: 'POST' });
  }

  // Utility methods for validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  }

  // Health check method
  async healthCheck() {
    try {
      await this.authenticate();
      return { status: 'healthy', authenticated: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { status: 'unhealthy', error: errorMessage };
    }
  }
}
