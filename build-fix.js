#!/usr/bin/env node

// Simple script to test timestamp conversion
const testTimestamp = 1749847758;

console.log('Testing timestamp conversion:');
console.log('Original timestamp:', testTimestamp);
console.log('As seconds (wrong):', new Date(testTimestamp).toLocaleString());
console.log('As milliseconds (correct):', new Date(testTimestamp * 1000).toLocaleString());

// Test the actual data from your campaign
const campaignData = {
  "created_on": 1749847758,
  "updated_on": 1749847759
};

console.log('\nCampaign dates:');
console.log('Created (fixed):', new Date(campaignData.created_on * 1000).toLocaleString());
console.log('Updated (fixed):', new Date(campaignData.updated_on * 1000).toLocaleString());
