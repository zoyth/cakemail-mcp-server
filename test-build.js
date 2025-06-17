#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('🔨 Running TypeScript compilation...');
  
  const result = execSync('npm run build', { 
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ Build successful!');
  console.log(result);
  
} catch (error) {
  console.log('❌ Build failed with errors:');
  console.log(error.stdout || error.stderr || error.message);
  process.exit(1);
}
