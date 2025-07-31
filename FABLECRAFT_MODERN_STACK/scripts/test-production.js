#!/usr/bin/env node

/**
 * PRODUCTION BUILD TEST
 * Tests the production build locally before deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 TESTING PRODUCTION BUILD\n');

// Step 1: Clean previous build
console.log('1️⃣ Cleaning previous build...');
try {
  execSync('rm -rf dist', { cwd: rootDir });
  console.log('✅ Clean complete\n');
} catch (error) {
  console.log('⚠️  No previous build to clean\n');
}

// Step 2: Install dependencies
console.log('2️⃣ Ensuring dependencies are installed...');
try {
  execSync('npm ci', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Dependencies ready\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 3: Build for production
console.log('3️⃣ Building for production...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Build complete\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 4: Verify build output
console.log('4️⃣ Verifying build output...');
const distPath = path.join(rootDir, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in dist!');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf8');

// Check for proper script tags
if (!indexContent.includes('<script') || !indexContent.includes('.js')) {
  console.error('❌ No JavaScript files linked in index.html!');
  process.exit(1);
}

// Check for CSS
if (!indexContent.includes('<link') || !indexContent.includes('.css')) {
  console.error('❌ No CSS files linked in index.html!');
  process.exit(1);
}

// Check for absolute paths
if (indexContent.includes('src="./') || indexContent.includes('href="./')) {
  console.error('❌ Relative paths found in index.html!');
  process.exit(1);
}

console.log('✅ Build output verified\n');

// Step 5: Preview instructions
console.log('5️⃣ NEXT STEPS:');
console.log('   Run: npm run preview');
console.log('   Open: http://localhost:4173');
console.log('   Check browser console for errors');
console.log('   Test all routes and features\n');

console.log('✅ Production build test complete!');