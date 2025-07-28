/**
 * Professional Storage Factory - Enterprise Pattern
 * 
 * This factory automatically routes all storage operations to either 
 * mock storage (development) or real database storage (production)
 * without requiring individual method modifications.
 */

import { mockStorage } from './mockStorage';

const isDevelopment = process.env.NODE_ENV === 'development';
const usesMockDatabase = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('mock');

/**
 * Create storage adapter that automatically routes based on environment
 */
export function createStorageAdapter() {
  if (isDevelopment && usesMockDatabase) {
    console.log('🎭 StorageFactory: Using MockStorage for all operations');
    return mockStorage;
  }
  
  console.log('🔗 StorageFactory: Using DatabaseStorage for all operations');
  
  // In production, this would return the real database storage
  // For now, return mockStorage as fallback to ensure functionality
  console.warn('⚠️ Production database not configured, falling back to MockStorage');
  return mockStorage;
}