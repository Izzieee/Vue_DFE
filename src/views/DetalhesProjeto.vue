<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { buscarProjetoComTarefas } from '@/api'
import type { Projeto, Tarefa } from '@/tipos'
import CartaoTarefa from '@/components/CartaoTarefa.vue'

const route = useRoute()
const projeto = ref<Projeto | null>(null)
const tarefas = ref<Tarefa[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

onMounted(async () => {
  try {
    const id = String(route.params.id)
    const resultado = await buscarProjetoComTarefas(id)

    projeto.value = resultado
    tarefas.value = resultado.tarefas ?? []
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

    <template v-else-if="projeto">
      <header class="projeto-cabecalho">
        <h1>{{ projeto.nome }}</h1>
        <p class="projeto-descricao">{{ projeto.descricao }}</p>
        <p class="projeto-disciplina">{{ projeto.disciplina }}</p>
      </header>

      <h2 class="tarefas-titulo">Tarefas</h2>
      <p v-if="tarefas.length === 0">Nenhuma tarefa.</p>
      <div v-else class="lista-tarefas">
        <CartaoTarefa v-for="tarefa in tarefas" :key="tarefa.id" :tarefa="tarefa" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.projeto-cabecalho {
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #e3e8f0;
  border-left: 4px solid #c83131;
  border-radius: 12px;
  background: #ffffff;
}

.projeto-cabecalho h1 {
  margin: 0 0 10px;
  color: #0a1d50;
  font-size: 26px;
}

.projeto-descricao {
  margin: 0 0 14px;
  color: #596579;
  font-size: 14px;
}

.projeto-disciplina {
  display: inline-block;
  margin: 0;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffeaeb;
  color: #c83131;
  font-size: 12px;
  font-weight: 600;
}

.tarefas-titulo {
  margin: 0 0 16px;
  color: #0a1d50;
  font-size: 20px;
}

.lista-tarefas {
  display: grid;
  gap: 16px;
}
</style>
