import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath, URL } from 'url';
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      // Phase 3: Enhanced React optimization for Replit
      babel: {
        plugins: [
          // Remove console.log in production
          ...(process.env.NODE_ENV === 'production' ? [
            ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]
          ] : [])
        ]
      }
    }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  
  // Phase 3: Replit-Optimized Build Configuration
  build: {
    outDir: "dist",
    emptyOutDir: true,
    
    // Optimized for Replit creative development (not production deployment)
    target: 'esnext', // Use latest features for modern browsers in Replit
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
    sourcemap: true, // Always include sourcemaps for debugging
    
    // Development-focused build settings
    rollupOptions: {
      output: {
        // Simple chunk strategy for faster builds
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-alert-dialog', '@radix-ui/react-button'],
          utils: ['clsx', 'tailwind-merge', 'date-fns']
        }
      }
    },
    
    // Faster builds for iteration
    chunkSizeWarningLimit: 1000, // Increase limit for development
  },
  
  // Phase 3: Development Server Optimized for Replit
  server: {
    port: 5173,
    host: "0.0.0.0",
    strictPort: true,
    
    // Enhanced for Replit environment
    hmr: {
      overlay: true,
      clientPort: 5173
    },
    
    // File system optimization
    fs: {
      strict: false, // Allow serving files outside of root for Replit
      allow: ['..']
    },
    
    // Proxy for API calls in development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Phase 3: Dependency Optimization for Replit
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'react-hook-form',
      'zod',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      'framer-motion'
    ],
    exclude: [
      // Exclude heavy AI dependencies for faster dev builds
      '@google/generative-ai',
      '@anthropic-ai/sdk'
    ],
    // Force re-optimization when needed
    force: process.env.FORCE_OPTIMIZE === 'true'
  },
  
  // Phase 3: ESBuild Configuration for Speed
  esbuild: {
    target: 'esnext',
    // Remove debugger statements in production
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
    // Keep console in development for debugging
    pure: process.env.NODE_ENV === 'production' ? ['console.log'] : [],
    // Faster transpilation
    tsconfigRaw: {
      compilerOptions: {
        useDefineForClassFields: false,
      }
    }
  },
  
  // Phase 3: Performance and Caching (Replit-focused)
  define: {
    // Optimize React for development
    __DEV__: process.env.NODE_ENV !== 'production',
    
    // Build time constants for debugging
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '3.0.0'),
    __REPLIT_ENV__: JSON.stringify(!!process.env.REPL_ID),
    
    // Phase 3 feature flags
    __ENABLE_PERFORMANCE_DASHBOARD__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __ENABLE_AUTO_BACKUP__: JSON.stringify(true),
    __ENABLE_EXPORT_IMPORT__: JSON.stringify(true)
  },
  
  // Phase 3: CSS Processing Optimization
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      // Optimize any CSS preprocessing for speed
    }
  },
  
  // Phase 3: Development-specific configurations
  ...(process.env.NODE_ENV === 'development' && {
    // Development-only optimizations
    clearScreen: false, // Keep console history
    logLevel: 'info', // Detailed logging for development
  }),
  
  // Phase 3: Worker optimization for Replit
  worker: {
    format: 'es'
  },
  
  // Experimental features for better Replit experience
  experimental: {
    // Skip unnecessary processing in development
    skipSsrTransform: true
  }
});
