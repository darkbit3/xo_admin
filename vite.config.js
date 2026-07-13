import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PORT) || 5173,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['xo-admin.onrender.com'],
  },
  plugins: [react(), tailwindcss()],
})
