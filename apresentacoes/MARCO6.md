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

# Marco 6

## Build, publicação e deploy

**ERROR 404 · Organização acadêmica**

Raquel Aires · Jacyane Carvalho · Ryllen Alves

11/11/2026

<!-- nota: Abertura rápida. Apresentar a equipe e o objetivo do marco: tirar o projeto do ambiente local e colocá-lo no ar, com build de produção e rotas funcionando. -->

---

## O que entregamos

- Build de produção validado com `vue-tsc` e Vite
- Frontend publicado no Netlify
- API publicada no Render
- Rotas internas acessíveis diretamente (SPA)
- Interface validada de 320 px a 1024 px
- Desafio opcional: arrastar e soltar no quadro

<!-- nota: Raquel. Destacar que não é só "subir o site": o build foi conferido, a API está em outro serviço e as rotas internas funcionam ao recarregar. -->

---

## Arquitetura

- **Frontend:** Vue 3 + TypeScript + Vite
- **Roteamento:** Vue Router em history mode
- **API:** json-server (REST)
- **Hospedagem:** Netlify (frontend) + Render (API)
- **Fluxo:** Navegador → Netlify → API Render → db.json

<!-- nota: Raquel. Explicar a separação: o Netlify serve apenas os arquivos estáticos; o Render executa o json-server. A URL da API entra no build por variável de ambiente. -->

---

## Build de produção

- `npm run build`
- `vue-tsc --build`: verificação de tipos
- `vite build`: gera `dist/`
- `postbuild`: gera `dist/404.html`
- Assets com hash para cache seguro

<!-- nota: Jacyane. Mostrar que o build não é só o Vite: o type-check roda antes e o postbuild garante o fallback de 404 para hospedagens estáticas. -->

---

## Variáveis de ambiente

- `VITE_API_URL` define a API usada no build
- Local: `http://localhost:3000`
- Produção: `https://vue-dfe-api.onrender.com`
- Exemplos versionados em `.env.example` e `.env.production.example`

<!-- nota: Jacyane. Explicar que a URL não fica fixa no código; o mesmo projeto gera builds para local e produção. -->

---

## Deploy do frontend

- Netlify conectado ao repositório GitHub
- `netlify.toml`: `publish = "dist"`, Node 24
- Build contínuo a cada push na `main`
- **No ar:** https://error404-vue.netlify.app

<!-- nota: Jacyane. O deploy é automático. O netlify.toml também configura o fallback de SPA, que aparece no próximo bloco. -->

---

## Deploy da API

- `render.yaml`: Blueprint do Render
- `server.js` executa o json-server com `db.json`
- **No ar:** https://vue-dfe-api.onrender.com
- Plano gratuito: hiberna e os dados são efêmeros

<!-- nota: Raquel. Transparência: o plano free do Render hiberna após inatividade e o db.json não é um banco persistente. Para o escopo acadêmico, atende; em produção, precisaria de banco real. -->

---

## Rotas internas (SPA)

- `createWebHistory` no Vue Router
- Netlify: `/* → /index.html` com status 200
- `_redirects` cobre hospedagens estáticas
- `404.html` gerado no postbuild
- Rota desconhecida cai no catch-all

<!-- nota: Ryllen. O problema: ao abrir /tarefas/2 direto, o servidor não tem esse arquivo. A regra devolve o index.html; o Vue Router lê a URL e renderiza a tela certa. -->

---

## Demonstração de rotas

- Abrir `/tarefas/2` diretamente
- Recarregar a página e conferir os dados
- Abrir `/projetos/1` diretamente
- Abrir `/tarefas/2/editar`
- Rota inexistente: página 404 com link de volta

<!-- nota: Ryllen. Fazer a demo ao vivo. Se a API do Render estiver hibernando, a primeira carga pode demorar; recarregar depois. Mostrar que o console não tem erros. -->

---

## Responsividade

- Breakpoints em 760, 1100, 560 e 480 px
- Cabeçalho, cartões, quadro e formulários ajustados
- 90 combinações de tela entre 320 e 1024 px
- Sem overflow horizontal

<!-- nota: Jacyane. O quadro passa de 4 para 2 e depois 1 coluna; os cartões e formulários se adaptam. A validação foi automatizada com captura de overflow. -->

---

## Resultados

- Build sem erros de tipo
- Frontend e API publicados e acessíveis
- CRUD de tarefas e projetos validado
- Rotas internas sem 404
- Nenhum erro no console

<!-- nota: Raquel. Fechar a parte técnica com evidências. O registro completo está no README e em VALIDACAO_ROTAS.md. -->

---

## Limitações e próximos passos

- Render free hiberna; dados não persistem
- Sem autenticação de usuários
- Desafio opcional implementado: arrastar e soltar
- Próxima etapa: apresentação final
- **Obrigado!**

<!-- nota: Todos. Encerrar em 5 minutos. Dizer que a aplicação está no ar, que o desafio opcional foi entregue e que o código e a documentação estão no GitHub. -->
