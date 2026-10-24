<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listarTarefas } from '@/api'
import type { Status, Tarefa } from '@/tipos'
import CartaoTarefa from '@/components/CartaoTarefa.vue'

const tarefas = ref<Tarefa[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

const colunas: { status: Status; titulo: string }[] = [
  { status: 'a-fazer', titulo: 'A fazer' },
  { status: 'em-andamento', titulo: 'Em andamento' },
  { status: 'em-revisao', titulo: 'Em revisão' },
  { status: 'concluida', titulo: 'Concluída' },
]

const tarefasPorStatus = computed(() => {
  return {
    'a-fazer': tarefas.value.filter((tarefa) => tarefa.status === 'a-fazer'),
    'em-andamento': tarefas.value.filter((tarefa) => tarefa.status === 'em-andamento'),
    'em-revisao': tarefas.value.filter((tarefa) => tarefa.status === 'em-revisao'),
    concluida: tarefas.value.filter((tarefa) => tarefa.status === 'concluida'),
  }
})

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
    <h1 class="titulo-secao">Quadro de tarefas</h1>

    <p v-if="carregando" class="estado">Carregando...</p>

    <p v-else-if="erro" class="estado estado-erro">Erro: {{ erro }}</p>

    <div v-else class="quadro">
      <section v-for="coluna in colunas" :key="coluna.status" class="coluna">
        <h2 class="titulo-coluna">{{ coluna.titulo }}</h2>

        <div class="tarefas-coluna">
          <CartaoTarefa
            v-for="tarefa in tarefasPorStatus[coluna.status]"
            :key="tarefa.id"
            :tarefa="tarefa"
          />

          <p v-if="tarefasPorStatus[coluna.status].length === 0" class="coluna-vazia">
            Nenhuma tarefa
          </p>
        </div>
      </section>
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
  margin: 0;
  padding-bottom: var(--space-2);
  border-bottom: 3px solid hsl(var(--border));
  color: hsl(var(--ring));
  font-size: clamp(1.3rem, 1.05rem + 0.9vw, 1.7rem);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.quadro {
  display: grid;
  grid-template-columns: repeat(4, minmax(250px, 1fr));
  gap: var(--space-3);
  overflow-x: auto;
}

.coluna {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 250px;
  padding: var(--space-3);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card) / 0.5);
}

.titulo-coluna {
  margin: 0;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid hsl(var(--border));
  color: hsl(var(--foreground));
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tarefas-coluna {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.coluna-vazia {
  margin: 0;
  padding: var(--space-3);
  border: 1px dashed hsl(var(--border));
  color: hsl(var(--muted-foreground));
  font-size: 0.8rem;
  text-align: center;
}

.estado {
  padding: var(--space-5) var(--space-3);
  border: 1px dashed hsl(var(--border));
  color: hsl(var(--muted-foreground));
  text-align: center;
}

.estado-erro {
  border-color: hsl(var(--destructive) / 0.5);
  color: hsl(var(--destructive-foreground));
}
</style>
