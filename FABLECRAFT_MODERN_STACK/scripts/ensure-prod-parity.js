#!/usr/bin/env node

/**
 * ENSURE DEV/PROD PARITY SCRIPT
 * This script ensures that development and production builds work identically
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 ENSURING DEV/PROD PARITY\n');

const issues = [];

// 1. Check React imports
console.log('1️⃣ Checking React imports...');
const filesToCheck = [
  'src/main.tsx',
  'src/App.tsx',
  'src/app/providers/theme-provider.tsx',
  'src/features-modern/theme/components/theme-toggle.tsx',
];

filesToCheck.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('useLayoutEffect') && !content.includes('import React')) {
      issues.push(`❌ ${file} uses useLayoutEffect but doesn't import React`);
    }
  }
});

// 2. Check Vite config
console.log('\n2️⃣ Checking Vite configuration...');
const viteConfigPath = path.join(rootDir, 'vite.config.ts');
const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');

if (!viteConfig.includes('jsxImportSource')) {
  issues.push('❌ Vite config missing jsxImportSource');
}

if (!viteConfig.includes('fastRefresh')) {
  issues.push('❌ Vite config missing fastRefresh configuration');
}

// 3. Check for common production issues
console.log('\n3️⃣ Checking for common production issues...');

// Check for console.log statements
const srcFiles = execSync('find src -name "*.tsx" -o -name "*.ts"', { cwd: rootDir }).toString().split('\n').filter(Boolean);
srcFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  if (content.includes('console.log') && !file.includes('main.tsx')) {
    issues.push(`⚠️  ${file} contains console.log statements`);
  }
});

// 4. Test production build
console.log('\n4️⃣ Testing production build...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'pipe' });
  console.log('✅ Production build successful');
} catch (error) {
  issues.push('❌ Production build failed');
}

// 5. Check for environment variables
console.log('\n5️⃣ Checking environment variables...');
const envExample = path.join(rootDir, '.env.example');
if (!fs.existsSync(envExample)) {
  issues.push('⚠️  Missing .env.example file');
}

// Report results
console.log('\n📊 PARITY CHECK RESULTS:\n');
if (issues.length === 0) {
  console.log('✅ All checks passed! Dev/Prod parity looks good.');
} else {
  console.log(`Found ${issues.length} issues:\n`);
  issues.forEach(issue => console.log(issue));
  
  console.log('\n📝 RECOMMENDATIONS:');
  console.log('1. Ensure all React components import React when using hooks');
  console.log('2. Remove console.log statements before production');
  console.log('3. Test production build locally with: npm run preview');
  console.log('4. Use environment variables for configuration');
}

// 6. Auto-fix some issues
if (issues.some(issue => issue.includes('useLayoutEffect'))) {
  console.log('\n🔧 Auto-fixing React import issues...');
  filesToCheck.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('useLayoutEffect') && !content.includes('import React')) {
        content = content.replace(
          /import\s*{([^}]+)}\s*from\s*['"]react['"]/,
          "import React, {$1} from 'react'"
        );
        fs.writeFileSync(filePath, content);
        console.log(`✅ Fixed React import in ${file}`);
      }
    }
  });
}