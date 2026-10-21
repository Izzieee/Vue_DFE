<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { listarProjetos } from '@/api'
import { validarTarefa, type Campo, type Erros } from '@/validacao'
import type { Tarefa, Projeto } from '@/tipos'

interface Props {
  inicial?: Tarefa
  /** Informa se o formulário cria ou edita. Por padrão, deduz a partir do id. */
  modo?: 'criar' | 'editar'
  /** Bloqueia os campos enquanto a gravação está em andamento. */
  enviando?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', payload: Omit<Tarefa, 'id'>): void
}>()

const projetos = ref<Projeto[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

/** Mensagens de erro dos campos, indexadas pelo nome do campo. */
const erros = ref<Erros>({})
/** Os erros só passam a ser exibidos depois da primeira tentativa de envio. */
const envioTentado = ref(false)
/**
 * Trava o envio de forma síncrona. A prop `enviando` só chega ao componente depois
 * que a tela re-renderiza, o que não impede cliques rápidos em sequência.
 */
const envioBloqueado = ref(false)

// Sem `modo` explícito, uma tarefa já persistida (com id) indica edição.
const modo = computed(() => props.modo ?? (props.inicial?.id ? 'editar' : 'criar'))

const titulo = computed(() => (modo.value === 'editar' ? 'Editar tarefa' : 'Nova tarefa'))

/** Há uma requisição em andamento: os controles ficam bloqueados. */
const ocupado = computed(() => props.enviando || envioBloqueado.value)

const rotuloBotao = computed(() => {
  if (ocupado.value) {
    return modo.value === 'editar' ? 'Salvando...' : 'Criando...'
  }
  return modo.value === 'editar' ? 'Salvar alterações' : 'Criar tarefa'
})

const form = ref<Omit<Tarefa, 'id'>>({
  projetoId: '',
  titulo: '',
  descricao: '',
  status: 'a-fazer',
  prioridade: 'media',
  responsavel: '',
  prazo: '',
})

onMounted(async () => {
  try {
    projetos.value = await listarProjetos()
  } catch (e) {
    erro.value = (e as Error).message
  } finally {
    carregando.value = false
  }
})

watch(
  () => props.inicial,
  (inicial) => {
    if (inicial) {
      form.value = {
        projetoId: inicial.projetoId,
        titulo: inicial.titulo,
        descricao: inicial.descricao,
        status: inicial.status,
        prioridade: inicial.prioridade,
        responsavel: inicial.responsavel,
        prazo: inicial.prazo,
      }
    }
  },
  { immediate: true },
)

function handleSubmit(event: Event) {
  event.preventDefault()

  // Evita envios duplicados enquanto a requisição anterior não termina.
  if (props.enviando || envioBloqueado.value) {
    return
  }

  envioBloqueado.value = true
  envioTentado.value = true

  const resultado = validarTarefa(form.value, projetos.value)
  erros.value = resultado

  // Só envia quando todos os campos obrigatórios estiverem válidos.
  if (Object.keys(resultado).length > 0) {
    envioBloqueado.value = false
    return
  }

  emit('submit', { ...form.value })

  // Caso a tela não controle a prop `enviando`, a trava é liberada no mesmo ciclo.
  nextTick(() => {
    if (!props.enviando) {
      envioBloqueado.value = false
    }
  })
}

// A trava é liberada quando a tela avisa que a requisição terminou, mesmo com falha.
watch(
  () => props.enviando,
  (enviando) => {
    if (!enviando) {
      envioBloqueado.value = false
    }
  },
)

// Depois da primeira tentativa de envio, os erros são recalculados a cada alteração
// para que o usuário consiga corrigir os campos que foram sinalizados.
watch(
  form,
  () => {
    if (!envioTentado.value) {
      return
    }

    const resultado = validarTarefa(form.value, projetos.value)
    const atualizados: Erros = { ...erros.value }

    for (const campo of Object.keys(atualizados) as Campo[]) {
      if (resultado[campo]) {
        atualizados[campo] = resultado[campo]
      } else {
        delete atualizados[campo]
      }
    }

    erros.value = atualizados
  },
  { deep: true },
)

/** Identificador da mensagem de erro de um campo. */
function idErro(campo: Campo): string {
  return `erro-${campo}`
}
</script>

<template>
  <section class="formulario">
    <h1 class="titulo-secao">{{ titulo }}</h1>

    <p v-if="carregando" class="estado">Carregando projetos...</p>
    <p v-else-if="erro" class="estado estado-erro">Erro: {{ erro }}</p>

    <form v-else @submit="handleSubmit" class="form" :aria-busy="ocupado" novalidate>
      <div class="campo" :class="{ 'campo-invalido': erros.titulo }">
        <label for="titulo" class="rotulo">Título</label>
        <input
          id="titulo"
          name="titulo"
          v-model="form.titulo"
          type="text"
          required
          :disabled="ocupado"
          placeholder="Título da tarefa"
        />
        <p v-if="erros.titulo" class="erro-campo" :id="idErro('titulo')">
          {{ erros.titulo }}
        </p>
      </div>

      <div class="campo" :class="{ 'campo-invalido': erros.descricao }">
        <label for="descricao" class="rotulo">Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          v-model="form.descricao"
          rows="4"
          required
          :disabled="ocupado"
          placeholder="Descreva a tarefa"
        ></textarea>
        <p v-if="erros.descricao" class="erro-campo" :id="idErro('descricao')">
          {{ erros.descricao }}
        </p>
      </div>

      <div class="linha">
        <div class="campo" :class="{ 'campo-invalido': erros.status }">
          <label for="status" class="rotulo">Status</label>
          <select id="status" name="status" v-model="form.status" required :disabled="ocupado">
            <option value="a-fazer">A fazer</option>
            <option value="em-andamento">Em andamento</option>
            <option value="em-revisao">Em revisão</option>
            <option value="concluida">Concluída</option>
          </select>
          <p v-if="erros.status" class="erro-campo" :id="idErro('status')">
            {{ erros.status }}
          </p>
        </div>

        <div class="campo" :class="{ 'campo-invalido': erros.prioridade }">
          <label for="prioridade" class="rotulo">Prioridade</label>
          <select
            id="prioridade"
            name="prioridade"
            v-model="form.prioridade"
            required
            :disabled="ocupado"
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          <p v-if="erros.prioridade" class="erro-campo" :id="idErro('prioridade')">
            {{ erros.prioridade }}
          </p>
        </div>
      </div>

      <div class="linha">
        <div class="campo" :class="{ 'campo-invalido': erros.responsavel }">
          <label for="responsavel" class="rotulo">Responsável</label>
          <input
            id="responsavel"
            name="responsavel"
            v-model="form.responsavel"
            type="text"
            required
            :disabled="ocupado"
            placeholder="Nome do responsável"
          />
          <p v-if="erros.responsavel" class="erro-campo" :id="idErro('responsavel')">
            {{ erros.responsavel }}
          </p>
        </div>

        <div class="campo" :class="{ 'campo-invalido': erros.prazo }">
          <label for="prazo" class="rotulo">Prazo</label>
          <input
            id="prazo"
            name="prazo"
            v-model="form.prazo"
            type="date"
            required
            :disabled="ocupado"
          />
          <p v-if="erros.prazo" class="erro-campo" :id="idErro('prazo')">
            {{ erros.prazo }}
          </p>
        </div>
      </div>

      <div class="campo" :class="{ 'campo-invalido': erros.projetoId }">
        <label for="projetoId" class="rotulo">Projeto</label>
        <select
          id="projetoId"
          name="projetoId"
          v-model="form.projetoId"
          required
          :disabled="ocupado"
        >
          <option value="" disabled>Selecione um projeto</option>
          <option v-for="projeto in projetos" :key="projeto.id" :value="projeto.id">
            {{ projeto.nome }}
          </option>
        </select>
        <p v-if="erros.projetoId" class="erro-campo" :id="idErro('projetoId')">
          {{ erros.projetoId }}
        </p>
      </div>

      <footer class="acoes">
        <button type="submit" class="botao botao-primario" :disabled="ocupado">
          {{ rotuloBotao }}
        </button>
      </footer>
    </form>
  </section>
</template>

<style scoped>
.formulario {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid hsl(var(--border));
  border-left: 3px solid hsl(var(--ring));
  background: hsl(var(--card) / 0.94);
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

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: 0;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.rotulo {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: hsl(var(--ring));
}

input,
textarea,
select {
  width: 100%;
  padding: var(--space-2);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--input));
  color: hsl(var(--foreground));
  font: inherit;
  font-size: 0.92rem;
}

input:focus,
textarea:focus,
select:focus {
  border-color: hsl(var(--ring));
  outline: var(--focus-ring);
  outline-offset: 2px;
}

input:disabled,
textarea:disabled,
select:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.campo-invalido input,
.campo-invalido textarea,
.campo-invalido select {
  border-color: hsl(var(--destructive));
}

.erro-campo {
  margin: 0;
  padding-left: var(--space-2);
  border-left: 3px solid hsl(var(--destructive));
  color: hsl(var(--destructive));
  font-size: 0.78rem;
  letter-spacing: 0.04em;
}

.linha {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
}

@media (min-width: 680px) {
  .linha {
    grid-template-columns: 1fr 1fr;
  }
}

.acoes {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.botao {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--secondary));
  color: hsl(var(--muted-foreground));
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s var(--ease-glass);
}

.botao-primario {
  background: hsl(var(--ring));
  border-color: hsl(var(--ring));
  color: hsl(var(--background));
  box-shadow: 0 0 20px hsl(var(--ring) / 0.4);
}

.botao:hover {
  border-color: hsl(var(--ring));
  color: hsl(var(--ring));
}

.botao-primario:hover {
  background: hsl(var(--ring));
  color: hsl(var(--background));
}

.botao:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
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
</style>
