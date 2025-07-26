// Direct startup for Nuxt 3 frontend on port 5000
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Fablecraft - Nuxt 3 + Vue 3 on port 5000');

// Start Nuxt directly 
const nuxt = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit'
});

nuxt.on('error', (error) => {
  console.error('Error starting Nuxt:', error);
  process.exit(1);
});

nuxt.on('close', (code) => {
  process.exit(code || 0);
});

// Keep process alive
process.on('SIGINT', () => {
  nuxt.kill('SIGINT');
});