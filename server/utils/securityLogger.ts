/**
 * Security Logger Utility
 * Provides secure, auditable logging with sensitive data redaction
 */

export interface AuthEvent {
  timestamp: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'TOKEN_REFRESH' | 'REGISTRATION';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface APIEvent {
  timestamp: string;
  method: string;
  endpoint: string;
  userId?: string;
  ipAddress: string;
  responseStatus: number;
  responseTime: number;
  requestSize?: number;
  responseSize?: number;
}

export interface SecurityEvent {
  timestamp: string;
  eventType: 'RATE_LIMIT_EXCEEDED' | 'INVALID_TOKEN' | 'SUSPICIOUS_ACTIVITY' | 'API_KEY_VALIDATION' | 'UNAUTHORIZED_ACCESS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  userId?: string;
  ipAddress: string;
  details: Record<string, any>;
  actionTaken?: string;
}

export interface SystemEvent {
  timestamp: string;
  eventType: 'SERVICE_START' | 'SERVICE_STOP' | 'ERROR' | 'WARNING' | 'INFO';
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

export class SecurityLogger {
  private static sensitiveFields = [
    'password',
    'token',
    'apiKey',
    'api_key',
    'secret',
    'jwt',
    'authorization',
    'cookie',
    'session',
    'credential',
    'key'
  ];

  private static redactSensitive(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.redactSensitive(item));
    }

    const redacted: any = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = this.sensitiveFields.some(field => 
        lowerKey.includes(field.toLowerCase())
      );

      if (isSensitive) {
        if (typeof value === 'string') {
          redacted[key] = value.length > 0 ? '[REDACTED]' : '';
        } else {
          redacted[key] = '[REDACTED]';
        }
      } else if (typeof value === 'object') {
        redacted[key] = this.redactSensitive(value);
      } else {
        redacted[key] = value;
      }
    }

    return redacted;
  }

  private static formatLogEntry(type: string, data: any): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type,
      environment: process.env.NODE_ENV || 'development',
      ...this.redactSensitive(data)
    };

    return JSON.stringify(logEntry);
  }

  private static writeLog(logEntry: string, severity: 'INFO' | 'WARN' | 'ERROR' = 'INFO'): void {
    switch (severity) {
      case 'ERROR':
        console.error(logEntry);
        break;
      case 'WARN':
        console.warn(logEntry);
        break;
      default:
        console.log(logEntry);
    }

    // In production, you would also write to external logging service
    // e.g., Winston, Bunyan, or cloud logging service
  }

  // Authentication event logging
  static logAuthEvent(event: Omit<AuthEvent, 'timestamp'>): void {
    const fullEvent: AuthEvent = {
      timestamp: new Date().toISOString(),
      ...event
    };

    const logEntry = this.formatLogEntry('AUTH_EVENT', fullEvent);
    this.writeLog(logEntry);

    // Alert on failed logins
    if (event.eventType === 'FAILED_LOGIN') {
      this.checkFailedLoginPattern(event.ipAddress);
    }
  }

  // API access event logging
  static logAPIEvent(event: Omit<APIEvent, 'timestamp'>): void {
    const fullEvent: APIEvent = {
      timestamp: new Date().toISOString(),
      ...event
    };

    const logEntry = this.formatLogEntry('API_EVENT', fullEvent);
    const severity = event.responseStatus >= 400 ? 'WARN' : 'INFO';
    this.writeLog(logEntry, severity);
  }

  // Security event logging
  static logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      timestamp: new Date().toISOString(),
      ...event
    };

    const logEntry = this.formatLogEntry('SECURITY_EVENT', fullEvent);
    const severity = event.severity === 'CRITICAL' || event.severity === 'HIGH' ? 'ERROR' : 'WARN';
    this.writeLog(logEntry, severity);

    // Alert on high/critical events
    if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
      this.alertSecurityTeam(fullEvent);
    }
  }

  // System event logging
  static logSystemEvent(event: Omit<SystemEvent, 'timestamp'>): void {
    const fullEvent: SystemEvent = {
      timestamp: new Date().toISOString(),
      ...event
    };

    const logEntry = this.formatLogEntry('SYSTEM_EVENT', fullEvent);
    const severity = event.eventType === 'ERROR' ? 'ERROR' : 'INFO';
    this.writeLog(logEntry, severity);
  }

  // API Key validation logging (replaces insecure console.log)
  static logAPIKeyValidation(service: 'gemini' | 'openai', isValid: boolean, keyPresent: boolean): void {
    this.logSecurityEvent({
      eventType: 'API_KEY_VALIDATION',
      severity: isValid ? 'LOW' : 'MEDIUM',
      ipAddress: 'localhost', // Server-side validation
      details: {
        service,
        keyPresent,
        isValid,
        formatValid: isValid
      },
      actionTaken: isValid ? 'Service initialized' : 'Service initialization failed'
    });
  }

  // Rate limiting event
  static logRateLimitExceeded(ipAddress: string, endpoint: string, userId?: string): void {
    this.logSecurityEvent({
      eventType: 'RATE_LIMIT_EXCEEDED',
      severity: 'MEDIUM',
      ipAddress,
      userId,
      details: {
        endpoint,
        message: 'Rate limit exceeded'
      },
      actionTaken: 'Request blocked'
    });
  }

  // Suspicious activity detection
  static logSuspiciousActivity(ipAddress: string, activity: string, details: Record<string, any>): void {
    this.logSecurityEvent({
      eventType: 'SUSPICIOUS_ACTIVITY',
      severity: 'HIGH',
      ipAddress,
      details: {
        activity,
        ...details
      },
      actionTaken: 'Activity logged for investigation'
    });
  }

  // Failed login pattern detection
  private static failedLoginAttempts = new Map<string, number>();
  private static checkFailedLoginPattern(ipAddress: string): void {
    const attempts = this.failedLoginAttempts.get(ipAddress) || 0;
    const newAttempts = attempts + 1;
    this.failedLoginAttempts.set(ipAddress, newAttempts);

    // Alert after 5 failed attempts
    if (newAttempts >= 5) {
      this.logSuspiciousActivity(ipAddress, 'Multiple failed login attempts', {
        attemptCount: newAttempts,
        timeWindow: '5 minutes'
      });
    }

    // Clear old attempts every 5 minutes
    setTimeout(() => {
      this.failedLoginAttempts.delete(ipAddress);
    }, 5 * 60 * 1000);
  }

  // Security team alerting (placeholder for external integration)
  private static alertSecurityTeam(event: SecurityEvent): void {
    // In production, this would integrate with:
    // - Slack notifications
    // - PagerDuty alerts
    // - Email notifications
    // - SIEM systems
    
    this.logSystemEvent({
      eventType: 'WARNING',
      service: 'SecurityAlert',
      message: `Security alert triggered: ${event.eventType}`,
      metadata: {
        severity: event.severity,
        eventId: `sec-${Date.now()}`,
        requiresResponse: event.severity === 'CRITICAL'
      }
    });
  }

  // Development helper for secure logging
  static dev(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.logSystemEvent({
        eventType: 'INFO',
        service: 'Development',
        message,
        metadata: data ? this.redactSensitive(data) : undefined
      });
    }
  }

  // Secure replacement for console.log in production
  static info(message: string, data?: any): void {
    this.logSystemEvent({
      eventType: 'INFO',
      service: 'Application',
      message,
      metadata: data ? this.redactSensitive(data) : undefined
    });
  }

  // Secure replacement for console.warn
  static warn(message: string, data?: any): void {
    this.logSystemEvent({
      eventType: 'WARNING',
      service: 'Application',
      message,
      metadata: data ? this.redactSensitive(data) : undefined
    });
  }

  // Secure replacement for console.error
  static error(message: string, error?: Error | any): void {
    this.logSystemEvent({
      eventType: 'ERROR',
      service: 'Application',
      message,
      metadata: error ? {
        errorMessage: error.message || error,
        errorStack: error.stack,
        errorName: error.name
      } : undefined
    });
  }
}

// Express middleware for API event logging
export function apiLoggingMiddleware(req: any, res: any, next: any): void {
  const startTime = Date.now();
  
  // Capture original end function
  const originalEnd = res.end;
  
  res.end = function(chunk: any, encoding: any) {
    const responseTime = Date.now() - startTime;
    
    SecurityLogger.logAPIEvent({
      method: req.method,
      endpoint: req.path,
      userId: req.user?.id,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      responseStatus: res.statusCode,
      responseTime,
      requestSize: req.get('content-length') ? parseInt(req.get('content-length')) : undefined,
      responseSize: chunk ? Buffer.byteLength(chunk, encoding) : undefined
    });
    
    // Call original end function
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

// Rate limiting helper
export function createRateLimitHandler() {
  return (req: any, res: any) => {
    SecurityLogger.logRateLimitExceeded(
      req.ip || req.connection.remoteAddress || 'unknown',
      req.path,
      req.user?.id
    );
    
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.'
    });
  };
}

export default SecurityLogger;