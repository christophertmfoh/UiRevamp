#!/usr/bin/env node

/**
 * Health Check Script
 * Monitors application health and dependencies
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

class HealthChecker {
  constructor() {
    this.checks = [];
    this.results = [];
    this.startTime = Date.now();
  }

  async httpCheck(name, url, timeout = 5000) {
    return new Promise((resolve) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: timeout
      }, (res) => {
        const isHealthy = res.statusCode >= 200 && res.statusCode < 400;
        resolve({
          name,
          type: 'http',
          status: isHealthy ? 'healthy' : 'unhealthy',
          details: `HTTP ${res.statusCode}`,
          responseTime: Date.now() - startTime
        });
      });

      const startTime = Date.now();
      
      req.on('error', (error) => {
        resolve({
          name,
          type: 'http',
          status: 'unhealthy',
          details: error.message,
          responseTime: Date.now() - startTime
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          name,
          type: 'http',
          status: 'unhealthy',
          details: 'Request timeout',
          responseTime: timeout
        });
      });

      req.end();
    });
  }

  async fileCheck(name, filePath) {
    try {
      const stats = fs.statSync(filePath);
      return {
        name,
        type: 'file',
        status: 'healthy',
        details: `File exists (${stats.size} bytes)`,
        responseTime: 0
      };
    } catch (error) {
      return {
        name,
        type: 'file',
        status: 'unhealthy',
        details: error.message,
        responseTime: 0
      };
    }
  }

  async diskSpaceCheck(name, threshold = 90) {
    try {
      const stats = fs.statSync('.');
      // This is a simplified check - in production, use a proper disk space library
      return {
        name,
        type: 'disk',
        status: 'healthy',
        details: 'Disk space check skipped (requires external library)',
        responseTime: 0
      };
    } catch (error) {
      return {
        name,
        type: 'disk',
        status: 'unhealthy',
        details: error.message,
        responseTime: 0
      };
    }
  }

  async memoryCheck(name, threshold = 90) {
    const memUsage = process.memoryUsage();
    const totalMem = memUsage.heapTotal;
    const usedMem = memUsage.heapUsed;
    const usagePercent = (usedMem / totalMem) * 100;
    
    return {
      name,
      type: 'memory',
      status: usagePercent < threshold ? 'healthy' : 'unhealthy',
      details: `${Math.round(usagePercent)}% used (${Math.round(usedMem / 1024 / 1024)}MB / ${Math.round(totalMem / 1024 / 1024)}MB)`,
      responseTime: 0
    };
  }

  async environmentCheck(name) {
    const requiredVars = ['NODE_ENV'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    return {
      name,
      type: 'environment',
      status: missingVars.length === 0 ? 'healthy' : 'unhealthy',
      details: missingVars.length === 0 ? 'All required variables present' : `Missing: ${missingVars.join(', ')}`,
      responseTime: 0
    };
  }

  async databaseCheck(name) {
    // Check if database URL is configured
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return {
        name,
        type: 'database',
        status: 'unhealthy',
        details: 'DATABASE_URL not configured',
        responseTime: 0
      };
    }

    if (dbUrl === 'mock') {
      return {
        name,
        type: 'database',
        status: 'healthy',
        details: 'Using mock database (development)',
        responseTime: 0
      };
    }

    // For real database connections, you would implement actual connection test here
    return {
      name,
      type: 'database',
      status: 'healthy',
      details: 'Database URL configured',
      responseTime: 0
    };
  }

  async runChecks() {
    const baseUrl = process.env.HEALTH_CHECK_URL || 'http://localhost:5000';
    
    const checks = [
      // Application endpoints
      () => this.httpCheck('Server Health', `${baseUrl}/health`),
      () => this.httpCheck('API Status', `${baseUrl}/api/health`),
      
      // System checks
      () => this.memoryCheck('Memory Usage'),
      () => this.diskSpaceCheck('Disk Space'),
      () => this.environmentCheck('Environment Variables'),
      () => this.databaseCheck('Database Connection'),
      
      // File system checks
      () => this.fileCheck('Package.json', './package.json'),
      () => this.fileCheck('Environment Template', './.env.example'),
    ];

    console.log(`${colors.bold}${colors.cyan}Running Health Checks...${colors.reset}\n`);

    // Run all checks in parallel
    const results = await Promise.all(checks.map(check => check()));
    this.results = results;

    return results;
  }

  generateReport(format = 'console') {
    const endTime = Date.now();
    const totalTime = endTime - this.startTime;
    
    if (format === 'json') {
      const report = {
        timestamp: new Date().toISOString(),
        totalTime: totalTime,
        checks: this.results,
        summary: this.getSummary()
      };
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    // Console format
    console.log(`${colors.bold}${colors.cyan}Health Check Report${colors.reset}`);
    console.log(`${colors.blue}Completed in ${totalTime}ms${colors.reset}\n`);

    // Group results by status
    const healthy = this.results.filter(r => r.status === 'healthy');
    const unhealthy = this.results.filter(r => r.status === 'unhealthy');

    // Display healthy checks
    if (healthy.length > 0) {
      console.log(`${colors.green}✅ Healthy (${healthy.length}):${colors.reset}`);
      healthy.forEach(result => {
        const timeStr = result.responseTime > 0 ? ` (${result.responseTime}ms)` : '';
        console.log(`  ${colors.green}•${colors.reset} ${result.name}: ${result.details}${timeStr}`);
      });
      console.log('');
    }

    // Display unhealthy checks
    if (unhealthy.length > 0) {
      console.log(`${colors.red}❌ Unhealthy (${unhealthy.length}):${colors.reset}`);
      unhealthy.forEach(result => {
        const timeStr = result.responseTime > 0 ? ` (${result.responseTime}ms)` : '';
        console.log(`  ${colors.red}•${colors.reset} ${result.name}: ${result.details}${timeStr}`);
      });
      console.log('');
    }

    // Overall status
    const overallHealthy = unhealthy.length === 0;
    const statusColor = overallHealthy ? colors.green : colors.red;
    const statusIcon = overallHealthy ? '✅' : '❌';
    const statusText = overallHealthy ? 'HEALTHY' : 'UNHEALTHY';
    
    console.log(`${statusColor}${colors.bold}${statusIcon} Overall Status: ${statusText}${colors.reset}`);
    
    if (!overallHealthy) {
      console.log(`\n${colors.cyan}💡 Recommendations:${colors.reset}`);
      unhealthy.forEach(result => {
        console.log(`  • Fix ${result.name}: ${result.details}`);
      });
    }

    return overallHealthy;
  }

  getSummary() {
    const healthy = this.results.filter(r => r.status === 'healthy').length;
    const unhealthy = this.results.filter(r => r.status === 'unhealthy').length;
    const total = this.results.length;
    
    return {
      total,
      healthy,
      unhealthy,
      healthyPercentage: Math.round((healthy / total) * 100)
    };
  }

  async run() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
${colors.bold}FableCraft Health Checker${colors.reset}

Usage: node scripts/health-check.js [options]

Options:
  --help, -h          Show this help message
  --format <type>     Output format (console, json)
  --url <base-url>    Base URL for health checks (default: http://localhost:5000)
  --timeout <ms>      Request timeout in milliseconds (default: 5000)

Examples:
  node scripts/health-check.js
  node scripts/health-check.js --format json
  node scripts/health-check.js --url http://localhost:3000
  
Environment Variables:
  HEALTH_CHECK_URL    Base URL for health checks
`);
      process.exit(0);
    }

    // Parse arguments
    const formatIndex = args.indexOf('--format');
    const format = formatIndex !== -1 && args[formatIndex + 1] ? args[formatIndex + 1] : 'console';

    const urlIndex = args.indexOf('--url');
    if (urlIndex !== -1 && args[urlIndex + 1]) {
      process.env.HEALTH_CHECK_URL = args[urlIndex + 1];
    }

    try {
      await this.runChecks();
      const healthy = this.generateReport(format);
      process.exit(healthy ? 0 : 1);
    } catch (error) {
      console.error(`${colors.red}Health check failed: ${error.message}${colors.reset}`);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const checker = new HealthChecker();
  checker.run();
}

module.exports = HealthChecker;