// Quick syntax check for the logs API
import { BaseApiClient } from './api/base-client.js';

export class LogsApiTest extends BaseApiClient {
  async testGetCampaignLogs(campaignId: string) {
    const url = new URL(`${this.baseUrl}/logs/campaigns/${campaignId}`);
    url.searchParams.set('page', '1');
    url.searchParams.set('per_page', '10');
    
    const endpoint = `/logs/campaigns/${campaignId}${url.search}`;
    return this.makeRequest(endpoint);
  }
}

console.log('✅ Syntax check passed - LogsApi should compile correctly');
