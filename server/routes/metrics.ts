/**
 * Metrics API Endpoint for Prometheus Integration
 * Provides server-side performance metrics in Prometheus format
 */

import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// In-memory metrics storage
interface MetricData {
  http_requests_total: { [key: string]: number };
  http_request_duration_seconds: { [key: string]: number[] };
  active_connections: number;
  memory_usage_bytes: number;
  cpu_usage_percent: number;
  database_connections_active: number;
  database_connections_max: number;
  ai_generation_requests_total: number;
  ai_generation_failures_total: number;
  user_sessions_created_total: number;
  security_events_total: { [key: string]: number };
  auth_failures_total: number;
  rate_limit_triggered_total: number;
}

let metrics: MetricData = {
  http_requests_total: {},
  http_request_duration_seconds: {},
  active_connections: 0,
  memory_usage_bytes: 0,
  cpu_usage_percent: 0,
  database_connections_active: 0,
  database_connections_max: 100,
  ai_generation_requests_total: 0,
  ai_generation_failures_total: 0,
  user_sessions_created_total: 0,
  security_events_total: {},
  auth_failures_total: 0,
  rate_limit_triggered_total: 0
};

// Middleware to track HTTP requests
export const metricsMiddleware = (req: Request, res: Response, next: Function) => {
  const startTime = Date.now();
  
  // Track request
  const key = `${req.method}_${req.route?.path || req.path}_${res.statusCode || 'unknown'}`;
  metrics.http_requests_total[key] = (metrics.http_requests_total[key] || 0) + 1;
  
  // Track response time
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const durationKey = `${req.method}_${req.route?.path || req.path}`;
    if (!metrics.http_request_duration_seconds[durationKey]) {
      metrics.http_request_duration_seconds[durationKey] = [];
    }
    metrics.http_request_duration_seconds[durationKey].push(duration);
    
    // Keep only last 1000 measurements per endpoint
    if (metrics.http_request_duration_seconds[durationKey].length > 1000) {
      metrics.http_request_duration_seconds[durationKey] = 
        metrics.http_request_duration_seconds[durationKey].slice(-1000);
    }
  });
  
  next();
};

// Function to update system metrics
export const updateSystemMetrics = () => {
  try {
    // Memory usage
    const memUsage = process.memoryUsage();
    metrics.memory_usage_bytes = memUsage.heapUsed;
    
    // CPU usage (simplified)
    const usage = process.cpuUsage();
    metrics.cpu_usage_percent = (usage.user + usage.system) / 1000000; // Convert to percentage
    
    // Active connections (estimated)
    metrics.active_connections = Object.keys(metrics.http_requests_total).length;
    
  } catch (error) {
    console.warn('Failed to update system metrics:', error);
  }
};

// Helper functions for metric tracking
export const trackAIGeneration = (success: boolean = true) => {
  metrics.ai_generation_requests_total++;
  if (!success) {
    metrics.ai_generation_failures_total++;
  }
};

export const trackUserSession = () => {
  metrics.user_sessions_created_total++;
};

export const trackSecurityEvent = (type: string) => {
  metrics.security_events_total[type] = (metrics.security_events_total[type] || 0) + 1;
};

export const trackAuthFailure = () => {
  metrics.auth_failures_total++;
};

export const trackRateLimit = () => {
  metrics.rate_limit_triggered_total++;
};

export const trackDatabaseConnections = (active: number, max: number = 100) => {
  metrics.database_connections_active = active;
  metrics.database_connections_max = max;
};

// Prometheus format converter
const formatPrometheusMetrics = (metrics: MetricData): string => {
  let output = '';
  
  // HTTP requests total
  output += '# HELP http_requests_total Total number of HTTP requests\n';
  output += '# TYPE http_requests_total counter\n';
  Object.entries(metrics.http_requests_total).forEach(([key, value]) => {
    const [method, path, status] = key.split('_');
    output += `http_requests_total{method="${method}",endpoint="${path}",status="${status}"} ${value}\n`;
  });
  
  // HTTP request duration (simplified histogram)
  output += '# HELP http_request_duration_seconds HTTP request duration in seconds\n';
  output += '# TYPE http_request_duration_seconds histogram\n';
  Object.entries(metrics.http_request_duration_seconds).forEach(([key, durations]) => {
    const [method, path] = key.split('_', 2);
    const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length / 1000; // Convert to seconds
    const p95 = durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)] / 1000 || 0;
    
    output += `http_request_duration_seconds{method="${method}",endpoint="${path}",quantile="0.5"} ${avg}\n`;
    output += `http_request_duration_seconds{method="${method}",endpoint="${path}",quantile="0.95"} ${p95}\n`;
  });
  
  // System metrics
  output += '# HELP memory_usage_bytes Current memory usage in bytes\n';
  output += '# TYPE memory_usage_bytes gauge\n';
  output += `memory_usage_bytes ${metrics.memory_usage_bytes}\n`;
  
  output += '# HELP cpu_usage_percent Current CPU usage percentage\n';
  output += '# TYPE cpu_usage_percent gauge\n';
  output += `cpu_usage_percent ${metrics.cpu_usage_percent}\n`;
  
  output += '# HELP active_connections Current number of active connections\n';
  output += '# TYPE active_connections gauge\n';
  output += `active_connections ${metrics.active_connections}\n`;
  
  // Database metrics
  output += '# HELP db_connections_active Current active database connections\n';
  output += '# TYPE db_connections_active gauge\n';
  output += `db_connections_active ${metrics.database_connections_active}\n`;
  
  output += '# HELP db_connections_max Maximum database connections\n';
  output += '# TYPE db_connections_max gauge\n';
  output += `db_connections_max ${metrics.database_connections_max}\n`;
  
  // AI metrics
  output += '# HELP ai_generation_requests_total Total AI generation requests\n';
  output += '# TYPE ai_generation_requests_total counter\n';
  output += `ai_generation_requests_total ${metrics.ai_generation_requests_total}\n`;
  
  output += '# HELP ai_generation_failures_total Total AI generation failures\n';
  output += '# TYPE ai_generation_failures_total counter\n';
  output += `ai_generation_failures_total ${metrics.ai_generation_failures_total}\n`;
  
  // User metrics
  output += '# HELP user_sessions_created_total Total user sessions created\n';
  output += '# TYPE user_sessions_created_total counter\n';
  output += `user_sessions_created_total ${metrics.user_sessions_created_total}\n`;
  
  // Security metrics
  output += '# HELP security_events_total Total security events by type\n';
  output += '# TYPE security_events_total counter\n';
  Object.entries(metrics.security_events_total).forEach(([type, count]) => {
    output += `security_events_total{type="${type}"} ${count}\n`;
  });
  
  output += '# HELP auth_failures_total Total authentication failures\n';
  output += '# TYPE auth_failures_total counter\n';
  output += `auth_failures_total ${metrics.auth_failures_total}\n`;
  
  output += '# HELP rate_limit_triggered_total Total rate limit triggers\n';
  output += '# TYPE rate_limit_triggered_total counter\n';
  output += `rate_limit_triggered_total ${metrics.rate_limit_triggered_total}\n`;
  
  // Application health
  output += '# HELP up Application up status\n';
  output += '# TYPE up gauge\n';
  output += `up{job="fablecraft-server"} 1\n`;
  
  return output;
};

// Metrics endpoint
router.get('/', (req: Request, res: Response) => {
  try {
    // Update system metrics before serving
    updateSystemMetrics();
    
    // Return metrics in Prometheus format
    const prometheusMetrics = formatPrometheusMetrics(metrics);
    
    res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.send(prometheusMetrics);
  } catch (error) {
    console.error('Failed to generate metrics:', error);
    res.status(500).send('# Error generating metrics\n');
  }
});

// Health endpoint for the metrics service itself
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    metrics_collected: Object.keys(metrics.http_requests_total).length,
    uptime: process.uptime()
  });
});

// Update system metrics every 15 seconds
setInterval(updateSystemMetrics, 15000);

export default router;