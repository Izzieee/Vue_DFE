<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { criarTarefa } from '@/api'
import FormularioTarefa from '@/components/FormularioTarefa.vue'
import type { Tarefa } from '@/tipos'

const route = useRoute()
const router = useRouter()
const erro = ref<string | null>(null)
const salvando = ref(false)

const projetoIdDaQuery = route.query.projetoId as string | undefined

const inicial: Tarefa = {
  id: '',
  projetoId: projetoIdDaQuery ?? '',
  titulo: '',
  descricao: '',
  status: 'a-fazer',
  prioridade: 'media',
  responsavel: '',
  prazo: '',
}

async function cadastrar(dados: Omit<Tarefa, 'id'>) {
  // Ignora envios duplicados enquanto a requisição estiver em andamento.
  if (salvando.value) {
    return
  }

  salvando.value = true
  erro.value = null

  try {
    await criarTarefa(dados)
    router.push({ name: 'inicio' })
  } catch (e) {
    erro.value = (e as Error).message || 'Erro ao salvar a tarefa.'
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <section class="pagina">
    <p v-if="erro" class="estado estado-erro">Erro: {{ erro }}</p>

    <FormularioTarefa modo="criar" :inicial="inicial" :enviando="salvando" @submit="cadastrar" />
  </section>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
}
</style>
