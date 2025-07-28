/**
 * Simple Security Logging for Replit Development
 * Replaces complex enterprise audit trails with development-friendly logging
 */

interface SecurityEvent {
  type: 'auth' | 'api' | 'error' | 'access';
  action: string;
  details?: any;
  timestamp: Date;
  userId?: string;
}

class SimpleSecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 50; // Keep last 50 events for development

  log(type: SecurityEvent['type'], action: string, details?: any, userId?: string) {
    const event: SecurityEvent = {
      type,
      action,
      details,
      timestamp: new Date(),
      userId
    };

    this.events.unshift(event);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Simple console logging for development
    if (process.env.NODE_ENV === 'development') {
      const emoji = this.getEmoji(type);
      const userInfo = userId ? ` [User: ${userId}]` : '';
      console.log(`${emoji} Security: ${action}${userInfo}`, details || '');
    }
  }

  private getEmoji(type: SecurityEvent['type']): string {
    switch (type) {
      case 'auth': return '🔐';
      case 'api': return '🌐';
      case 'error': return '🚨';
      case 'access': return '👁️';
      default: return '📝';
    }
  }

  // Auth-specific logging methods
  logLogin(userId: string, method: string = 'password') {
    this.log('auth', `Login successful via ${method}`, { method }, userId);
  }

  logLogout(userId: string) {
    this.log('auth', 'Logout', undefined, userId);
  }

  logFailedLogin(identifier: string, reason: string) {
    this.log('auth', `Login failed: ${reason}`, { identifier, reason });
  }

  logApiAccess(endpoint: string, method: string, userId?: string) {
    this.log('api', `${method} ${endpoint}`, { method, endpoint }, userId);
  }

  logSecurityError(error: string, details?: any) {
    this.log('error', `Security error: ${error}`, details);
  }

  logSuspiciousActivity(activity: string, details?: any, userId?: string) {
    this.log('access', `Suspicious: ${activity}`, details, userId);
  }

  // Development helpers
  getRecentEvents(count: number = 10): SecurityEvent[] {
    return this.events.slice(0, count);
  }

  exportSecurityLog(): string {
    return JSON.stringify(this.events, null, 2);
  }

  clearLog() {
    this.events = [];
    console.log('🧹 Security log cleared');
  }

  // Simple security summary for development
  logSecuritySummary() {
    const summary = this.events.slice(0, 20).reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('🔒 Security Summary (Last 20 events):', summary);
  }
}

// Single instance for the app
export const securityLogger = new SimpleSecurityLogger();

// Development helper - expose to window in dev mode
if (process.env.NODE_ENV === 'development') {
  (window as any).fablecraftSecurity = {
    log: securityLogger,
    summary: () => securityLogger.logSecuritySummary(),
    clear: () => securityLogger.clearLog(),
    export: () => securityLogger.exportSecurityLog()
  };
}