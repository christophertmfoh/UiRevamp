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
  },
  build: {
    outDir: "dist",
  },
});