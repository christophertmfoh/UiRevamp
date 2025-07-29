import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Only create database connection for real databases, not mock
let pool: Pool | null = null;
let db: any = null;

if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'mock') {
  // Skip database initialization when using mock storage
  console.log('📦 Skipping database connection - using MockStorage');
} else {
  // A-grade performance: Optimized connection pool with proper timeouts
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 10, // Reasonable pool size for development
    idleTimeoutMillis: 30000, // 30 second idle timeout
    connectionTimeoutMillis: 5000, // 5 second connection timeout
    // Removed query_timeout - causing issues with Neon
  });
  
  db = drizzle({ client: pool, schema });
}

export { pool, db };