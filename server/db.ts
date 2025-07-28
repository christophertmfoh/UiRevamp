import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// A-grade performance: Optimized connection pool with proper timeouts
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 10, // Reasonable pool size for development
  idleTimeoutMillis: 30000, // 30 second idle timeout
  connectionTimeoutMillis: 5000, // 5 second connection timeout
  // Removed query_timeout - causing issues with Neon
});

export const db = drizzle({ client: pool, schema });