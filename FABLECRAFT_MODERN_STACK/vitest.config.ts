import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/OLD_ASSETS/**', // CRITICAL: Exclude old assets
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['OLD_ASSETS/**', 'node_modules/**', 'src/test/**', '**/*.d.ts', '**/*.config.*'],
      thresholds: {
        global: { branches: 80, functions: 80, lines: 80, statements: 80 }
      }
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/lib': '/src/lib',
      '@/hooks': '/src/hooks',
      '@/types': '/src/types',
      '@/utils': '/src/utils',
      '@/pages': '/src/pages',
      '@/styles': '/src/styles',
    },
  },
})