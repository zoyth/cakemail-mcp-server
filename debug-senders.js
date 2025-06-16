// Debug script to test the Cakemail Senders API directly
const fetch = require('node-fetch');

const BASE_URL = 'https://api.cakemail.dev';
const USERNAME = 'f+mcp@cakemail.com';
const PASSWORD = 'stage8speech2slugs';

async function authenticate() {
  console.log('🔐 Authenticating...');
  
  const response = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: USERNAME,
      password: PASSWORD
    }).toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed (${response.status}): ${errorText}`);
  }

  const tokenData = await response.json();
  console.log('✅ Authentication successful');
  return tokenData.access_token;
}

async function getAccountInfo(token) {
  console.log('📋 Getting account info...');
  
  const response = await fetch(`${BASE_URL}/accounts/self`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get account info (${response.status}): ${errorText}`);
  }

  const accountData = await response.json();
  console.log('✅ Account info retrieved:', {
    id: accountData.data?.id,
    name: accountData.data?.name,
    email: accountData.data?.email
  });
  return accountData;
}

async function testSendersEndpoints(token, accountId) {
  console.log('🧪 Testing various senders endpoints...\n');

  const testCases = [
    {
      name: 'GET /senders',
      url: '/senders'
    },
    {
      name: 'GET /senders with account_id',
      url: accountId ? `/senders?account_id=${accountId}` : '/senders?account_id=969871'
    },
    {
      name: 'GET /senders with pagination',
      url: '/senders?page=1&per_page=10'
    },
    {
      name: 'GET /senders with all params',
      url: accountId ? `/senders?account_id=${accountId}&page=1&per_page=10` : '/senders?account_id=969871&page=1&per_page=10'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`🔍 Testing: ${testCase.name}`);
      console.log(`   URL: ${BASE_URL}${testCase.url}`);
      
      const response = await fetch(`${BASE_URL}${testCase.url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Success! Data:`, {
          hasData: !!data.data,
          dataType: typeof data.data,
          dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
          pagination: data.pagination || 'None',
          firstSender: Array.isArray(data.data) && data.data.length > 0 ? {
            id: data.data[0].id,
            name: data.data[0].name,
            email: data.data[0].email
          } : 'None'
        });
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Failed: ${errorText}`);
      }
    } catch (error) {
      console.log(`   💥 Error: ${error.message}`);
    }
    console.log('');
  }
}

async function main() {
  try {
    console.log('🚀 Starting Cakemail Senders API Debug\n');
    
    // Step 1: Authenticate
    const token = await authenticate();
    console.log('');
    
    // Step 2: Get account info
    const accountData = await getAccountInfo(token);
    const accountId = accountData.data?.id;
    console.log('');
    
    // Step 3: Test senders endpoints
    await testSendersEndpoints(token, accountId);
    
    console.log('🎉 Debug completed!');
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
  }
}

main();