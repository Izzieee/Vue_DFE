<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { atualizarProjeto, buscarProjeto } from '@/api'

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
    erro.value = (e as Error).message
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
    erro.value = (e as Error).message
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <section class="pagina">
    <h1 class="titulo-secao">Editar projeto</h1>

    <p v-if="carregando" class="estado">Carregando projeto...</p>
    <p v-else-if="erro" class="estado estado-erro">Erro:{{ erro }}</p>

    <form v-else class="formulario" @submit.prevent="salvarProjeto">
      <div class="campo">
        <label for="nome">Nome</label>
        <input id="nome" v-model="nome" type="text" />
      </div>

      <div class="campo">
        <label for="descricao">Descrição</label>
        <textarea id="descricao" v-model="descricao"></textarea>
      </div>

      <div class="campo">
        <label for="disciplina">Disciplina</label>
        <input id="disciplina" v-model="disciplina" type="text" />
      </div>

      <button class="botao-salvar" type="submit" :disabled="salvando">
        {{ salvando ? 'Salvando...' : 'Salvar alterações' }}
      </button>
    </form>
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

.campo label {
  color: hsl(var(--ring));
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.campo input,
.campo textarea {
  padding: var(--space-2);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font: inherit;
}

.campo textarea {
  min-height: 120px;
  resize: vertical;
}

.campo input:focus,
.campo textarea:focus {
  border-color: hsl(var(--ring));
  outline: none;
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
}

.botao-salvar:hover {
  background: hsl(var(--ring) / 0.2);
}

.estado {
  padding: var(--space-5) var(--space-3);
  border: 1px dashed hsl(var(--border));
  background: hsl(var(--card) / 0.9);
  color: hsl(var(--muted-foreground));
  text-align: center;
}

.estado-erro {
  border-color: hsl(var(--destructive) / 0.5);
  color: hsl(var(--destructive-foreground));
}
</style>
