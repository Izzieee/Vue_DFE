<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listarTarefas } from '@/api'
import type { Tarefa } from '@/tipos'
import CartaoTarefa from '@/components/CartaoTarefa.vue'

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
  <section class="pagina">
    <h1 class="titulo-secao">Tarefas</h1>

    <p v-if="carregando" class="estado">Carregando...</p>
    <p v-else-if="erro" class="estado estado-erro">Erro: {{ erro }}</p>
    <p v-else-if="tarefas.length === 0" class="estado">Nenhuma tarefa.</p>

    <div v-else class="lista-tarefas">
      <CartaoTarefa v-for="tarefa in tarefas" :key="tarefa.id" :tarefa="tarefa" />
    </div>
  </section>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.titulo-secao {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  padding-bottom: var(--space-2);
  border-bottom: 3px solid hsl(var(--border));
  color: hsl(var(--ring));
  font-size: clamp(1.3rem, 1.05rem + 0.9vw, 1.7rem);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-shadow: 0 0 20px hsl(var(--ring) / 0.35);
}

.titulo-secao::before {
  content: '//';
  letter-spacing: 0;
}

.lista-tarefas {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
}

.estado {
  grid-column: 1 / -1;
  padding: var(--space-5) var(--space-3);
  border: 1px dashed hsl(var(--border));
  background: hsl(var(--card) / 0.9);
  color: hsl(var(--muted-foreground));
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-align: center;
  text-transform: uppercase;
}

.estado-erro {
  border: 1px solid hsl(var(--destructive) / 0.5);
  background: hsl(var(--destructive) / 0.06);
  color: hsl(var(--destructive-foreground));
}

@media (min-width: 680px) {
  .lista-tarefas {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1080px) {
  .lista-tarefas {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
