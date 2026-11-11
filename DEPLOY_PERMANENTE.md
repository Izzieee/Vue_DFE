# Deploy Permanente — Vue_DFE (Marco 6)

Este guia leva o projeto da hospedagem temporária (Netlify Drop + Cloudflare Tunnel) para um deploy permanente:

- **Frontend:** Netlify (conectado ao GitHub, build contínuo)
- **API:** Render.com (Web Service gratuito com `json-server`)
- **Variável de ambiente:** `VITE_API_URL` definida nos dois serviços

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
   - Disco: 1 GB montado em `/var/data` (persistência básica do `db.json`)
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

O Render gerará uma URL como:
```
https://vue-dfe-api.onrender.com
```

Aguarde o deploy finalizar e teste no navegador:
```
https://sua-api.onrender.com/tarefas
```
Deve retornar o JSON das tarefas.

> **Aviso:** no plano gratuito do Render o serviço hiberna após inatividade. A primeira requisição pode demorar alguns segundos (o famoso "cold start").

---

## Passo 2 — Publicar o frontend no Netlify (permanente)

O site atual está em **Netlify Drop** (anônimo, temporário, com senha `My-Drop-Site`). Para torná-lo permanente:

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
| `VITE_API_URL` | `https://sua-api.onrender.com` |

Substitua `https://sua-api.onrender.com` pela URL real gerada no Passo 1.

Após salvar, o Netlify fará um novo build automaticamente com a URL da API embutida.

---

## Passo 3 — Build local com variável de produção (opcional)

Se quiser testar o build localmente com a URL da API do Render:

```sh
# Crie o arquivo .env.production (não é versionado)
echo "VITE_API_URL=https://sua-api.onrender.com" > .env.production

# Gere o build de produção
npm run build

# Valide localmente
npm run preview
```

---

## Passo 4 — Verificação final

| O que testar | Como |
|--------------|------|
| API no ar | Acesse `https://sua-api.onrender.com/tarefas` no navegador |
| Frontend no ar | Acesse a URL do Netlify (ex.: `https://seu-site.netlify.app`) |
| Carregamento de tarefas | O frontend deve exibir as tarefas da API |
| Criar/editar/excluir | As operações devem gravar na API (sujeito ao hibernação do Render) |

---

## Problemas conhecidos e limitações

| Problema | Causa | Mitigação |
|----------|-------|-----------|
| Primeira requisição lenta | Render hiberna o serviço gratuito | Normal após alguns segundos |
| Alterações (POST/PUT/DELETE) resetadas | `db.json` no disco efêmero do Render | O disco de 1 GB no `render.yaml` ajuda, mas reinicializações podem resetar. Para dados críticos, use um banco real (PostgreSQL). |
| Site Netlify Drop expira | Site anônimo não claimado | Este guia migra para um site conectado ao GitHub, permanente |

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
