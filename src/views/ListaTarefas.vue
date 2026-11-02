<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listarTarefas } from '@/api'
import type { Tarefa } from '@/tipos'
import CartaoTarefa from '@/components/CartaoTarefa.vue'
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

/** Aplica na lista o status confirmado pela API, mantendo os demais dados. */
function aoAtualizarTarefa(atualizada: Tarefa) {
  const indice = tarefas.value.findIndex((tarefa) => tarefa.id === atualizada.id)

  if (indice !== -1) {
    tarefas.value[indice] = atualizada
  }
}

const tarefasFiltradas = computed(() => {
  return filtrarTarefas(tarefas.value)
})

const temFiltrosAtivos = computed(() =>
  Boolean(termoBusca.value.trim() || filtroStatus.value || filtroPrioridade.value),
)

function limparFiltros() {
  termoBusca.value = ''
  filtroStatus.value = ''
  filtroPrioridade.value = ''
}
</script>

<template>
  <section class="pagina">
    <h1 class="titulo-secao">Tarefas</h1>

    <div class="filtros">
      <div class="filtro-campo">
        <label for="busca-titulo" class="rotulo-filtro">Buscar por título</label>
        <input
          id="busca-titulo"
          name="busca-titulo"
          v-model="termoBusca"
          type="text"
          placeholder="Digite o título da tarefa..."
          class="campo-input"
        />
      </div>

      <div class="filtro-campo">
        <label for="filtro-status" class="rotulo-filtro">Status</label>
        <select id="filtro-status" name="filtro-status" v-model="filtroStatus" class="campo-input">
          <option value="">Todos</option>
          <option value="a-fazer">A fazer</option>
          <option value="em-andamento">Em andamento</option>
          <option value="em-revisao">Em revisão</option>
          <option value="concluida">Concluída</option>
        </select>
      </div>

      <div class="filtro-campo">
        <label for="filtro-prioridade" class="rotulo-filtro">Prioridade</label>
        <select
          id="filtro-prioridade"
          name="filtro-prioridade"
          v-model="filtroPrioridade"
          class="campo-input"
        >
          <option value="">Todas</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <button v-if="temFiltrosAtivos" type="button" class="botao" @click="limparFiltros">
        Limpar filtros
      </button>
    </div>

    <p v-if="carregando" class="estado">Carregando...</p>
    <div v-else-if="erro" class="estado estado-erro">
      <p>Erro: {{ erro }}</p>

      <button type="button" class="botao" @click="carregarTarefas">Tentar Novamente</button>
    </div>
    <p v-else-if="tarefas.length === 0" class="estado">Nenhuma tarefa.</p>
    <p v-else-if="tarefasFiltradas.length === 0" class="estado">
      Nenhuma tarefa encontrada com os critérios selecionados.
    </p>

    <div v-else class="lista-tarefas">
      <CartaoTarefa
        v-for="tarefa in tarefasFiltradas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @atualizada="aoAtualizarTarefa"
      />
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

.busca {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.rotulo-busca {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: hsl(var(--ring));
}

.campo-input {
  width: 100%;
  max-width: 400px;
  padding: var(--space-2);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--input));
  color: hsl(var(--foreground));
  font: inherit;
  font-size: 0.92rem;
}

.campo-input:focus {
  border-color: hsl(var(--ring));
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.filtros {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

@media (min-width: 680px) {
  .filtros {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
  }
}

.filtro-campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.rotulo-filtro {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: hsl(var(--ring));
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
  color: hsl(var(--ring));
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
