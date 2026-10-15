<script setup lang="ts">
import type { Tarefa } from '../tipos'
import { RouterLink } from 'vue-router'

defineProps<{
  tarefa: Tarefa
}>()
</script>

<template>
  <article class="cartao">
    <header>
      <h3>
        <RouterLink :to="`/tarefas/${tarefa.id}`">
          {{ tarefa.titulo }}
        </RouterLink>
      </h3>
      <span class="status" :data-status="tarefa.status">
        {{ tarefa.status }}
      </span>
    </header>

    <p class="descricao">{{ tarefa.descricao }}</p>

    <footer>
      <span class="prioridade" :data-prioridade="tarefa.prioridade">
        {{ tarefa.prioridade }}
      </span>
      <span class="responsavel">{{ tarefa.responsavel }}</span>
      <time class="prazo">{{ tarefa.prazo }}</time>
    </footer>
  </article>
</template>

<style scoped>
.cartao {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}
.cartao header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cartao h3 { margin: 0; }
.status, .prioridade {
  font-size: 0.85rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: #eee;
}
footer {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}
</style>

