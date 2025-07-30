#!/usr/bin/env tsx

/**
 * Development Server Stability Check
 * Verifies both client and server are running properly
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface HealthCheck {
  service: string;
  url: string;
  expectedStatus?: number;
  timeout?: number;
}

const checks: HealthCheck[] = [
  {
    service: 'Express API Server',
    url: 'http://localhost:5000/api/health',
    expectedStatus: 200,
    timeout: 5000
  },
  {
    service: 'Vite Development Server',
    url: 'http://localhost:5173/',
    expectedStatus: 200,
    timeout: 3000
  }
];

async function checkService(check: HealthCheck): Promise<boolean> {
  try {
    const { stdout } = await execAsync(
      `curl -s -w "%{http_code}" -o /dev/null --max-time ${(check.timeout || 5000) / 1000} "${check.url}"`,
      { timeout: check.timeout || 5000 }
    );
    
    const statusCode = parseInt(stdout.trim());
    const isHealthy = statusCode === (check.expectedStatus || 200);
    
    console.log(`✅ ${check.service}: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'} (${statusCode})`);
    return isHealthy;
    
  } catch (error) {
    console.log(`❌ ${check.service}: FAILED - ${error.message}`);
    return false;
  }
}

async function runStabilityCheck(): Promise<boolean> {
  console.log('🔍 FableCraft Development Server Stability Check\n');
  
  const results = await Promise.all(checks.map(checkService));
  const allHealthy = results.every(result => result);
  
  console.log(`\n📊 Overall Status: ${allHealthy ? '🟢 STABLE' : '🔴 UNSTABLE'}`);
  
  if (allHealthy) {
    console.log('✨ All services are running properly');
    console.log('🚀 Development environment is ready for creative work');
  } else {
    console.log('⚠️  Some services need attention');
    console.log('💡 Consider restarting the development server');
  }
  
  return allHealthy;
}

// Run check if called directly
if (require.main === module) {
  runStabilityCheck().then(stable => {
    process.exit(stable ? 0 : 1);
  });
}

export { runStabilityCheck };