#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
  try {
    console.log('Building cakemail-mcp-server...');
    
    // Clean build directory
    console.log('Cleaning build directory...');
    await execAsync('rm -rf build');
    
    // Run TypeScript compiler
    console.log('Compiling TypeScript...');
    const { stdout, stderr } = await execAsync('npx tsc');
    
    if (stderr) {
      console.error('TypeScript compilation warnings/errors:');
      console.error(stderr);
    }
    
    if (stdout) {
      console.log('TypeScript output:');
      console.log(stdout);
    }
    
    // Make the main file executable
    console.log('Making build/index.js executable...');
    await execAsync('chmod +x build/index.js');
    
    console.log('✅ Build completed successfully!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
