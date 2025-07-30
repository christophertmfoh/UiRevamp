import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Testing environment
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    
    // Coverage configuration with enterprise thresholds
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        'dist/',
        '.next/',
        'build/',
        '**/*.stories.*',
        '**/*.test.*',
        '**/*.spec.*',
        '**/mocks/**',
        'OLD_ASSETS/**',
      ],
      // 🚨 ENTERPRISE COVERAGE THRESHOLDS
      thresholds: {
        global: {
          branches: 85,     // 85% branch coverage required
          functions: 85,    // 85% function coverage required
          lines: 85,        // 85% line coverage required
          statements: 85,   // 85% statement coverage required
        },
        // Stricter thresholds for critical business logic
        'src/features/**/*.ts': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        // More lenient for UI components (harder to test)
        'src/components/**/*.tsx': {
          branches: 75,
          functions: 75,
          lines: 75,
          statements: 75,
        },
      },
      all: true,
      skipFull: false,
    },
    
    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: [
      'node_modules/',
      'dist/',
      '.next/',
      'build/',
      'OLD_ASSETS/',
      'coverage/',
    ],
    
    // Timeout configuration
    testTimeout: 10000,  // 10s timeout for tests
    hookTimeout: 10000,  // 10s timeout for hooks
    
    // Reporter configuration
    reporter: ['verbose', 'junit', 'json'],
    outputFile: {
      junit: './reports/junit.xml',
      json: './reports/test-results.json',
    },
    
    // Performance optimization
    isolate: true,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
      },
    },
    
    // Mock configuration
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    
    // Watch mode configuration
    watch: false,
    watchExclude: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'build/**',
      'coverage/**',
      'OLD_ASSETS/**',
    ],
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/test': path.resolve(__dirname, './src/test'),
    },
  },
  
  // Esbuild configuration for testing
  esbuild: {
    target: 'node14',
  },
  
  // Define configuration for consistent environment
  define: {
    __TEST__: true,
  },
});