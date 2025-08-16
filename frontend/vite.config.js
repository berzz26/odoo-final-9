import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // This makes your dev server accessible on your local network
    host: true, 
    // The port your dev server will run on
    port: 8080, 
    // The proxy is the only part needed to connect to the backend
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})