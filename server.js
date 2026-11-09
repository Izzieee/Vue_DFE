const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Porta via variável de ambiente (heroku/render usam PORT)
const PORT = process.env.PORT || 3000

// Middlewares padrão do json-server (logger, no-cache, etc.)
server.use(middlewares)

// Habilita CORS para permitir chamadas de qualquer origem (frontend hospedado separadamente)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  next()
})

// Usa o router do json-server com o db.json
server.use(router)

server.listen(PORT, () => {
  console.log(`JSON Server está rodando na porta ${PORT}`)
})
