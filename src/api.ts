import type {
  NovaProjeto,
  NovaTarefa,
  Projeto,
  Tarefa,
} from './tipos'

const API_URL = 'http://localhost:3000'

type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface OpcoesRequisicao {
  method?: MetodoHttp
  body?: unknown
}

async function requisicao<T>(
  url: string,
  options: OpcoesRequisicao = {},
): Promise<T> {
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
    throw new Error(mensagem)
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

export async function tarefasDoProjeto(id: string): Promise<Tarefa[]> {
  const projeto = await buscarProjetoComTarefas(id)
  return projeto.tarefas ?? []
}

export function listarTarefasDoProjeto(id: string): Promise<Tarefa[]> {
  return tarefasDoProjeto(id)
}

export function criarTarefa(tarefa: NovaTarefa): Promise<Tarefa> {
  return requisicao<Tarefa>('/tarefas', { method: 'POST', body: tarefa })
}

export function atualizarTarefa(
  id: string,
  tarefa: Partial<Tarefa>,
): Promise<Tarefa> {
  return requisicao<Tarefa>(
    `/tarefas/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: tarefa },
  )
}

export function criarProjeto(projeto: NovaProjeto): Promise<Projeto> {
  return requisicao<Projeto>('/projetos', { method: 'POST', body: projeto })
}

export function atualizarProjeto(
  id: string,
  projeto: Partial<Projeto>,
): Promise<Projeto> {
  return requisicao<Projeto>(
    `/projetos/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: projeto },
  )
}
