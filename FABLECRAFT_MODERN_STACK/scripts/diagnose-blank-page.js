#!/usr/bin/env node

/**
 * DIAGNOSTIC SCRIPT: Find why production build shows blank page
 * Based on Vite 7 + React 18 + Vercel deployment issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 BLANK PAGE DIAGNOSTIC TOOL\n');

const issues = [];
const warnings = [];
const fixes = [];

// Test 1: Check if dist/index.html has proper script tags
console.log('📋 TEST 1: Checking production HTML');
try {
  const indexPath = path.join(rootDir, 'dist/index.html');
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8');
    
    // Check for script tags
    const scriptTags = html.match(/<script[^>]*>/g) || [];
    console.log(`Found ${scriptTags.length} script tags`);
    
    // Check for module scripts
    const moduleScripts = scriptTags.filter(tag => tag.includes('type="module"'));
    if (moduleScripts.length === 0) {
      issues.push('❌ No module scripts found in index.html');
      fixes.push('Ensure Vite is generating module scripts');
    } else {
      console.log(`✅ Found ${moduleScripts.length} module scripts`);
    }
    
    // Check for React shim
    if (!html.includes('window.React')) {
      warnings.push('⚠️  No React global polyfill found in HTML');
    }
    
    // Check for root element
    if (!html.includes('id="root"')) {
      issues.push('❌ No root element found in index.html');
    }
  } else {
    issues.push('❌ dist/index.html not found - build may have failed');
  }
} catch (error) {
  issues.push(`❌ Error checking HTML: ${error.message}`);
}

// Test 2: Check main JS bundle for React initialization
console.log('\n📋 TEST 2: Checking React initialization');
try {
  const jsFiles = fs.readdirSync(path.join(rootDir, 'dist/assets/js'))
    .filter(f => f.startsWith('index-') && f.endsWith('.js'));
  
  if (jsFiles.length > 0) {
    const mainJs = fs.readFileSync(path.join(rootDir, 'dist/assets/js', jsFiles[0]), 'utf8');
    
    // Check for React imports
    if (!mainJs.includes('react') && !mainJs.includes('React')) {
      issues.push('❌ React not found in main bundle');
    }
    
    // Check for createRoot
    if (!mainJs.includes('createRoot')) {
      issues.push('❌ createRoot not found - app may not be mounting');
    }
    
    // Check for error handling
    if (mainJs.includes('Application Failed to Load')) {
      console.log('✅ Error handling found');
    } else {
      warnings.push('⚠️  No error handling found for failed app loads');
    }
  }
} catch (error) {
  issues.push(`❌ Error checking JS bundle: ${error.message}`);
}

// Test 3: Check Vite config for issues
console.log('\n📋 TEST 3: Checking Vite configuration');
try {
  const viteConfig = fs.readFileSync(path.join(rootDir, 'vite.config.ts'), 'utf8');
  
  // Check for React plugin
  if (!viteConfig.includes('@vitejs/plugin-react')) {
    issues.push('❌ React plugin not configured in Vite');
  }
  
  // Check for base path
  if (!viteConfig.includes("base: '/'")) {
    warnings.push("⚠️  Base path not explicitly set to '/'");
    fixes.push("Add base: '/' to vite.config.ts");
  }
  
  // Check for JSX configuration
  if (viteConfig.includes('jsxRuntime: \'automatic\'')) {
    console.log('✅ JSX runtime set to automatic');
  } else {
    warnings.push('⚠️  JSX runtime not explicitly set to automatic');
  }
} catch (error) {
  issues.push(`❌ Error checking Vite config: ${error.message}`);
}

// Test 4: Check for common Vite 7 issues
console.log('\n📋 TEST 4: Checking for Vite 7 specific issues');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  
  // Check Vite version
  const viteVersion = packageJson.devDependencies?.vite || packageJson.dependencies?.vite;
  if (viteVersion && viteVersion.includes('7.')) {
    console.log(`✅ Using Vite 7: ${viteVersion}`);
    
    // Vite 7 specific checks
    if (!fs.existsSync(path.join(rootDir, 'public'))) {
      warnings.push('⚠️  No public directory found (Vite 7 expects it)');
    }
  }
  
  // Check for React 18
  const reactVersion = packageJson.dependencies?.react;
  if (reactVersion && !reactVersion.includes('18.')) {
    issues.push('❌ Not using React 18 - may cause compatibility issues');
  }
} catch (error) {
  issues.push(`❌ Error checking package.json: ${error.message}`);
}

// Test 5: Check Vercel configuration
console.log('\n📋 TEST 5: Checking Vercel configuration');
try {
  const vercelPath = path.join(rootDir, 'vercel.json');
  if (fs.existsSync(vercelPath)) {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    
    // Check rewrites
    if (!vercelConfig.rewrites || vercelConfig.rewrites.length === 0) {
      issues.push('❌ No rewrites configured in vercel.json');
      fixes.push('Add SPA rewrites to vercel.json');
    } else {
      console.log('✅ Rewrites configured');
    }
    
    // Check for cleanUrls setting
    if (vercelConfig.cleanUrls === true) {
      warnings.push('⚠️  cleanUrls is enabled - may interfere with SPA routing');
      fixes.push('Remove or set cleanUrls to false in vercel.json');
    }
  } else {
    warnings.push('⚠️  No vercel.json found');
  }
} catch (error) {
  issues.push(`❌ Error checking Vercel config: ${error.message}`);
}

// Test 6: Check for module loading issues
console.log('\n📋 TEST 6: Testing local production build');
try {
  console.log('Starting preview server...');
  // Start preview server in background
  const preview = execSync('npm run preview &', { cwd: rootDir });
  
  // Wait for server to start
  execSync('sleep 2');
  
  // Try to fetch the page
  try {
    const response = execSync('curl -s http://localhost:4173', { encoding: 'utf8' });
    if (response.includes('<div id="root"></div>')) {
      console.log('✅ Root element found in preview');
    } else {
      issues.push('❌ Root element not found in preview response');
    }
  } catch (e) {
    warnings.push('⚠️  Could not test preview server');
  }
  
  // Kill preview server
  execSync('pkill -f "vite preview" || true');
} catch (error) {
  console.log('⚠️  Could not test preview server');
}

// Generate report
console.log('\n' + '='.repeat(60));
console.log('📊 DIAGNOSTIC REPORT\n');

if (issues.length > 0) {
  console.log('🚨 CRITICAL ISSUES FOUND:');
  issues.forEach(issue => console.log(`   ${issue}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('');
}

if (fixes.length > 0) {
  console.log('🔧 RECOMMENDED FIXES:');
  fixes.forEach((fix, i) => console.log(`   ${i + 1}. ${fix}`));
  console.log('');
}

// Most likely cause based on research
console.log('🎯 MOST LIKELY CAUSE (Based on Vite 7 + React 18 + Vercel):');
console.log('   1. React is not being exposed globally before chunks load');
console.log('   2. Module loading order issue in production');
console.log('   3. Vercel serving static files incorrectly');
console.log('   4. Missing or incorrect base path configuration');

console.log('\n💡 IMMEDIATE ACTION:');
console.log('   1. Check browser console for specific errors');
console.log('   2. Verify all assets are loading (Network tab)');
console.log('   3. Test with a minimal React component first');
console.log('   4. Consider reverting to a known working commit');

console.log('\n' + '='.repeat(60));