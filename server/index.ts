import { spawn } from 'child_process';
import { join } from 'path';

console.log('🚀 FORCING NUXT 3 FRONTEND ON PORT 5000');
console.log('=====================================');

const frontendPath = join(process.cwd(), 'frontend');

// Kill any existing processes on port 5000
spawn('pkill', ['-f', 'port 5000'], { stdio: 'ignore' });

// Start Nuxt with explicit port binding
const nuxt = spawn('npm', ['run', 'dev'], {
  cwd: frontendPath,
  stdio: ['inherit', 'inherit', 'inherit'],
  env: { 
    ...process.env, 
    PORT: '5000',
    NUXT_PORT: '5000',
    NUXT_HOST: '0.0.0.0'
  }
});

nuxt.on('error', (error) => {
  console.error('Nuxt startup error:', error);
  process.exit(1);
});

nuxt.on('close', (code) => {
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  nuxt.kill('SIGINT');
});

console.log('✅ Nuxt 3 taking over port 5000...');