#!/usr/bin/env node

// Test build to verify TypeScript compilation
const { spawn } = require('child_process');

console.log('🔨 Testing TypeScript compilation after latest fixes...\n');

const tsc = spawn('npx', ['tsc', '--noEmit'], {
  cwd: '/Users/francoislane/dev/cakemail-mcp-server',
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

tsc.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ SUCCESS! TypeScript compilation completed without errors.');
    console.log('✅ All exactOptionalPropertyTypes issues have been resolved.');
    console.log('✅ The MCP server is ready to build and deploy.');
  } else {
    console.log('\n❌ TypeScript compilation failed.');
    console.log(`❌ Exit code: ${code}`);
    console.log('❌ There are still remaining type errors to fix.');
  }
  process.exit(code);
});

tsc.on('error', (err) => {
  console.error('❌ Failed to run TypeScript compiler:', err.message);
  process.exit(1);
});
