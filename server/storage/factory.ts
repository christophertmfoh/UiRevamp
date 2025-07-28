/**
 * Replit-Native Storage Adapter
 * 
 * Simple storage routing optimized for creative development workflow.
 * Automatically uses mock storage for fast iteration in Replit environment.
 */

import { mockStorage } from './mockStorage';

const isReplitEnvironment = !!process.env.REPL_ID || process.env.NODE_ENV === 'development';

/**
 * Create storage adapter optimized for creative development workflow
 */
export function createStorageAdapter() {
  if (isReplitEnvironment) {
    console.log('🎨 Replit Storage: Using MockStorage for creative development');
    return mockStorage;
  }
  
  // For deployed environments, could connect to real database
  console.log('📊 Production Storage: Using MockStorage (real database not configured)');
  return mockStorage;
}