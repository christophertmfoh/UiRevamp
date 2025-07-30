#!/usr/bin/env tsx

/**
 * Senior Developer Database Setup Script
 * 
 * Handles database schema creation and migration without user prompts.
 * This ensures consistent database state across all environments.
 */

import { execSync } from 'child_process';

console.log('🚀 Setting up production database...');

try {
  // Push schema changes to database (auto-create new tables)
  console.log('📊 Pushing schema to PostgreSQL database...');
  execSync('echo "+" | npx drizzle-kit push --force', { 
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' }
  });
  
  console.log('✅ Database setup complete!');
  console.log('🔥 Ready for production-grade user authentication and project storage');
  
} catch (error) {
  console.error('❌ Database setup failed:', error);
  process.exit(1);
}