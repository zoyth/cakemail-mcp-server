#!/usr/bin/env node

// Simple test to check if the TypeScript build succeeds
const { spawn } = require('child_process');
const path = require('path');

console.log('🔨 Testing TypeScript build...\n');

// First, clean build directory
const tsc = spawn('npx', ['tsc'], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  shell: process.platform === 'win32'
});

tsc.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Build succeeded! All TypeScript errors have been resolved.');
    console.log('✅ The MCP server should now compile without errors.');
  } else {
    console.log('\n❌ Build failed with exit code:', code);
    console.log('❌ There are still TypeScript compilation errors.');
  }
  process.exit(code);
});

tsc.on('error', (err) => {
  console.error('Failed to start TypeScript compiler:', err.message);
  process.exit(1);
});
