import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'web', // index.html lives in web/
  plugins: [react()],
  resolve: {
    // Web code may import pure-data model files (types, catalog shapes) —
    // never engine.ts or index.ts, which drag Node built-ins into the bundle.
    alias: { '@model': path.resolve(__dirname, 'src/model') },
  },
  build: {
    outDir: '../dist/public', // relative to root → app/dist/public
    emptyOutDir: true, // opt-in required: outDir sits outside web/
  },
  server: {
    // Same-origin fetches in dev and prod alike — no CORS, no base URLs
    proxy: {
      '/api': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    },
  },
})
