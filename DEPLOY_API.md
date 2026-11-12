# Deploy da API (json-server hospedado)

Este guia explica como hospedar a API do Vue_DFE em um serviço gratuito, como o [Render.com](https://render.com).

> **Situação atual:** a API já está publicada em <https://vue-dfe-api.onrender.com>. Este guia serve para recriar o serviço ou entender a configuração usada.

## 1. Faça upload do código para o GitHub

Certifique-se de que os arquivos `db.json` e `server.js` estejam no repositório.

## 2. Crie um serviço no Render.com

1. Acesse [https://render.com](https://render.com) e crie uma conta gratuita.
2. Clique em **"New"** → **"Web Service"**.
3. Conecte seu repositório GitHub e selecione o repositório `Vue_DFE`.
4. Configure:
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run api:prod`
   - **Instance Type:** `Free`

## 3. Defina a variável de ambiente

No painel do Render, vá em **Environment Variables** e adicione:

| Chave | Valor |
|-------|-------|
| `PORT` | `10000` (ou a porta que o Render atribuir) |

O Render injeta automaticamente a variável `PORT`.

## 4. Atualize o frontend com a URL da API

Após o deploy, o Render vai gerar uma URL como `https://sua-api.onrender.com`.

Atualize o arquivo `.env` do frontend (local) ou a variável de ambiente do serviço de hospedagem do frontend:

```
VITE_API_URL=https://sua-api.onrender.com
```

## 5. Teste

Acesse `https://sua-api.onrender.com/tarefas` no navegador. Deve retornar o JSON das tarefas. Em seguida, acesse o frontend e verifique se as tarefas carregam.

## Alternativas gratuitas

- **Railway.app:** `https://railway.app/`
- **Koyeb:** `https://www.koyeb.com/`
- **Fly.io:** `https://fly.io/`

## Observações importantes

- O plano gratuito do Render pode "hibernar" o serviço após inatividade. A primeira requisição pode demorar alguns segundos.
- O `db.json` é um arquivo simples. Alterações feitas via POST/PUT/DELETE são salvas nele, mas podem ser resetadas em deploys no plano gratuito. Para dados persistentes, considere um banco de dados real (PostgreSQL, etc.).
