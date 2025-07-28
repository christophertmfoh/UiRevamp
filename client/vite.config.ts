import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "..", "shared"),
    },
  },
  root: __dirname,
  
  // Phase 5: Enhanced development server for sub-100ms hot-reload
  server: {
    port: 5173,
    host: "0.0.0.0",
    allowedHosts: [".replit.dev", "localhost"],

    // Phase 5: Optimized HMR for creative workflow
    hmr: {
      overlay: false, // Reduce visual interruption during writing
      clientPort: 443, // Use HTTPS port for Replit
      port: 5173
    },

    // Phase 5: Warmup critical writing components
    warmup: {
      clientFiles: [
        './src/components/writing/**/*',
        './src/components/characters/**/*',
        './src/components/projects/**/*',
        './src/hooks/useWritingSession.ts',
        './src/lib/store.ts'
      ]
    },

    // File system security optimized for creative workflow
    fs: {
      strict: false, // Allow flexibility for creative assets
      deny: ["**/node_modules/**", "**/.git/**"],
    },

    // Proxy API calls to Express server
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        timeout: 10000
      }
    }
  },
  
  build: {
    outDir: path.resolve(__dirname, "..", "dist/public"),
    emptyOutDir: true,
    
    // Phase 5: Creative workflow optimized build
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true, // Always include for creative debugging
    
    // Phase 5: Manual chunks for faster creative component loading
    rollupOptions: {
      output: {
        manualChunks: {
          'writing-core': [
            './src/components/writing/WritingEditor.tsx',
            './src/components/characters/CharacterForm.tsx'
          ],
          'ui-primitives': ['@radix-ui/react-dialog', '@radix-ui/react-form'],
          'icons': ['lucide-react'],
          'state': ['zustand', '@tanstack/react-query']
        }
      }
    }
  },
  
  // Phase 5: Enhanced dependency optimization for creative workflow
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react/jsx-runtime',
      '@tanstack/react-query',
      'react-hook-form',
      'zod', 'clsx', 'tailwind-merge',
      '@radix-ui/react-dialog',
      '@radix-ui/react-form',
      '@radix-ui/react-button',
      'lucide-react',
      'zustand',
      'framer-motion'
    ],
    exclude: [
      '@google/generative-ai',
      '@anthropic-ai/sdk'
    ],
    // Phase 5: Force optimization for faster creative iteration
    force: process.env.FORCE_OPTIMIZE === 'true',
    esbuildOptions: {
      target: 'es2020'
    }
  },
  
  // ESBuild options for faster builds
  esbuild: {
    target: 'es2020',
    // Remove debugger statements in production
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
  },
  
  // Performance and caching
  define: {
    // Optimize React for production
    __DEV__: process.env.NODE_ENV !== 'production',
    // Build time constants
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  }
});