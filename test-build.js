#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  console.log('Running TypeScript build...');
  const output = execSync('npm run build', { 
    cwd: '/Users/francoislane/dev/cakemail-mcp-server',
    encoding: 'utf8' 
  });
  console.log('Build successful!');
  console.log(output);
} catch (error) {
  console.log('Build failed:');
  console.log(error.stdout);
  console.log(error.stderr);
  process.exit(1);
}
