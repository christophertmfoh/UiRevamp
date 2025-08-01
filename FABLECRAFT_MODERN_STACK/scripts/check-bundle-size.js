#!/usr/bin/env node

/**
 * Bundle Size Checker
 * Validates build output against performance budgets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { budgets, performanceTests } from '../performance.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  reset: '\x1b[0m'
};

/**
 * Get file size in KB
 */
function getFileSizeInKB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
}

/**
 * Analyze bundle sizes in dist directory
 */
function analyzeBundleSizes() {
  const distPath = path.join(__dirname, '../dist/assets');
  
  if (!fs.existsSync(distPath)) {
    console.error(`${colors.red}Error: dist directory not found. Run 'npm run build' first.${colors.reset}`);
    process.exit(1);
  }

  console.log('\n📊 Bundle Size Analysis\n');
  console.log('─'.repeat(50));

  const files = fs.readdirSync(distPath);
  const jsFiles = files.filter(file => file.endsWith('.js'));
  
  let totalSize = 0;
  const results = [];

  // Analyze each JS file
  jsFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    const sizeKB = parseFloat(getFileSizeInKB(filePath));
    totalSize += sizeKB;

    // Determine file type
    let fileType = 'component';
    if (file.includes('vendor')) fileType = 'vendor';
    else if (file.includes('index')) fileType = 'main';
    
    results.push({
      file,
      size: sizeKB,
      type: fileType
    });
  });

  // Display individual files
  results.forEach(({ file, size, type }) => {
    const maxSize = parseInt(budgets.componentSize.max);
    const warnSize = parseInt(budgets.componentSize.warn);
    
    let color = colors.green;
    let status = '✓';
    
    if (size > maxSize) {
      color = colors.red;
      status = '✗';
    } else if (size > warnSize) {
      color = colors.yellow;
      status = '⚠';
    }
    
    console.log(`${color}${status} ${file.padEnd(30)} ${size}kb${colors.reset}`);
  });

  console.log('─'.repeat(50));

  // Check total bundle size
  const maxBundleSize = parseInt(budgets.bundleSize.max);
  const warnBundleSize = parseInt(budgets.bundleSize.warn);
  
  let bundleColor = colors.green;
  let bundleStatus = 'PASS';
  
  if (totalSize > maxBundleSize) {
    bundleColor = colors.red;
    bundleStatus = 'FAIL';
  } else if (totalSize > warnBundleSize) {
    bundleColor = colors.yellow;
    bundleStatus = 'WARN';
  }

  console.log(`\n${bundleColor}Total Bundle Size: ${totalSize.toFixed(2)}kb [${bundleStatus}]${colors.reset}`);
  console.log(`Budget: ${budgets.bundleSize.warn} (warn) / ${budgets.bundleSize.max} (max)\n`);

  // Performance recommendations
  if (totalSize > warnBundleSize) {
    console.log(`${colors.yellow}⚠️  Performance Recommendations:${colors.reset}`);
    console.log('  • Consider lazy loading larger components');
    console.log('  • Review and remove unused dependencies');
    console.log('  • Enable tree shaking for better optimization');
    console.log('  • Use dynamic imports for route-based code splitting\n');
  }

  // Exit with error if budget exceeded
  if (totalSize > maxBundleSize) {
    process.exit(1);
  }
}

/**
 * Analyze component sizes
 */
function analyzeComponentSizes() {
  const componentsPath = path.join(__dirname, '../src/components');
  
  if (!fs.existsSync(componentsPath)) {
    return;
  }

  console.log('\n🧩 Component Size Analysis\n');
  console.log('─'.repeat(50));

  // This is a placeholder - in a real implementation,
  // you would analyze the actual built component chunks
  console.log('Component size analysis requires build metadata.');
  console.log('Run with --analyze flag during build for detailed info.\n');
}

// Run analysis
console.log(`\n${colors.green}🚀 Fablecraft Performance Budget Check${colors.reset}`);
analyzeBundleSizes();
analyzeComponentSizes();

console.log(`${colors.green}✨ Performance check complete!${colors.reset}\n`);