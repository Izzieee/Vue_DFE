import { createApp } from './node_modules/json-server/lib/app.js'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

// Porta via variável de ambiente (Render injeta PORT automaticamente)
const PORT = process.env.PORT || 3000

// Caminho do arquivo de banco de dados
const dbPath = path.resolve('db.json')

// Carrega o banco de dados a partir do db.json.
// O json-server espera a estrutura { data: { tarefas: [...], projetos: [...] } }
// e um método write() para persistir alterações (POST/PUT/DELETE).
const rawData = JSON.parse(readFileSync(dbPath, 'utf-8'))

const db = {
  data: rawData,
  write() {
    writeFileSync(dbPath, JSON.stringify(this.data, null, 2), 'utf-8')
  },
}

// Cria a aplicação do json-server
const app = createApp(db, { logger: false })

app.listen(PORT, () => {
  console.log(`JSON Server está rodando na porta ${PORT}`)
})
