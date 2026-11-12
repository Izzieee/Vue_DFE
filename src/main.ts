import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Mantém o título da aba alinhado à rota aberta, inclusive no acesso direto.
router.afterEach((rota) => {
  const titulo = typeof rota.meta.titulo === 'string' ? rota.meta.titulo : null
  document.title = titulo
    ? `ERROR 404 · ${titulo}`
    : 'ERROR 404 · Organização acadêmica'
})

createApp(App).use(router).mount('#app')
