<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { buscarProjetoComTarefas } from '@/api'
import type { ErroApi } from '@/api'
import type { Projeto, Tarefa } from '@/tipos'
import CartaoTarefa from '@/components/CartaoTarefa.vue'
import ConfirmacaoExclusao from '@/components/ConfirmacaoExclusao.vue'
import { useExclusaoTarefa } from '@/exclusaoTarefa'

const route = useRoute()
const projeto = ref<Projeto | null>(null)
const tarefas = ref<Tarefa[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

const {
  tarefaSelecionada,
  excluindo,
  erro: erroExclusao,
  mensagem: mensagemExclusao,
  solicitarExclusao,
  cancelarExclusao,
  confirmarExclusao,
} = useExclusaoTarefa((tarefa) => {
  // A lista do projeto só perde a tarefa depois que a API confirma a exclusão.
  tarefas.value = tarefas.value.filter((item) => item.id !== tarefa.id)
})

/** Aplica nas tarefas do projeto o status confirmado pela API. */
function aoAtualizarTarefa(atualizada: Tarefa) {
  const indice = tarefas.value.findIndex((tarefa) => tarefa.id === atualizada.id)

  if (indice !== -1) {
    tarefas.value[indice] = atualizada
  }
}

async function carregarProjeto() {
  carregando.value = true
  erro.value = null
  projeto.value = null
  tarefas.value = []

  try {
    const id = String(route.params.id)
    const resultado = await buscarProjetoComTarefas(id)

    projeto.value = resultado
    tarefas.value = resultado.tarefas ?? []
  } catch (e) {
    const erroApi = e as ErroApi

    if (erroApi.status === 404) {
      erro.value = 'Projeto não encontrado'
    } else {
      erro.value = erroApi.message
    }
  } finally {
    carregando.value = false
  }
}

onMounted(carregarProjeto)
</script>

<template>
  <section class="pagina">
    <p v-if="carregando" class="estado">Carregando...</p>
    <div v-else-if="erro" class="estado estado-erro">
      <p>{{ erro }}</p>

      <RouterLink class="botao-editar" to="/projetos">Voltar para projetos</RouterLink>

      <button type="button" class="botao" @click="carregarProjeto">Tentar Novamente</button>
    </div>

    <template v-else-if="projeto">
      <header class="projeto-cabecalho">
        <h1>{{ projeto.nome }}</h1>
        <p class="projeto-descricao">{{ projeto.descricao }}</p>
        <span class="tag-disciplina">{{ projeto.disciplina }}</span>

        <div class="projeto-acoes">
          <RouterLink class="botao-editar" :to="`/projetos/${projeto.id}/editar`"
            >Editar projeto</RouterLink
          >
          <RouterLink
            class="botao-editar"
            :to="{ path: '/tarefas/nova', query: { projetoId: projeto.id } }"
            >+ Nova Tarefa</RouterLink
          >
        </div>
      </header>

      <h2 class="titulo-secao">Tarefas</h2>
      <p v-if="mensagemExclusao" class="estado estado-sucesso" role="status">
        {{ mensagemExclusao }}
      </p>
      <p v-if="tarefas.length === 0" class="estado">Nenhuma tarefa.</p>
      <div v-else class="lista-tarefas">
        <CartaoTarefa
          v-for="tarefa in tarefas"
          :key="tarefa.id"
          :tarefa="tarefa"
          @atualizada="aoAtualizarTarefa"
          @excluir="solicitarExclusao"
        />
      </div>
    </template>

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

.projeto-cabecalho {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid hsl(var(--border));
  border-left: 3px solid hsl(var(--ring));
  background: hsl(var(--card) / 0.94);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 4px 24px rgba(0, 0, 0, 0.4);
}

.projeto-cabecalho h1 {
  margin: 0;
  color: hsl(var(--ring));
  font-size: clamp(1.4rem, 1.1rem + 1vw, 1.9rem);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 0 0 20px hsl(var(--ring) / 0.4);
}

.projeto-descricao {
  margin: 0;
  color: hsl(var(--muted-foreground));
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

.tag-disciplina {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border: 1px solid hsl(var(--ring) / 0.5);
  background: hsl(var(--ring) / 0.1);
  color: hsl(var(--ring));
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.projeto-acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  flex-wrap: wrap;
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

.titulo-secao {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  padding-bottom: var(--space-2);
  border-bottom: 3px solid hsl(var(--border));
  color: hsl(var(--ring));
  font-size: clamp(1.1rem, 0.95rem + 0.6vw, 1.4rem);
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
