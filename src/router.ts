
import { createRouter, createWebHistory } from 'vue-router'
import PlaceholderView from './views/PlaceholderView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: PlaceholderView,
      meta: { titulo: 'Início' }
    },
    {
      path: '/tarefas/:id',
      name: 'detalhe-tarefa',
      component: PlaceholderView,
      meta: { titulo: 'Detalhes da tarefa' }
    },
    {
      path: '/projetos',
      name: 'lista-projetos',
      component: PlaceholderView,
      meta: { titulo: 'Projetos' }
    },
    {
      path: '/projetos/:id',
      name: 'detalhe-projeto',
      component: PlaceholderView,
      meta: { titulo: 'Detalhes do projeto' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'nao-encontrada',
      component: PlaceholderView,
      meta: { titulo: 'Página não encontrada' }
    }
  ]
})

export default router
