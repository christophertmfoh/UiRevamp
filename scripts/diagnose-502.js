#!/usr/bin/env node

/**
 * Diagnostic script for 502/504 errors
 * Run with: node scripts/diagnose-502.js
 */

const http = require('http');
const https = require('https');

const config = {
  serverUrl: process.env.SERVER_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  timeout: 10000
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      timeout: config.timeout,
      headers: {
        'User-Agent': 'Diagnostic-Script/1.0',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function runDiagnostics() {
  console.log('🔍 Starting 502/504 Error Diagnostics...\n');
  
  const checks = [
    {
      name: 'Server Health Check',
      url: `${config.serverUrl}/api/health`,
      description: 'Checking if the Express server is responding'
    },
    {
      name: 'Client Server Check',
      url: config.clientUrl,
      description: 'Checking if the Vite dev server is responding'
    },
    {
      name: 'API Proxy Test',
      url: `${config.clientUrl}/api/health`,
      description: 'Testing API proxy through Vite'
    }
  ];

  for (const check of checks) {
    console.log(`📋 ${check.name}`);
    console.log(`   ${check.description}`);
    console.log(`   URL: ${check.url}`);
    
    try {
      const startTime = Date.now();
      const response = await makeRequest(check.url);
      const duration = Date.now() - startTime;
      
      console.log(`   ✅ Status: ${response.statusCode}`);
      console.log(`   ⏱️  Response Time: ${duration}ms`);
      
      if (response.statusCode >= 400) {
        console.log(`   ⚠️  Warning: Status code indicates an issue`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      
      if (error.code === 'ECONNREFUSED') {
        console.log(`   💡 Suggestion: Server might not be running`);
      } else if (error.message.includes('timeout')) {
        console.log(`   💡 Suggestion: Server is taking too long to respond`);
      }
    }
    
    console.log('');
  }

  console.log('🔧 Common Solutions:');
  console.log('1. Restart both servers: npm run dev');
  console.log('2. Check if ports 5000 and 5173 are available');
  console.log('3. Verify DATABASE_URL environment variable is set');
  console.log('4. Check server logs for specific error messages');
  console.log('5. Ensure all dependencies are installed: npm install');
}

// Run diagnostics
runDiagnostics().catch(console.error);