# Projeto de Desenvolvimento Frontend G2

Projeto em equipe da disciplina **Desenvolvimento Frontend — 2026.2**, ministrada pela
Profª Marianne Lacerda Dutra Theodoro.

**Marco atual:** Marco 4 — Busca, filtros e quadro

## Integrantes da equipe

| Nome completo | Usuário no GitHub |
|---|---|
| [Raquel Aires Pimenta Silva] | [@RaquelAires](https://github.com/RaquelAires) |
| [Jacyane Carvalho Martins] | [@Izzieee](https://github.com/Izzieee) |
| [Ryllen Alves da Silva Nascimento] | [@Ryllen](https://github.com/Ryllen) |

**Professora:** [@mariannedutra](https://github.com/mariannedutra)

---

## Stack do projeto

- **Framework:** Vue 3 (Composition API com `<script setup>`)
- **Linguagem:** TypeScript
- **Roteamento:** Vue Router
- **Build tool:** Vite
- **API local:** json-server (v1.x)
- **Node.js:** 24 LTS ou superior

---

## Como executar

Instale as dependências:

```sh
npm install
```

Suba a API local (json-server na porta 3000):

```sh
npm run api
```

Em outro terminal, suba o servidor de desenvolvimento:

```sh
npm run dev
```

Para gerar a build de produção:

```sh
npm run build
```

---

## Rotas

| Rota | Tela |
|---|---|
| `/` | Lista de tarefas |
| `/tarefas/nova` | Nova tarefa |
| `/tarefas/:id` | Detalhe da tarefa |
| `/tarefas/:id/editar` | Edição da tarefa |
| `/projetos` | Lista de projetos |
| `/projetos/novo` | Novo projeto |
| `/projetos/:id` | Detalhe do projeto com as tarefas |
| `/projetos/:id/editar` | Edição do projeto |
| `*` | Página não encontrada |

## Contrato de dados

Definido em `db.json` e tipado em `src/tipos.ts`. As tarefas de um projeto são obtidas por
`GET /projetos/:id?_embed=tarefas`, pois o json-server trata os ids numéricos da URL
(`?projetoId=1`) de forma diferente do texto usado no `db.json`.

---

## Registro de issues

Issues do quadro do projeto ([GitHub Projects](https://github.com/Izzieee/Vue_DFE/projects)),
em ordem de execução. Cada issue do repositório é identificada por dois números: o da issue
(`[#17](https://github.com/Izzieee/Vue_DFE/issues/17)`) e o número do item do roadmap citado
no título (`#19`).

### Marco 3 — Cadastro e edição

| Issue | Item | Título | Responsável | Situação |
|---|---|---|---|---|
| [#15](https://github.com/Izzieee/Vue_DFE/issues/15) | #17 | Criar o componente de formulário de tarefa | @RaquelAires | Concluída |
| [#16](https://github.com/Izzieee/Vue_DFE/issues/16) | #18 | Criar a tela de nova tarefa | @RaquelAires | Concluída |
| [#20](https://github.com/Izzieee/Vue_DFE/issues/20) | #22 | Criar cadastro e edição de projeto | @Izzieee | Concluída |
| [#17](https://github.com/Izzieee/Vue_DFE/issues/17) | #19 | Criar a tela de edição de tarefa | @Izzieee | Concluída |
| [#18](https://github.com/Izzieee/Vue_DFE/issues/18) | #20 | **Validar o formulário** | @Izzieee | **Concluída** |
| [#19](https://github.com/Izzieee/Vue_DFE/issues/19) | #21 | **Tornar o formulário acessível** | @Izzieee | **Concluída** |
| [#21](https://github.com/Izzieee/Vue_DFE/issues/21) | #23 | Criar o slide de apresentação do Marco 3 | @Ryllen | A fazer |

### Marco 4 — Busca, filtros e quadro

| Issue | Item | Título | Responsável | Situação |
|---|---|---|---|---|
| [#22](https://github.com/Izzieee/Vue_DFE/issues/22) | #24 | Implementar a busca por título | @RaquelAires | Concluída |
| [#23](https://github.com/Izzieee/Vue_DFE/issues/23) | #25 | Implementar os filtros por status e prioridade | @RaquelAires | Concluída |
| [#24](https://github.com/Izzieee/Vue_DFE/issues/24) | #26 | Centralizar o estado de busca e filtros | @Ryllen | A fazer |
| [#25](https://github.com/Izzieee/Vue_DFE/issues/25) | #27 | Criar a visão de quadro | @Ryllen | A fazer |
| [#26](https://github.com/Izzieee/Vue_DFE/issues/26) | #28 | Alternar entre lista e quadro | @Ryllen | A fazer |
| [#27](https://github.com/Izzieee/Vue_DFE/issues/27) | #29 | Mudar o status pelo cartão | @Izzieee | Em andamento |
| [#28](https://github.com/Izzieee/Vue_DFE/issues/28) | #30 | Criar o slide de apresentação do Marco 4 | @Izzieee | A fazer |

### Issue — #29 Mudar o status pelo cartão

Issue [#27](https://github.com/Izzieee/Vue_DFE/issues/27) · rótulo `marco-4` · responsável @Izzieee

**Objetivo:** permitir que o usuário altere o status de uma tarefa diretamente pelo cartão,
gravando a alteração na API e apresentando o novo status na lista.

**Arquivos alvo:** `src/components/CartaoTarefa.vue`, `src/views/ListaTarefas.vue`,
`src/views/DetalhesProjeto.vue` e `src/api.ts`.

**Dependências:** #23 (filtros por status e prioridade), das funções de atualização da API do
Marco 3 e da issue #25 (visão de quadro) para os critérios que dependem do quadro.

**Critérios de aceite**

- [ ] Disponibiliza um controle para alterar o status no cartão.
- [ ] Utiliza os valores de status previstos no contrato da API.
- [ ] Envia a alteração para a API.
- [ ] Atualiza a interface após a confirmação da gravação.
- [ ] No quadro, o cartão passa para a coluna correspondente ao novo status.
- [ ] Na lista, o status atualizado também é apresentado.
- [ ] Trata erros de gravação e informa o usuário.
- [ ] Evita indicar uma alteração como concluída quando a API retornar erro.
- [ ] Não utiliza arrastar e soltar para modificar o status.

### Issue concluída — #21 Tornar o formulário acessível

Issue [#19](https://github.com/Izzieee/Vue_DFE/issues/19) · rótulo `marco-3` · responsável @Izzieee

**Objetivo:** garantir que o formulário de tarefas seja acessível, permitindo a navegação por
teclado e tornando os campos e as mensagens de erro compreensíveis para diferentes usuários.

**Arquivos alvo:** `src/components/FormularioTarefa.vue` e as telas de cadastro e edição que
apresentam o resultado das operações.

**Dependências:** #15 (formulário de tarefa) e as validações definidas em #18 (validar o
formulário).

**Critérios de aceite**

- [x] Todos os campos possuem labels associadas corretamente.
- [x] É possível navegar pelos campos utilizando o teclado.
- [x] A ordem de navegação é lógica e previsível.
- [x] Os campos inválidos possuem identificação acessível.
- [x] As mensagens de erro são perceptíveis sem depender apenas de cores.
- [x] Os estados de erro são associados aos respectivos campos.
- [x] Os controles interativos podem ser utilizados por teclado.
- [x] A acessibilidade é mantida tanto no cadastro quanto na edição.

**Recursos de acessibilidade aplicados**

| Recurso | Onde foi aplicado |
|---|---|
| `label` associada por `for`/`id` | Todos os sete campos do formulário |
| `aria-invalid` | Campos com erro, `false` quando o campo está válido |
| `aria-describedby` | Campo inválido aponta para a sua mensagem de erro |
| Resumo de erros (`role="alert"`) | Lista os campos com erro e recebe o foco no envio bloqueado |
| Marcador textual de erro | As mensagens não dependem apenas da cor |
| Aviso de envio (`role="status"`) | Informa o estado do envio e evita a perda de foco no botão desabilitado |
| Foco dirigido | Resumo de erros, links do resumo e mensagem de sucesso |

A ordem de navegação segue a ordem visual dos campos e todos os controles são nativos
(`input`, `select`, `textarea` e `button`), portanto funcionam apenas com o teclado.

### Issue concluída — #20 Validar o formulário

Issue [#18](https://github.com/Izzieee/Vue_DFE/issues/18) · rótulo `marco-3` · responsável @Izzieee

**Objetivo:** implementar validações nos formulários de cadastro e edição de tarefas para evitar o
envio de dados inválidos e informar os erros de maneira clara.

**Arquivos alvo:** `src/components/FormularioTarefa.vue` e as telas de cadastro e edição que
controlam o estado de envio.

**Dependências:** #15 (formulário de tarefa) e a integração com as telas de cadastro e edição,
#16 (tela de nova tarefa) e #17 (tela de edição de tarefa).

**Critérios de aceite**

- [x] Valida os campos obrigatórios conforme o contrato da API.
- [x] Impede o envio quando houver campos obrigatórios inválidos.
- [x] Exibe mensagens de erro próximas aos respectivos campos.
- [x] Permite corrigir os campos após a identificação de erros.
- [x] Bloqueia o botão enquanto a requisição estiver em andamento.
- [x] Evita envios duplicados durante o processamento.
- [x] Libera o botão após o término da requisição, mesmo quando ocorrer uma falha.
- [x] Mantém o comportamento de validação nas telas de cadastro e edição.

**Regras aplicadas**

| Campo | Regra |
|---|---|
| Título | Obrigatório, entre 3 e 80 caracteres |
| Descrição | Obrigatória, entre 10 e 300 caracteres |
| Responsável | Obrigatório, entre 3 e 60 caracteres |
| Prazo | Obrigatório e precisa ser uma data existente |
| Projeto | Obrigatório e precisa existir na lista de projetos |
| Status e Prioridade | Precisam ser valores aceitos pelo contrato |

O prazo não é comparado com a data atual: tarefas já cadastradas podem estar vencidas e
precisam continuar sendo editáveis.

### Issue concluída — #19 Criar a tela de edição de tarefa

Issue [#17](https://github.com/Izzieee/Vue_DFE/issues/17) · rótulo `marco-3` · responsável @Izzieee

**Objetivo:** criar a tela que permite editar uma tarefa existente, carregando os dados atuais e
salvando as alterações na API.

**Arquivo alvo:** `src/views/EditarTarefa.vue`

**Dependências:** #14 (API de escrita), #15 (formulário de tarefa) e das rotas e funções de
consulta já existentes no projeto.

**Critérios de aceite**

- [x] Cria e disponibiliza a rota `/tarefas/:id/editar`.
- [x] Obtém o ID da tarefa pelos parâmetros da rota.
- [x] Busca os dados atuais da tarefa na API.
- [x] Preenche o componente `FormularioTarefa.vue` com os dados existentes.
- [x] Permite modificar os campos da tarefa.
- [x] Salva as alterações utilizando a função de atualização da API.
- [x] Apresenta feedback de carregamento, sucesso e erro.
- [x] Trata situações em que a tarefa não é encontrada.
- [x] Retorna à tela adequada após salvar com sucesso.

**Edição sem alterações:** quando nenhum campo é modificado, o formulário avisa que não há
alterações em relação aos dados atuais, mas mantém o botão de salvar habilitado. A gravação
continua sendo um `PATCH` idempotente, então salvar novamente não altera os dados.
