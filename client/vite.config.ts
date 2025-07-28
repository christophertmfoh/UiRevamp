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
  
  // Development server configuration with proxy
  server: {
    port: 5173,
    host: "0.0.0.0",
    allowedHosts: [".replit.dev", "localhost"],

    // File system security
    fs: {
      strict: true,
      deny: ["**/.*"],
    },

    // Proxy API calls to Express server
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  build: {
    outDir: path.resolve(__dirname, "..", "dist/public"),
    emptyOutDir: true,
    
    // Enhanced build optimizations for scalability
    target: 'es2020',
    minify: 'esbuild', // Faster than terser
    sourcemap: process.env.NODE_ENV !== 'production',
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      'react-hook-form',
      'zod',
      'clsx',
      'tailwind-merge'
    ],
    exclude: [
      // Exclude large dependencies that don't need pre-bundling
      '@google/generative-ai'
    ]
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