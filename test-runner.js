#!/usr/bin/env node

/**
 * Simple test runner script for development
 * Provides quick feedback during development
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Color codes for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'all';

  log('\n🧪 Cakemail MCP Server Test Runner', 'bold');
  log('====================================\n', 'blue');

  try {
    switch (testType) {
      case 'unit':
        log('Running unit tests...', 'yellow');
        await runCommand('npm', ['run', 'test:unit']);
        break;

      case 'integration':
        log('Running integration tests...', 'yellow');
        await runCommand('npm', ['run', 'test:integration']);
        break;

      case 'coverage':
        log('Running tests with coverage...', 'yellow');
        await runCommand('npm', ['run', 'test:coverage']);
        break;

      case 'watch':
        log('Running tests in watch mode...', 'yellow');
        await runCommand('npm', ['run', 'test:watch']);
        break;

      case 'ci':
        log('Running CI tests...', 'yellow');
        await runCommand('npm', ['run', 'test:ci']);
        break;

      case 'all':
      default:
        log('Running all tests...', 'yellow');
        await runCommand('npm', ['test']);
        break;
    }

    log('\n✅ Tests completed successfully!', 'green');
  } catch (error) {
    log('\n❌ Tests failed!', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Show usage if --help is passed
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('\nUsage: node test-runner.js [type]', 'bold');
  log('\nAvailable test types:', 'blue');
  log('  all          Run all tests (default)', 'reset');
  log('  unit         Run only unit tests', 'reset');
  log('  integration  Run only integration tests', 'reset');
  log('  coverage     Run tests with coverage report', 'reset');
  log('  watch        Run tests in watch mode', 'reset');
  log('  ci           Run tests for CI/CD', 'reset');
  log('\nExamples:', 'yellow');
  log('  node test-runner.js', 'reset');
  log('  node test-runner.js unit', 'reset');
  log('  node test-runner.js coverage', 'reset');
  log('  node test-runner.js watch\n', 'reset');
  process.exit(0);
}

main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
