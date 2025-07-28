import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react({
      // Enable React optimization features
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
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "..", "shared"),
    },
  },
  root: __dirname,
  
  // Development server configuration
  server: {
    port: 5173,
    host: "0.0.0.0",
    
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
  
  // Development server optimizations
  server: {
    port: 5173,
    host: "0.0.0.0",
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
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