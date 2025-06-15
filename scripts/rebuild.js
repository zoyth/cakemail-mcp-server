#!/usr/bin/env node

// Clean build and rebuild script
import { execSync } from 'child_process';
import { rmSync, existsSync } from 'fs';

try {
  console.log('🧹 Cleaning build directory...');
  if (existsSync('./build')) {
    rmSync('./build', { recursive: true, force: true });
    console.log('✅ Build directory cleaned');
  }

  console.log('🔨 Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
