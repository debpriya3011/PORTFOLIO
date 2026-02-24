import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// SPA fallback plugin for client-side routing
const spaFallbackPlugin = {
  name: 'spa-fallback',
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        // Skip API routes and known file types
        if (req.method === 'GET' && !/.+\.[a-z]+$/i.test(req.url) && !req.url.startsWith('/api/') && !req.url.startsWith('/uploads/')) {
          req.url = '/'
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [inspectAttr(), react(), spaFallbackPlugin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
