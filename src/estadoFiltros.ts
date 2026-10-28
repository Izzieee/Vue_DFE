import { ref } from 'vue'
import type { Prioridade, Status, Tarefa } from './tipos'

const busca = ref('')
const status = ref<Status | ''>('')
const prioridade = ref<Prioridade | ''>('')

function filtrarTarefas(tarefas: Tarefa[]) {
  const termo = busca.value.toLowerCase().trim()

  return tarefas.filter((tarefa) => {
    const correspondeBusca =
      !termo || tarefa.titulo.toLowerCase().includes(termo)

    const correspondeStatus =
      !status.value || tarefa.status === status.value

    const correspondePrioridade =
      !prioridade.value || tarefa.prioridade === prioridade.value

    return correspondeBusca && correspondeStatus && correspondePrioridade
  })
}

export function useFiltrosTarefas() {
  return {
    busca,
    status,
    prioridade,
    filtrarTarefas,
  }
}