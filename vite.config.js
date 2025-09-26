import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  // Ce chemin de base sera utilisé pour le 'build' ET le 'preview'.
  // Le serveur de développement ('dev') le gérera correctement.
  base: "/boiserie_book_project/",
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
    },
  },
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
    },
  }
})
