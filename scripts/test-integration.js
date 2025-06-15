#!/usr/bin/env node

/**
 * Integration Test Script for Cakemail MCP Server
 * 
 * This script tests the core functionality of the improved Cakemail MCP server
 * to ensure it works correctly after migration.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test configuration
const SERVER_PATH = join(__dirname, '..', 'build', 'index.js');
const TIMEOUT = 10000; // 10 seconds timeout for each test

class MCPTester {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  async runTests() {
    console.log('🧪 Starting Cakemail MCP Server Integration Tests...\n');

    // Check if server file exists
    try {
      await import(SERVER_PATH);
    } catch (error) {
      console.error('❌ Server build not found. Run "npm run build" first.');
      process.exit(1);
    }

    // Test 1: Server startup
    await this.testServerStartup();

    // Test 2: Tool discovery
    await this.testToolDiscovery();

    // Test 3: Health check (if credentials available)
    await this.testHealthCheck();

    // Summary
    this.printSummary();
  }

  async testServerStartup() {
    console.log('📡 Testing server startup...');
    
    return new Promise((resolve) => {
      const server = spawn('node', [SERVER_PATH], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, CAKEMAIL_USERNAME: 'test', CAKEMAIL_PASSWORD: 'test' }
      });

      let output = '';
      let errorOutput = '';

      const timeout = setTimeout(() => {
        server.kill();
        if (errorOutput.includes('Cakemail MCP server running on stdio')) {
          this.pass('Server startup');
        } else {
          this.fail('Server startup', 'Server did not start within timeout');
        }
        resolve();
      }, 3000);

      server.stderr.on('data', (data) => {
        errorOutput += data.toString();
        if (errorOutput.includes('Cakemail MCP server running on stdio')) {
          clearTimeout(timeout);
          server.kill();
          this.pass('Server startup');
          resolve();
        }
      });

      server.on('error', (error) => {
        clearTimeout(timeout);
        this.fail('Server startup', error.message);
        resolve();
      });
    });
  }

  async testToolDiscovery() {
    console.log('🔍 Testing tool discovery...');

    return new Promise((resolve) => {
      const server = spawn('node', [SERVER_PATH], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, CAKEMAIL_USERNAME: 'test', CAKEMAIL_PASSWORD: 'test' }
      });

      const listToolsRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list'
      };

      let response = '';
      
      const timeout = setTimeout(() => {
        server.kill();
        this.fail('Tool discovery', 'Timeout waiting for tools list');
        resolve();
      }, 5000);

      server.stdout.on('data', (data) => {
        response += data.toString();
        
        try {
          const lines = response.trim().split('\n');
          for (const line of lines) {
            if (line.trim()) {
              const parsed = JSON.parse(line);
              if (parsed.id === 1 && parsed.result && parsed.result.tools) {
                clearTimeout(timeout);
                server.kill();
                
                const tools = parsed.result.tools;
                const expectedTools = [
                  'cakemail_health_check',
                  'cakemail_get_senders',
                  'cakemail_create_campaign',
                  'cakemail_send_transactional_email',
                  'cakemail_get_templates', // New tool
                  'cakemail_get_automations' // New tool
                ];

                const foundTools = tools.map(t => t.name);
                const missingTools = expectedTools.filter(tool => !foundTools.includes(tool));
                
                if (missingTools.length === 0) {
                  this.pass(`Tool discovery (${tools.length} tools found)`);
                } else {
                  this.fail('Tool discovery', `Missing tools: ${missingTools.join(', ')}`);
                }
                
                resolve();
                return;
              }
            }
          }
        } catch (error) {
          // Continue parsing
        }
      });

      server.stderr.on('data', (data) => {
        const output = data.toString();
        if (output.includes('running on stdio')) {
          // Server is ready, send the request
          server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
        }
      });

      server.on('error', (error) => {
        clearTimeout(timeout);
        this.fail('Tool discovery', error.message);
        resolve();
      });
    });
  }

  async testHealthCheck() {
    console.log('💓 Testing health check...');

    const hasCredentials = process.env.CAKEMAIL_USERNAME && process.env.CAKEMAIL_PASSWORD;
    
    if (!hasCredentials) {
      console.log('⏭️  Skipping health check (no credentials provided)');
      return;
    }

    return new Promise((resolve) => {
      const server = spawn('node', [SERVER_PATH], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: process.env
      });

      const healthRequest = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'cakemail_health_check',
          arguments: {}
        }
      };

      let response = '';
      
      const timeout = setTimeout(() => {
        server.kill();
        this.fail('Health check', 'Timeout waiting for health check response');
        resolve();
      }, 10000); // Longer timeout for API call

      server.stdout.on('data', (data) => {
        response += data.toString();
        
        try {
          const lines = response.trim().split('\n');
          for (const line of lines) {
            if (line.trim()) {
              const parsed = JSON.parse(line);
              if (parsed.id === 2) {
                clearTimeout(timeout);
                server.kill();
                
                if (parsed.result && parsed.result.content) {
                  const content = parsed.result.content[0].text;
                  if (content.includes('healthy') || content.includes('authenticated')) {
                    this.pass('Health check (API connectivity)');
                  } else {
                    this.fail('Health check', 'Unhealthy response: ' + content);
                  }
                } else if (parsed.error) {
                  this.fail('Health check', parsed.error.message || 'Unknown error');
                } else {
                  this.fail('Health check', 'Unexpected response format');
                }
                
                resolve();
                return;
              }
            }
          }
        } catch (error) {
          // Continue parsing
        }
      });

      server.stderr.on('data', (data) => {
        const output = data.toString();
        if (output.includes('running on stdio')) {
          // Server is ready, send the request
          setTimeout(() => {
            server.stdin.write(JSON.stringify(healthRequest) + '\n');
          }, 1000); // Give server a moment to fully initialize
        }
      });

      server.on('error', (error) => {
        clearTimeout(timeout);
        this.fail('Health check', error.message);
        resolve();
      });
    });
  }

  pass(testName) {
    console.log(`✅ ${testName}`);
    this.passed++;
  }

  fail(testName, reason) {
    console.log(`❌ ${testName}: ${reason}`);
    this.failed++;
  }

  printSummary() {
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Total: ${this.passed + this.failed}`);

    if (this.failed === 0) {
      console.log('\n🎉 All tests passed! Migration successful.');
      console.log('\n🚀 Next steps:');
      console.log('1. Test with MCP Inspector: npm run inspector');
      console.log('2. Update Claude Desktop configuration');
      console.log('3. Test integration with Claude Desktop');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the issues above.');
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Ensure the server builds correctly: npm run rebuild');
      console.log('2. Check your environment variables');
      console.log('3. Test with MCP Inspector for detailed debugging');
      process.exit(1);
    }
  }
}

// Environment validation
function validateEnvironment() {
  console.log('🔧 Environment Check:');
  
  const nodeVersion = process.version;
  console.log(`Node.js version: ${nodeVersion}`);
  
  if (process.env.CAKEMAIL_USERNAME && process.env.CAKEMAIL_PASSWORD) {
    console.log('✅ Cakemail credentials found');
  } else {
    console.log('⚠️  No Cakemail credentials found - some tests will be skipped');
    console.log('   Set CAKEMAIL_USERNAME and CAKEMAIL_PASSWORD to run full tests');
  }
  
  console.log('');
}

// Run tests
async function main() {
  validateEnvironment();
  
  const tester = new MCPTester();
  await tester.runTests();
}

main().catch(console.error);
