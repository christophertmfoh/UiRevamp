import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  server: {
    host: '0.0.0.0',
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173,
    strictPort: true,
    hmr: {
      overlay: true,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})