#!/usr/bin/env node

/**
 * Comprehensive Build and Integration Test
 * Tests the complete Cakemail MCP Server including the new list management functionality
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = __dirname;

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'pipe',
      ...options
    });

    let stdout = '';
    let stderr = '';

    process.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      resolve({
        code,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function testBuild() {
  logStep(1, 'Testing TypeScript Build');
  
  try {
    const result = await runCommand('npm', ['run', 'build'], {
      cwd: projectRoot
    });

    if (result.code === 0) {
      logSuccess('TypeScript build completed successfully');
      return true;
    } else {
      logError('TypeScript build failed');
      if (result.stderr) {
        log('Build errors:', 'red');
        log(result.stderr, 'red');
      }
      if (result.stdout) {
        log('Build output:', 'yellow');
        log(result.stdout, 'yellow');
      }
      return false;
    }
  } catch (error) {
    logError(`Build command failed: ${error.message}`);
    return false;
  }
}

async function testFileStructure() {
  logStep(2, 'Verifying File Structure');
  
  const requiredFiles = [
    'build/index.js',
    'build/api/list-api.js',
    'build/handlers/lists.js',
    'build/config/list-tools.js',
    'build/config/tools.js',
    'build/handlers/index.js',
    'build/cakemail-api.js'
  ];

  const missingFiles = [];
  
  for (const file of requiredFiles) {
    try {
      const filePath = join(projectRoot, file);
      readFileSync(filePath);
      logSuccess(`Found: ${file}`);
    } catch (error) {
      logError(`Missing: ${file}`);
      missingFiles.push(file);
    }
  }

  if (missingFiles.length === 0) {
    logSuccess('All required files are present');
    return true;
  } else {
    logError(`Missing ${missingFiles.length} required files`);
    return false;
  }
}

async function testToolsConfiguration() {
  logStep(3, 'Testing Tools Configuration');
  
  try {
    // Import the built tools configuration
    const toolsPath = join(projectRoot, 'build/config/tools.js');
    const { allTools } = await import(toolsPath);
    
    logInfo(`Total tools configured: ${allTools.length}`);
    
    // Check for list management tools
    const listTools = allTools.filter(tool => tool.name.includes('list'));
    logInfo(`List management tools: ${listTools.length}`);
    
    const expectedListTools = [
      'cakemail_list_lists',
      'cakemail_create_list',
      'cakemail_get_list',
      'cakemail_update_list',
      'cakemail_delete_list',
      'cakemail_archive_list',
      'cakemail_get_list_stats'
    ];
    
    const foundListTools = listTools.map(tool => tool.name);
    const missingListTools = expectedListTools.filter(name => !foundListTools.includes(name));
    
    if (missingListTools.length === 0) {
      logSuccess('All list management tools are configured');
      logInfo(`List tools found: ${foundListTools.join(', ')}`);
      return true;
    } else {
      logError(`Missing list tools: ${missingListTools.join(', ')}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to test tools configuration: ${error.message}`);
    return false;
  }
}

async function testHandlersRegistry() {
  logStep(4, 'Testing Handlers Registry');
  
  try {
    // Import the built handlers registry
    const handlersPath = join(projectRoot, 'build/handlers/index.js');
    const { handlerRegistry } = await import(handlersPath);
    
    logInfo(`Total handlers registered: ${Object.keys(handlerRegistry).length}`);
    
    // Check for list management handlers
    const listHandlers = Object.keys(handlerRegistry).filter(name => name.includes('list'));
    logInfo(`List management handlers: ${listHandlers.length}`);
    
    const expectedListHandlers = [
      'cakemail_list_lists',
      'cakemail_create_list',
      'cakemail_get_list',
      'cakemail_update_list',
      'cakemail_delete_list',
      'cakemail_archive_list',
      'cakemail_get_list_stats'
    ];
    
    const missingListHandlers = expectedListHandlers.filter(name => !listHandlers.includes(name));
    
    if (missingListHandlers.length === 0) {
      logSuccess('All list management handlers are registered');
      logInfo(`List handlers found: ${listHandlers.join(', ')}`);
      return true;
    } else {
      logError(`Missing list handlers: ${missingListHandlers.join(', ')}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to test handlers registry: ${error.message}`);
    return false;
  }
}

async function testAPIIntegration() {
  logStep(5, 'Testing API Integration');
  
  try {
    // Import the built CakemailAPI
    const apiPath = join(projectRoot, 'build/cakemail-api.js');
    const { CakemailAPI } = await import(apiPath);
    
    // Create a test instance (without credentials)
    const testConfig = {
      username: 'test@example.com',
      password: 'testpassword'
    };
    
    const api = new CakemailAPI(testConfig);
    
    // Check if lists property exists
    if (api.lists) {
      logSuccess('Lists API is integrated into CakemailAPI');
      
      // Check if list methods exist
      const listMethods = [
        'getLists',
        'createList',
        'getList',
        'updateList',
        'deleteList',
        'archiveList',
        'getListStats'
      ];
      
      const missingMethods = listMethods.filter(method => typeof api.lists[method] !== 'function');
      
      if (missingMethods.length === 0) {
        logSuccess('All list methods are available on the API');
        logInfo(`List methods: ${listMethods.join(', ')}`);
        return true;
      } else {
        logError(`Missing list methods: ${missingMethods.join(', ')}`);
        return false;
      }
    } else {
      logError('Lists API is not integrated into CakemailAPI');
      return false;
    }
  } catch (error) {
    logError(`Failed to test API integration: ${error.message}`);
    return false;
  }
}

async function testPackageVersion() {
  logStep(6, 'Testing Package Version');
  
  try {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.version === '1.9.0') {
      logSuccess(`Package version is correct: ${packageJson.version}`);
      return true;
    } else {
      logError(`Package version mismatch. Expected: 1.9.0, Found: ${packageJson.version}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to test package version: ${error.message}`);
    return false;
  }
}

async function testDocumentation() {
  logStep(7, 'Testing Documentation');
  
  try {
    const docFiles = [
      'docs/list-management.md',
      'CHANGELOG.md'
    ];
    
    const missingDocs = [];
    
    for (const file of docFiles) {
      try {
        const filePath = join(projectRoot, file);
        const content = readFileSync(filePath, 'utf8');
        
        if (file === 'docs/list-management.md') {
          if (content.includes('cakemail_list_lists') && content.includes('cakemail_create_list')) {
            logSuccess(`Documentation found: ${file}`);
          } else {
            logWarning(`Documentation exists but may be incomplete: ${file}`);
          }
        } else if (file === 'CHANGELOG.md') {
          if (content.includes('[1.9.0]') && content.includes('List Management')) {
            logSuccess(`Changelog updated: ${file}`);
          } else {
            logWarning(`Changelog exists but may not be updated: ${file}`);
          }
        }
      } catch (error) {
        logError(`Missing documentation: ${file}`);
        missingDocs.push(file);
      }
    }
    
    return missingDocs.length === 0;
  } catch (error) {
    logError(`Failed to test documentation: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  log('🚀 Starting Comprehensive Build and Integration Tests\n', 'magenta');
  log('Testing Cakemail MCP Server v1.9.0 - List Management Integration\n', 'cyan');
  
  const tests = [
    testBuild,
    testFileStructure,
    testToolsConfiguration,
    testHandlersRegistry,
    testAPIIntegration,
    testPackageVersion,
    testDocumentation
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      logError(`Test failed with exception: ${error.message}`);
    }
  }
  
  log('\n📊 Test Results Summary', 'magenta');
  log('='.repeat(50), 'cyan');
  
  if (passedTests === totalTests) {
    log(`✅ All ${totalTests} tests passed!`, 'green');
    log('\n🎉 List Management Integration is ready for deployment!', 'green');
    
    log('\n📋 What\'s New in v1.9.0:', 'cyan');
    log('• 7 new list management tools', 'green');
    log('• Complete CRUD operations for contact lists', 'green');
    log('• Performance analytics and statistics', 'green');
    log('• Webhook and redirection configuration', 'green');
    log('• Multi-language and enterprise support', 'green');
    log('• Comprehensive documentation and examples', 'green');
    
    log('\n🚀 Next Steps:', 'cyan');
    log('1. Deploy the updated server', 'blue');
    log('2. Test with Claude Desktop integration', 'blue');
    log('3. Verify list management functionality', 'blue');
    log('4. Review documentation and examples', 'blue');
    
    process.exit(0);
  } else {
    log(`❌ ${totalTests - passedTests} out of ${totalTests} tests failed`, 'red');
    log('\n🔧 Please fix the failing tests before deployment', 'yellow');
    process.exit(1);
  }
}

// Run the tests
runAllTests().catch((error) => {
  logError(`Test suite failed: ${error.message}`);
  process.exit(1);
});
