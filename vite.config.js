// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // any request to /api/* will be forwarded to your Laravel app
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // keep /api/v1/... intact
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
