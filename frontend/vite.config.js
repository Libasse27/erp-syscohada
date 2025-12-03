import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Supprimer les avertissements de dépréciation de SASS
        // Ces avertissements viennent de Bootstrap qui utilise encore @import
        // En attendant la migration de Bootstrap vers @use/@forward
        quietDeps: true,
        api: 'modern-compiler',
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          bootstrap: ['bootstrap', 'react-bootstrap'],
        },
      },
    },
  },
})
