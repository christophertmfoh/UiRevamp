import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'
  const isProd = mode === 'production'

  return {
    root: process.cwd(), // Explicitly set root for Vite 7
    base: '/', // Ensure base path is set
    publicDir: 'public', // Explicitly set public directory
    plugins: [
      react({
        // Fix for useLayoutEffect error in production
        jsxRuntime: 'automatic',
      }),
      // Compression for production builds
      isProd && compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240, // Only compress files larger than 10kb
      }),
      isProd && compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
      }),
      // Bundle analysis in production
      isProd && visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    
    // Resolve configuration - SAME for dev and prod
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/lib': path.resolve(__dirname, './src/lib'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/styles': path.resolve(__dirname, './src/styles'),
        '@/app': path.resolve(__dirname, './src/app'),
        '@/features-modern': path.resolve(__dirname, './src/features-modern'),
        '@/shared': path.resolve(__dirname, './src/shared'),
        // Fix for React in production
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      },
    },
    
    // Server configuration for development
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      hmr: {
        overlay: true,
      },
    },
    
    // Preview configuration - matches production environment
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
    },
    
    // Build configuration - optimized for production
    build: {
      outDir: 'dist',
      sourcemap: isProd ? false : true, // No sourcemaps in production for security
      minify: isProd ? 'terser' : false,
      cssMinify: isProd,
      
      // Ensure CSS is properly handled
      cssCodeSplit: true,
      
      // Rollup configuration for optimal chunking
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor chunk for node_modules
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor'
              }
              if (id.includes('react-router')) {
                return 'router'
              }
              return 'vendor'
            }
            // Theme CSS should be in its own chunk
            if (id.includes('theme/variables.css')) {
              return 'theme'
            }
          },
          // Consistent file naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk'
            return `assets/js/${facadeModuleId}-[hash].js`
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return 'assets/[name]-[hash][extname]'
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (ext && /png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`
            } else if (ext && /css/i.test(ext)) {
              return `assets/css/[name]-[hash][extname]`
            } else {
              return `assets/[name]-[hash][extname]`
            }
          },
        },
      },
      
      // Terser will use default options
    },
    
    // CSS configuration
    css: {
      // Ensure CSS modules work the same in dev and prod
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: isDev 
          ? '[name]__[local]__[hash:base64:5]'
          : '[hash:base64:8]',
      },
      // PostCSS is handled by postcss.config.js
    },
    
    // Dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
        '@radix-ui/react-accordion',
        '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-slot',
      ],
      // Force consistent parsing
      esbuildOptions: {
        target: 'es2020',
        // Fix for React in production
        jsx: 'automatic',
      },
    },
    
    // Environment variable handling
    envPrefix: 'VITE_',
    
    // Consistent module handling
    esbuild: {
      // Ensure JSX is handled the same way
      jsx: 'automatic',
      jsxDev: isDev,
      // Remove console and debugger in production
      drop: isProd ? ['console', 'debugger'] : [],
    },
  }
})