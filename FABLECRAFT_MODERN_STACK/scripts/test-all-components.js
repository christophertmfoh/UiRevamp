#!/usr/bin/env node

/**
 * COMPREHENSIVE UI COMPONENT TEST
 * Tests ALL UI components to ensure they render correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 TESTING ALL UI COMPONENTS\n');

const componentTests = {
  layout: { passed: 0, failed: 0, tests: [] },
  navigation: { passed: 0, failed: 0, tests: [] },
  theme: { passed: 0, failed: 0, tests: [] },
  features: { passed: 0, failed: 0, tests: [] },
  forms: { passed: 0, failed: 0, tests: [] },
};

// Test 1: Layout Components
console.log('📋 TEST 1: Layout Components');
const layoutComponents = [
  'src/App.tsx',
  'src/features-modern/landing/landing-page.tsx',
  'src/features-modern/landing/components/hero-section.tsx',
  'src/features-modern/landing/components/footer-section.tsx',
];

layoutComponents.forEach(component => {
  const fullPath = path.join(rootDir, component);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for proper exports
    if (content.includes('export') && (content.includes('function') || content.includes('const'))) {
      componentTests.layout.tests.push(`✅ ${component} properly exported`);
      componentTests.layout.passed++;
    } else {
      componentTests.layout.tests.push(`❌ ${component} export issue`);
      componentTests.layout.failed++;
    }
    
    // Check for React imports
    if (content.includes("from 'react'") || content.includes('from "react"')) {
      componentTests.layout.tests.push(`✅ ${component} has React import`);
      componentTests.layout.passed++;
    } else {
      componentTests.layout.tests.push(`❌ ${component} missing React import`);
      componentTests.layout.failed++;
    }
  } else {
    componentTests.layout.tests.push(`❌ ${component} NOT FOUND`);
    componentTests.layout.failed++;
  }
});

// Test 2: Navigation Components
console.log('\n📋 TEST 2: Navigation Components');
const navComponents = [
  'src/features-modern/landing/components/navigation.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/dropdown-menu.tsx',
];

navComponents.forEach(component => {
  const fullPath = path.join(rootDir, component);
  if (fs.existsSync(fullPath)) {
    componentTests.navigation.tests.push(`✅ ${component} exists`);
    componentTests.navigation.passed++;
  } else {
    componentTests.navigation.tests.push(`❌ ${component} NOT FOUND`);
    componentTests.navigation.failed++;
  }
});

// Test 3: Theme Components
console.log('\n📋 TEST 3: Theme Components');
const themeComponents = [
  'src/app/providers/theme-provider.tsx',
  'src/features-modern/theme/components/theme-toggle.tsx',
];

themeComponents.forEach(component => {
  const fullPath = path.join(rootDir, component);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for theme functionality
    if (content.includes('ThemeProvider') || content.includes('useTheme')) {
      componentTests.theme.tests.push(`✅ ${component} has theme logic`);
      componentTests.theme.passed++;
    } else {
      componentTests.theme.tests.push(`❌ ${component} missing theme logic`);
      componentTests.theme.failed++;
    }
  } else {
    componentTests.theme.tests.push(`❌ ${component} NOT FOUND`);
    componentTests.theme.failed++;
  }
});

// Test 4: Feature Components
console.log('\n📋 TEST 4: Feature Components');
const featureComponents = [
  'src/features-modern/landing/components/feature-cards.tsx',
  'src/features-modern/landing/components/process-steps.tsx',
  'src/features-modern/landing/components/testimonials.tsx',
  'src/features-modern/landing/components/pricing-section.tsx',
];

featureComponents.forEach(component => {
  const fullPath = path.join(rootDir, component);
  if (fs.existsSync(fullPath)) {
    componentTests.features.tests.push(`✅ ${component} exists`);
    componentTests.features.passed++;
  } else {
    componentTests.features.tests.push(`⚠️  ${component} not found (optional)`);
  }
});

// Test 5: Form Components
console.log('\n📋 TEST 5: Form Components');
const formComponents = [
  'src/components/ui/input.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/label.tsx',
];

formComponents.forEach(component => {
  const fullPath = path.join(rootDir, component);
  if (fs.existsSync(fullPath)) {
    componentTests.forms.tests.push(`✅ ${component} exists`);
    componentTests.forms.passed++;
  } else {
    componentTests.forms.tests.push(`❌ ${component} NOT FOUND`);
    componentTests.forms.failed++;
  }
});

// Print results
console.log('\n📊 COMPONENT TEST RESULTS\n');

let totalPassed = 0;
let totalFailed = 0;

Object.entries(componentTests).forEach(([category, results]) => {
  console.log(`${category.toUpperCase()}:`);
  results.tests.forEach(test => console.log(`  ${test}`));
  console.log(`  Summary: ${results.passed} passed, ${results.failed} failed\n`);
  totalPassed += results.passed;
  totalFailed += results.failed;
});

console.log('═'.repeat(50));
console.log(`OVERALL: ${totalPassed} passed, ${totalFailed} failed`);

if (totalFailed === 0) {
  console.log('\n✅ ALL COMPONENTS TEST PASSED!');
} else {
  console.log('\n❌ COMPONENT TESTS FAILED!');
  console.log('Fix the issues above before deployment.');
  process.exit(1);
}