<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { criarTarefa, type ErroApi } from '@/api'
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
    const falha = e as ErroApi
    if (falha.status === 500) {
      erro.value = 'Erro interno do servidor. Tente novamente mais tarde.'
    } else {
      erro.value = falha.message || 'Erro ao salvar a tarefa.'
    }
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <section class="pagina">
    <p v-if="erro" class="estado estado-erro estado-erro-combustao" role="alert">
      <span class="erro-marcador" aria-hidden="true">!</span>
      Erro: {{ erro }}
    </p>

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
  background: transparent;
  border: 1px solid hsl(var(--ring));
  color: hsl(var(--ring));
}

.botao-primario:hover {
  background: hsl(var(--ring) / 0.08);
  color: hsl(var(--ring));
}

.botao-secundario {
  background: transparent;
  border: 1px solid hsl(var(--border));
  color: hsl(var(--muted-foreground));
}

.botao-secundario:hover {
  background: hsl(var(--secondary) / 0.05);
  border-color: hsl(var(--ring));
  color: hsl(var(--ring));
}

</style>
