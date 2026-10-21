<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { atualizarTarefa, buscarTarefa, type ErroApi } from '@/api'
import FormularioTarefa from '@/components/FormularioTarefa.vue'
import type { Tarefa } from '@/tipos'

const route = useRoute()
const router = useRouter()

const tarefa = ref<Tarefa | null>(null)
const carregando = ref(true)
const salvando = ref(false)
const salvo = ref(false)
const erro = ref<string | null>(null)
const naoEncontrada = ref(false)
const sucesso = ref<HTMLElement | null>(null)

let redirecionamento: ReturnType<typeof setTimeout> | undefined

// O id da tarefa vem do parâmetro da rota: /tarefas/:id/editar
const idTarefa = String(route.params.id ?? '')

// O foco vai para a mensagem de sucesso, para que a mudança seja percebida.
watch(salvo, (confirmado) => {
  if (confirmado) {
    nextTick(() => sucesso.value?.focus())
  }
})

onMounted(async () => {
  try {
    tarefa.value = await buscarTarefa(idTarefa)
  } catch (e) {
    const falha = e as ErroApi
    if (falha.status === 404) {
      naoEncontrada.value = true
      erro.value = 'Tarefa não encontrada.'
    } else {
      erro.value = falha.message
    }
  } finally {
    carregando.value = false
  }
})

async function salvar(dados: Omit<Tarefa, 'id'>) {
  // Ignora envios duplicados enquanto a requisição estiver em andamento.
  if (salvando.value) {
    return
  }

  salvando.value = true
  erro.value = null

  try {
    await atualizarTarefa(idTarefa, dados)
    salvo.value = true
    // Dá tempo de o usuário ver a confirmação antes de navegar.
    redirecionamento = setTimeout(() => router.push(`/tarefas/${idTarefa}`), 1500)
  } catch (e) {
    const falha = e as ErroApi
    if (falha.status === 404) {
      naoEncontrada.value = true
      erro.value = 'Tarefa não encontrada.'
    } else {
      erro.value = falha.message || 'Erro ao salvar as alterações.'
    }
  } finally {
    salvando.value = false
  }
}

onUnmounted(() => {
  if (redirecionamento) {
    clearTimeout(redirecionamento)
  }
})
</script>

<template>
  <section class="pagina">
    <p v-if="carregando" class="estado" role="status">Carregando tarefa...</p>

    <template v-else-if="erro">
      <p class="estado estado-erro" role="alert">{{ erro }}</p>
      <RouterLink class="botao-voltar" to="/">Voltar para a lista de tarefas</RouterLink>
    </template>

    <template v-else>
      <p v-if="salvo" ref="sucesso" class="estado estado-sucesso" role="status" tabindex="-1">
        Tarefa atualizada com sucesso. Redirecionando para o detalhe...
      </p>

      <FormularioTarefa
        v-else
        modo="editar"
        :inicial="tarefa ?? undefined"
        :enviando="salvando"
        @submit="salvar"
      />
    </template>
  </section>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
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

.botao-voltar {
  align-self: flex-start;
  padding: var(--space-2) var(--space-3);
  border: 1px solid hsl(var(--ring));
  background: hsl(var(--ring) / 0.1);
  color: hsl(var(--ring));
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.3s var(--ease-glass);
}

.botao-voltar:hover {
  background: hsl(var(--ring) / 0.2);
  box-shadow: 0 0 18px hsl(var(--ring) / 0.2);
}
</style>
