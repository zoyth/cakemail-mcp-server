#!/usr/bin/env node

// Simple build script to manually trigger TypeScript compilation
const { spawn } = require('child_process');
const path = require('path');

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function build() {
  try {
    console.log('🧹 Cleaning build directory...');
    await runCommand('rm', ['-rf', 'build']);
    
    console.log('🔨 Compiling TypeScript...');
    await runCommand('npx', ['tsc']);
    
    console.log('✅ Making index.js executable...');
    await runCommand('chmod', ['+x', 'build/index.js']);
    
    console.log('✅ Build completed successfully!');
    console.log('');
    console.log('📦 You can now use the campaign tools:');
    console.log('   • cakemail_list_campaigns');
    console.log('   • cakemail_get_latest_campaigns');
    console.log('   • cakemail_get_campaign');
    console.log('   • cakemail_create_campaign');
    console.log('   • cakemail_update_campaign');
    console.log('   • cakemail_send_campaign');
    console.log('   • cakemail_delete_campaign');
    console.log('   • cakemail_debug_campaign_access');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
