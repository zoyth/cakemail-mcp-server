#!/usr/bin/env node

// Quick test script for reports functionality
import { CakemailAPI } from './build/cakemail-api.js';
import 'dotenv/config';

const username = process.env.CAKEMAIL_USERNAME;
const password = process.env.CAKEMAIL_PASSWORD;

if (!username || !password) {
  console.error('CAKEMAIL_USERNAME and CAKEMAIL_PASSWORD environment variables are required');
  process.exit(1);
}

const api = new CakemailAPI({ username, password });

async function testReports() {
  console.log('🔍 Testing Reports API Integration...\n');

  try {
    // Test health check first
    console.log('1. Testing basic health check...');
    const health = await api.healthCheck();
    console.log('✅ Health check passed\n');

    // Test reports access
    console.log('2. Testing reports access...');
    const debug = await api.reports.debugReportsAccess();
    console.log('📊 Reports debug results:');
    console.log(JSON.stringify(debug, null, 2));
    console.log('✅ Reports API accessible\n');

    // Test account stats
    console.log('3. Testing account stats...');
    const accountStats = await api.reports.getSelfAccountStats();
    console.log('📈 Account stats retrieved:');
    console.log(JSON.stringify(accountStats, null, 2));
    console.log('✅ Account stats working\n');

    console.log('🎉 All reports tests passed! Reports API is fully integrated.');

  } catch (error) {
    console.error('❌ Error testing reports:', error.message);
    console.error('Full error:', error);
  }
}

testReports();
