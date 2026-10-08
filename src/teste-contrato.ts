import type { Tarefa } from './tipos'

const t: Tarefa = {
  id: '99',
  projetoId: '1',
  titulo: 'Teste',
  descricao: 'Errando de propósito',
  status: 'concluído',   // ← deve dar erro TS2322
  prioridade: 'alta',
  responsavel: 'Ana',
  prazo: '2026-10-06',
}
