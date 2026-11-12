<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listarTarefas } from '@/api'
import type { Status, Tarefa } from '@/tipos'
import CartaoTarefa from '@/components/CartaoTarefa.vue'
import ConfirmacaoExclusao from '@/components/ConfirmacaoExclusao.vue'
import EstadoCarregamento from '@/components/EstadoCarregamento.vue'
import { useExclusaoTarefa } from '@/exclusaoTarefa'
import { useFiltrosTarefas } from '@/estadoFiltros'

const tarefas = ref<Tarefa[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)
const {
  busca: termoBusca,
  status: filtroStatus,
  prioridade: filtroPrioridade,
  filtrarTarefas,
} = useFiltrosTarefas()

const {
  tarefaSelecionada,
  excluindo,
  erro: erroExclusao,
  mensagem: mensagemExclusao,
  solicitarExclusao,
  cancelarExclusao,
  confirmarExclusao,
} = useExclusaoTarefa((tarefa) => {
  // O quadro só perde a tarefa depois que a API confirma a exclusão.
  tarefas.value = tarefas.value.filter((item) => item.id !== tarefa.id)
})
const colunas: { status: Status; titulo: string }[] = [
  { status: 'a-fazer', titulo: 'A fazer' },
  { status: 'em-andamento', titulo: 'Em andamento' },
  { status: 'em-revisao', titulo: 'Em revisão' },
  { status: 'concluida', titulo: 'Concluída' },
]

const tarefasFiltradas = computed(() => {
  return filtrarTarefas(tarefas.value)
})

const temFiltrosAtivos = computed(() =>
  Boolean(termoBusca.value.trim() || filtroStatus.value || filtroPrioridade.value),
)

const tarefasPorStatus = computed(() => {
  return {
    'a-fazer': tarefasFiltradas.value.filter((tarefa) => tarefa.status === 'a-fazer'),
    'em-andamento': tarefasFiltradas.value.filter((tarefa) => tarefa.status === 'em-andamento'),
    'em-revisao': tarefasFiltradas.value.filter((tarefa) => tarefa.status === 'em-revisao'),
    concluida: tarefasFiltradas.value.filter((tarefa) => tarefa.status === 'concluida'),
  }
})

async function carregarTarefas() {
  carregando.value = true
  erro.value = null

  try {
    tarefas.value = await listarTarefas()
  } catch (e) {
    erro.value = (e as Error).message
  } finally {
    carregando.value = false
  }
}

onMounted(carregarTarefas)

/** Aplica no quadro o status confirmado pela API, mantendo os demais dados. */
function aoAtualizarTarefa(atualizada: Tarefa) {
  const indice = tarefas.value.findIndex((tarefa) => tarefa.id === atualizada.id)

  if (indice !== -1) {
    tarefas.value[indice] = atualizada
  }
}
</script>

<template>
  <section class="pagina" :aria-busy="carregando" aria-label="Quadro de tarefas">
    <h1 class="titulo-secao">Quadro de tarefas</h1>

    <EstadoCarregamento v-if="carregando" mensagem="Carregando tarefas..." />

    <div v-else-if="erro" class="estado estado-erro">
      <p>Erro: {{ erro }}</p>

      <button type="button" class="botao" @click="carregarTarefas">Tentar Novamente</button>
    </div>

    <div v-else-if="tarefas.length === 0" class="estado">Nenhuma tarefa cadastrada.</div>
    <div v-else-if="tarefasFiltradas.length === 0 && temFiltrosAtivos" class="estado">
      Nenhuma tarefa encontrada com os critérios selecionados.
    </div>

    <div v-else class="quadro" role="region" aria-label="Quadro kanban por status">
      <section
        v-for="coluna in colunas"
        :key="coluna.status"
        class="coluna"
        aria-label="Coluna {{ coluna.titulo }}"
      >
        <h2 class="titulo-coluna">{{ coluna.titulo }}</h2>

        <div class="tarefas-coluna">
          <CartaoTarefa
            v-for="tarefa in tarefasPorStatus[coluna.status]"
            :key="tarefa.id"
            :tarefa="tarefa"
            @atualizada="aoAtualizarTarefa"
            @excluir="solicitarExclusao"
          />

          <p v-if="tarefasPorStatus[coluna.status].length === 0" class="coluna-vazia">
            Nenhuma tarefa.
          </p>
        </div>
      </section>
    </div>

    <p v-if="mensagemExclusao" class="estado estado-sucesso" role="status">
      {{ mensagemExclusao }}
    </p>

    <ConfirmacaoExclusao
      :tarefa="tarefaSelecionada"
      :excluindo="excluindo"
      :erro="erroExclusao"
      @confirmar="confirmarExclusao"
      @cancelar="cancelarExclusao"
    />
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
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) hsl(var(--background));
}

@media (max-width: 1100px) {
  .quadro {
    grid-template-columns: repeat(2, minmax(200px, 1fr));
  }
}

@media (max-width: 560px) {
  .quadro {
    grid-template-columns: 1fr;
  }
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

.estado-sucesso {
  border: 1px solid hsl(var(--terminal-green) / 0.5);
  background: hsl(var(--terminal-green) / 0.08);
  color: hsl(var(--terminal-green));
}

.botao {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.5rem 0.85rem;
  border: 1px solid hsl(var(--ring));
  border-radius: 4px;
  background: hsl(var(--ring) / 0.08);
  color: hsl(var(--ring));
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s ease;
}

.botao:hover {
  background: hsl(var(--ring) / 0.18);
  box-shadow: 0 0 12px hsl(var(--ring) / 0.15);
}
</style>
