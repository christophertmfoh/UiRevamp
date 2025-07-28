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

// Optimized connection pool for A-grade performance
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Increase pool size for better concurrent handling
  idleTimeoutMillis: 30000, // 30 second idle timeout
  connectionTimeoutMillis: 2000, // 2 second connection timeout
  query_timeout: 1000, // 1 second query timeout for fast failure
});

export const db = drizzle({ client: pool, schema });