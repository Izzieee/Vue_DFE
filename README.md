# Projeto de Desenvolvimento Frontend G2

Projeto em equipe da disciplina **Desenvolvimento Frontend — 2026.2**, ministrada pela
Profª Marianne Lacerda Dutra Theodoro.

**Marco atual:** Marco 2 — Listagem e rotas

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
| `/tarefas/:id` | Detalhe da tarefa |
| `/projetos` | Lista de projetos |
| `/projetos/:id` | Detalhe do projeto com as tarefas |
| `*` | Página não encontrada |

## Contrato de dados

Definido em `db.json` e tipado em `src/tipos.ts`. As tarefas de um projeto são obtidas por
`GET /projetos/:id?_embed=tarefas`, pois o json-server trata os ids numéricos da URL
(`?projetoId=1`) de forma diferente do texto usado no `db.json`.
