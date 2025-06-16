#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('🔨 Starting rebuild process...');
  
  // Change to project directory
  const projectPath = '/Users/francoislane/dev/cakemail-mcp-server';
  process.chdir(projectPath);
  
  // Clean build directory
  console.log('🧹 Cleaning build directory...');
  try {
    if (fs.existsSync('build')) {
      fs.rmSync('build', { recursive: true, force: true });
    }
  } catch (e) {
    console.log('Warning: Could not clean build directory:', e.message);
  }
  
  // Run TypeScript compilation
  console.log('🔧 Compiling TypeScript...');
  const buildResult = execSync('npx tsc', { 
    stdio: 'pipe', 
    encoding: 'utf8',
    timeout: 60000 
  });
  
  console.log('✅ TypeScript compilation successful!');
  
  // Make index.js executable
  try {
    execSync('chmod +x build/index.js');
    console.log('✅ Made index.js executable');
  } catch (e) {
    console.log('Warning: Could not make index.js executable:', e.message);
  }
  
  console.log('🎉 Rebuild completed successfully!');
  
} catch (error) {
  console.error('❌ Rebuild failed:');
  console.error('Error:', error.message);
  if (error.stdout) console.error('Stdout:', error.stdout);
  if (error.stderr) console.error('Stderr:', error.stderr);
  process.exit(1);
}
