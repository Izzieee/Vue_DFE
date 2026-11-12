---
marp: true
theme: default
paginate: true
backgroundColor: '#0b0f14'
color: '#e6edf3'
style: |
  section {
    font-family: 'Segoe UI', 'Inter', sans-serif;
    padding: 56px 64px;
  }
  h1, h2, h3 {
    color: #39ff14;
    letter-spacing: 0.04em;
  }
  h1 { font-size: 2.4em; }
  h2 {
    font-size: 1.7em;
    border-bottom: 2px solid #1f6f3a;
    padding-bottom: 0.25em;
  }
  strong { color: #7df9ff; }
  code {
    background: #111820;
    color: #7df9ff;
    padding: 0.1em 0.3em;
    border-radius: 4px;
  }
  a { color: #7df9ff; }
  ul { line-height: 1.55; }
  footer { color: #6b7a86; font-size: 0.55em; }
  section.lead { text-align: center; }
  section.lead h1 { font-size: 3em; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# ERROR 404

## Organização acadêmica

**Apresentação final — Desenvolvimento Frontend 2026.2**

Raquel Aires · Jacyane Carvalho · Ryllen Alves

11/11/2026

<!-- nota: Abertura. Nome do projeto, equipe e disciplina. -->

---

## Roteiro

- Framework e modelo conceitual
- Decisões técnicas
- Demonstração
- Partes fáceis e difíceis
- O que faríamos diferente

<!-- nota: Dividir a apresentação: Raquel começa por problema e stack; Jacyane segue com framework, modelo e deploy; Ryllen cobre contrato, rotas, demo e lições. -->

---

## O problema

- Organizar tarefas e projetos acadêmicos
- Visualizar por lista e por quadro Kanban
- Buscar, filtrar e priorizar
- Cadastrar, editar e excluir com segurança

<!-- nota: Raquel. Contextualizar o domínio: o projeto é um organizador acadêmico, não um CRUD genérico. -->

---

## Stack

- **Vue 3** com Composition API e `<script setup>`
- **TypeScript** para o contrato de dados
- **Vue Router** para navegação SPA
- **Vite** para desenvolvimento e build
- **json-server** como API REST
- **Netlify + Render** para publicação

<!-- nota: Raquel. Justificar escolhas: Vue pela reatividade e componentização; TypeScript pelo contrato; Vite pela velocidade; json-server para simular backend sem infraestrutura. -->

---

## Framework: Vue 3

- Reatividade com `ref`, `computed` e `watch`
- Componentes SFC com template, script e estilo
- Props e eventos para comunicação
- Composables para estado compartilhado
- Diretivas e binding declarativo

<!-- nota: Jacyane. Explicar o modelo mental: o estado muda, a interface reage. Não manipulamos o DOM manualmente; descrevemos o resultado. -->

---

## Modelo conceitual

- **Dados** → **estado reativo** → **interface**
- A view lê o estado e dispara ações
- A API confirma a mudança antes da UI
- Rotas mapeiam URL → componente
- Erros e carregamento também são estado

<!-- nota: Jacyane. Fluxo unidirecional. Destacar que a UI não "chuta" o sucesso: só atualiza depois que a API confirma. -->

---

## Componentização

- `AppLayout`: estrutura e navegação
- `CartaoTarefa`: apresentação e ações
- `FormularioTarefa`: campos e validação
- `ConfirmacaoExclusao`: diálogo acessível
- `EstadoCarregamento`: feedback consistente
- Views para lista, quadro, detalhe e edição

<!-- nota: Raquel. Mostrar que os componentes têm responsabilidades claras e são reutilizados em lista, quadro e detalhe do projeto. -->

---

## Contrato de dados

- `Tarefa`: id, projetoId, título, descrição, status, prioridade, responsável, prazo
- `Projeto`: id, nome, descrição, status
- Status: `a-fazer`, `em-andamento`, `em-revisao`, `concluida`
- Projeto com tarefas: `GET /projetos/:id?_embed=tarefas`

<!-- nota: Ryllen. Explicar por que usamos _embed: o json-server compara o id numérico da URL com o texto do db.json; o embed evita o filtro inconsistente. -->

---

## Decisões técnicas

- TypeScript em todo o contrato
- Camada de API centralizada com timeout de 10 s
- Composables em vez de biblioteca de estado
- CSS com variáveis e layout responsivo
- Acessibilidade: labels, foco, `aria-live`, teclado

<!-- nota: Ryllen. Justificar o "sem Pinia": o estado é pequeno e os composables resolvem. A camada de API converte falhas em mensagens claras. -->

---

## Rotas e SPA

- `createWebHistory` + catch-all
- Netlify: `/* → /index.html` (200)
- `_redirects` e `404.html` como fallback
- Título da aba por rota
- Página 404 com caminho tentado e retorno

<!-- nota: Jacyane. O desafio de SPA: o servidor precisa devolver o index.html para rotas internas; o Vue Router faz o resto. -->

---

## Build e deploy

- `vue-tsc` + `vite build`
- `dist/` com assets versionados
- Netlify para o frontend
- Render para a API
- `VITE_API_URL` separa local e produção

<!-- nota: Jacyane. Mostrar o fluxo: push → build no Netlify → deploy. A API é um serviço separado. -->

---

## Qualidade e testes

- CRUD completo validado
- Rotas internas e recarga sem 404
- Falhas de API tratadas
- 90 combinações de responsividade
- Console limpo nas telas principais

<!-- nota: Jacyane. Não temos suíte automatizada formal; a validação foi manual e com scripts de apoio. Essa é uma lacuna que reconhecemos. -->

---

## Demonstração

1. Lista, busca e filtros
2. Quadro Kanban
3. Arrastar e soltar entre colunas
4. Cadastro e edição
5. Exclusão com confirmação
6. Rota interna direta e 404

<!-- nota: Ryllen. Roteiro da demo. Fazer em ordem, com calma; se a API hibernar, avisar que a primeira requisição pode demorar. -->

---

## Demo ao vivo

- **Frontend:** https://error404-vue.netlify.app
- **API:** https://vue-dfe-api.onrender.com
- **Repositório:** https://github.com/Izzieee/Vue_DFE

<!-- nota: Ryllen. Deixar os links visíveis para a banca. Abrir /tarefas/2 diretamente para provar o fallback de SPA. -->

---

## Partes fáceis

- Componentização com Vue
- Reatividade e `computed`
- Formulários e validação declarativa
- Estilos com variáveis CSS
- Reutilização do cartão em três telas

<!-- nota: Raquel. O que fluiu bem: a estrutura de componentes e a reatividade. O Vue deixou o código previsível. -->

---

## Partes difíceis

- Integração com json-server e `_embed`
- Estados de erro, carregamento e timeout
- Fallback de SPA no deploy
- Responsividade do quadro e dos formulários
- Arrastar e soltar sem quebrar o seletor de status

<!-- nota: Ryllen e Jacyane. Ser honesto: o maior custo foi tratar falhas e diferenças entre ambiente local e publicado. O DnD exigiu cuidado com eventos e controles internos do cartão. -->

---

## O que faríamos diferente

- Testes automatizados desde o início
- Backend real com banco persistente
- CI/CD com checagens no pull request
- Design system e componentes base
- Autenticação e perfis de usuário
- Arrastar e soltar planejado desde o Marco 4

<!-- nota: Todos. Reconhecer lacunas e mostrar maturidade: a maior delas é a ausência de testes automatizados e de um backend persistente. -->

---

## Aprendizados

- Planejar o deploy desde cedo evita surpresas
- O contrato de dados precisa ser explícito
- Erros fazem parte da interface
- Acessibilidade e responsividade são requisitos
- Documentar o processo ajuda a equipe e a banca

<!-- nota: Todos. Fechar com aprendizados concretos, não genéricos. -->

---

## Obrigado!

**Perguntas?**

- https://error404-vue.netlify.app
- https://github.com/Izzieee/Vue_DFE

<!-- nota: Abrir para perguntas. Ter o README e o VALIDACAO_ROTAS.md à mão para detalhes técnicos. -->
