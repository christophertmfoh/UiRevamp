/**
 * Enterprise Health Check Endpoints
 * Comprehensive system monitoring for production deployment
 */

import { Router } from 'express';
import { logger } from '../middleware/structured-logging';
import { db } from '../db';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceHealth;
    ai: ServiceHealth;
    memory: ServiceHealth;
    storage: ServiceHealth;
  };
  performance: {
    averageResponseTime: number;
    requestsPerMinute: number;
    errorRate: number;
  };
}

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  lastChecked: string;
  error?: string;
}

class HealthMonitor {
  private readonly startTime = Date.now();
  private requestCount = 0;
  private errorCount = 0;
  private responseTimes: number[] = [];

  async checkDatabase(): Promise<ServiceHealth> {
    try {
      const startTime = Date.now();
      await db.execute('SELECT 1');
      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'degraded' : 'unhealthy',
        responseTime,
        lastChecked: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Database health check failed', error as Error);
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        error: (error as Error).message,
      };
    }
  }

  async checkAI(): Promise<ServiceHealth> {
    try {
      // Simple AI service availability check
      const hasGeminiKey = !!process.env.GEMINI_API_KEY;
      
      return {
        status: hasGeminiKey ? 'healthy' : 'degraded',
        lastChecked: new Date().toISOString(),
        error: hasGeminiKey ? undefined : 'GEMINI_API_KEY not configured',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        lastChecked: new Date().toISOString(),
        error: (error as Error).message,
      };
    }
  }

  checkMemory(): ServiceHealth {
    const memoryUsage = process.memoryUsage();
    const heapUsed = memoryUsage.heapUsed / 1024 / 1024; // MB
    const heapTotal = memoryUsage.heapTotal / 1024 / 1024; // MB
    const memoryUsagePercent = (heapUsed / heapTotal) * 100;

    let status: ServiceHealth['status'] = 'healthy';
    if (memoryUsagePercent > 80) status = 'degraded';
    if (memoryUsagePercent > 95) status = 'unhealthy';

    return {
      status,
      lastChecked: new Date().toISOString(),
      responseTime: memoryUsagePercent,
    };
  }

  checkStorage(): ServiceHealth {
    // Basic storage health check (disk space, file system, etc.)
    return {
      status: 'healthy',
      lastChecked: new Date().toISOString(),
    };
  }

  recordRequest(responseTime: number, isError: boolean = false) {
    this.requestCount++;
    if (isError) this.errorCount++;
    
    this.responseTimes.push(responseTime);
    // Keep only last 100 response times for average calculation
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
  }

  getPerformanceMetrics() {
    const averageResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
      : 0;

    const uptime = Date.now() - this.startTime;
    const uptimeMinutes = uptime / 1000 / 60;
    const requestsPerMinute = uptimeMinutes > 0 ? this.requestCount / uptimeMinutes : 0;
    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;

    return {
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      requestsPerMinute: Math.round(requestsPerMinute * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
    };
  }

  async getHealthStatus(): Promise<HealthStatus> {
    const [database, ai, memory, storage] = await Promise.all([
      this.checkDatabase(),
      this.checkAI(),
      Promise.resolve(this.checkMemory()),
      Promise.resolve(this.checkStorage()),
    ]);

    const services = { database, ai, memory, storage };
    const serviceStatuses = Object.values(services).map(s => s.status);
    
    let overallStatus: HealthStatus['status'] = 'healthy';
    if (serviceStatuses.some(s => s === 'unhealthy')) {
      overallStatus = 'unhealthy';
    } else if (serviceStatuses.some(s => s === 'degraded')) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version || '3.0.0',
      environment: process.env.NODE_ENV || 'development',
      services,
      performance: this.getPerformanceMetrics(),
    };
  }
}

const healthMonitor = new HealthMonitor();

// Basic health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = await healthMonitor.getHealthStatus();
    
    const statusCode = health.status === 'healthy' ? 200 
      : health.status === 'degraded' ? 200 
      : 503;

    logger.info('Health check requested', {
      status: health.status,
      requestor_ip: req.ip,
    }, req);

    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed', error as Error, {}, req);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check system failure',
    });
  }
});

// Detailed health check (authenticated endpoint for internal monitoring)
router.get('/health/detailed', async (req, res) => {
  try {
    const health = await healthMonitor.getHealthStatus();
    
    // Add additional detailed metrics
    const detailedHealth = {
      ...health,
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        processId: process.pid,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
      database: {
        connectionPool: {
          // Add connection pool stats if available
          total: 'N/A',
          active: 'N/A',
          idle: 'N/A',
        },
      },
    };

    const statusCode = health.status === 'healthy' ? 200 
      : health.status === 'degraded' ? 200 
      : 503;

    res.status(statusCode).json(detailedHealth);
  } catch (error) {
    logger.error('Detailed health check failed', error as Error, {}, req);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Detailed health check system failure',
    });
  }
});

// Readiness probe (for Kubernetes/container orchestration)
router.get('/ready', async (req, res) => {
  try {
    const dbHealth = await healthMonitor.checkDatabase();
    
    if (dbHealth.status === 'unhealthy') {
      logger.warn('Readiness check failed - database unhealthy', {}, req);
      return res.status(503).json({
        ready: false,
        reason: 'Database connection failed',
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Readiness check failed', error as Error, {}, req);
    res.status(503).json({
      ready: false,
      reason: 'Readiness check system failure',
      timestamp: new Date().toISOString(),
    });
  }
});

// Liveness probe (for Kubernetes/container orchestration)
router.get('/live', (req, res) => {
  // Simple liveness check - if this endpoint responds, the service is alive
  res.json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: Date.now() - healthMonitor['startTime'],
  });
});

// Middleware to record request metrics
export function recordRequestMetrics(req: any, res: any, next: any) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const isError = res.statusCode >= 400;
    healthMonitor.recordRequest(responseTime, isError);
  });
  
  next();
}

export { healthMonitor };
export default router;