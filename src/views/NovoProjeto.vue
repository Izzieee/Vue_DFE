<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { criarProjeto, type ErroApi } from '@/api'

const router = useRouter()

const nome = ref('')
const descricao = ref('')
const disciplina = ref('')

const salvando = ref(false)
const erro = ref<string | null>(null)

async function salvarProjeto() {
  salvando.value = true
  erro.value = null

  try {
    await criarProjeto({
      nome: nome.value,
      descricao: descricao.value,
      disciplina: disciplina.value,
      criadoEm: new Date().toISOString(),
    })

    router.push('/projetos')
  } catch (e) {
    const falha = e as ErroApi
    if (falha.status === 500) {
      erro.value = 'Erro interno do servidor. Tente novamente mais tarde.'
    } else {
      erro.value = falha.message || 'Erro ao salvar o projeto.'
    }
  } finally {
    salvando.value = false
  }
}
</script>
<template>
  <section class="pagina">
    <h1 class="titulo-secao">Novo Projeto</h1>

    <p v-if="erro" class="estado estado-erro" role="alert">Erro: {{ erro }}</p>

    <form class="formulario" @submit.prevent="salvarProjeto" novalidate>
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
          placeholder="Nome do projeto"
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
          placeholder="Descreva o projeto"
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
          placeholder="Disciplina ou curso"
        />
      </div>

      <button class="botao botao-salvar" type="submit" :disabled="salvando">
        {{ salvando ? 'Salvando...' : 'Salvar projeto' }}
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

.formulario {
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
  width: 100%;
  box-sizing: border-box;
  padding: var(--space-2);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--input));
  color: hsl(var(--foreground));
  font: inherit;
  font-size: 0.92rem;
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
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: all 0.3s var(--ease-glass);
}

.botao-salvar:hover:not(:disabled) {
  background: hsl(var(--ring) / 0.2);
  box-shadow: 0 0 18px hsl(var(--ring) / 0.2);
}

.botao-salvar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

@media (max-width: 560px) {
  .formulario {
    padding: var(--space-2);
  }

  .pagina {
    padding: var(--space-2);
  }
}
</style>
