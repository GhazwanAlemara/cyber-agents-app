import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@thecompany/core/db.js': path.resolve(__dirname, '../firebase-functions/core/db.js'),
      '@thecompany/core': path.resolve(__dirname, '../firebase-functions/core'),
      'firebase/app': path.resolve(__dirname, 'node_modules/firebase/app'),
      'firebase/firestore': path.resolve(__dirname, 'node_modules/firebase/firestore'),
      'firebase/auth': path.resolve(__dirname, 'node_modules/firebase/auth'),
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  }
})
