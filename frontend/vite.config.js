import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/zgeslom': {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/temp' : "http://localhost:3001",
      '/message' : "http://localhost:3001",
      '/api' : "http://localhost:3001",
      '/exchangeToken' : "http://localhost:3001",
      '/logout' : "http://localhost:3001",
      '/socket.io': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  }
})
