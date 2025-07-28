import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
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
      "@/components": path.resolve(__dirname, "src", "shared", "components"),
      "@/ui": path.resolve(__dirname, "src", "shared", "components", "ui"),
      "@/features": path.resolve(__dirname, "src", "features"),
      "@/hooks": path.resolve(__dirname, "src", "shared", "hooks"),
      "@/lib": path.resolve(__dirname, "src", "shared", "lib"),
      "@/utils": path.resolve(__dirname, "src", "shared", "utils"),
      "@/types": path.resolve(__dirname, "src", "shared", "types"),
      "@/assets": path.resolve(__dirname, "..", "attached_assets"),
      "@shared": path.resolve(__dirname, "..", "shared"),
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
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/shared/components')) {
            return 'ui-components';
          }
          if (id.includes('src/pages')) {
            return 'pages';
          }
        },
      },
    },
  },
});