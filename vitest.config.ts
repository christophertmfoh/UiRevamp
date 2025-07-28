/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Simple testing configuration for Replit development
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    
    // Fast testing for creative workflow
    testTimeout: 10000, // 10 seconds max per test
    hookTimeout: 10000,
    
    // Coverage configuration (simplified)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'], // Simpler reporting
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'build/',
        'coverage/',
        'scripts/',
        'docs/',
      ],
      // Relaxed coverage thresholds for creative development
      thresholds: {
        global: {
          branches: 60,
          functions: 60, 
          lines: 65,
          statements: 65
        }
      }
    },
    
    // Optimized for Replit environment
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // Faster startup in Replit
      }
    },
    
    // Performance and reliability
    maxConcurrency: 3, // Limit concurrent tests for Replit
    isolate: false, // Faster test execution
    sequence: {
      shuffle: false // Deterministic test order
    },
    
    // Simple watch mode for development
    watch: false, // Disable by default to avoid resource usage
    
    // Reporter configuration for development
    reporter: process.env.CI ? ['verbose', 'json'] : ['verbose'],
    
    // Simplified cache for faster reruns
    cache: {
      dir: './node_modules/.vitest'
    }
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@server': path.resolve(__dirname, './server'),
    },
  },
  
  // Optimize for Replit development
  define: {
    __TEST__: true,
    // Simplified feature flags for testing
    __DEV_PERFORMANCE_MONITORING__: process.env.NODE_ENV === 'development'
  }
})