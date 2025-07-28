#!/usr/bin/env node

/**
 * Load Testing Framework
 * Tests application performance under various load conditions
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

class LoadTester {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:5000';
    this.maxConcurrentRequests = options.maxConcurrentRequests || 50;
    this.testDuration = options.testDuration || 60000; // 60 seconds
    this.rampUpTime = options.rampUpTime || 10000; // 10 seconds
    this.endpoints = options.endpoints || this.getDefaultEndpoints();
    
    this.results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      timeouts: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      responseTimes: [],
      errorCodes: {},
      endpointResults: {},
      startTime: 0,
      endTime: 0
    };
    
    this.activeRequests = 0;
    this.isRunning = false;
  }

  getDefaultEndpoints() {
    return [
      {
        path: '/api/health',
        method: 'GET',
        weight: 1,
        auth: false
      },
      {
        path: '/api/projects',
        method: 'GET',
        weight: 3,
        auth: true
      },
      {
        path: '/api/characters',
        method: 'GET',
        weight: 2,
        auth: true
      },
      {
        path: '/api/daily-content',
        method: 'GET',
        weight: 1,
        auth: false
      },
      {
        path: '/api/projects',
        method: 'POST',
        weight: 1,
        auth: true,
        data: {
          title: 'Load Test Project',
          description: 'Test project for load testing',
          genre: 'fantasy'
        }
      }
    ];
  }

  async authenticateUser() {
    return new Promise((resolve, reject) => {
      const authData = JSON.stringify({
        username: 'loadtest@example.com',
        password: 'loadtest123'
      });

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(authData)
        }
      };

      const req = this.makeRequest('/api/auth/signin', options, (response) => {
        if (response.statusCode === 200 && response.data.token) {
          resolve(response.data.token);
        } else {
          // If auth fails, continue without token (some endpoints don't require auth)
          console.warn(`${colors.yellow}⚠️ Authentication failed, continuing without token${colors.reset}`);
          resolve(null);
        }
      }, (error) => {
        console.warn(`${colors.yellow}⚠️ Authentication error: ${error.message}${colors.reset}`);
        resolve(null);
      });

      req.write(authData);
      req.end();
    });
  }

  makeRequest(endpoint, options = {}, onResponse, onError, timeout = 10000) {
    const url = new URL(endpoint, this.baseUrl);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: timeout
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = data ? JSON.parse(data) : {};
          onResponse({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          onResponse({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', onError);
    req.on('timeout', () => {
      req.destroy();
      onError(new Error('Request timeout'));
    });

    return req;
  }

  async makeTestRequest(endpoint, token = null) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'LoadTester/1.0'
      };
      
      if (token && endpoint.auth) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const options = {
        method: endpoint.method,
        headers: headers
      };

      const req = this.makeRequest(
        endpoint.path,
        options,
        (response) => {
          const responseTime = Date.now() - startTime;
          resolve({
            success: response.statusCode >= 200 && response.statusCode < 400,
            statusCode: response.statusCode,
            responseTime: responseTime,
            endpoint: endpoint.path,
            method: endpoint.method
          });
        },
        (error) => {
          const responseTime = Date.now() - startTime;
          resolve({
            success: false,
            statusCode: error.code === 'ECONNREFUSED' ? 503 : 500,
            responseTime: responseTime,
            endpoint: endpoint.path,
            method: endpoint.method,
            error: error.message
          });
        }
      );

      if (endpoint.data) {
        const data = JSON.stringify(endpoint.data);
        req.write(data);
      }
      
      req.end();
    });
  }

  selectRandomEndpoint() {
    const totalWeight = this.endpoints.reduce((sum, ep) => sum + ep.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const endpoint of this.endpoints) {
      random -= endpoint.weight;
      if (random <= 0) {
        return endpoint;
      }
    }
    
    return this.endpoints[0];
  }

  updateResults(result) {
    this.results.totalRequests++;
    
    if (result.success) {
      this.results.successfulRequests++;
    } else {
      this.results.failedRequests++;
      
      if (result.error && result.error.includes('timeout')) {
        this.results.timeouts++;
      }
      
      this.results.errorCodes[result.statusCode] = 
        (this.results.errorCodes[result.statusCode] || 0) + 1;
    }
    
    this.results.responseTimes.push(result.responseTime);
    this.results.minResponseTime = Math.min(this.results.minResponseTime, result.responseTime);
    this.results.maxResponseTime = Math.max(this.results.maxResponseTime, result.responseTime);
    
    // Update endpoint-specific results
    const endpointKey = `${result.method} ${result.endpoint}`;
    if (!this.results.endpointResults[endpointKey]) {
      this.results.endpointResults[endpointKey] = {
        requests: 0,
        successes: 0,
        failures: 0,
        totalResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0
      };
    }
    
    const endpointResult = this.results.endpointResults[endpointKey];
    endpointResult.requests++;
    endpointResult.totalResponseTime += result.responseTime;
    endpointResult.minResponseTime = Math.min(endpointResult.minResponseTime, result.responseTime);
    endpointResult.maxResponseTime = Math.max(endpointResult.maxResponseTime, result.responseTime);
    
    if (result.success) {
      endpointResult.successes++;
    } else {
      endpointResult.failures++;
    }
  }

  calculateStatistics() {
    if (this.results.responseTimes.length === 0) return;
    
    // Calculate average response time
    this.results.averageResponseTime = 
      this.results.responseTimes.reduce((sum, time) => sum + time, 0) / 
      this.results.responseTimes.length;
    
    // Calculate percentiles
    const sortedTimes = [...this.results.responseTimes].sort((a, b) => a - b);
    this.results.p50 = this.getPercentile(sortedTimes, 50);
    this.results.p95 = this.getPercentile(sortedTimes, 95);
    this.results.p99 = this.getPercentile(sortedTimes, 99);
    
    // Calculate requests per second
    const durationSeconds = (this.results.endTime - this.results.startTime) / 1000;
    this.results.requestsPerSecond = this.results.totalRequests / durationSeconds;
    
    // Calculate success rate
    this.results.successRate = (this.results.successfulRequests / this.results.totalRequests) * 100;
  }

  getPercentile(sortedArray, percentile) {
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[index] || 0;
  }

  async runLoadTest() {
    console.log(`${colors.bold}${colors.cyan}🚀 Starting Load Test${colors.reset}`);
    console.log(`${colors.blue}Target: ${this.baseUrl}${colors.reset}`);
    console.log(`${colors.blue}Duration: ${this.testDuration / 1000}s${colors.reset}`);
    console.log(`${colors.blue}Max Concurrent: ${this.maxConcurrentRequests}${colors.reset}`);
    console.log(`${colors.blue}Ramp-up Time: ${this.rampUpTime / 1000}s${colors.reset}\n`);

    // Authenticate user for protected endpoints
    console.log(`${colors.cyan}🔐 Authenticating test user...${colors.reset}`);
    const token = await this.authenticateUser();
    
    this.isRunning = true;
    this.results.startTime = Date.now();
    
    // Ramp up requests gradually
    const rampUpInterval = this.rampUpTime / this.maxConcurrentRequests;
    let currentConcurrency = 0;
    
    const rampUpTimer = setInterval(() => {
      if (currentConcurrency < this.maxConcurrentRequests && this.isRunning) {
        currentConcurrency++;
        this.startRequestLoop(token);
      } else {
        clearInterval(rampUpTimer);
      }
    }, rampUpInterval);

    // Stop test after duration
    setTimeout(() => {
      this.isRunning = false;
      
      // Wait for remaining requests to complete
      const checkCompletion = () => {
        if (this.activeRequests === 0) {
          this.results.endTime = Date.now();
          this.calculateStatistics();
          this.generateReport();
        } else {
          setTimeout(checkCompletion, 100);
        }
      };
      
      setTimeout(checkCompletion, 1000); // Give 1 second for requests to finish
    }, this.testDuration);

    // Progress reporting
    const progressInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(progressInterval);
        return;
      }
      
      const elapsed = Date.now() - this.results.startTime;
      const progress = (elapsed / this.testDuration) * 100;
      const rps = this.results.totalRequests / (elapsed / 1000);
      
      process.stdout.write(`\r${colors.cyan}Progress: ${progress.toFixed(1)}% | Requests: ${this.results.totalRequests} | RPS: ${rps.toFixed(1)} | Active: ${this.activeRequests}${colors.reset}`);
    }, 1000);
  }

  async startRequestLoop(token) {
    while (this.isRunning) {
      if (this.activeRequests < this.maxConcurrentRequests) {
        this.activeRequests++;
        
        const endpoint = this.selectRandomEndpoint();
        
        this.makeTestRequest(endpoint, token)
          .then((result) => {
            this.updateResults(result);
            this.activeRequests--;
          })
          .catch((error) => {
            this.updateResults({
              success: false,
              statusCode: 500,
              responseTime: 0,
              endpoint: endpoint.path,
              method: endpoint.method,
              error: error.message
            });
            this.activeRequests--;
          });
      }
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  generateReport() {
    console.log(`\n\n${colors.bold}${colors.cyan}📊 LOAD TEST RESULTS${colors.reset}\n`);
    
    // Overview
    console.log(`${colors.bold}📋 Test Overview:${colors.reset}`);
    console.log(`  Duration: ${(this.results.endTime - this.results.startTime) / 1000}s`);
    console.log(`  Total Requests: ${colors.green}${this.results.totalRequests}${colors.reset}`);
    console.log(`  Successful: ${colors.green}${this.results.successfulRequests}${colors.reset}`);
    console.log(`  Failed: ${colors.red}${this.results.failedRequests}${colors.reset}`);
    console.log(`  Success Rate: ${this.getSuccessRateColor()}${this.results.successRate.toFixed(2)}%${colors.reset}`);
    console.log(`  Requests/sec: ${colors.blue}${this.results.requestsPerSecond.toFixed(2)}${colors.reset}\n`);
    
    // Response Times
    console.log(`${colors.bold}⏱️ Response Times:${colors.reset}`);
    console.log(`  Average: ${this.getResponseTimeColor(this.results.averageResponseTime)}${this.results.averageResponseTime.toFixed(2)}ms${colors.reset}`);
    console.log(`  Min: ${colors.green}${this.results.minResponseTime}ms${colors.reset}`);
    console.log(`  Max: ${this.getResponseTimeColor(this.results.maxResponseTime)}${this.results.maxResponseTime}ms${colors.reset}`);
    console.log(`  50th percentile: ${this.getResponseTimeColor(this.results.p50)}${this.results.p50}ms${colors.reset}`);
    console.log(`  95th percentile: ${this.getResponseTimeColor(this.results.p95)}${this.results.p95}ms${colors.reset}`);
    console.log(`  99th percentile: ${this.getResponseTimeColor(this.results.p99)}${this.results.p99}ms${colors.reset}\n`);
    
    // Error Analysis
    if (this.results.failedRequests > 0) {
      console.log(`${colors.bold}❌ Error Analysis:${colors.reset}`);
      console.log(`  Timeouts: ${colors.red}${this.results.timeouts}${colors.reset}`);
      console.log(`  Error Codes:`);
      Object.entries(this.results.errorCodes).forEach(([code, count]) => {
        console.log(`    ${code}: ${colors.red}${count}${colors.reset}`);
      });
      console.log('');
    }
    
    // Endpoint Performance
    console.log(`${colors.bold}🎯 Endpoint Performance:${colors.reset}`);
    Object.entries(this.results.endpointResults).forEach(([endpoint, stats]) => {
      const avgResponseTime = stats.totalResponseTime / stats.requests;
      const successRate = (stats.successes / stats.requests) * 100;
      
      console.log(`  ${endpoint}:`);
      console.log(`    Requests: ${colors.blue}${stats.requests}${colors.reset}`);
      console.log(`    Success Rate: ${this.getSuccessRateColor(successRate)}${successRate.toFixed(2)}%${colors.reset}`);
      console.log(`    Avg Response: ${this.getResponseTimeColor(avgResponseTime)}${avgResponseTime.toFixed(2)}ms${colors.reset}`);
      console.log(`    Range: ${stats.minResponseTime}ms - ${stats.maxResponseTime}ms`);
    });
    
    // Performance Assessment
    console.log(`\n${colors.bold}🏆 Performance Assessment:${colors.reset}`);
    this.generatePerformanceAssessment();
    
    // Save detailed results
    this.saveResults();
    console.log(`\n${colors.cyan}💾 Detailed results saved to: load-test-results.json${colors.reset}`);
  }

  getSuccessRateColor(rate = this.results.successRate) {
    if (rate >= 99) return colors.green;
    if (rate >= 95) return colors.yellow;
    return colors.red;
  }

  getResponseTimeColor(time) {
    if (time <= 100) return colors.green;
    if (time <= 500) return colors.yellow;
    return colors.red;
  }

  generatePerformanceAssessment() {
    const assessments = [];
    
    // RPS Assessment
    if (this.results.requestsPerSecond >= 100) {
      assessments.push(`${colors.green}✅ Excellent throughput (${this.results.requestsPerSecond.toFixed(1)} RPS)${colors.reset}`);
    } else if (this.results.requestsPerSecond >= 50) {
      assessments.push(`${colors.yellow}⚠️ Good throughput (${this.results.requestsPerSecond.toFixed(1)} RPS)${colors.reset}`);
    } else {
      assessments.push(`${colors.red}❌ Low throughput (${this.results.requestsPerSecond.toFixed(1)} RPS)${colors.reset}`);
    }
    
    // Response Time Assessment
    if (this.results.averageResponseTime <= 200) {
      assessments.push(`${colors.green}✅ Excellent response times${colors.reset}`);
    } else if (this.results.averageResponseTime <= 500) {
      assessments.push(`${colors.yellow}⚠️ Acceptable response times${colors.reset}`);
    } else {
      assessments.push(`${colors.red}❌ Slow response times${colors.reset}`);
    }
    
    // Success Rate Assessment
    if (this.results.successRate >= 99) {
      assessments.push(`${colors.green}✅ Excellent reliability${colors.reset}`);
    } else if (this.results.successRate >= 95) {
      assessments.push(`${colors.yellow}⚠️ Good reliability${colors.reset}`);
    } else {
      assessments.push(`${colors.red}❌ Poor reliability${colors.reset}`);
    }
    
    // Percentile Assessment
    if (this.results.p95 <= 1000) {
      assessments.push(`${colors.green}✅ Consistent performance (95th percentile: ${this.results.p95}ms)${colors.reset}`);
    } else {
      assessments.push(`${colors.red}❌ Inconsistent performance (95th percentile: ${this.results.p95}ms)${colors.reset}`);
    }
    
    assessments.forEach(assessment => console.log(`  ${assessment}`));
  }

  saveResults() {
    const report = {
      timestamp: new Date().toISOString(),
      configuration: {
        baseUrl: this.baseUrl,
        maxConcurrentRequests: this.maxConcurrentRequests,
        testDuration: this.testDuration,
        rampUpTime: this.rampUpTime,
        endpoints: this.endpoints
      },
      results: this.results
    };
    
    fs.writeFileSync('load-test-results.json', JSON.stringify(report, null, 2));
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    
    if (key && value) {
      if (key === 'concurrent') options.maxConcurrentRequests = parseInt(value);
      if (key === 'duration') options.testDuration = parseInt(value) * 1000;
      if (key === 'url') options.baseUrl = value;
      if (key === 'rampup') options.rampUpTime = parseInt(value) * 1000;
    }
  }
  
  console.log(`${colors.bold}${colors.cyan}🧪 FableCraft Load Testing Tool${colors.reset}\n`);
  
  const loadTester = new LoadTester(options);
  loadTester.runLoadTest().catch(error => {
    console.error(`${colors.red}❌ Load test failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}

module.exports = LoadTester;