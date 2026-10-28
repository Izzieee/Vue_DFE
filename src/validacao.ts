import type { Prioridade, Projeto, Status, Tarefa } from './tipos'

/** Campos do formulário de tarefa sujeitos a validação. */
export type Campo =
  'projetoId' | 'titulo' | 'descricao' | 'status' | 'prioridade' | 'responsavel' | 'prazo'

/** Mapa de campo para a mensagem de erro correspondente. */
export type Erros = Partial<Record<Campo, string>>

/** Dados do formulário de tarefa, sem o id gerado pela API. */
export type DadosTarefa = Omit<Tarefa, 'id'>

/** Ordem dos campos na interface, usada para listar os erros de forma previsível. */
export const ORDEM_CAMPOS: Campo[] = [
  'titulo',
  'descricao',
  'status',
  'prioridade',
  'responsavel',
  'prazo',
  'projetoId',
]

/** Nomes dos campos exibidos no formulário. */
export const ROTULOS: Record<Campo, string> = {
  projetoId: 'Projeto',
  titulo: 'Título',
  descricao: 'Descrição',
  status: 'Status',
  prioridade: 'Prioridade',
  responsavel: 'Responsável',
  prazo: 'Prazo',
}

/** Status aceitos pelo contrato de dados da API. */
export const STATUS_VALIDOS: Status[] = ['a-fazer', 'em-andamento', 'em-revisao', 'concluida']

/** Rótulos exibidos para cada status aceito pelo contrato da API. */
export const ROTULOS_STATUS: Record<Status, string> = {
  'a-fazer': 'A fazer',
  'em-andamento': 'Em andamento',
  'em-revisao': 'Em revisão',
  concluida: 'Concluída',
}

/** Prioridades aceitas pelo contrato de dados da API. */
export const PRIORIDADES_VALIDAS: Prioridade[] = ['baixa', 'media', 'alta']

interface RegraCampo {
  /** Indica se o campo precisa ser preenchido. */
  obrigatorio: boolean
  /** Quantidade mínima de caracteres aceitos, contados após remover os espaços das pontas. */
  minimo?: number
  /** Quantidade máxima de caracteres aceitos, contados após remover os espaços das pontas. */
  maximo?: number
}

/** Regras aplicadas aos campos de texto do formulário de tarefa. */
export const REGRAS_TEXTO: Record<'titulo' | 'descricao' | 'responsavel', RegraCampo> = {
  titulo: { obrigatorio: true, minimo: 3, maximo: 80 },
  descricao: { obrigatorio: true, minimo: 10, maximo: 300 },
  responsavel: { obrigatorio: true, minimo: 3, maximo: 60 },
}

/** Campos de texto do formulário de tarefa. */
export type CampoTexto = keyof typeof REGRAS_TEXTO

/**
 * Valida um texto contra a regra do campo.
 *
 * @returns A mensagem de erro ou `undefined` quando o valor é válido.
 */
export function validarTexto(valor: string, campo: CampoTexto): string | undefined {
  const regra = REGRAS_TEXTO[campo]
  const texto = (valor ?? '').trim()

  if (!texto) {
    return regra.obrigatorio ? `O campo ${ROTULOS[campo]} é obrigatório.` : undefined
  }

  if (regra.minimo !== undefined && texto.length < regra.minimo) {
    return `O campo ${ROTULOS[campo]} deve ter pelo menos ${regra.minimo} caracteres.`
  }

  if (regra.maximo !== undefined && texto.length > regra.maximo) {
    return `O campo ${ROTULOS[campo]} deve ter no máximo ${regra.maximo} caracteres.`
  }

  return undefined
}

/**
 * Verifica se o texto no formato `AAAA-MM-DD` representa uma data que existe no calendário.
 */
export function dataValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false
  }

  const [ano = 0, mes = 1, dia = 1] = valor.split('-').map(Number)
  const data = new Date(Date.UTC(ano, mes - 1, dia))

  return (
    data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia
  )
}

/**
 * Valida os campos do formulário de tarefa conforme o contrato de dados da API.
 *
 * O prazo é apenas conferido como data existente: tarefas já persistidas podem estar
 * vencidas e precisam continuar sendo editáveis.
 *
 * @param dados Valores do formulário.
 * @param projetos Projetos disponíveis, usados para conferir o projeto escolhido.
 * @returns Mapa de campo para mensagem de erro. Vazio quando os dados são válidos.
 */
export function validarTarefa(dados: DadosTarefa, projetos: Projeto[] = []): Erros {
  const erros: Erros = {}

  for (const campo of ['titulo', 'descricao', 'responsavel'] as const) {
    const erro = validarTexto(dados[campo] ?? '', campo)
    if (erro) {
      erros[campo] = erro
    }
  }

  const projeto = (dados.projetoId ?? '').trim()
  if (!projeto) {
    erros.projetoId = 'Selecione o projeto da tarefa.'
  } else if (projetos.length > 0 && !projetos.some((item) => item.id === projeto)) {
    erros.projetoId = 'O projeto selecionado não existe.'
  }

  if (!STATUS_VALIDOS.includes(dados.status)) {
    erros.status = 'Selecione um status válido.'
  }

  if (!PRIORIDADES_VALIDAS.includes(dados.prioridade)) {
    erros.prioridade = 'Selecione uma prioridade válida.'
  }

  const prazo = (dados.prazo ?? '').trim()
  if (!prazo) {
    erros.prazo = 'Informe o prazo da tarefa.'
  } else if (!dataValida(prazo)) {
    erros.prazo = 'O prazo informado não é uma data válida.'
  }

  return erros
}
