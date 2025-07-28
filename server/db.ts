import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Professional database connection with environment-aware configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const DATABASE_URL = process.env.DATABASE_URL;
const usesMockDatabase = !DATABASE_URL || DATABASE_URL.includes('mock');

// Professional database initialization with proper TypeScript handling
let pool: Pool | null = null;
let db: any = null;

if (isDevelopment && usesMockDatabase) {
  console.log("🎭 Development Mode: Using MockStorage instead of database connection");
  console.log("⚠️  Database-dependent features will use in-memory storage");
  
  // Create minimal interface compatibility - storage layer handles routing
  pool = null;
  db = null;
} else {
  console.log("🔗 Production Mode: Connecting to real database");
  
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required in production environment");
  }
  
  neonConfig.webSocketConstructor = ws;
  pool = new Pool({ connectionString: DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

// Export the initialized values
export { pool, db };