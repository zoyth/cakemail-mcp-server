#!/usr/bin/env node

import 'dotenv/config';
import { CakemailAPI } from './build/cakemail-api.js';

const username = process.env.CAKEMAIL_USERNAME;
const password = process.env.CAKEMAIL_PASSWORD;
const baseUrl = process.env.CAKEMAIL_BASE_URL || 'https://api.cakemail.dev';

if (!username || !password) {
  console.error('CAKEMAIL_USERNAME and CAKEMAIL_PASSWORD environment variables are required');
  process.exit(1);
}

const api = new CakemailAPI({ 
  username, 
  password, 
  baseUrl,
  debug: true  // Enable debug logging
});

async function debugAnalytics() {
  try {
    console.log('🔍 Testing analytics endpoints for campaign 14764408...\n');
    
    // First, let's get the campaign details to make sure it exists
    console.log('1. Getting campaign details...');
    const campaign = await api.getCampaign('14764408');
    console.log('✅ Campaign exists:', {
      id: campaign.data.id,
      name: campaign.data.name,
      status: campaign.data.status
    });
    
    // Now try the analytics endpoint
    console.log('\n2. Testing analytics endpoint...');
    
    try {
      const analytics = await api.getCampaignAnalytics('14764408');
      console.log('✅ Analytics successful:', analytics);
    } catch (error) {
      console.log('❌ Analytics failed:', {
        name: error.name,
        message: error.message,
        status: error.statusCode
      });
      
      // Let's try manually constructing the request to see what URL is being called
      console.log('\n3. Manual URL debugging...');
      
      // Access the base client directly to get account ID
      const accountId = await api.getCurrentAccountId();
      console.log('Account ID:', accountId);
      
      // Test different possible endpoints
      const testEndpoints = [
        `/campaigns/14764408/analytics`,
        `/campaigns/14764408/analytics?account_id=${accountId}`,
        `/campaigns/14764408/stats`,
        `/campaigns/14764408/stats?account_id=${accountId}`,
        `/campaigns/14764408/statistics`,
        `/campaigns/14764408/reports`,
        `/analytics/campaigns/14764408`,
        `/analytics/campaign/14764408`,
        `/stats/campaigns/14764408`
      ];
      
      for (const endpoint of testEndpoints) {
        try {
          console.log(`\n   Testing: ${baseUrl}${endpoint}`);
          const result = await api.makeRequest(endpoint);
          console.log(`   ✅ SUCCESS:`, result);
          break; // Found working endpoint
        } catch (err) {
          console.log(`   ❌ ${err.statusCode || 'ERROR'}: ${err.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugAnalytics().catch(console.error);
