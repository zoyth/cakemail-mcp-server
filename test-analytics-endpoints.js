#!/usr/bin/env node

import fetch from 'node-fetch';
import 'dotenv/config';

const username = process.env.CAKEMAIL_USERNAME;
const password = process.env.CAKEMAIL_PASSWORD;
const baseUrl = process.env.CAKEMAIL_BASE_URL || 'https://api.cakemail.dev';

// Get access token
async function getToken() {
  const response = await fetch(`${baseUrl}/token`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: username,
      password: password
    }).toString()
  });

  if (!response.ok) {
    throw new Error(`Auth failed: ${response.status} ${response.statusText}`);
  }

  const tokenData = await response.json();
  return tokenData.access_token;
}

// Test different analytics endpoints
async function testAnalyticsEndpoints() {
  console.log('🔍 Testing analytics endpoints for campaign 14764408...\n');
  
  const token = await getToken();
  console.log('✅ Got access token');
  
  // Get account info first
  const accountResponse = await fetch(`${baseUrl}/accounts/self`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  let accountId = null;
  if (accountResponse.ok) {
    const accountData = await accountResponse.json();
    accountId = accountData.data?.id;
    console.log('✅ Account ID:', accountId);
  }
  
  // Test different analytics endpoints
  const testEndpoints = [
    '/campaigns/14764408/analytics',
    `/campaigns/14764408/analytics${accountId ? '?account_id=' + accountId : ''}`,
    '/campaigns/14764408/stats',
    '/campaigns/14764408/statistics',
    '/campaigns/14764408/reports',
    '/campaigns/14764408/performance',
    '/analytics/campaigns/14764408',
    '/stats/campaigns/14764408',
    '/reports/campaigns/14764408'
  ];
  
  console.log('\n📊 Testing analytics endpoints:');
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`\n   Testing: ${baseUrl}${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ SUCCESS: ${response.status}`);
        console.log(`   Data:`, JSON.stringify(data, null, 4));
        break; // Found working endpoint
      } else {
        console.log(`   ❌ ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.log(`   ❌ ERROR: ${err.message}`);
    }
  }
  
  // Also test if we can get campaign details to make sure it exists
  console.log('\n📧 Testing campaign existence:');
  const campaignResponse = await fetch(`${baseUrl}/campaigns/14764408${accountId ? '?account_id=' + accountId : ''}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (campaignResponse.ok) {
    const campaignData = await campaignResponse.json();
    console.log('✅ Campaign exists:', {
      id: campaignData.data?.id,
      name: campaignData.data?.name,
      status: campaignData.data?.status,
      delivery_finished_on: campaignData.data?.delivery_finished_on
    });
  } else {
    console.log('❌ Campaign not found:', campaignResponse.status, campaignResponse.statusText);
  }
}

testAnalyticsEndpoints().catch(console.error);
