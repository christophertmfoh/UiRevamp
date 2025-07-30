/**
 * Enterprise Structured Logging System
 * Replaces console.log with proper structured logging
 */

import { Request, Response } from 'express';

interface LogContext {
  requestId: string;
  userId?: string;
  service: string;
  environment: string;
  timestamp: string;
}

interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context: LogContext;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack: string;
    code?: string;
  };
}

class StructuredLogger {
  private service: string;
  private environment: string;

  constructor(service: string = 'fablecraft-api') {
    this.service = service;
    this.environment = process.env.NODE_ENV || 'development';
  }

  private createContext(req?: Request): LogContext {
    return {
      requestId: req?.headers['x-request-id'] as string || this.generateRequestId(),
      userId: req?.user?.id,
      service: this.service,
      environment: this.environment,
      timestamp: new Date().toISOString(),
    };
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatLog(entry: LogEntry): string {
    if (this.environment === 'development') {
      // Human-readable format for development
      const timestamp = new Date(entry.context.timestamp).toLocaleTimeString();
      const level = entry.level.toUpperCase().padEnd(5);
      const service = entry.context.service;
      const requestId = entry.context.requestId.split('_')[2] || 'unknown';
      
      let logLine = `${timestamp} [${level}] ${service}:${requestId} ${entry.message}`;
      
      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        logLine += ` ${JSON.stringify(entry.metadata)}`;
      }
      
      if (entry.error) {
        logLine += `\nError: ${entry.error.name}: ${entry.error.message}`;
        if (entry.error.stack) {
          logLine += `\nStack: ${entry.error.stack}`;
        }
      }
      
      return logLine;
    } else {
      // JSON format for production (structured logging)
      return JSON.stringify(entry);
    }
  }

  private log(level: LogEntry['level'], message: string, metadata?: Record<string, unknown>, req?: Request, error?: Error) {
    const context = this.createContext(req);
    
    const entry: LogEntry = {
      level,
      message,
      context,
      metadata,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack || '',
          code: (error as any).code,
        }
      }),
    };

    const formattedLog = this.formatLog(entry);
    
    // Output to appropriate stream
    if (level === 'error') {
      console.error(formattedLog);
    } else {
      console.log(formattedLog);
    }

    // In production, send to external logging service (Datadog, New Relic, etc.)
    if (this.environment === 'production') {
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // Integration point for external logging services
    // Example: Datadog, New Relic, Sentry, etc.
    // For now, just a placeholder
  }

  debug(message: string, metadata?: Record<string, unknown>, req?: Request) {
    this.log('debug', message, metadata, req);
  }

  info(message: string, metadata?: Record<string, unknown>, req?: Request) {
    this.log('info', message, metadata, req);
  }

  warn(message: string, metadata?: Record<string, unknown>, req?: Request) {
    this.log('warn', message, metadata, req);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>, req?: Request) {
    this.log('error', message, metadata, req, error);
  }

  // Performance logging
  performance(operation: string, duration: number, metadata?: Record<string, unknown>, req?: Request) {
    this.info(`Performance: ${operation}`, {
      operation,
      duration_ms: duration,
      ...metadata,
    }, req);
  }

  // Database query logging
  query(query: string, duration: number, rowCount?: number, req?: Request) {
    this.debug('Database Query', {
      query_type: query.split(' ')[0]?.toUpperCase(),
      duration_ms: duration,
      row_count: rowCount,
      query: process.env.NODE_ENV === 'development' ? query : undefined,
    }, req);
  }

  // User action logging
  userAction(action: string, userId: string, metadata?: Record<string, unknown>, req?: Request) {
    this.info(`User Action: ${action}`, {
      action,
      user_id: userId,
      ...metadata,
    }, req);
  }

  // Security event logging
  security(event: string, severity: 'low' | 'medium' | 'high' | 'critical', metadata?: Record<string, unknown>, req?: Request) {
    this.warn(`Security Event: ${event}`, {
      event,
      severity,
      ip_address: req?.ip,
      user_agent: req?.headers['user-agent'],
      ...metadata,
    }, req);
  }
}

// Singleton instance
export const logger = new StructuredLogger();

// Express middleware for request logging
export function requestLoggingMiddleware(req: Request, res: Response, next: Function) {
  const startTime = Date.now();
  
  // Generate request ID if not present
  if (!req.headers['x-request-id']) {
    req.headers['x-request-id'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log incoming request
  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    user_agent: req.headers['user-agent'],
    content_length: req.headers['content-length'],
  }, req);

  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - startTime;
    
    logger.info('Outgoing Response', {
      method: req.method,
      url: req.url,
      status_code: res.statusCode,
      duration_ms: duration,
      response_size: JSON.stringify(body).length,
    }, req);

    return originalJson.call(this, body);
  };

  next();
}

// Performance monitoring decorator
export function logPerformance(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const startTime = Date.now();
    const className = target.constructor.name;
    
    try {
      const result = await method.apply(this, args);
      const duration = Date.now() - startTime;
      
      logger.performance(`${className}.${propertyName}`, duration, {
        success: true,
        args_count: args.length,
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error(`${className}.${propertyName} failed`, error as Error, {
        duration_ms: duration,
        args_count: args.length,
      });
      
      throw error;
    }
  };

  return descriptor;
}

// Database query performance decorator (enhanced)
export function logDatabaseQuery(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const startTime = Date.now();
    const className = target.constructor.name;
    
    try {
      const result = await method.apply(this, args);
      const duration = Date.now() - startTime;
      
      // Enhanced database logging
      const rowCount = Array.isArray(result) ? result.length : result ? 1 : 0;
      const operation = propertyName.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
      
      logger.query(`${className}.${propertyName}`, duration, rowCount);
      
      // Flag slow queries
      if (duration > 1000) {
        logger.warn('Slow Database Query Detected', {
          operation,
          duration_ms: duration,
          row_count: rowCount,
          class: className,
          method: propertyName,
        });
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error(`Database query failed: ${className}.${propertyName}`, error as Error, {
        duration_ms: duration,
        operation: propertyName,
      });
      
      throw error;
    }
  };

  return descriptor;
}