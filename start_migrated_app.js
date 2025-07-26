// Start script for migrated Nuxt 3 frontend
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Fablecraft - Migrated Stack (Nuxt 3 + Vue 3)');
console.log('================================================');

// Change to frontend directory and start Nuxt dev server
const frontendDir = path.join(__dirname, 'frontend');
const nuxt = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

nuxt.on('error', (error) => {
  console.error('Failed to start Nuxt frontend:', error);
});

nuxt.on('close', (code) => {
  console.log(`Nuxt frontend process exited with code ${code}`);
});

console.log('✅ Nuxt 3 frontend starting on port 5000...');