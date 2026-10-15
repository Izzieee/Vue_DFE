
import type { Projeto, Tarefa } from './tipos'

const API_URL = 'http://localhost:3000'

async function requisicao<T>(url: string): Promise<T> {
  const resposta = await fetch(`${API_URL}${url}`)

  if (!resposta.ok) {
    throw new Error(`Erro ao consultar a API: ${resposta.status}`)
  }

  return resposta.json() as Promise<T>
}

export function listarTarefas(): Promise<Tarefa[]> {
  return requisicao<Tarefa[]>('/tarefas')
}

export function buscarTarefa(id: string): Promise<Tarefa> {
  return requisicao<Tarefa>(`/tarefas/${encodeURIComponent(id)}`)
}

export function listarProjetos(): Promise<Projeto[]> {
  return requisicao<Projeto[]>('/projetos')
}

export function buscarProjeto(id: string): Promise<Projeto> {
  return requisicao<Projeto>(`/projetos/${encodeURIComponent(id)}`)
}

export function buscarProjetoComTarefas(
  id: string
): Promise<Projeto & { tarefas: Tarefa[] }> {
  return requisicao<Projeto & { tarefas: Tarefa[] }>(
    `/projetos/${encodeURIComponent(id)}?_embed=tarefas`
  )
}

export async function tarefasDoProjeto(id: string): Promise<Tarefa[]> {
  const projeto = await buscarProjetoComTarefas(id)
  return projeto.tarefas ?? []
}

export function listarTarefasDoProjeto(id: string): Promise<Tarefa[]> {
  return tarefasDoProjeto(id)
}
