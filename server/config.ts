/**
 * Centralized Configuration Management
 * Environment-based settings for development, staging, and production
 */

export interface AppConfig {
  database: {
    maxConnections: number;
    idleTimeout: number;
    connectionTimeout: number;
    enableLogging: boolean;
  };
  ai: {
    maxRequests: number;
    windowMs: number;
    burstLimit: number;
    burstWindow: number;
    cacheMaxAge: number;
    maxCacheSize: number;
  };
  api: {
    requestLimit: string;
    corsOrigins: string[];
    enableDetailedLogging: boolean;
    cacheMaxAge: number;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
  };
}

const configs: Record<string, AppConfig> = {
  development: {
    database: {
      maxConnections: process.env.REPL_ID ? 3 : 5, // Replit optimization
      idleTimeout: 30000,
      connectionTimeout: process.env.REPL_ID ? 15000 : 10000, // Higher for Replit
      enableLogging: !process.env.REPL_ID, // Disable logging in Replit for performance
    },
    ai: {
      maxRequests: 8,
      windowMs: 60000,
      burstLimit: 3,
      burstWindow: 10000,
      cacheMaxAge: 1000 * 60 * 5, // 5 minutes in dev
      maxCacheSize: 50,
    },
    api: {
      requestLimit: '50mb',
      corsOrigins: ['http://localhost:3000', 'http://localhost:5000'],
      enableDetailedLogging: true,
      cacheMaxAge: 300, // 5 minutes
    },
    upload: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ],
    },
  },
  production: {
    database: {
      maxConnections: process.env.REPL_ID ? 5 : 20, // Replit memory constraints
      idleTimeout: 30000,
      connectionTimeout: process.env.REPL_ID ? 15000 : 10000,
      enableLogging: false,
    },
    ai: {
      maxRequests: 15,
      windowMs: 60000,
      burstLimit: 5,
      burstWindow: 10000,
      cacheMaxAge: 1000 * 60 * 15, // 15 minutes in prod
      maxCacheSize: 200,
    },
    api: {
      requestLimit: '50mb',
      corsOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
      enableDetailedLogging: false,
      cacheMaxAge: 3600, // 1 hour
    },
    upload: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/rtf'
      ],
    },
  },
  staging: {
    database: {
      maxConnections: 10,
      idleTimeout: 30000,
      connectionTimeout: 10000,
      enableLogging: true,
    },
    ai: {
      maxRequests: 10,
      windowMs: 60000,
      burstLimit: 4,
      burstWindow: 10000,
      cacheMaxAge: 1000 * 60 * 10, // 10 minutes in staging
      maxCacheSize: 100,
    },
    api: {
      requestLimit: '50mb',
      corsOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
      enableDetailedLogging: true,
      cacheMaxAge: 1800, // 30 minutes
    },
    upload: {
      maxFileSize: 25 * 1024 * 1024, // 25MB
      allowedTypes: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ],
    },
  },
};

export function getConfig(): AppConfig {
  const env = process.env.NODE_ENV || 'development';
  return configs[env] || configs.development;
}

export const config = getConfig();