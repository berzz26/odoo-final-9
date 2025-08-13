import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <-- alias
    },
  },
  server: {
    host: '0.0.0.0',   // <-- allow external access
    port: 8080,  
  }
})
