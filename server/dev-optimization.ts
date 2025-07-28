import { Request, Response, NextFunction } from 'express';

/**
 * Phase 5: Development Server Optimization
 * In-memory caching and performance optimizations for creative workflow
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class DevCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 100; // Prevent memory bloat
  
  set(key: string, data: any, ttl: number = 60000): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

const devCache = new DevCache();

/**
 * Middleware for caching API responses in development
 */
export const devCacheMiddleware = (ttl: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache in development
    if (process.env.NODE_ENV !== 'development') {
      return next();
    }
    
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Don't cache health checks
    if (req.path === '/api/health') {
      return next();
    }
    
    const cacheKey = `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
    const cached = devCache.get(cacheKey);
    
    if (cached) {
      console.log(`📦 Cache hit: ${cacheKey}`);
      return res.json(cached);
    }
    
    // Intercept res.json to cache the response
    const originalJson = res.json;
    res.json = function(data: any) {
      if (res.statusCode === 200) {
        devCache.set(cacheKey, data, ttl);
        console.log(`💾 Cached: ${cacheKey}`);
      }
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Static asset optimization for development
 */
export const optimizeStaticAssets = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Add cache headers for static assets in development
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    }
    
    next();
  };
};

/**
 * Performance monitoring middleware
 */
export const performanceMonitoring = () => {
  const requestTimes = new Map<string, number>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const key = `${req.method} ${req.path}`;
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      requestTimes.set(key, duration);
      
      // Warn about slow requests
      if (duration > 1000) {
        console.warn(`🐌 Slow request: ${key} took ${duration}ms`);
      }
      
      // Log performance metrics for creative workflow optimization
      if (req.path.includes('/characters') || req.path.includes('/projects')) {
        console.log(`⏱️  Creative API: ${key} ${duration}ms`);
      }
    });
    
    next();
  };
};

/**
 * Memory usage monitoring for development
 */
export const memoryMonitoring = () => {
  let lastCheck = Date.now();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    
    // Check memory every 30 seconds
    if (now - lastCheck > 30000) {
      const usage = process.memoryUsage();
      const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
      
      console.log(`🧠 Memory: ${heapUsedMB}MB used / ${heapTotalMB}MB total`);
      
      // Warn if memory usage is high
      if (heapUsedMB > 150) {
        console.warn(`⚠️  High memory usage: ${heapUsedMB}MB`);
      }
      
      lastCheck = now;
    }
    
    next();
  };
};

/**
 * Clear development cache (useful for debugging)
 */
export const clearDevCache = (): void => {
  devCache.clear();
  console.log('🗑️  Development cache cleared');
};

/**
 * Get development cache statistics
 */
export const getDevCacheStats = () => {
  return {
    size: devCache.size(),
    maxSize: 100
  };
};