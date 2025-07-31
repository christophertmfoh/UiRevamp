#!/usr/bin/env node

/**
 * COMPREHENSIVE BUILD AND STACK AUDIT
 * Ensures EVERYTHING follows enterprise best practices
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 COMPREHENSIVE BUILD & STACK AUDIT\n');

const auditResults = {
  routing: { passed: 0, failed: 0, tests: [] },
  assets: { passed: 0, failed: 0, tests: [] },
  ui: { passed: 0, failed: 0, tests: [] },
  build: { passed: 0, failed: 0, tests: [] },
  deployment: { passed: 0, failed: 0, tests: [] },
  performance: { passed: 0, failed: 0, tests: [] },
};

// Test 1: Routing Configuration
console.log('📋 TEST 1: Routing Configuration');
try {
  // Check vercel.json exists
  if (fs.existsSync(path.join(rootDir, 'vercel.json'))) {
    const vercelConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf8'));
    if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
      auditResults.routing.tests.push('✅ Vercel routing configured');
      auditResults.routing.passed++;
    } else {
      auditResults.routing.tests.push('❌ Vercel routing NOT configured');
      auditResults.routing.failed++;
    }
  } else {
    auditResults.routing.tests.push('❌ vercel.json MISSING');
    auditResults.routing.failed++;
  }

  // Check React Router setup
  const mainFile = fs.readFileSync(path.join(rootDir, 'src/main.tsx'), 'utf8');
  if (mainFile.includes('BrowserRouter')) {
    auditResults.routing.tests.push('✅ React Router configured');
    auditResults.routing.passed++;
  } else {
    auditResults.routing.tests.push('❌ React Router NOT found');
    auditResults.routing.failed++;
  }
} catch (error) {
  console.error('❌ Error checking routing:', error.message);
}

// Test 2: Asset Loading
console.log('\n📋 TEST 2: Asset Loading');
try {
  // Check if dist has proper structure
  if (fs.existsSync(path.join(rootDir, 'dist'))) {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'dist/index.html'), 'utf8');
    
    // Check CSS loading
    if (indexHtml.includes('<link') && indexHtml.includes('.css')) {
      auditResults.assets.tests.push('✅ CSS properly linked');
      auditResults.assets.passed++;
    } else {
      auditResults.assets.tests.push('❌ CSS NOT properly linked');
      auditResults.assets.failed++;
    }
    
    // Check JS loading
    if (indexHtml.includes('<script') && indexHtml.includes('.js')) {
      auditResults.assets.tests.push('✅ JS properly linked');
      auditResults.assets.passed++;
    } else {
      auditResults.assets.tests.push('❌ JS NOT properly linked');
      auditResults.assets.failed++;
    }
    
    // Check asset paths are absolute
    if (!indexHtml.includes('src="./') && !indexHtml.includes('href="./')) {
      auditResults.assets.tests.push('✅ Asset paths are absolute');
      auditResults.assets.passed++;
    } else {
      auditResults.assets.tests.push('❌ Relative asset paths found');
      auditResults.assets.failed++;
    }
  }
} catch (error) {
  console.error('❌ Error checking assets:', error.message);
}

// Test 3: UI Components
console.log('\n📋 TEST 3: UI Components');
try {
  // Check if all major UI components exist
  const componentsToCheck = [
    'src/features-modern/landing/landing-page.tsx',
    'src/features-modern/theme/components/theme-toggle.tsx',
    'src/components/ui/button.tsx',
    'src/App.tsx',
  ];
  
  componentsToCheck.forEach(component => {
    if (fs.existsSync(path.join(rootDir, component))) {
      auditResults.ui.tests.push(`✅ ${component} exists`);
      auditResults.ui.passed++;
    } else {
      auditResults.ui.tests.push(`❌ ${component} MISSING`);
      auditResults.ui.failed++;
    }
  });
  
  // Check if components are exported properly
  const appFile = fs.readFileSync(path.join(rootDir, 'src/App.tsx'), 'utf8');
  if (appFile.includes('export default')) {
    auditResults.ui.tests.push('✅ App component properly exported');
    auditResults.ui.passed++;
  } else {
    auditResults.ui.tests.push('❌ App component NOT properly exported');
    auditResults.ui.failed++;
  }
} catch (error) {
  console.error('❌ Error checking UI components:', error.message);
}

// Test 4: Build Configuration
console.log('\n📋 TEST 4: Build Configuration');
try {
  const viteConfig = fs.readFileSync(path.join(rootDir, 'vite.config.ts'), 'utf8');
  
  // Check base path
  if (viteConfig.includes("base: '/'") || viteConfig.includes('base: "/"')) {
    auditResults.build.tests.push('✅ Base path configured');
    auditResults.build.passed++;
  } else {
    auditResults.build.tests.push('❌ Base path NOT configured');
    auditResults.build.failed++;
  }
  
  // Check build output
  if (viteConfig.includes("outDir: 'dist'")) {
    auditResults.build.tests.push('✅ Output directory configured');
    auditResults.build.passed++;
  } else {
    auditResults.build.tests.push('❌ Output directory NOT configured');
    auditResults.build.failed++;
  }
  
  // Check plugins
  if (viteConfig.includes('react()')) {
    auditResults.build.tests.push('✅ React plugin configured');
    auditResults.build.passed++;
  } else {
    auditResults.build.tests.push('❌ React plugin NOT configured');
    auditResults.build.failed++;
  }
} catch (error) {
  console.error('❌ Error checking build config:', error.message);
}

// Test 5: Deployment Configuration
console.log('\n📋 TEST 5: Deployment Configuration');
try {
  // Check package.json scripts
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  
  const requiredScripts = ['dev', 'build', 'preview'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      auditResults.deployment.tests.push(`✅ Script "${script}" exists`);
      auditResults.deployment.passed++;
    } else {
      auditResults.deployment.tests.push(`❌ Script "${script}" MISSING`);
      auditResults.deployment.failed++;
    }
  });
  
  // Check dependencies
  const criticalDeps = ['react', 'react-dom', 'react-router-dom'];
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      auditResults.deployment.tests.push(`✅ Dependency "${dep}" installed`);
      auditResults.deployment.passed++;
    } else {
      auditResults.deployment.tests.push(`❌ Dependency "${dep}" MISSING`);
      auditResults.deployment.failed++;
    }
  });
} catch (error) {
  console.error('❌ Error checking deployment:', error.message);
}

// Test 6: Performance Optimizations
console.log('\n📋 TEST 6: Performance Optimizations');
try {
  const viteConfig = fs.readFileSync(path.join(rootDir, 'vite.config.ts'), 'utf8');
  
  // Check code splitting
  if (viteConfig.includes('manualChunks')) {
    auditResults.performance.tests.push('✅ Code splitting configured');
    auditResults.performance.passed++;
  } else {
    auditResults.performance.tests.push('❌ Code splitting NOT configured');
    auditResults.performance.failed++;
  }
  
  // Check compression
  if (viteConfig.includes('compression')) {
    auditResults.performance.tests.push('✅ Compression enabled');
    auditResults.performance.passed++;
  } else {
    auditResults.performance.tests.push('❌ Compression NOT enabled');
    auditResults.performance.failed++;
  }
  
  // Check minification
  if (viteConfig.includes('minify')) {
    auditResults.performance.tests.push('✅ Minification configured');
    auditResults.performance.passed++;
  } else {
    auditResults.performance.tests.push('❌ Minification NOT configured');
    auditResults.performance.failed++;
  }
} catch (error) {
  console.error('❌ Error checking performance:', error.message);
}

// Print comprehensive results
console.log('\n📊 AUDIT RESULTS\n');

let totalPassed = 0;
let totalFailed = 0;

Object.entries(auditResults).forEach(([category, results]) => {
  console.log(`${category.toUpperCase()}:`);
  results.tests.forEach(test => console.log(`  ${test}`));
  console.log(`  Summary: ${results.passed} passed, ${results.failed} failed\n`);
  totalPassed += results.passed;
  totalFailed += results.failed;
});

console.log('═'.repeat(50));
console.log(`OVERALL: ${totalPassed} passed, ${totalFailed} failed`);

if (totalFailed === 0) {
  console.log('\n✅ BUILD & STACK AUDIT PASSED!');
  console.log('Your application follows enterprise best practices.');
} else {
  console.log('\n❌ BUILD & STACK AUDIT FAILED!');
  console.log('Fix the issues above before deployment.');
  
  // Provide specific recommendations
  console.log('\n📝 RECOMMENDATIONS:');
  if (auditResults.routing.failed > 0) {
    console.log('- Add vercel.json with proper rewrites configuration');
  }
  if (auditResults.assets.failed > 0) {
    console.log('- Ensure all assets use absolute paths');
  }
  if (auditResults.build.failed > 0) {
    console.log('- Add base: "/" to vite.config.ts');
  }
  if (auditResults.performance.failed > 0) {
    console.log('- Enable compression and code splitting');
  }
  
  process.exit(1);
}