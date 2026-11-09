import { createServer } from 'node:http'
import { createApp } from './node_modules/json-server/lib/app.js'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Porta via variável de ambiente (heroku/render usam PORT)
const PORT = process.env.PORT || 3000

// Inicializa o banco de dados LowDB com o db.json
const db = new Low(new JSONFile('db.json'), {})
await db.read()

// Cria a aplicação do json-server
const app = createApp(db, { logger: false })

// Cria o servidor HTTP
const httpServer = createServer(app)

httpServer.listen(PORT, () => {
  console.log(`JSON Server está rodando na porta ${PORT}`)
})
