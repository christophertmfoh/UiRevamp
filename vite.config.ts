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
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    
    // Enhanced build optimizations for scalability
    target: 'es2020',
    minify: 'esbuild', // Faster than terser
    sourcemap: process.env.NODE_ENV !== 'production',
    
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip'
          ],
          'form-vendor': [
            'react-hook-form',
            '@hookform/resolvers',
            'zod'
          ],
          'utility-vendor': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
            'date-fns'
          ],
          'animation-vendor': [
            'framer-motion',
            'lucide-react'
          ]
        },
        // Optimize chunk naming for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.[^.]*$/, '')
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      },
      // External dependencies for CDN optimization (optional)
      external: process.env.USE_CDN === 'true' ? ['react', 'react-dom'] : []
    },
    
    // Performance optimizations
    reportCompressedSize: false, // Faster builds
    chunkSizeWarningLimit: 1000, // 1MB warning threshold
    
    // CSS optimizations
    cssCodeSplit: true,
    cssMinify: true
  },
  
  // Development server optimizations
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // Enable HTTP/2 for development (requires HTTPS)
    // https: true,
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
    // Optimize for size in production
    minifyIdentifiers: process.env.NODE_ENV === 'production',
    minifySyntax: process.env.NODE_ENV === 'production',
    minifyWhitespace: process.env.NODE_ENV === 'production'
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
