import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
        // Use SWC for faster builds
        jsxImportSource: '@emotion/react',
      }),
      // Bundle analyzer for production builds
      mode === 'analyze' && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),

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
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
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
        '/socket.io': {
          target: env.VITE_WS_URL || 'http://localhost:3001',
          changeOrigin: true,
          ws: true,
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
      target: 'es2022',
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
            'ui-vendor': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tabs',
              '@radix-ui/react-tooltip',
              '@radix-ui/react-select',
              '@radix-ui/react-popover',
            ],
            'editor-vendor': [
              '@tiptap/react',
              '@tiptap/starter-kit',
              '@tiptap/extension-placeholder',
              '@tiptap/extension-character-count',
            ],
            'utils-vendor': [
              'lodash-es',
              'date-fns',
              'uuid',
              'nanoid',
              'clsx',
              'tailwind-merge',
            ],
          },
          // Asset naming
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name?.split('.').pop() || ''
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return 'assets/images/[name]-[hash][extname]'
            }
            if (/woff2?|eot|ttf|otf/i.test(extType)) {
              return 'assets/fonts/[name]-[hash][extname]'
            }
            return 'assets/[ext]/[name]-[hash][extname]'
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
        'framer-motion',
        'lucide-react',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },

    // ESBuild configuration
    esbuild: {
      target: 'es2022',
      drop: command === 'build' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },

    // Worker configuration
    worker: {
      format: 'es',
    },

    // JSON configuration
    json: {
      namedExports: true,
      stringify: false,
    },
  }
})