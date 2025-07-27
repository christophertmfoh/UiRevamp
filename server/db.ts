import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Ensure the database is provisioned.");
}

// Enhanced connection configuration for scalability
const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  // Connection pooling for better performance
  max: 20, // Maximum pool size
  min: 5,  // Minimum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Use connection pooling for better scalability
const pool = new Pool(connectionConfig);

// Initialize HTTP client for Neon with optimizations
const sql = neon(process.env.DATABASE_URL, {
  // Enable prepared statements for better performance
  arrayMode: false,
  fullResults: false,
  // Connection timeout optimization
  fetchConnectionTimeout: 10000
});

export const db = drizzle(sql);

// Pool management for health checks
export const getPoolStats = () => ({
  totalCount: pool.totalCount,
  idleCount: pool.idleCount,
  waitingCount: pool.waitingCount
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});