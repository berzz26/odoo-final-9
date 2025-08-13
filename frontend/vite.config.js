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
    host: true, 
    port: 8080, 
    strictPort: true,
    allowedHosts: [
      'ec2-13-202-224-27.ap-south-1.compute.amazonaws.com'
    ],
  },
})
