#!/usr/bin/env node

import { execSync } from 'child_process';
import { chdir } from 'process';

// Change to the project directory
chdir('/Users/francoislane/dev/cakemail-mcp-server');

try {
  console.log('🔨 Building project...');
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
