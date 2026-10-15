<script setup lang="ts">
import type { Tarefa } from '@/tipos'
import { RouterLink } from 'vue-router'

defineProps<{
  tarefa: Tarefa
}>()
</script>

<template>
  <article class="cartao">
    <header class="cartao-cabecalho">
      <h3 class="cartao-titulo">
        <RouterLink :to="`/tarefas/${tarefa.id}`">
          {{ tarefa.titulo }}
        </RouterLink>
      </h3>
      <span class="etiqueta status" :data-status="tarefa.status">
        {{ tarefa.status }}
      </span>
    </header>

    <p class="cartao-descricao">{{ tarefa.descricao }}</p>

    <footer class="cartao-rodape">
      <span class="etiqueta prioridade" :data-prioridade="tarefa.prioridade">
        {{ tarefa.prioridade }}
      </span>
      <span class="cartao-responsavel">{{ tarefa.responsavel }}</span>
      <time class="cartao-prazo" :datetime="tarefa.prazo">{{ tarefa.prazo }}</time>
    </footer>
  </article>
</template>

<style scoped>
.cartao {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #e3e8f0;
  border-radius: 12px;
  background: #ffffff;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.cartao:hover {
  box-shadow: 0 10px 24px rgba(10, 29, 80, 0.08);
  transform: translateY(-2px);
}

.cartao-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.cartao-titulo {
  margin: 0;
  font-size: 17px;
}

.cartao-titulo a {
  color: #0a1d50;
  text-decoration: none;
}

.cartao-titulo a:hover {
  color: #c83131;
  text-decoration: underline;
}

.cartao-descricao {
  margin: 0;
  color: #596579;
  font-size: 14px;
}

.cartao-rodape {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  color: #737d90;
  font-size: 13px;
}

.cartao-responsavel {
  font-weight: 600;
}

.cartao-prazo {
  margin-left: auto;
  white-space: nowrap;
}

.etiqueta {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status,
.prioridade {
  background: #eef1f6;
  color: #596579;
}

.status[data-status='a-fazer'] {
  background: #eef1f6;
  color: #596579;
}

.status[data-status='em-andamento'] {
  background: #e4edff;
  color: #2b5fd9;
}

.status[data-status='em-revisao'] {
  background: #fff1dc;
  color: #b8730a;
}

.status[data-status='concluida'] {
  background: #e2f5ea;
  color: #1f8a4c;
}

.prioridade[data-prioridade='baixa'] {
  background: #eef1f6;
  color: #596579;
}

.prioridade[data-prioridade='media'] {
  background: #fff1dc;
  color: #b8730a;
}

.prioridade[data-prioridade='alta'] {
  background: #ffe3e6;
  color: #c83131;
}
</style>
