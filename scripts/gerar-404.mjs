import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Copia o index.html do build para 404.html.
 *
 * Hospedagens estáticas que não leem regras de redirecionamento (como o
 * GitHub Pages) entregam o 404.html para rotas internas. Assim o Vue Router
 * consegue assumir a navegação mesmo quando a página é aberta ou atualizada
 * diretamente.
 */
const origem = resolve('dist/index.html')
const destino = resolve('dist/404.html')

copyFileSync(origem, destino)
console.log('dist/404.html gerado a partir de dist/index.html')
