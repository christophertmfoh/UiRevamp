import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
      }),
    ],

    // Path resolution
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@stores': path.resolve(__dirname, './src/stores'),
        '@types': path.resolve(__dirname, './src/types'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@api': path.resolve(__dirname, './src/api'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@features': path.resolve(__dirname, './src/features'),
        '@pages': path.resolve(__dirname, './src/pages'),
      },
    },

    // CSS configuration
    css: {
      devSourcemap: true,
    },

    // Development server
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      open: false,
      cors: true,
      hmr: {
        overlay: false,
        port: 5174,
      },
      // Proxy for API during development
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // Preview server (for production builds)
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
      cors: true,
    },

    // Build configuration
    build: {
      target: 'es2020',
      outDir: 'dist',
      sourcemap: command === 'build' && mode !== 'production',
      minify: 'esbuild',
      cssMinify: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      
      // Rollup options
      rollupOptions: {
        output: {
          // Code splitting strategy
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['@tanstack/react-router'],
            'query-vendor': ['@tanstack/react-query'],
          },
        },
      },
    },

    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@tanstack/react-router',
        '@tanstack/react-query',
        'zustand',
        'react-hook-form',
        '@hookform/resolvers',
        'zod',
        'axios',
        'lucide-react',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },

    // ESBuild configuration
    esbuild: {
      target: 'es2020',
      drop: command === 'build' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
  }
})