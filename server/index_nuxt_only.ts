// Simple startup script to run Nuxt 3 frontend on port 5000
import { spawn } from "child_process";
import path from "path";

console.log('🚀 Starting Fablecraft - Nuxt 3 + Vue 3 Frontend');
console.log('===========================================');

// Start Nuxt directly on port 5000
const frontendDir = path.join(process.cwd(), 'frontend');
const nuxtProcess = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'inherit',
  env: { ...process.env, NUXT_PORT: '5000', NUXT_HOST: '0.0.0.0' }
});

nuxtProcess.on('error', (error) => {
  console.error('Failed to start Nuxt frontend:', error);
});

nuxtProcess.on('close', (code) => {
  console.log(`Nuxt frontend process exited with code ${code}`);
  process.exit(code || 0);
});

console.log('✅ Nuxt 3 frontend starting on port 5000...');
console.log('🌐 Visit: http://localhost:5000');