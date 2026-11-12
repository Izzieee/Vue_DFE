# Validação das rotas internas (issue #41 / item #43)

**Data da validação:** 11/11/2026
**Aplicação publicada:** <https://error404-vue.netlify.app>
**API publicada:** <https://vue-dfe-api.onrender.com>

## Objetivo

Garantir que as rotas internas do Vue Router possam ser abertas diretamente e recarregadas
sem apresentar erro 404, mantendo os dados carregados pela API.

## Configuração aplicada

| Arquivo | Função |
|---|---|
| `src/router.ts` | Usa `createWebHistory(import.meta.env.BASE_URL)` e uma rota catch-all (`/:pathMatch(.*)*`) para a página 404. |
| `netlify.toml` | Redireciona `/*` para `/index.html` com status `200`, permitindo o fallback de SPA no Netlify. |
| `public/_redirects` | Contém `/* /index.html 200` para hospedagens estáticas que leem esse arquivo. |
| `scripts/gerar-404.mjs` | Copia `dist/index.html` para `dist/404.html` no `postbuild`, cobrindo hospedagens que usam página 404 estática. |
| `src/main.ts` | Define o título da aba conforme a rota, inclusive no acesso direto. |
| `src/views/PlaceholderView.vue` | Página 404 com o caminho tentado e link de volta para a lista de tarefas. |

## Testes de acesso direto

Cada rota foi aberta em uma nova navegação (equivalente a colar o endereço no navegador ou
recarregar a página) na aplicação publicada.

| Rota | Resultado | Dados verificados |
|---|---|---|
| `/tarefas/2` | Abre diretamente, sem 404 | Título "Criar tela de listagem", status "Em andamento", responsável "Bruno" e prazo "2026-10-15". |
| `/projetos/1` | Abre diretamente, sem 404 | Projeto "Sistema de biblioteca" com as 4 tarefas vinculadas. |
| `/tarefas/2/editar` | Abre diretamente, sem 404 | Formulário preenchido com título, responsável e prazo da tarefa 2. |
| `/projetos/1/editar` | Abre diretamente, sem 404 | Formulário preenchido com os dados do projeto 1. |
| `/tarefas/nova` | Abre diretamente, sem 404 | Formulário vazio de nova tarefa. |
| `/projetos/novo` | Abre diretamente, sem 404 | Formulário vazio de novo projeto. |
| `/rota-inexistente` | Fallback da SPA + página 404 | Mensagem "Página não encontrada", caminho tentado e link "Voltar para as tarefas". |

- Recarregar o navegador em `/tarefas/2` e `/projetos/1` mantém a rota e os dados; não há 404.
- O Vue Router renderiza o componente correto em cada rota e a rota desconhecida cai no catch-all.
- Nenhum erro foi registrado no console do navegador durante os testes.

## Como reproduzir

```sh
npm run build
npm run preview
```

Abra diretamente (ou recarregue) as rotas da tabela em `http://localhost:4173`. No ambiente
publicado, repita o teste em <https://error404-vue.netlify.app>.

## Observações

- No Netlify, o fallback é feito pelo `netlify.toml` com status `200`; arquivos existentes
  (como os assets com hash) são servidos antes da regra de redirecionamento.
- Em hospedagens que não leem `netlify.toml`, o `_redirects` cobre o fallback; onde esse
  recurso não existe, o `404.html` gerado no `postbuild` permite que a aplicação carregue e
  o Vue Router resolva a rota solicitada.
- A página 404 foi ajustada para exibir uma mensagem adequada ao usuário, em vez do texto
  genérico de placeholder usado nas etapas anteriores.
