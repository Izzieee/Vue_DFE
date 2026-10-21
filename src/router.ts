import { createRouter, createWebHistory } from 'vue-router'
import PlaceholderView from './views/PlaceholderView.vue'
import ListaTarefas from './views/ListaTarefas.vue'
import DetalheTarefa from './views/DetalheTarefa.vue'
import NovaTarefa from './views/NovaTarefa.vue'
import ListaProjetos from './views/ListaProjetos.vue'
import DetalhesProjeto from './views/DetalhesProjeto.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'inicio',
      component: ListaTarefas,
      meta: { titulo: 'Tarefas' },
    },
    {
      path: '/tarefas/nova',
      name: 'nova-tarefa',
      component: NovaTarefa,
      meta: { titulo: 'Nova tarefa' },
    },
    {
      path: '/tarefas/:id',
      name: 'detalhe-tarefa',
      component: DetalheTarefa,
      meta: { titulo: 'Detalhes da tarefa' },
    },
    {
      path: '/projetos',
      name: 'lista-projetos',
      component: ListaProjetos,
      meta: { titulo: 'Projetos' },
    },
    {
      path: '/projetos/:id',
      name: 'detalhe-projeto',
      component: DetalhesProjeto,
      meta: { titulo: 'Detalhes do projeto' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'nao-encontrada',
      component: PlaceholderView,
      meta: { titulo: 'Página não encontrada' },
    },
  ],
})

export default router
