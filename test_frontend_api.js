#!/usr/bin/env node

/**
 * Professional Frontend-Backend Integration Test
 * 
 * This script validates that the frontend can successfully communicate
 * with the backend API and that the mock storage is providing the
 * expected data structure.
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const API_URL = BASE_URL;

// Test configuration
const TESTS = [
  {
    name: 'API Health Check',
    endpoint: '/api/projects',
    expectedStatus: 200,
    validateResponse: (data) => Array.isArray(data) && data.length > 0
  },
  {
    name: 'Project Structure Validation',
    endpoint: '/api/projects',
    expectedStatus: 200,
    validateResponse: (data) => {
      const project = data[0];
      return project && 
             typeof project.id === 'string' &&
             typeof project.name === 'string' &&
             typeof project.type === 'string' &&
             Array.isArray(project.genre) &&
             project.createdAt &&
             project.updatedAt;
    }
  },
  {
    name: 'Demo Data Verification',
    endpoint: '/api/projects',
    expectedStatus: 200,
    validateResponse: (data) => {
      const expectedProjects = ['The Chronicles of Aethermoor', 'Midnight in Neo Tokyo', 'The Last Library'];
      const projectNames = data.map(p => p.name);
      return expectedProjects.every(name => projectNames.includes(name));
    }
  }
];

// Color output utilities
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

async function runTest(test) {
  try {
    console.log(colors.blue(`\n🧪 Running: ${test.name}`));
    
    const response = await fetch(`${API_URL}${test.endpoint}`);
    const status = response.status;
    
    // Check status code
    if (status !== test.expectedStatus) {
      throw new Error(`Expected status ${test.expectedStatus}, got ${status}`);
    }
    
    // Parse response
    const data = await response.json();
    
    // Validate response structure
    if (!test.validateResponse(data)) {
      throw new Error('Response validation failed');
    }
    
    console.log(colors.green(`✅ PASSED: ${test.name}`));
    return { name: test.name, status: 'PASSED', data };
    
  } catch (error) {
    console.log(colors.red(`❌ FAILED: ${test.name} - ${error.message}`));
    return { name: test.name, status: 'FAILED', error: error.message };
  }
}

async function main() {
  console.log(colors.cyan('\n🔬 PROFESSIONAL FRONTEND-BACKEND INTEGRATION TEST'));
  console.log(colors.cyan('===============================================\n'));
  
  const results = [];
  
  for (const test of TESTS) {
    const result = await runTest(test);
    results.push(result);
  }
  
  // Summary
  console.log(colors.cyan('\n📊 TEST SUMMARY'));
  console.log(colors.cyan('==============='));
  
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  
  console.log(`\n✅ Passed: ${colors.green(passed)}`);
  console.log(`❌ Failed: ${colors.red(failed)}`);
  console.log(`📈 Success Rate: ${colors.yellow(Math.round((passed / results.length) * 100))}%`);
  
  if (failed === 0) {
    console.log(colors.green('\n🎉 ALL TESTS PASSED! Frontend-Backend integration is working correctly.'));
    
    // Show sample data for verification
    const projectData = results.find(r => r.name === 'Demo Data Verification')?.data;
    if (projectData) {
      console.log(colors.cyan('\n📝 Sample Project Data:'));
      projectData.slice(0, 1).forEach(project => {
        console.log(`  • ${colors.yellow(project.name)} (${project.type})`);
        console.log(`    Genre: ${project.genre.join(', ')}`);
        console.log(`    Created: ${new Date(project.createdAt).toLocaleDateString()}`);
      });
    }
  } else {
    console.log(colors.red('\n❌ Some tests failed. Please check the issues above.'));
    process.exit(1);
  }
  
  return results;
}

// Self-executing test
main().catch(error => {
  console.error(colors.red(`\n💥 Test runner failed: ${error.message}`));
  process.exit(1);
});