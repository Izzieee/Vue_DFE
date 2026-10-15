<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { buscarTarefa } from '../api'
import type { Tarefa } from '../tipos'

const rota = useRoute()
const tarefa = ref<Tarefa | null>(null)
const carregando = ref(true)
const erro = ref<string | null>(null)

onMounted(async () => {
  try {
    tarefa.value = await buscarTarefa(rota.params.id as string)
  } catch (e) {
    erro.value = (e as Error).message
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <section>
    <p v-if="carregando">Carregando...</p>
    <p v-else-if="erro">Erro: {{ erro }}</p>

    <article v-else-if="tarefa">
      <h2>{{ tarefa.titulo }}</h2>
      <p>{{ tarefa.descricao }}</p>
      <ul>
        <li><strong>Status:</strong> {{ tarefa.status }}</li>
        <li><strong>Prioridade:</strong> {{ tarefa.prioridade }}</li>
        <li><strong>Responsável:</strong> {{ tarefa.responsavel }}</li>
        <li><strong>Prazo:</strong> {{ tarefa.prazo }}</li>
        <li><strong>Projeto:</strong> {{ tarefa.projetoId }}</li>
      </ul>
    </article>
  </section>
</template>