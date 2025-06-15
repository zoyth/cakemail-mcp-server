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
    if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return; // Token is still valid
    }

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
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const tokenData = await response.json() as CakemailToken;
    this.token = tokenData;
    this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000) - 60000); // 1 minute buffer
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    await this.authenticate();

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.token!.access_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    // Merge additional headers if provided (but don't override the main ones)
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Campaign API methods
  async createCampaign(data: any) {
    // Use the correct Cakemail API structure
    const campaignData = {
      name: data.name,
      content: {
        type: "html",
        subject: data.subject,
        html: data.html_content,
        text: data.text_content || undefined
      },
      audience: {
        list_id: parseInt(data.list_id)
      },
      sender_id: data.sender_id
    };
    
    // Remove undefined fields to keep the request clean
    if (!campaignData.content.text) {
      delete campaignData.content.text;
    }
    
    return this.makeRequest('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData)
    });
  }

  async getCampaigns(params?: any) {
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
    return this.makeRequest(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteCampaign(id: string) {
    return this.makeRequest(`/campaigns/${id}`, { method: 'DELETE' });
  }

  // Contact API methods
  async createContact(data: any) {
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

  // Transactional API methods
  async sendTransactionalEmail(data: any) {
    return this.makeRequest('/transactional/emails', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Sender API methods
  async createSender(data: any) {
    return this.makeRequest('/brands/default/senders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getSenders() {
    return this.makeRequest('/brands/default/senders');
  }

  // Analytics API methods
  async getCampaignAnalytics(id: string) {
    return this.makeRequest(`/campaigns/${id}/analytics`);
  }

  async getTransactionalAnalytics(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeRequest(`/transactional/analytics${query}`);
  }
}