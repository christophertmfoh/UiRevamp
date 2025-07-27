/**
 * Performance Monitoring and Health Checks
 * Tracks API performance, database health, and system metrics
 */

import { Request, Response, NextFunction } from 'express';
import { pool } from './db';

interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  apiEndpoints: Map<string, {
    count: number;
    totalTime: number;
    errors: number;
  }>;
  lastReset: Date;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    requestCount: 0,
    averageResponseTime: 0,
    errorRate: 0,
    apiEndpoints: new Map(),
    lastReset: new Date(),
  };

  private startTimes = new Map<string, number>();

  // Middleware to track request performance
  trackRequest() {
    return (req: Request, res: Response, next: NextFunction) => {
      const requestId = `${req.method}:${req.path}:${Date.now()}`;
      const startTime = Date.now();
      
      this.startTimes.set(requestId, startTime);

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.recordRequest(req.method, req.path, duration, res.statusCode >= 400);
        this.startTimes.delete(requestId);
      });

      next();
    };
  }

  private recordRequest(method: string, path: string, duration: number, isError: boolean) {
    const endpoint = `${method} ${path}`;
    
    this.metrics.requestCount++;
    
    // Update endpoint-specific metrics
    const endpointMetrics = this.metrics.apiEndpoints.get(endpoint) || {
      count: 0,
      totalTime: 0,
      errors: 0,
    };

    endpointMetrics.count++;
    endpointMetrics.totalTime += duration;
    if (isError) endpointMetrics.errors++;

    this.metrics.apiEndpoints.set(endpoint, endpointMetrics);

    // Update global metrics
    this.updateGlobalMetrics();
  }

  private updateGlobalMetrics() {
    let totalTime = 0;
    let totalErrors = 0;

    for (const endpoint of this.metrics.apiEndpoints.values()) {
      totalTime += endpoint.totalTime;
      totalErrors += endpoint.errors;
    }

    this.metrics.averageResponseTime = this.metrics.requestCount > 0 
      ? totalTime / this.metrics.requestCount 
      : 0;
    
    this.metrics.errorRate = this.metrics.requestCount > 0 
      ? (totalErrors / this.metrics.requestCount) * 100 
      : 0;
  }

  // Get current performance metrics
  getMetrics() {
    const endpointStats = Array.from(this.metrics.apiEndpoints.entries()).map(
      ([endpoint, stats]) => ({
        endpoint,
        count: stats.count,
        averageTime: stats.count > 0 ? stats.totalTime / stats.count : 0,
        errorRate: stats.count > 0 ? (stats.errors / stats.count) * 100 : 0,
      })
    );

    return {
      ...this.metrics,
      endpoints: endpointStats,
      uptime: Date.now() - this.metrics.lastReset.getTime(),
    };
  }

  // Reset metrics (useful for monitoring periods)
  resetMetrics() {
    this.metrics = {
      requestCount: 0,
      averageResponseTime: 0,
      errorRate: 0,
      apiEndpoints: new Map(),
      lastReset: new Date(),
    };
  }
}

// Health check functions
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    // Simple query to test database connectivity
    await pool.query('SELECT 1');
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getSystemHealth() {
  const [dbHealth] = await Promise.all([
    checkDatabaseHealth(),
  ]);

  const memoryUsage = process.memoryUsage();
  
  return {
    timestamp: new Date().toISOString(),
    status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
    database: dbHealth,
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      external: Math.round(memoryUsage.external / 1024 / 1024), // MB
    },
    uptime: Math.round(process.uptime()),
  };
}

// Singleton performance monitor
export const performanceMonitor = new PerformanceMonitor();

// Express routes for monitoring
export function addMonitoringRoutes(app: any) {
  // Health check endpoint
  app.get('/health', async (req: Request, res: Response) => {
    try {
      const health = await getSystemHealth();
      const statusCode = health.status === 'healthy' ? 200 : 503;
      res.status(statusCode).json(health);
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Performance metrics endpoint (should be protected in production)
  app.get('/metrics', (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production' && !req.headers.authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    res.json(performanceMonitor.getMetrics());
  });

  // Reset metrics endpoint (should be protected)
  app.post('/metrics/reset', (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production' && !req.headers.authorization) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    performanceMonitor.resetMetrics();
    res.json({ message: 'Metrics reset successfully' });
  });
}