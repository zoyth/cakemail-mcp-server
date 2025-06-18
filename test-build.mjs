import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testBuild() {
  try {
    console.log('Testing TypeScript compilation...');
    const { stdout, stderr } = await execAsync('npm run build', { 
      cwd: '/Users/francoislane/dev/cakemail-mcp-server' 
    });
    
    if (stderr) {
      console.log('Build stderr:', stderr);
    }
    
    console.log('Build stdout:', stdout);
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.log('❌ Build failed:');
    console.log('Error message:', error.message);
    console.log('Error stdout:', error.stdout);
    console.log('Error stderr:', error.stderr);
  }
}

testBuild();
