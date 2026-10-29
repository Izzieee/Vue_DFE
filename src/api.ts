import type { NovaProjeto, NovaTarefa, Projeto, Status, Tarefa } from './tipos'

const API_URL = 'http://localhost:3000'

type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Erro lançado pela camada de API. Carrega o status HTTP para que as telas
 * possam tratar casos específicos (por exemplo, 404 para recurso inexistente).
 */
export type ErroApi = Error & { status?: number }

interface OpcoesRequisicao {
  method?: MetodoHttp
  body?: unknown
}

async function requisicao<T>(url: string, options: OpcoesRequisicao = {}): Promise<T> {
  const { method = 'GET', body } = options

  const headers: Record<string, string> = {}
  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  const resposta = await fetch(`${API_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!resposta.ok) {
    let mensagem = `Erro ao consultar a API: ${resposta.status}`
    try {
      const erro = await resposta.json()
      if (erro?.message) {
        mensagem = erro.message
      }
    } catch {
      // ignora falha ao ler corpo do erro
    }
    throw Object.assign(new Error(mensagem), { status: resposta.status })
  }

  if (resposta.status === 204) {
    return undefined as T
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

export function buscarProjetoComTarefas(id: string): Promise<Projeto & { tarefas: Tarefa[] }> {
  return requisicao<Projeto & { tarefas: Tarefa[] }>(
    `/projetos/${encodeURIComponent(id)}?_embed=tarefas`,
  )
}

export function criarTarefa(tarefa: NovaTarefa): Promise<Tarefa> {
  return requisicao<Tarefa>('/tarefas', { method: 'POST', body: tarefa })
}

export function atualizarTarefa(id: string, tarefa: Partial<Tarefa>): Promise<Tarefa> {
  return requisicao<Tarefa>(`/tarefas/${encodeURIComponent(id)}`, { method: 'PATCH', body: tarefa })
}

/** Altera apenas o status de uma tarefa, usando os valores do contrato da API. */
export function atualizarStatusTarefa(id: string, status: Status): Promise<Tarefa> {
  return atualizarTarefa(id, { status })
}

export function criarProjeto(projeto: NovaProjeto): Promise<Projeto> {
  return requisicao<Projeto>('/projetos', { method: 'POST', body: projeto })
}

export function atualizarProjeto(id: string, projeto: Partial<Projeto>): Promise<Projeto> {
  return requisicao<Projeto>(`/projetos/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: projeto,
  })
}
