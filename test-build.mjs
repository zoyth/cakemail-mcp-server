import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testBuild() {
  try {
    console.log('Running TypeScript build...');
    const { stdout, stderr } = await execAsync('cd /Users/francoislane/dev/cakemail-mcp-server && npm run build');
    
    if (stderr) {
      console.error('Build stderr:', stderr);
    }
    
    console.log('Build stdout:', stdout);
    console.log('✅ Build completed successfully!');
    
    return { success: true, output: stdout };
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Export for potential use
export { testBuild };

console.log('Test script ready - call testBuild() to execute');
