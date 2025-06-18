#!/usr/bin/env node

// Quick test to verify missing handlers are now implemented
import { handlerRegistry } from './build/handlers/index.js';

const missingFunctions = [
  'cakemail_get_campaign',
  'cakemail_get_latest_campaigns', 
  'cakemail_debug_campaign_access',
  'cakemail_render_campaign'
];

console.log('🔍 Testing previously missing handler functions...\n');

let allFixed = true;

for (const funcName of missingFunctions) {
  const handler = handlerRegistry[funcName];
  if (handler && typeof handler === 'function') {
    console.log(`✅ ${funcName}: Found and is a function`);
  } else {
    console.log(`❌ ${funcName}: ${handler ? 'Found but not a function' : 'Missing'}`);
    allFixed = false;
  }
}

console.log('\n' + '='.repeat(50));
if (allFixed) {
  console.log('🎉 All previously missing handlers are now implemented!');
} else {
  console.log('⚠️  Some handlers are still missing or invalid.');
}

// Test that handlers don't return "Not implemented yet"
console.log('\n🧪 Testing handler implementation...\n');

const testArgs = {
  cakemail_get_latest_campaigns: { count: 5 },
  cakemail_get_campaign: { campaign_id: "123" },
  cakemail_debug_campaign_access: {},
  cakemail_render_campaign: { campaign_id: "123" }
};

for (const funcName of missingFunctions) {
  const handler = handlerRegistry[funcName];
  if (handler) {
    try {
      // Create a mock API object
      const mockApi = {
        campaigns: {
          getCampaigns: () => Promise.resolve({ data: [] }),
          getCampaign: () => Promise.resolve({ data: { id: 123, name: "Test Campaign" } }),
          renderCampaign: () => Promise.resolve({ data: { html: "<html>test</html>", text: "test", subject: "Test" } })
        },
        account: {
          getSelfAccount: () => Promise.resolve({ data: { id: 456 } })
        }
      };
      
      // Call the handler with mock data
      const result = handler(testArgs[funcName] || {}, mockApi);
      
      // Check if it's a promise (async function)
      if (result && typeof result.then === 'function') {
        console.log(`✅ ${funcName}: Returns a promise (async function)`);
      } else if (result && result.content && Array.isArray(result