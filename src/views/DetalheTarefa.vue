<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { buscarProjeto, buscarTarefa } from '@/api'
import type { ErroApi } from '@/api'
import type { Tarefa } from '@/tipos'
import EstadoCarregamento from '@/components/EstadoCarregamento.vue'

const rota = useRoute()
const tarefa = ref<Tarefa | null>(null)
const nomeProjeto = ref<string | null>(null)
const carregando = ref(true)
const erro = ref<string | null>(null)

async function carregarTarefa() {
  carregando.value = true
  erro.value = null
  tarefa.value = null
  nomeProjeto.value = ''

  try {
    const resultado = await buscarTarefa(rota.params.id as string)
    tarefa.value = resultado

    const projeto = await buscarProjeto(resultado.projetoId)
    nomeProjeto.value = projeto.nome
  } catch (e) {
    const erroApi = e as ErroApi

    if (erroApi.status === 404) {
      erro.value = 'Tarefa ou projeto não encontrado.'
    } else {
      erro.value = erroApi.message
    }
  } finally {
    carregando.value = false
  }
}

onMounted(carregarTarefa)
</script>

<template>
  <section class="pagina" :aria-busy="carregando">
    <EstadoCarregamento v-if="carregando" mensagem="Carregando tarefa..." />
    <div v-else-if="erro" class="estado estado-erro estado-erro-combustao" role="alert">
      <p class="texto-erro">
        <span class="erro-marcador" aria-hidden="true">!</span>
        {{ erro }}
      </p>

      <div class="botoes-erro">
        <RouterLink class="botao botao-secundario" to="/">Voltar para tarefas</RouterLink>
        <button type="button" class="botao botao-primario" @click="carregarTarefa">Tentar Novamente</button>
      </div>
    </div>

    <article v-else-if="tarefa" class="tarefa">
      <header class="tarefa-cabecalho">
        <h1>{{ tarefa.titulo }}</h1>
        <div class="etiquetas">
          <span class="etiqueta status" :data-status="tarefa.status">{{ tarefa.status }}</span>
          <span class="etiqueta prioridade" :data-prioridade="tarefa.prioridade">
            {{ tarefa.prioridade }}
          </span>
        </div>
      </header>

      <p class="tarefa-descricao">{{ tarefa.descricao }}</p>

      <RouterLink class="botao-editar" :to="`/tarefas/${tarefa.id}/editar`">
        Editar tarefa
      </RouterLink>

      <dl class="detalhes">
        <div class="detalhe">
          <dt>Responsável</dt>
          <dd>{{ tarefa.responsavel }}</dd>
        </div>
        <div class="detalhe">
          <dt>Prazo</dt>
          <dd>{{ tarefa.prazo }}</dd>
        </div>
        <div class="detalhe">
          <dt>Projeto</dt>
          <dd>
            <RouterLink :to="`/projetos/${tarefa.projetoId}`">
              {{ nomeProjeto ?? tarefa.projetoId }}
            </RouterLink>
          </dd>
        </div>
      </dl>
    </article>
  </section>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.tarefa {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid hsl(var(--border));
  border-left: 3px solid hsl(var(--ring));
  background: hsl(var(--card) / 0.94);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 4px 24px rgba(0, 0, 0, 0.4);
}

.tarefa-cabecalho {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.tarefa-cabecalho h1 {
  margin: 0;
  color: hsl(var(--foreground));
  font-size: clamp(1.3rem, 1.05rem + 0.9vw, 1.7rem);
  letter-spacing: 0.06em;
  text-shadow: 0 0 20px hsl(var(--ring) / 0.35);
}

.etiquetas {
  display: flex;
  gap: var(--space-2);
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

.status {
  color: hsl(var(--terminal-dim));
}

.status[data-status='em-andamento'] {
  color: hsl(var(--terminal-cyan));
}

.status[data-status='em-revisao'] {
  color: hsl(var(--terminal-amber));
}

.status[data-status='concluida'] {
  color: hsl(var(--terminal-green));
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

.tarefa-descricao {
  margin: 0;
  color: hsl(var(--muted-foreground));
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
  font-size: 0.92rem;
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

.botao-editar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: var(--space-1) var(--space-2);
  border: 1px solid hsl(var(--ring));
  background: hsl(var(--ring) / 0.08);
  color: hsl(var(--ring));
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.3s var(--ease-glass);
}

.botao-editar:hover {
  background: hsl(var(--ring) / 0.18);
  box-shadow: 0 0 12px hsl(var(--ring) / 0.15);
}

.detalhes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-3);
  margin: 0;
  padding-top: var(--space-3);
  border-top: 1px solid hsl(var(--border));
}

.detalhe dt {
  margin-bottom: var(--space-1);
  color: hsl(var(--ring));
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.detalhe dd {
  margin: 0;
  padding-left: var(--space-2);
  border-left: 2px solid hsl(var(--border));
  color: hsl(var(--muted-foreground));
  font-size: 0.92rem;
}

.detalhe a {
  color: hsl(var(--ring));
  font-weight: 700;
  text-decoration: none;
}

.detalhe a:hover {
  text-decoration: underline;
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

.estado-erro-combustao {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
  text-align: center;
}

.texto-erro {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin: 0;
}

.botoes-erro {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  flex-wrap: wrap;
}

.botao-primario {
  background: hsl(var(--ring));
  border-color: hsl(var(--ring));
  color: hsl(var(--background));
  box-shadow: 0 0 20px hsl(var(--ring) / 0.4);
}

.botao-primario:hover {
  background: hsl(var(--ring));
  color: hsl(var(--background));
}

.botao-secundario {
  background: hsl(var(--secondary));
  border-color: hsl(var(--border));
  color: hsl(var(--muted-foreground));
}

.botao-secundario:hover {
  border-color: hsl(var(--ring));
  color: hsl(var(--ring));
}

.erro-marcador {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border: 1px solid hsl(var(--destructive));
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
  margin-right: var(--space-1);
  flex-shrink: 0;
}
</style>
