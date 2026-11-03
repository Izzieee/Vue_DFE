<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import type { Tarefa } from '@/tipos'

const props = defineProps<{
  /** Tarefa que será excluída. Com `null`, o diálogo não é exibido. */
  tarefa: Tarefa | null
  /** Bloqueia os botões enquanto a API processa a exclusão. */
  excluindo?: boolean
  /** Mensagem devolvida quando a exclusão falha. */
  erro?: string | null
}>()

const emit = defineEmits<{
  (evento: 'confirmar'): void
  (evento: 'cancelar'): void
}>()

const idBase = useId()
const idTitulo = `${idBase}-titulo`
const idDescricao = `${idBase}-descricao`

const dialogo = ref<HTMLElement | null>(null)
const botaoCancelar = ref<HTMLButtonElement | null>(null)

/** Guarda quem abriu o diálogo para devolver o foco ao fechar. */
let focoAnterior: HTMLElement | null = null

/** Devolve o foco a quem abriu o diálogo, evitando que ele se perca no `body`. */
function devolverFoco() {
  if (focoAnterior?.isConnected) {
    focoAnterior.focus()
  }
  focoAnterior = null
}

watch(
  () => props.tarefa,
  async (tarefa) => {
    if (!tarefa) {
      // O diálogo é removido por `v-if`, então o componente continua montado:
      // o foco precisa ser devolvido aqui, não apenas em `onBeforeUnmount`.
      devolverFoco()
      return
    }

    focoAnterior = document.activeElement as HTMLElement | null
    await nextTick()
    // O foco começa na opção segura, evitando uma exclusão acidental.
    botaoCancelar.value?.focus()
  },
)

onBeforeUnmount(devolverFoco)

function cancelar() {
  if (!props.excluindo) {
    emit('cancelar')
  }
}

/**
 * Mantém o foco dentro do diálogo: Esc cancela e Tab circula apenas entre os
 * controles disponíveis, sem alcançar o restante da página.
 */
function aoTeclar(evento: KeyboardEvent) {
  if (evento.key === 'Escape') {
    evento.preventDefault()
    cancelar()
    return
  }

  if (evento.key !== 'Tab' || !dialogo.value) {
    return
  }

  const focaveis = Array.from(
    dialogo.value.querySelectorAll<HTMLElement>('button:not([disabled])'),
  )

  if (focaveis.length === 0) {
    return
  }

  const primeiro = focaveis[0]
  const ultimo = focaveis[focaveis.length - 1]

  if (!primeiro || !ultimo) {
    return
  }

  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault()
    ultimo.focus()
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault()
    primeiro.focus()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="tarefa" class="sobreposicao" @click.self="cancelar">
      <div
        ref="dialogo"
        class="dialogo"
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="idTitulo"
        :aria-describedby="idDescricao"
        :aria-busy="excluindo"
        @keydown="aoTeclar"
      >
        <h2 :id="idTitulo" class="dialogo-titulo">Excluir tarefa</h2>

        <p :id="idDescricao" class="dialogo-texto">
          Tem certeza de que deseja excluir a tarefa
          <strong>{{ tarefa.titulo }}</strong>? Essa ação não pode ser desfeita.
        </p>

        <p v-if="erro" class="dialogo-erro" role="alert">
          <span class="erro-marcador" aria-hidden="true">!</span>
          {{ erro }}
        </p>

        <footer class="dialogo-acoes">
          <button
            ref="botaoCancelar"
            type="button"
            class="botao"
            :disabled="excluindo"
            @click="cancelar"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="botao botao-perigo"
            :disabled="excluindo"
            @click="emit('confirmar')"
          >
            {{ excluindo ? 'Excluindo...' : 'Excluir' }}
          </button>
        </footer>

        <span class="apenas-leitor" role="status">
          {{ excluindo ? 'Excluindo a tarefa...' : '' }}
        </span>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.sobreposicao {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: var(--space-3);
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.dialogo {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid hsl(var(--destructive) / 0.6);
  border-left: 3px solid hsl(var(--destructive));
  background: hsl(var(--card));
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.6),
    0 0 32px hsl(var(--destructive) / 0.15);
}

.dialogo-titulo {
  margin: 0;
  color: hsl(var(--destructive));
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.dialogo-texto {
  margin: 0;
  color: hsl(var(--muted-foreground));
  font-size: 0.9rem;
}

.dialogo-texto strong {
  color: hsl(var(--foreground));
}

.dialogo-erro {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  margin: 0;
  color: hsl(var(--destructive));
  font-size: 0.82rem;
}

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

.dialogo-acoes {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.botao {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  padding: var(--space-2) var(--space-3);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--secondary));
  color: hsl(var(--muted-foreground));
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s var(--ease-glass);
}

.botao:hover:not(:disabled) {
  border-color: hsl(var(--ring));
  color: hsl(var(--ring));
}

.botao-perigo {
  border-color: hsl(var(--destructive));
  background: hsl(var(--destructive) / 0.12);
  color: hsl(var(--destructive));
}

.botao-perigo:hover:not(:disabled) {
  background: hsl(var(--destructive) / 0.22);
  color: hsl(var(--destructive));
  box-shadow: 0 0 16px hsl(var(--destructive) / 0.2);
}

.botao:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
</style>
