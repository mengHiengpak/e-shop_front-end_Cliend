import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Without this Vite binds to loopback only, so a phone on the same Wi-Fi
    // cannot load http://192.168.x.x:5174 at all.
    host: true,
    port: 5174,
    strictPort: true,
  }
})
