#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Code Complexity Analysis Report\n');

// 1. Run complexity-report
console.log('📊 Cyclomatic Complexity Analysis:');
console.log('=' .repeat(50));
try {
  const complexityReport = execSync(
    'npx cr client/src --format plain --max-files 10',
    { encoding: 'utf8' }
  );
  console.log(complexityReport);
} catch (error) {
  console.log('Error running complexity report:', error.message);
}

// 2. Run jscpd for duplicate code detection
console.log('\n📋 Code Duplication Analysis:');
console.log('=' .repeat(50));
try {
  const duplicationReport = execSync(
    'npx jscpd client/src --min-lines 5 --min-tokens 50',
    { encoding: 'utf8' }
  );
  console.log(duplicationReport);
} catch (error) {
  console.log('Error running duplication analysis:', error.message);
}

// 3. Simple function complexity analyzer
console.log('\n🔢 Function Complexity Summary:');
console.log('=' .repeat(50));

function analyzeComplexity(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const functionMatches = content.match(/function\s+\w+|const\s+\w+\s*=\s*\(|export\s+(default\s+)?function/g) || [];
  const ifStatements = (content.match(/\bif\s*\(/g) || []).length;
  const forLoops = (content.match(/\bfor\s*\(/g) || []).length;
  const whileLoops = (content.match(/\bwhile\s*\(/g) || []).length;
  const tryCatch = (content.match(/\btry\s*{/g) || []).length;
  
  return {
    functions: functionMatches.length,
    conditionals: ifStatements,
    loops: forLoops + whileLoops,
    errorHandling: tryCatch,
    complexity: ifStatements + forLoops + whileLoops + tryCatch
  };
}

// Analyze key files
const keyFiles = [
  'client/src/components/LandingPage.tsx',
  'client/src/components/CharacterManager.tsx',
  'server/routes.ts',
  'server/storage.ts'
];

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = analyzeComplexity(file);
    console.log(`\n${file}:`);
    console.log(`  Functions: ${stats.functions}`);
    console.log(`  Conditionals: ${stats.conditionals}`);
    console.log(`  Loops: ${stats.loops}`);
    console.log(`  Error Handling: ${stats.errorHandling}`);
    console.log(`  Total Complexity Score: ${stats.complexity}`);
  }
});

console.log('\n💡 Complexity Guidelines:');
console.log('- Functions with complexity > 10: Consider refactoring');
console.log('- Files with > 200 lines: Consider splitting');
console.log('- Duplicate code blocks: Extract to shared functions');