#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('Testing TypeScript compilation...');

const tsc = spawn('npx', ['tsc', '--noEmit'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

tsc.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ TypeScript compilation successful!');
  } else {
    console.log(`\n❌ TypeScript compilation failed with exit code ${code}`);
  }
  process.exit(code);
});

tsc.on('error', (err) => {
  console.error('Error running TypeScript compiler:', err);
  process.exit(1);
});
