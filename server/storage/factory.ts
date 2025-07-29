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
  // Use real database when DATABASE_URL is available and not "mock"
  if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'mock') {
    console.log('🔗 Production Mode: Connecting to real database');
    return databaseStorage;
  }
  
  // Use mock storage for development (no DATABASE_URL or DATABASE_URL=mock)
  console.log('🎨 Development Mode: Using MockStorage');
  return mockStorage;
}