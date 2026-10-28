<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { atualizarStatusTarefa } from '@/api'
import type { Status, Tarefa } from '@/tipos'
import { ROTULOS_STATUS, STATUS_VALIDOS } from '@/validacao'

const props = defineProps<{
  tarefa: Tarefa
}>()

const emit = defineEmits<{
  /** Emitido somente depois que a API confirma a gravação do novo status. */
  (evento: 'atualizada', tarefa: Tarefa): void
}>()

const statusSelecionado = ref<Status>(props.tarefa.status)
const salvando = ref(false)
const erro = ref<string | null>(null)

const idStatus = `status-${props.tarefa.id}`
const idErroStatus = `erro-status-${props.tarefa.id}`

// Mantém o seletor alinhado ao status confirmado pela API.
watch(
  () => props.tarefa.status,
  (status) => {
    statusSelecionado.value = status
  },
)

async function alterarStatus() {
  const anterior = props.tarefa.status

  if (statusSelecionado.value === anterior) {
    return
  }

  salvando.value = true
  erro.value = null

  try {
    const atualizada = await atualizarStatusTarefa(props.tarefa.id, statusSelecionado.value)
    emit('atualizada', atualizada)
  } catch (e) {
    // A alteração só é indicada como concluída depois da confirmação da API.
    statusSelecionado.value = anterior
    erro.value = (e as Error).message || 'Não foi possível alterar o status da tarefa.'
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <article class="cartao" :data-prioridade="tarefa.prioridade">
    <header class="cartao-cabecalho">
      <h3 class="cartao-titulo">
        <RouterLink :to="`/tarefas/${tarefa.id}`">
          {{ tarefa.titulo }}
        </RouterLink>
      </h3>

      <div class="status-controle" :data-status="statusSelecionado">
        <label class="apenas-leitor" :for="idStatus">Status da tarefa {{ tarefa.titulo }}</label>
        <select
          :id="idStatus"
          v-model="statusSelecionado"
          class="seletor-status"
          :disabled="salvando"
          :aria-busy="salvando"
          :aria-describedby="erro ? idErroStatus : undefined"
          @change="alterarStatus"
        >
          <option v-for="status in STATUS_VALIDOS" :key="status" :value="status">
            {{ ROTULOS_STATUS[status] }}
          </option>
        </select>
        <span class="apenas-leitor" role="status">
          {{ salvando ? 'Salvando o novo status...' : '' }}
        </span>
      </div>
    </header>

    <p v-if="erro" :id="idErroStatus" class="erro-status" role="alert">
      <span class="erro-marcador" aria-hidden="true">!</span>
      {{ erro }}
    </p>

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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid hsl(var(--border));
  border-left: 3px solid hsl(var(--ring));
  background-color: hsl(var(--card) / 0.94);
  transition: all 0.3s var(--ease-glass);
}

.cartao:hover {
  border-color: hsl(var(--ring));
  background-color: hsl(var(--secondary) / 0.96);
  transform: translateY(-3px);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.45),
    0 0 24px hsl(var(--ring) / 0.15);
}

.cartao[data-prioridade='alta'] {
  border-color: hsl(var(--priority-high) / 0.55);
  border-left-color: hsl(var(--priority-high));
  background-image: linear-gradient(
    135deg,
    hsl(var(--priority-high) / 0.26),
    hsl(var(--priority-high) / 0.08)
  );
}

.cartao[data-prioridade='media'] {
  border-color: hsl(var(--priority-medium) / 0.55);
  border-left-color: hsl(var(--priority-medium));
  background-image: linear-gradient(
    135deg,
    hsl(var(--priority-medium) / 0.24),
    hsl(var(--priority-medium) / 0.07)
  );
}

.cartao[data-prioridade='baixa'] {
  border-color: hsl(var(--priority-low) / 0.5);
  border-left-color: hsl(var(--priority-low));
  background-image: linear-gradient(
    135deg,
    hsl(var(--priority-low) / 0.22),
    hsl(var(--priority-low) / 0.06)
  );
}

.cartao-cabecalho {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.cartao-titulo {
  min-width: 0;
  margin: 0;
  overflow: hidden;
  font-size: 0.98rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cartao-titulo a {
  color: hsl(var(--foreground));
  text-decoration: none;
}

.cartao-titulo a:hover {
  color: hsl(var(--ring));
  text-decoration: underline;
}

.cartao-descricao {
  margin: 0;
  color: hsl(var(--muted-foreground));
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
  font-size: 0.82rem;
}

.cartao-rodape {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: auto;
  padding-top: var(--space-1);
  color: hsl(var(--muted-foreground));
  font-size: 0.72rem;
}

.cartao-responsavel {
  color: hsl(var(--foreground));
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.cartao-prazo {
  margin-left: auto;
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
  white-space: nowrap;
}

.etiqueta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border: 1px solid currentColor;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

.etiqueta::before {
  content: '';
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: currentColor;
}

.status-controle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border: 1px solid currentColor;
  color: hsl(var(--terminal-dim));
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-controle::before {
  content: '';
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: currentColor;
}

.status-controle[data-status='em-andamento'] {
  color: hsl(var(--terminal-cyan));
}

.status-controle[data-status='em-revisao'] {
  color: hsl(var(--terminal-amber));
}

.status-controle[data-status='concluida'] {
  color: hsl(var(--terminal-green));
}

.seletor-status {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}

.seletor-status:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 3px;
}

.seletor-status:disabled {
  cursor: progress;
  opacity: 0.65;
}

.seletor-status option {
  background: hsl(var(--card));
  color: hsl(var(--foreground));
  letter-spacing: normal;
  text-transform: none;
}

.erro-status {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  margin: 0;
  color: hsl(var(--destructive));
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}

/* Marcador do erro: identifica a mensagem sem depender apenas da cor. */
.erro-marcador {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  border: 1px solid hsl(var(--destructive));
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
}

/* Conteúdo lido por tecnologias assistivas, mas não exibido na tela. */
.apenas-leitor {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.prioridade {
  color: hsl(var(--priority-low));
}

.prioridade[data-prioridade='media'] {
  color: hsl(var(--priority-medium));
}

.prioridade[data-prioridade='alta'] {
  color: hsl(var(--priority-high));
}
</style>
