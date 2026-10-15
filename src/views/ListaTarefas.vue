<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listarTarefas } from '../api'
import type { Tarefa } from '../tipos'
import CartaoTarefa from '../components/CartaoTarefa.vue'

const tarefas = ref<Tarefa[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

onMounted(async () => {
  try {
    tarefas.value = await listarTarefas()
  } catch (e) {
    erro.value = (e as Error).message
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <section>
    <h2>Tarefas</h2>

    <p v-if="carregando">Carregando...</p>
    <p v-else-if="erro">Erro: {{ erro }}</p>
    <p v-else-if="tarefas.length === 0">Nenhuma tarefa.</p>

    <div v-else>
      <CartaoTarefa
        v-for="tarefa in tarefas"
        :key="tarefa.id"
        :tarefa="tarefa"
      />
    </div>
  </section>
</template>