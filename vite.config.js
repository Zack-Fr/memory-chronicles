import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
server: {
    proxy: {
      // proxy all /api and /attachments calls
    '/api': { target: 'http://localhost:8000', changeOrigin: true },
    '/attachments': { target: 'http://localhost:8000', changeOrigin: true }
    }
}
})

