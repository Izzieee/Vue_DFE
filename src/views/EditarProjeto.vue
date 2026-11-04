<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { atualizarProjeto, buscarProjeto, type ErroApi } from '@/api'
import { RouterLink } from 'vue-router'
import EstadoCarregamento from '@/components/EstadoCarregamento.vue'

const route = useRoute()
const router = useRouter()

const nome = ref('')
const descricao = ref('')
const disciplina = ref('')

const carregando = ref(true)
const erro = ref<string | null>(null)
const salvando = ref(false)

onMounted(async () => {
  try {
    const id = String(route.params.id)
    const projeto = await buscarProjeto(id)

    nome.value = projeto.nome
    descricao.value = projeto.descricao
    disciplina.value = projeto.disciplina
  } catch (e) {
    const falha = e as ErroApi

    if (falha.status === 404) {
      erro.value = 'Projeto não encontrado'
    } else {
      erro.value = falha.message
    }
  } finally {
    carregando.value = false
  }
})

async function salvarProjeto() {
  const id = String(route.params.id)

  salvando.value = true
  erro.value = null

  try {
    await atualizarProjeto(id, {
      nome: nome.value,
      descricao: descricao.value,
      disciplina: disciplina.value,
    })

    router.push(`/projetos/${id}`)
  } catch (e) {
    const falha = e as ErroApi

    if (falha.status === 404) {
      erro.value = 'Projeto não encontrado'
    } else if (falha.status === 500) {
      erro.value = 'Erro interno do servidor. Tente novamente mais tarde.'
    } else {
      erro.value = falha.message
    }
  } finally {
    salvando.value = false
  }
}
</script>
<template>
  <section class="pagina" :aria-busy="carregando">
    <h1 class="titulo-secao">Editar projeto</h1>

    <EstadoCarregamento v-if="carregando" mensagem="Carregando projeto..." />
    <div v-else-if="erro" class="estado estado-erro">
      <p>{{ erro }}</p>

      <RouterLink class="botao-voltar" to="/projetos">Voltar para Projetos</RouterLink>
    </div>

    <form v-else class="formulario" @submit.prevent="salvarProjeto" novalidate>
      <div class="campo">
        <label for="nome" class="rotulo">Nome</label>
        <input
          id="nome"
          name="nome"
          v-model="nome"
          type="text"
          required
          :disabled="salvando"
          :aria-invalid="Boolean(erro)"
        />
      </div>

      <div class="campo">
        <label for="descricao" class="rotulo">Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          v-model="descricao"
          rows="4"
          required
          :disabled="salvando"
        ></textarea>
      </div>

      <div class="campo">
        <label for="disciplina" class="rotulo">Disciplina</label>
        <input
          id="disciplina"
          name="disciplina"
          v-model="disciplina"
          type="text"
          required
          :disabled="salvando"
        />
      </div>

      <button class="botao botao-salvar" type="submit" :disabled="salvando">
        {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
      </button>
    </form>
  </section>
</template>
<style>
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
  text-shadow: 0 0 20px hsl(var(--ring) / 0.35);
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid hsl(var(--border));
  border-left: 3px solid hsl(var(--ring));
  background: hsl(var(--card) / 0.94);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.rotulo {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: hsl(var(--ring));
}

.campo input,
.campo textarea {
  padding: var(--space-2);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--input));
  color: hsl(var(--foreground));
  font: inherit;
  font-size: 0.92rem;
  width: 100%;
  box-sizing: border-box;
}

.campo textarea {
  min-height: 120px;
  resize: vertical;
}

.campo input:focus,
.campo textarea:focus {
  border-color: hsl(var(--ring));
  outline: var(--focus-ring);
  outline-offset: 2px;
}

.campo input:disabled,
.campo textarea:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.botao-salvar {
  width: fit-content;
  padding: var(--space-2) var(--space-3);
  border: 1px solid hsl(var(--ring));
  background: hsl(var(--ring) / 0.1);
  color: hsl(var(--ring));
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: all 0.3s var(--ease-glass);
}

.botao-salvar:hover:not(:disabled) {
  background: hsl(var(--ring) / 0.2);
}

.botao-salvar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.botao-voltar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.4rem 0.75rem;
  border: 1px solid hsl(var(--ring));
  background: hsl(var(--ring) / 0.08);
  color: hsl(var(--ring));
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s ease;
}

.botao-voltar:hover {
  background: hsl(var(--ring) / 0.18);
  box-shadow: 0 0 12px hsl(var(--ring) / 0.15);
}

.estado {
  padding: var(--space-5) var(--space-3);
  border: 1px dashed hsl(var(--border));
  background: hsl(var(--card) / 0.9);
  color: hsl(var(--muted-foreground));
  text-align: center;
  text-transform: uppercase;
}

.estado-erro {
  border: 1px solid hsl(var(--destructive) / 0.5);
  background: hsl(var(--destructive) / 0.06);
  color: hsl(var(--destructive-foreground));
}

@media (max-width: 560px) {
  .formulario {
    padding: var(--space-2);
  }

  .pagina {
    padding: var(--space-2);
  }
}
</style>
