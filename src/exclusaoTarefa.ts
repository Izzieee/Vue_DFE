import { ref } from 'vue'
import type { ErroApi } from './api'
import { excluirTarefa } from './api'
import type { Tarefa } from './tipos'

/**
 * Centraliza o fluxo de exclusão de tarefas: seleção do registro, confirmação,
 * chamada da API e mensagens de retorno. A lista do chamador só é alterada
 * depois que a API confirma a exclusão.
 *
 * @param aoExcluir callback executado com a tarefa confirmada pela API.
 */
export function useExclusaoTarefa(aoExcluir: (tarefa: Tarefa) => void) {
  /** Tarefa aguardando confirmação. `null` mantém o diálogo fechado. */
  const tarefaSelecionada = ref<Tarefa | null>(null)
  /** Há uma requisição de exclusão em andamento. */
  const excluindo = ref(false)
  /** Falha devolvida pela API; a tarefa continua na lista. */
  const erro = ref<string | null>(null)
  /** Confirmação exibida depois de uma exclusão bem-sucedida. */
  const mensagem = ref<string | null>(null)

  function solicitarExclusao(tarefa: Tarefa) {
    erro.value = null
    mensagem.value = null
    tarefaSelecionada.value = tarefa
  }

  function cancelarExclusao() {
    // Enquanto a requisição está em andamento, o diálogo não pode ser fechado.
    if (excluindo.value) {
      return
    }

    tarefaSelecionada.value = null
    erro.value = null
  }

  async function confirmarExclusao() {
    const tarefa = tarefaSelecionada.value

    // Ignora confirmações duplicadas e o clique sem tarefa selecionada.
    if (!tarefa || excluindo.value) {
      return
    }

    excluindo.value = true
    erro.value = null

    try {
      await excluirTarefa(tarefa.id)
      aoExcluir(tarefa)
      tarefaSelecionada.value = null
      mensagem.value = `Tarefa "${tarefa.titulo}" excluída.`
    } catch (e) {
      const falha = e as ErroApi
      // A tarefa permanece na lista para que o usuário possa tentar novamente.
      if (falha.status === 500) {
        erro.value = 'Erro interno do servidor. Tente novamente mais tarde.'
      } else {
        erro.value = falha.message || 'Não foi possível excluir a tarefa.'
      }
    } finally {
      excluindo.value = false
    }
  }

  return {
    tarefaSelecionada,
    excluindo,
    erro,
    mensagem,
    solicitarExclusao,
    cancelarExclusao,
    confirmarExclusao,
  }
}
