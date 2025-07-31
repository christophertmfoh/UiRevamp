#!/usr/bin/env node

/**
 * DEV/PROD PARITY VERIFICATION SCRIPT
 * Ensures absolute consistency between development and production environments
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 DEV/PROD PARITY VERIFICATION\n');

const checks = {
  themes: { passed: 0, failed: 0, tests: [] },
  css: { passed: 0, failed: 0, tests: [] },
  assets: { passed: 0, failed: 0, tests: [] },
  config: { passed: 0, failed: 0, tests: [] },
};

// Test 1: Verify all theme CSS is in production build
console.log('📋 TEST 1: Theme CSS Inclusion');
try {
  const cssDir = path.join(rootDir, 'dist/assets/css');
  const distFiles = fs.existsSync(cssDir) 
    ? fs.readdirSync(cssDir).filter(f => f.endsWith('.css') && !f.endsWith('.gz') && !f.endsWith('.br'))
    : fs.readdirSync(path.join(rootDir, 'dist/assets')).filter(f => f.endsWith('.css'));
  
  const themes = [
    'light', 'dark', 'arctic-focus', 'golden-hour',
    'midnight-ink', 'forest-manuscript', 'starlit-prose', 'coffee-house'
  ];
  
  let cssContent = '';
  distFiles.forEach(file => {
    const filePath = fs.existsSync(cssDir) 
      ? path.join(cssDir, file)
      : path.join(rootDir, 'dist/assets', file);
    cssContent += fs.readFileSync(filePath, 'utf8');
  });
  
  themes.forEach(theme => {
    const selector = `[data-theme="${theme}"]`;
    const selectorMinified = `[data-theme=${theme}]`;
    if (cssContent.includes(selector) || cssContent.includes(selectorMinified)) {
      checks.themes.tests.push(`✅ Theme "${theme}" found in production CSS`);
      checks.themes.passed++;
    } else {
      checks.themes.tests.push(`❌ Theme "${theme}" MISSING from production CSS`);
      checks.themes.failed++;
    }
  });
  
  // Check gradient classes
  const gradientClasses = ['gradient-primary', 'gradient-primary-br', 'gradient-primary-text'];
  gradientClasses.forEach(cls => {
    if (cssContent.includes(cls)) {
      checks.css.tests.push(`✅ Gradient class "${cls}" found`);
      checks.css.passed++;
    } else {
      checks.css.tests.push(`❌ Gradient class "${cls}" MISSING`);
      checks.css.failed++;
    }
  });
  
} catch (error) {
  console.error('❌ Error checking production CSS:', error.message);
}

// Test 2: Verify CSS variables are consistent
console.log('\n📋 TEST 2: CSS Variable Consistency');
const requiredVars = [
  '--background', '--foreground', '--primary', '--primary-foreground',
  '--card', '--muted', '--accent', '--border', '--orb-primary', '--orb-secondary'
];

try {
  const variablesCss = fs.readFileSync(
    path.join(rootDir, 'src/shared/lib/theme/variables.css'), 
    'utf8'
  );
  
  requiredVars.forEach(varName => {
    if (variablesCss.includes(varName)) {
      checks.css.tests.push(`✅ CSS variable "${varName}" defined`);
      checks.css.passed++;
    } else {
      checks.css.tests.push(`❌ CSS variable "${varName}" MISSING`);
      checks.css.failed++;
    }
  });
} catch (error) {
  console.error('❌ Error checking CSS variables:', error.message);
}

// Test 3: Verify build configuration
console.log('\n📋 TEST 3: Build Configuration');
try {
  const viteConfig = fs.readFileSync(path.join(rootDir, 'vite.config.ts'), 'utf8');
  
  const configChecks = [
    { name: 'Path aliases use path.resolve', check: viteConfig.includes('path.resolve') },
    { name: 'CSS code splitting enabled', check: viteConfig.includes('cssCodeSplit: true') },
    { name: 'Manual chunks configured', check: viteConfig.includes('manualChunks') },
    { name: 'Environment mode handling', check: viteConfig.includes('mode === ') },
    { name: 'Compression plugins', check: viteConfig.includes('compression') },
  ];
  
  configChecks.forEach(({ name, check }) => {
    if (check) {
      checks.config.tests.push(`✅ ${name}`);
      checks.config.passed++;
    } else {
      checks.config.tests.push(`❌ ${name} NOT configured`);
      checks.config.failed++;
    }
  });
} catch (error) {
  console.error('❌ Error checking configuration:', error.message);
}

// Test 4: Verify asset handling
console.log('\n📋 TEST 4: Asset Handling');
try {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'dist/index.html'), 'utf8');
  
  const assetChecks = [
    { name: 'CSS files linked', check: indexHtml.includes('.css') },
    { name: 'JS files linked', check: indexHtml.includes('.js') },
    { name: 'Theme initialization', check: indexHtml.includes('data-theme') || indexHtml.includes('localStorage') },
  ];
  
  assetChecks.forEach(({ name, check }) => {
    if (check) {
      checks.assets.tests.push(`✅ ${name}`);
      checks.assets.passed++;
    } else {
      checks.assets.tests.push(`❌ ${name} issue found`);
      checks.assets.failed++;
    }
  });
} catch (error) {
  console.error('❌ Error checking assets:', error.message);
}

// Print results
console.log('\n📊 VERIFICATION RESULTS\n');

Object.entries(checks).forEach(([category, results]) => {
  console.log(`${category.toUpperCase()}:`);
  results.tests.forEach(test => console.log(`  ${test}`));
  console.log(`  Summary: ${results.passed} passed, ${results.failed} failed\n`);
});

// Overall summary
const totalPassed = Object.values(checks).reduce((sum, cat) => sum + cat.passed, 0);
const totalFailed = Object.values(checks).reduce((sum, cat) => sum + cat.failed, 0);

console.log('═'.repeat(50));
console.log(`OVERALL: ${totalPassed} passed, ${totalFailed} failed`);

if (totalFailed === 0) {
  console.log('\n✅ DEV/PROD PARITY VERIFIED! All checks passed.');
} else {
  console.log('\n❌ DEV/PROD PARITY ISSUES FOUND! Fix the failed checks above.');
  process.exit(1);
}