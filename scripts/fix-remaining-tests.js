#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of test files that need fixing
const testFiles = [
  'reports-api.test.ts',
  'sub-account-api.test.ts',
  'template-api.test.ts',
  'logs-api.test.ts'
];

const testsApiDir = '/Users/francoislane/dev/cakemail-mcp-server/tests/api';

testFiles.forEach(file => {
  const filePath = path.join(testsApiDir, file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the mock fetch import
    if (content.includes('// Mock fetch globally')) {
      content = content.replace(
        /\/\/ Mock fetch globally\nconst mockFetch = jest\.fn\(\);\nglobal\.fetch = mockFetch as any;/g,
        `// Get the mocked fetch from node-fetch\nimport fetch from 'node-fetch';\nconst mockFetch = fetch as jest.MockedFunction<typeof fetch>;`
      );
      
      // Add import if not present
      if (!content.includes("import fetch from 'node-fetch'")) {
        content = content.replace(
          /import { jest } from '@jest\/globals';/,
          `import { jest } from '@jest/globals';\nimport fetch from 'node-fetch';`
        );
      }
    }
    
    // Replace all API URLs with mock URL
    content = content.replace(/https:\/\/telemetry\.apis\.cakemail\.com/g, 'https://mock-api.test');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${file}`);
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
});

console.log('Done!');
