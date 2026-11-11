import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Em hospedagens de projeto (ex.: GitHub Pages em /Vue_DFE/) defina
  // VITE_BASE_PATH. Em hospedagens de raiz (ex.: Netlify) o padrão '/' funciona.
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [
    vue(),
    // O plugin de devtools não deve fazer parte do bundle de produção.
    ...(command === 'serve' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
