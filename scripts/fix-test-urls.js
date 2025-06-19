#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testsDir = path.join(__dirname, '..', 'tests');

function fixUrlsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Replace localhost URLs with the actual API URL
  const oldUrl = 'http://localhost:9999';
  const newUrl = 'https://telemetry.apis.cakemail.com';
  
  if (content.includes(oldUrl)) {
    content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed URLs in: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      walkDir(filePath);
    } else if (stat.isFile() && file.endsWith('.ts')) {
      fixUrlsInFile(filePath);
    }
  }
}

console.log('Fixing test URLs...');
walkDir(testsDir);
console.log('Done!');
