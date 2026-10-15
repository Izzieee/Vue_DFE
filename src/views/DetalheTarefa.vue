<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { buscarProjeto, buscarTarefa } from '@/api'
import type { Tarefa } from '@/tipos'

const rota = useRoute()
const tarefa = ref<Tarefa | null>(null)
const nomeProjeto = ref<string | null>(null)
const carregando = ref(true)
const erro = ref<string | null>(null)

onMounted(async () => {
  try {
    const resultado = await buscarTarefa(rota.params.id as string)
    tarefa.value = resultado

    const projeto = await buscarProjeto(resultado.projetoId)
    nomeProjeto.value = projeto.nome
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
.tarefa {
  padding: 24px;
  border: 1px solid #e3e8f0;
  border-left: 4px solid #c83131;
  border-radius: 12px;
  background: #ffffff;
}

.tarefa-cabecalho {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tarefa-cabecalho h1 {
  margin: 0;
  color: #0a1d50;
  font-size: 24px;
}

.etiquetas {
  display: flex;
  gap: 8px;
}

.etiqueta {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status,
.prioridade {
  background: #eef1f6;
  color: #596579;
}

.status[data-status='a-fazer'] {
  background: #eef1f6;
  color: #596579;
}

.status[data-status='em-andamento'] {
  background: #e4edff;
  color: #2b5fd9;
}

.status[data-status='em-revisao'] {
  background: #fff1dc;
  color: #b8730a;
}

.status[data-status='concluida'] {
  background: #e2f5ea;
  color: #1f8a4c;
}

.prioridade[data-prioridade='baixa'] {
  background: #eef1f6;
  color: #596579;
}

.prioridade[data-prioridade='media'] {
  background: #fff1dc;
  color: #b8730a;
}

.prioridade[data-prioridade='alta'] {
  background: #ffe3e6;
  color: #c83131;
}

.tarefa-descricao {
  margin: 16px 0 24px;
  color: #596579;
  font-size: 15px;
}

.detalhes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 16px 0 0;
  border-top: 1px solid #e3e8f0;
}

.detalhe dt {
  margin-bottom: 4px;
  color: #90737e;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.detalhe dd {
  margin: 0;
  color: #252a34;
  font-size: 15px;
}

.detalhe a {
  color: #c83131;
  font-weight: 600;
  text-decoration: none;
}

.detalhe a:hover {
  text-decoration: underline;
}
</style>
