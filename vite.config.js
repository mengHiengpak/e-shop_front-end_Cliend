import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = (env.VITE_URL_BASE || 'http://localhost:3000/api').trim()

  // The request path the browser sends already contains the backend's own "/api"
  // prefix, and http-proxy puts the target's path in front of it. Reducing the
  // target to the bare origin keeps "/api" from being duplicated.
  const apiOrigin = apiBase.replace(/^(https?:\/\/[^/?#]+).*$/, '$1')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Listen on the LAN as well, otherwise a phone on the same Wi-Fi cannot
      // reach the dev server at all.
      host: true,
      port: 5174,
      strictPort: true,
      // Serve the API from the Vite origin in dev. A phone loading
      // http://192.168.x.x:5174 would otherwise resolve "localhost:3000" to
      // itself, and a cross-site session cookie is dropped by mobile browsers.
      proxy: {
        '/api': {
          target: apiOrigin,
          changeOrigin: true,
        },
      },
    },
  }
})
