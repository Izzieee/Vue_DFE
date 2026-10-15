
import { createRouter, createWebHistory } from 'vue-router'
import PlaceholderView from './views/PlaceholderView.vue'
import ListaProjetos from './views/ListaProjetos.vue'
import DetalhesProjeto from './views/DetalhesProjeto.vue'

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
      component: ListaProjetos,
      meta: { titulo: 'Projetos' }
    },
    {
      path: '/projetos/:id',
      name: 'detalhe-projeto',
      component: DetalhesProjeto,
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
