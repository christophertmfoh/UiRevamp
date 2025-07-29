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
  max: 20, // Increased pool size for better performance
  idleTimeoutMillis: 60000, // 60 second idle timeout (increased)
  connectionTimeoutMillis: 10000, // 10 second connection timeout (increased)
  // Removed query_timeout - causing issues with Neon
});

export const db = drizzle({ client: pool, schema });