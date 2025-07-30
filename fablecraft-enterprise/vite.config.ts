import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    hmr: {
      port: 3000,
      protocol: 'wss',
      clientPort: 3000,
      host: 'bbf3cad8-c58a-41be-acec-fe1f62f386e3-00-qku0gbybmuzb.kirk.replit.dev'
    }
  }
})
