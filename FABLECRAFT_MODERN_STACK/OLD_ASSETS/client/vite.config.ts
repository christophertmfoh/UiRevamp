import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "..", "shared"),
      "@universal": path.resolve(__dirname, "..", "src"),
    },
  },
  root: __dirname,
  server: {
    port: 5173,
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: [
      ".replit.dev",
      ".replit.co", 
      "localhost",
      "bbf3cad8-c58a-41be-acec-fe1f62f386e3-00-qku0gbybmuzb.kirk.replit.dev"
    ],
    hmr: {
      clientPort: 5173
    },
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
  }
});