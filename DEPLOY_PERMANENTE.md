# Deploy Permanente — Vue_DFE (Marco 6)

Este guia documenta o deploy permanente do projeto (substituindo a hospedagem temporária em Netlify Drop + Cloudflare Tunnel):

- **Frontend:** Netlify (conectado ao GitHub, build contínuo)
- **API:** Render.com (Web Service gratuito com `json-server`)
- **Variável de ambiente:** `VITE_API_URL` definida nos dois serviços

## Situação atual

- **Frontend publicado:** <https://error404-vue.netlify.app>
- **API publicada:** <https://vue-dfe-api.onrender.com>
- **Última validação:** 11/11/2026 — rotas principais, CRUD e responsividade de 320 px a 1024 px

---

## Pré-requisitos

1. Conta no [GitHub](https://github.com/) com o repositório `Vue_DFE` publicado
2. Conta no [Render.com](https://render.com/) (plano gratuito)
3. Conta no [Netlify](https://www.netlify.com/) (plano gratuito)

O código já foi ajustado no repositório:
- `server.js` — corrigido para não depender de `lowdb` (que não estava instalado)
- `render.yaml` — blueprint para automatizar o deploy da API no Render
- `netlify.toml` — já configurado (`publish = "dist"`, redirecionamento SPA)

---

## Passo 1 — Hospedar a API no Render

### Opção A: Blueprint (mais rápido)

1. Acesse https://render.com e faça login
2. No dashboard, clique em **"Blueprint"** → **"New Blueprint Instance"**
3. Conecte sua conta do GitHub e selecione o repositório `Vue_DFE`
4. O Render detectará o arquivo `render.yaml` e preencherá:
   - Nome do serviço: `vue-dfe-api`
   - Build Command: `npm install`
   - Start Command: `npm run api:prod`
   - Porta: `10000`
   - Disco: nenhum (plano gratuito; o `db.json` é efêmero)
5. Clique em **"Apply"**

### Opção B: Manual (se o Blueprint não estiver disponível)

1. No Render, clique em **"New"** → **"Web Service"**
2. Conecte o GitHub e selecione `Vue_DFE`
3. Configure:
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run api:prod`
   - **Instance Type:** `Free`
4. Em **Environment Variables**, adicione:
   | Chave | Valor |
   |-------|-------|
   | `PORT` | `10000` |
5. Clique em **"Create Web Service"**

### Após o deploy da API

A URL publicada da API é:

```
https://vue-dfe-api.onrender.com
```

Aguarde o deploy finalizar e teste no navegador:

```
https://vue-dfe-api.onrender.com/tarefas
```

Deve retornar o JSON das tarefas.

> **Aviso:** no plano gratuito do Render o serviço hiberna após inatividade. A primeira requisição pode demorar alguns segundos (o famoso "cold start").

---

## Passo 2 — Publicar o frontend no Netlify (permanente)

O frontend está publicado em **<https://error404-vue.netlify.app>**, conectado ao repositório no GitHub com build contínuo. Para recriar esse deploy:

1. Acesse https://app.netlify.com e faça login
2. Clique em **"Add new site"** → **"Import an existing project"**
3. Conecte o GitHub e selecione o repositório `Vue_DFE`
4. Configure o build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** `24` (já definido no `netlify.toml`)
5. Clique em **"Deploy site"**

### Definir a variável de ambiente da API

No painel do Netlify, vá em **Site settings** → **Build & deploy** → **Environment** e adicione:

| Chave | Valor |
|-------|-------|
| `VITE_API_URL` | `https://vue-dfe-api.onrender.com` |

A URL já está definida no serviço do Render criado no Passo 1.

Após salvar, o Netlify fará um novo build automaticamente com a URL da API embutida.

---

## Passo 3 — Build local com variável de produção (opcional)

Se quiser testar o build localmente com a URL da API do Render:

```sh
# Crie o arquivo .env.production (não é versionado)
echo "VITE_API_URL=https://vue-dfe-api.onrender.com" > .env.production

# Gere o build de produção
npm run build

# Valide localmente
npm run preview
```

---

## Passo 4 — Verificação final

| O que testar | Como |
|--------------|------|
| API no ar | Acesse `https://vue-dfe-api.onrender.com/tarefas` no navegador |
| Frontend no ar | Acesse <https://error404-vue.netlify.app> |
| Carregamento de tarefas | O frontend deve exibir as tarefas da API |
| Criar/editar/excluir | As operações devem gravar na API (sujeito à hibernação do Render) |
| Responsividade | Testar em larguras de 320 px a 1024 px (celular e tablet) |

---

## Problemas conhecidos e limitações

| Problema | Causa | Mitigação |
|----------|-------|-----------|
| Primeira requisição lenta | Render hiberna o serviço gratuito | Normal após alguns segundos |
| Alterações (POST/PUT/DELETE) resetadas | `db.json` no disco efêmero do Render | O plano gratuito não oferece disco persistente; reinicializações e novos deploys resetam o `db.json` para o conteúdo versionado. Para dados críticos, use um banco real (PostgreSQL). |

---

## Estrutura atual dos arquivos relevantes

```
server.js              # API json-server (corrigida, sem lowdb)
render.yaml            # Blueprint para deploy no Render
netlify.toml           # Configuração de build do Netlify
.env.production.example # Exemplo de variável VITE_API_URL
DEPLOY_API.md          # Guia original (mantido para referência)
DEPLOY_PERMANENTE.md   # Este arquivo
```
