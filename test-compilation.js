#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

try {
  console.log('🔨 Running TypeScript compilation...');
  const result = execSync('npx tsc', { encoding: 'utf8', stdio: 'pipe' });
  
  if (result) {
    console.log('Compilation output:', result);
  }
  
  // Check if build directory was created
  if (existsSync('./build')) {
    console.log('✅ Build successful! Build directory created.');
    
    // Check for main files
    const mainFiles = ['index.js', 'cakemail-api.js', 'handlers/email.js', 'config/email-tools.js'];
    for (const file of mainFiles) {
      const filePath = path.join('./build', file);
      if (existsSync(filePath)) {
        console.log(`✅ ${file} compiled successfully`);
      } else {
        console.log(`❌ ${file} not found`);
      }
    }
  } else {
    console.log('❌ Build directory not created');
  }
} catch (error) {
  console.error('❌ Compilation failed:');
  console.error(error.stdout || error.stderr || error.message);
  process.exit(1);
}
