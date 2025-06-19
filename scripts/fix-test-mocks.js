// Fix all test files to use proper mocking
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

function fixTestFiles() {
  const testsApiDir = '/Users/francoislane/dev/cakemail-mcp-server/tests/api';
  const files = readdirSync(testsApiDir);
  
  for (const file of files) {
    if (file.endsWith('.test.ts')) {
      const filePath = join(testsApiDir, file);
      let content = readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Fix the mock fetch import
      if (content.includes('// Mock fetch globally')) {
        // Replace the mock fetch setup
        content = content.replace(
          /\/\/ Mock fetch globally\nconst mockFetch = jest\.fn\(\);\nglobal\.fetch = mockFetch as any;/g,
          `// Get the mocked fetch from node-fetch\nimport fetch from 'node-fetch';\nconst mockFetch = fetch as jest.MockedFunction<typeof fetch>;`
        );
        
        // Make sure fetch import is added after jest import
        if (!content.includes("import fetch from 'node-fetch'")) {
          content = content.replace(
            /import { jest } from '@jest\/globals';/,
            `import { jest } from '@jest/globals';\nimport fetch from 'node-fetch';`
          );
        }
        modified = true;
      }
      
      // Replace all API URLs with mock URL
      if (content.includes('telemetry.apis.cakemail.com')) {
        content = content.replace(/https:\/\/telemetry\.apis\.cakemail\.com/g, 'https://mock-api.test');
        modified = true;
      }
      
      if (modified) {
        writeFileSync(filePath, content);
        console.log(`Fixed: ${file}`);
      }
    }
  }
}

fixTestFiles();
console.log('Done fixing test files!');
