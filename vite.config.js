import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = (env.VITE_URL_BASE || 'http://localhost:3000/api').trim()

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
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
