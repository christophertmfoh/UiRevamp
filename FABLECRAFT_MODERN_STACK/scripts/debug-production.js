#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 DEBUGGING PRODUCTION BUILD\n');

// Check if dist exists
const distPath = path.join(rootDir, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found! Run npm run build first.');
  process.exit(1);
}

// Check index.html
const indexPath = path.join(distPath, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

console.log('📄 Checking index.html...');
console.log('- Has root div:', indexContent.includes('<div id="root">') ? '✅' : '❌');
console.log('- Has main script:', indexContent.includes('index-') ? '✅' : '❌');
console.log('- Has theme CSS:', indexContent.includes('theme-') ? '✅' : '❌');

// Check for main entry file
const jsFiles = fs.readdirSync(path.join(distPath, 'assets/js')).filter(f => f.startsWith('index-'));
console.log('\n📦 Entry files found:', jsFiles);

// Check file sizes
jsFiles.forEach(file => {
  const filePath = path.join(distPath, 'assets/js', file);
  const stats = fs.statSync(filePath);
  console.log(`- ${file}: ${(stats.size / 1024).toFixed(2)}KB`);
});

// Start preview server and check
console.log('\n🚀 Starting preview server...');
const preview = execSync('npm run preview', { 
  cwd: rootDir,
  stdio: 'pipe',
  detached: true
});

setTimeout(() => {
  console.log('\n🌐 Checking server response...');
  try {
    const response = execSync('curl -s http://localhost:4173', { encoding: 'utf8' });
    console.log('- Server responds:', response.length > 0 ? '✅' : '❌');
    console.log('- HTML length:', response.length, 'characters');
    
    // Check for common errors in response
    if (response.includes('Cannot GET')) {
      console.error('❌ Server routing error!');
    }
    if (response.includes('<div id="root"></div>')) {
      console.log('✅ Root div found in response');
    } else {
      console.error('❌ Root div NOT found in response!');
    }
  } catch (error) {
    console.error('❌ Failed to connect to preview server');
  }
}, 3000);