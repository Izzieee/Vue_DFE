<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { listarProjetos } from '@/api'
import { ORDEM_CAMPOS, ROTULOS, validarTarefa, type Campo, type Erros } from '@/validacao'
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

/** Resumo dos erros, que recebe o foco quando o envio é bloqueado. */
const resumoErros = ref<HTMLElement | null>(null)
/** Aviso do estado do envio, lido por tecnologias assistivas. */
const statusEnvio = ref<HTMLElement | null>(null)

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

/** Campos com erro, na ordem em que aparecem no formulário. */
const camposComErro = computed(() => ORDEM_CAMPOS.filter((campo) => Boolean(erros.value[campo])))

/** Estado do envio, anunciado para quem usa leitor de tela. */
const mensagemEnvio = computed(() => (ocupado.value ? 'Enviando a tarefa...' : ''))

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
    focarResumoErros()
    return
  }

  emit('submit', { ...form.value })

  nextTick(() => {
    // O foco vai para o aviso de envio: o botão desabilitado perderia o foco.
    statusEnvio.value?.focus()

    // Caso a tela não controle a prop `enviando`, a trava é liberada no mesmo ciclo.
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

/** Identificador do controle de um campo. */
function idCampo(campo: Campo): string {
  return `campo-${campo}`
}

/** Leva o foco até o controle de um campo. */
function focarCampo(campo: Campo) {
  document.getElementById(idCampo(campo))?.focus()
}

/** Leva o foco até o resumo de erros, que lista os campos que precisam de correção. */
function focarResumoErros() {
  nextTick(() => resumoErros.value?.focus())
}
</script>

<template>
  <section class="formulario">
    <h1 class="titulo-secao">{{ titulo }}</h1>

    <p v-if="carregando" class="estado" role="status">Carregando projetos...</p>
    <p v-else-if="erro" class="estado estado-erro" role="alert">Erro: {{ erro }}</p>

    <form v-else @submit="handleSubmit" class="form" :aria-busy="ocupado" novalidate>
      <div
        v-if="camposComErro.length"
        id="resumo-erros"
        ref="resumoErros"
        class="resumo-erros"
        role="alert"
        tabindex="-1"
        aria-labelledby="resumo-erros-titulo"
      >
        <h2 id="resumo-erros-titulo" class="resumo-titulo">Não foi possível enviar a tarefa</h2>
        <p class="resumo-texto">Corrija os campos abaixo:</p>
        <ul class="resumo-lista">
          <li v-for="campo in camposComErro" :key="campo">
            <a :href="`#${idCampo(campo)}`" @click.prevent="focarCampo(campo)">
              {{ ROTULOS[campo] }}
            </a>
          </li>
        </ul>
      </div>

      <p ref="statusEnvio" class="apenas-leitor" role="status" tabindex="-1">
        {{ mensagemEnvio }}
      </p>

      <div class="campo" :class="{ 'campo-invalido': erros.titulo }">
        <label for="campo-titulo" class="rotulo">Título</label>
        <input
          id="campo-titulo"
          name="titulo"
          v-model="form.titulo"
          type="text"
          required
          :disabled="ocupado"
          :aria-invalid="Boolean(erros.titulo)"
          :aria-describedby="erros.titulo ? idErro('titulo') : undefined"
          placeholder="Título da tarefa"
        />
        <p v-if="erros.titulo" class="erro-campo" :id="idErro('titulo')">
          <span class="erro-marcador" aria-hidden="true">!</span>
          {{ erros.titulo }}
        </p>
      </div>

      <div class="campo" :class="{ 'campo-invalido': erros.descricao }">
        <label for="campo-descricao" class="rotulo">Descrição</label>
        <textarea
          id="campo-descricao"
          name="descricao"
          v-model="form.descricao"
          rows="4"
          required
          :disabled="ocupado"
          :aria-invalid="Boolean(erros.descricao)"
          :aria-describedby="erros.descricao ? idErro('descricao') : undefined"
          placeholder="Descreva a tarefa"
        ></textarea>
        <p v-if="erros.descricao" class="erro-campo" :id="idErro('descricao')">
          <span class="erro-marcador" aria-hidden="true">!</span>
          {{ erros.descricao }}
        </p>
      </div>

      <div class="linha">
        <div class="campo" :class="{ 'campo-invalido': erros.status }">
          <label for="campo-status" class="rotulo">Status</label>
          <select
            id="campo-status"
            name="status"
            v-model="form.status"
            required
            :disabled="ocupado"
            :aria-invalid="Boolean(erros.status)"
            :aria-describedby="erros.status ? idErro('status') : undefined"
          >
            <option value="a-fazer">A fazer</option>
            <option value="em-andamento">Em andamento</option>
            <option value="em-revisao">Em revisão</option>
            <option value="concluida">Concluída</option>
          </select>
          <p v-if="erros.status" class="erro-campo" :id="idErro('status')">
            <span class="erro-marcador" aria-hidden="true">!</span>
            {{ erros.status }}
          </p>
        </div>

        <div class="campo" :class="{ 'campo-invalido': erros.prioridade }">
          <label for="campo-prioridade" class="rotulo">Prioridade</label>
          <select
            id="campo-prioridade"
            name="prioridade"
            v-model="form.prioridade"
            required
            :disabled="ocupado"
            :aria-invalid="Boolean(erros.prioridade)"
            :aria-describedby="erros.prioridade ? idErro('prioridade') : undefined"
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
          <p v-if="erros.prioridade" class="erro-campo" :id="idErro('prioridade')">
            <span class="erro-marcador" aria-hidden="true">!</span>
            {{ erros.prioridade }}
          </p>
        </div>
      </div>

      <div class="linha">
        <div class="campo" :class="{ 'campo-invalido': erros.responsavel }">
          <label for="campo-responsavel" class="rotulo">Responsável</label>
          <input
            id="campo-responsavel"
            name="responsavel"
            v-model="form.responsavel"
            type="text"
            required
            :disabled="ocupado"
            :aria-invalid="Boolean(erros.responsavel)"
            :aria-describedby="erros.responsavel ? idErro('responsavel') : undefined"
            placeholder="Nome do responsável"
          />
          <p v-if="erros.responsavel" class="erro-campo" :id="idErro('responsavel')">
            <span class="erro-marcador" aria-hidden="true">!</span>
            {{ erros.responsavel }}
          </p>
        </div>

        <div class="campo" :class="{ 'campo-invalido': erros.prazo }">
          <label for="campo-prazo" class="rotulo">Prazo</label>
          <input
            id="campo-prazo"
            name="prazo"
            v-model="form.prazo"
            type="date"
            required
            :disabled="ocupado"
            :aria-invalid="Boolean(erros.prazo)"
            :aria-describedby="erros.prazo ? idErro('prazo') : undefined"
          />
          <p v-if="erros.prazo" class="erro-campo" :id="idErro('prazo')">
            <span class="erro-marcador" aria-hidden="true">!</span>
            {{ erros.prazo }}
          </p>
        </div>
      </div>

      <div class="campo" :class="{ 'campo-invalido': erros.projetoId }">
        <label for="campo-projetoId" class="rotulo">Projeto</label>
        <select
          id="campo-projetoId"
          name="projetoId"
          v-model="form.projetoId"
          required
          :disabled="ocupado"
          :aria-invalid="Boolean(erros.projetoId)"
          :aria-describedby="erros.projetoId ? idErro('projetoId') : undefined"
        >
          <option value="" disabled>Selecione um projeto</option>
          <option v-for="projeto in projetos" :key="projeto.id" :value="projeto.id">
            {{ projeto.nome }}
          </option>
        </select>
        <p v-if="erros.projetoId" class="erro-campo" :id="idErro('projetoId')">
          <span class="erro-marcador" aria-hidden="true">!</span>
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
  border: 1px solid hsl(var(--destructive));
  border-radius: 50%;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1;
}

.resumo-erros {
  padding: var(--space-3);
  border: 1px solid hsl(var(--destructive) / 0.6);
  border-left: 3px solid hsl(var(--destructive));
  background: hsl(var(--destructive) / 0.08);
}

.resumo-titulo {
  margin: 0 0 var(--space-1);
  color: hsl(var(--destructive));
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.resumo-texto {
  margin: 0 0 var(--space-1);
  font-size: 0.85rem;
}

.resumo-lista {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding-left: var(--space-4);
  font-size: 0.85rem;
}

.resumo-lista a {
  color: hsl(var(--foreground));
  text-decoration: underline;
}

.resumo-lista a:hover {
  color: hsl(var(--ring));
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
