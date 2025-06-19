#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Function to recursively find all test files
function findTestFiles(dir) {
  let testFiles = [];
  const files = readdirSync(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('build')) {
      testFiles = testFiles.concat(findTestFiles(fullPath));
    } else if (file.endsWith('.test.ts')) {
      testFiles.push(fullPath);
    }
  }
  
  return testFiles;
}

// Fix test files
function fixTestFile(filePath) {
  console.log(`Fixing: ${filePath}`);
  let content = readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix the imports and mock setup for files that use fetch
  if (content.includes('// Mock fetch globally')) {
    content = content.replace(
      /\/\/ Mock fetch globally\nconst mockFetch = jest\.fn\(\);\nglobal\.fetch = mockFetch as any;/g,
      `import fetch from 'node-fetch';\n\n// Get the mocked fetch\nconst mockFetch = fetch as jest.MockedFunction<typeof fetch>;`
    );
    
    // Add import if not present
    if (!content.includes("import fetch from 'node-fetch'")) {
      content = content.replace(
        /import { jest } from '@jest\/globals';/,
        `import { jest } from '@jest/globals';\nimport fetch from 'node-fetch';`
      );
    }
    modified = true;
  }
  
  // Replace all telemetry.apis.cakemail.com with mock-api.test
  if (content.includes('telemetry.apis.cakemail.com')) {
    content = content.replace(/https:\/\/telemetry\.apis\.cakemail\.com/g, 'https://mock-api.test');
    modified = true;
  }
  
  if (modified) {
    writeFileSync(filePath, content);
    console.log(`✓ Fixed ${filePath}`);
  }
}

// Main
const testsDir = join(process.cwd(), 'tests');
const testFiles = findTestFiles(testsDir);

console.log(`Found ${testFiles.length} test files`);

for (const file of testFiles) {
  fixTestFile(file);
}

console.log('Done!');
