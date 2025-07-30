import type { Request, Response, NextFunction } from 'express';
import { log } from '../vite';
import { performance } from 'perf_hooks';

/**
 * Concurrent API Handler for React 18 Integration
 * Optimizes API responses for concurrent rendering and Suspense boundaries
 */

interface ConcurrentAPIOptions {
  enableStreaming?: boolean;
  chunkSize?: number;
  concurrencyLimit?: number;
  timeout?: number;
}

interface StreamingResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  metadata?: any;
}

interface CachingStrategy {
  ttl: number;
  key: string;
  shouldCache: (req: Request) => boolean;
}

/**
 * Concurrent API middleware for React 18 optimized endpoints
 */
export class ConcurrentAPIHandler {
  private static cache = new Map<string, { data: any; expires: number }>();
  private static activeRequests = new Map<string, Promise<any>>();

  /**
   * Streaming middleware for large datasets
   */
  static streamingMiddleware(options: ConcurrentAPIOptions = {}) {
    const {
      enableStreaming = true,
      chunkSize = 50,
      timeout = 30000,
    } = options;

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      if (!enableStreaming || !req.query.stream) {
        next();
        return;
      }

      const startTime = performance.now();
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Transfer-Encoding', 'chunked');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('X-Streaming', 'true');

      // Store streaming context
      (req as any).streaming = {
        chunkSize,
        timeout,
        startTime,
        write: (data: any) => {
          res.write(JSON.stringify(data) + '\n');
        },
        end: () => {
          const duration = performance.now() - startTime;
          log(`📊 Streaming API completed in ${duration.toFixed(2)}ms`);
          res.end();
        },
      };

      next();
    };
  }

  /**
   * Concurrent request deduplication middleware
   */
  static deduplicationMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const requestKey = `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
      
      // Check if same request is already in progress
      const activeRequest = this.activeRequests.get(requestKey);
      if (activeRequest) {
        log(`🔄 Deduplicating concurrent request: ${requestKey}`);
        try {
          const result = await activeRequest;
          return res.json(result);
        } catch (error) {
          return res.status(500).json({ error: 'Concurrent request failed' });
        }
      }

      // Mark request as active
      const requestPromise = new Promise((resolve, reject) => {
        res.on('finish', () => {
          this.activeRequests.delete(requestKey);
          resolve(res.locals.result);
        });
        res.on('error', reject);
      });

      this.activeRequests.set(requestKey, requestPromise);
      next();
    };
  }

  /**
   * Intelligent caching middleware optimized for React 18
   */
  static cachingMiddleware(strategy: CachingStrategy) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!strategy.shouldCache(req)) {
        return next();
      }

      const cacheKey = `${strategy.key}:${JSON.stringify(req.params)}:${JSON.stringify(req.query)}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && cached.expires > Date.now()) {
        log(`💾 Cache hit: ${cacheKey}`);
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached.data);
      }

      // Override res.json to cache the response
      const originalJson = res.json.bind(res);
      res.json = function(data: any) {
        // Cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          ConcurrentAPIHandler.cache.set(cacheKey, {
            data,
            expires: Date.now() + strategy.ttl,
          });
          log(`💾 Cached: ${cacheKey} for ${strategy.ttl}ms`);
        }
        
        res.setHeader('X-Cache', 'MISS');
        return originalJson(data);
      };

      next();
    };
  }

  /**
   * Stream large character datasets for React 18 Suspense
   */
  static async streamCharacters(
    req: Request,
    res: Response,
    getCharacters: (projectId: string, cursor?: string) => Promise<StreamingResponse<any>>
  ): Promise<void> {
    const { projectId } = req.params;
    const { cursor, limit = 20 } = req.query;
    
    if (!projectId) {
      res.status(400).json({ error: 'Project ID is required' });
      return;
    }
    const streaming = (req as any).streaming;

    if (!streaming) {
      // Non-streaming response
      const result = await getCharacters(projectId, cursor as string);
      res.json(result);
      return;
    }

    try {
      streaming.write({ type: 'stream_start', timestamp: Date.now() });
      
      let currentCursor = cursor as string;
      let totalCount = 0;

      while (true) {
        const batch = await getCharacters(projectId, currentCursor);
        
        // Stream each character individually for progressive loading
        for (const character of batch.data) {
          streaming.write({
            type: 'character_data',
            data: character,
            index: totalCount++,
          });
          
          // Allow other operations to proceed
          await new Promise(resolve => setImmediate(resolve));
        }

        if (!batch.hasMore) break;
        currentCursor = batch.nextCursor;
      }

      streaming.write({
        type: 'stream_complete',
        totalCount,
        timestamp: Date.now(),
      });
      
      streaming.end();
    } catch (error) {
      log(`❌ Character streaming error: ${error}`);
      streaming.write({
        type: 'stream_error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      streaming.end();
    }
  }

  /**
   * Concurrent project loading optimized for React 18
   */
  static async concurrentProjectLoad(
    req: Request,
    res: Response,
    getProject: (id: string) => Promise<any>,
    getCharacters: (projectId: string) => Promise<any[]>,
    getOutlines: (projectId: string) => Promise<any[]>
  ): Promise<void> {
    const { projectId } = req.params;
    const startTime = performance.now();

    if (!projectId) {
      res.status(400).json({ error: 'Project ID is required' });
      return;
    }

    try {
      // Load all project data concurrently
      const [project, characters, outlines] = await Promise.all([
        getProject(projectId),
        getCharacters(projectId),
        getOutlines(projectId),
      ]);

      const loadTime = performance.now() - startTime;
      log(`⚡ Concurrent project load: ${loadTime.toFixed(2)}ms`);

      res.json({
        project,
        characters: characters.slice(0, 10), // Limit initial load for React 18
        outlines: outlines.slice(0, 5),
        metadata: {
          loadTime: Math.round(loadTime),
          totalCharacters: characters.length,
          totalOutlines: outlines.length,
          lazyLoadAvailable: characters.length > 10 || outlines.length > 5,
        },
      });
    } catch (error) {
      log(`❌ Concurrent project load failed: ${error}`);
      res.status(500).json({
        error: 'Failed to load project data',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * AI Generation with progress streaming for React 18
   */
  static async streamAIGeneration(
    req: Request,
    res: Response,
    generateFunction: (data: any, onProgress: (progress: any) => void) => Promise<any>
  ): Promise<void> {
    const streaming = (req as any).streaming;
    const { projectId, ...generationData } = req.body;

    if (!streaming) {
      // Non-streaming AI generation
      const result = await generateFunction(generationData, () => {});
      res.json(result);
      return;
    }

    try {
      streaming.write({
        type: 'generation_start',
        projectId,
        timestamp: Date.now(),
      });

      let progressCount = 0;
      const result = await generateFunction(generationData, (progress) => {
        streaming.write({
          type: 'generation_progress',
          progress,
          step: ++progressCount,
          timestamp: Date.now(),
        });
      });

      streaming.write({
        type: 'generation_complete',
        result,
        totalSteps: progressCount,
        timestamp: Date.now(),
      });

      streaming.end();
    } catch (error) {
      log(`❌ AI generation streaming error: ${error}`);
      streaming.write({
        type: 'generation_error',
        error: error instanceof Error ? error.message : 'Generation failed',
      });
      streaming.end();
    }
  }

  /**
   * Performance monitoring middleware
   */
  static performanceMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = performance.now();
      const startMemory = process.memoryUsage();

      res.on('finish', () => {
        const duration = performance.now() - startTime;
        const endMemory = process.memoryUsage();
        const memoryDelta = endMemory.heapUsed - startMemory.heapUsed;

        if (duration > 1000) {
          log(`🐌 Slow API: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
        }

        if (memoryDelta > 10 * 1024 * 1024) { // 10MB
          log(`🚨 High memory usage: ${req.method} ${req.path} used ${(memoryDelta / 1024 / 1024).toFixed(2)}MB`);
        }

        // Add performance headers for React 18 debugging
        res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);
        res.setHeader('X-Memory-Delta', `${(memoryDelta / 1024).toFixed(2)}KB`);
      });

      next();
    };
  }

  /**
   * Clear expired cache entries
   */
  static cleanupCache(): void {
    const now = Date.now();
    const expired: string[] = [];

    this.cache.forEach((entry, key) => {
      if (entry.expires <= now) {
        expired.push(key);
      }
    });

    expired.forEach(key => this.cache.delete(key));
    
    if (expired.length > 0) {
      log(`🧹 Cleaned up ${expired.length} expired cache entries`);
    }
  }

  /**
   * Get cache and performance statistics
   */
  static getStats(): object {
    return {
      cacheSize: this.cache.size,
      activeRequests: this.activeRequests.size,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
    };
  }
}

/**
 * Setup automatic cache cleanup
 */
setInterval(() => {
  ConcurrentAPIHandler.cleanupCache();
}, 60000); // Clean every minute

export default ConcurrentAPIHandler;