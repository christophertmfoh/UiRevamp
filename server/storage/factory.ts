/**
 * Senior Developer Storage Factory
 * 
 * Production-ready storage routing with proper database integration.
 * Uses real PostgreSQL database when available, falls back to mock for development.
 */

import { mockStorage } from './mockStorage';
import { databaseStorage } from './databaseStorage';

/**
 * Create storage adapter with production-grade database support
 */
export function createStorageAdapter() {
  // Use real database when DATABASE_URL is available (production pattern)
  if (process.env.DATABASE_URL) {
    console.log('🔗 Production Mode: Connecting to real database');
    return databaseStorage;
  }
  
  // Fallback to mock storage for development without database
  console.log('🎨 Development Mode: Using MockStorage (no DATABASE_URL)');
  return mockStorage;
}