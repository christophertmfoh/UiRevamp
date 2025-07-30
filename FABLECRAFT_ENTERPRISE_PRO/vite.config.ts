/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, type UserConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig((): UserConfig => {
  return {
    plugins: [
      react(),
      // Custom plugin to suppress WebSocket errors
      {
        name: 'suppress-websocket-errors',
        configureServer(server) {
          const originalWs = server.ws;
          if (originalWs) {
            originalWs.on('error', () => {
              // Silently ignore WebSocket errors
            });
          }
        }
      }
    ],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
      hmr: {
        overlay: false, // Disable error overlay
        port: 5173,
        host: 'localhost',
        protocol: 'ws',
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['@tanstack/react-router'],
            'query-vendor': ['@tanstack/react-query'],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
  }
})