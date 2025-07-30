import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'bbf3cad8-c58a-41be-acec-fe1f62f386e3-00-qku0gbybmuzb.kirk.replit.dev',
      'ui-revamp-christophertmfo.replit.app',
      '.replit.dev',
      '.replit.app',
      'localhost'
    ]
  }
})
