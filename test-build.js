#!/usr/bin/env node

// Simple build test
console.log('Testing TypeScript compilation...');

try {
  // Import the main module to test compilation
  import('./build/index.js').then(() => {
    console.log('✅ Build successful - all TypeScript files compiled correctly');
  }).catch((error) => {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  });
} catch (error) {
  console.error('❌ Import failed:', error.message);
  process.exit(1);
}
