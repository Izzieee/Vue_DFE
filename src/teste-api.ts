
import {
  listarTarefas,
  buscarTarefa,
  listarProjetos,
  buscarProjeto,
  buscarProjetoComTarefas,
  tarefasDoProjeto
} from './api'

async function testar(
  nome: string,
  funcao: () => Promise<unknown>
): Promise<void> {
  try {
    const dados = await funcao()
    console.log(`✓ ${nome}`)
    console.log(dados)
  } catch (erro) {
    console.error(`✗ ${nome}`, erro)
  }
}

async function testarAPI(): Promise<void> {
  await testar('1. Todas as tarefas', listarTarefas)
  await testar('2. Uma tarefa', () => buscarTarefa('1'))
  await testar('3. Todos os projetos', listarProjetos)
  await testar('4. Um projeto', () => buscarProjeto('1'))
  await testar(
    '5. Projeto com tarefas',
    () => buscarProjetoComTarefas('1')
  )
  await testar(
    '6. Tarefas do projeto',
    () => tarefasDoProjeto('1')
  )
}

testarAPI()
