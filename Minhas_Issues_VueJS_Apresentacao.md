# MINHAS ISSUES — Busca por Título e Filtros de Status e Prioridade
## Apresentação Acadêmica — Visão Vue.js 3

**Projeto:** Vue_DFE  
**Framework:** Vue.js 3 (Composition API)  
**Build Tool:** Vite  
**Linguagem:** TypeScript  
**API:** json-server

---

## 1. O QUE FUI RESPONSÁVEL

Implementei dois marcos de funcionalidades na listagem de tarefas:

| Marco | O que fiz | Arquivo principal |
|-------|-----------|-------------------|
| Busca por título | Campo de busca que filtra tarefas pelo título, sem modificar os dados originais | `src/views/ListaTarefas.vue` |
| Filtros por status e prioridade | Dois seletores (status e prioridade) que funcionam individualmente e em conjunto com a busca | `src/views/ListaTarefas.vue` |

Ambos estão integrados na mesma tela (`ListaTarefas.vue`) e compartilham o mesmo estado reativo.

---

## 2. CURIOSIDADES DO VUE.JS (QUE EU PODEMOS MOSTRAR)

Como você já apresentou `ref` e `v-model` em aulas anteriores, aqui vão curiosidades do Vue.js relacionadas especificamente a estas issues, que você pode usar na apresentação:

---

### Curiosidade 1: `computed` tem cache automático

Quando o usuário digita na busca ou muda um seletor, não é necessário recalcular tudo toda hora. O Vue faz isso sozinho com `computed`:

```ts
const tarefasFiltradas = computed(() => {
  const termo = termoBusca.value.toLowerCase().trim()
  return tarefas.value.filter((tarefa) => {
    const correspondeBusca = !termo || tarefa.titulo.toLowerCase().includes(termo)
    const correspondeStatus = !filtroStatus.value || tarefa.status === filtroStatus.value
    const correspondePrioridade = !filtroPrioridade.value || tarefa.prioridade === filtroPrioridade.value
    return correspondeBusca && correspondeStatus && correspondePrioridade
  })
})
```

**O que falar:**  
> "O `computed` só recalcula quando alguma das suas dependências muda (`termoBusca`, `filtroStatus`, `filtroPrioridade` ou `tarefas`). Se nenhuma delas mudou, o Vue devolve o resultado guardado no cache. Isso é muito mais eficiente que rodar um filtro dentro de um método comum a cada renderização."

**Como mostrar ao vivo:**  
Adicione temporariamente um `console.log('Recalculando...')` dentro da `computed`. Abra o console do navegador, digite algo na busca (aparece o log), digite outra letra (aparece de novo), clique em outro lugar sem mudar nada (não aparece nada novo).

---

### Curiosidade 2: Dados originais nunca são modificados

O array `tarefas` (que vem da API) nunca é alterado. A `computed` devolve um **novo array** filtrado:

```ts
// tarefas.value continua intacto
return tarefas.value.filter(...) // cria um array novo
```

**O que falar:**  
> "A busca e os filtros não apagam nem mudam as tarefas originais. Eles apenas criam uma 'visão filtrada' dos dados. Isso permite combinar busca + status + prioridade sem perder informações. Se amanhã precisarmos limpar um filtro, basta voltar ao array original."

---

### Curiosidade 3: `v-if` remove elementos do DOM completamente

No template, usamos:

```vue
<p v-if="carregando" class="estado">Carregando...</p>
<p v-else-if="tarefasFiltradas.length === 0" class="estado">
  Nenhuma tarefa encontrada com os critérios selecionados.
</p>
```

**O que falar:**  
> "O `v-if` não apenas esconde o elemento com CSS (`display: none`). Ele **adiciona ou remove o elemento do DOM completamente**. Quando não há resultados, a lista de cartões é destruída e a mensagem é criada no lugar. Isso mantém o DOM limpo."

---

### Curiosidade 4: `v-for` com `:key` é obrigatório para listas

```vue
<CartaoTarefa
  v-for="tarefa in tarefasFiltradas"
  :key="tarefa.id"
  :tarefa="tarefa"
/>
```

**O que falar:**  
> "O `:key` diz ao Vue qual item é único. Sem ele, o Vue poderia reutilizar elementos do DOM incorretamente quando a lista muda (ex: ao aplicar ou limpar filtros), causando bugs visuais. Com o `key`, o Vue sabe exatamente qual cartão pertence a qual tarefa."

---

### Curiosidade 5: O estado da interface é reativo por si só

Não precisamos de funções para "mostrar" ou "esconder" botões manualmente:

```ts
const temFiltrosAtivos = computed(() =>
  Boolean(termoBusca.value.trim() || filtroStatus.value || filtroPrioridade.value)
)
```

```vue
<button v-if="temFiltrosAtivos" class="botao" @click="limparFiltros">
  Limpar filtros
</button>
```

**O que falar:**  
> "O botão 'Limpar filtros' aparece e some sozinho. Não escrevi nenhuma função para manipulá-lo. O Vue observa `temFiltrosAtivos` e, quando ela muda de `false` para `true`, o botão é renderizado automaticamente. Quando volta a ser `false`, ele some."

---

## 3. ROTEIRO DE EXPLICAÇÃO (FALA DETALHADA)

Abaixo está o roteiro que você pode usar na apresentação, dividido por tópico.

---

### A. INTRODUÇÃO (30 segundos)

> "Boa tarde. Sou a Raquel e fui responsável por implementar a busca por título e os filtros de status e prioridade na listagem de tarefas.  
>  
> Vou explicar não apenas o que fiz, mas como o **Vue.js 3** processou essa funcionalidade: reatividade, propriedades computadas, renderização condicional e ligação bidirecional."

---

### B. ESTRUTURA DO COMPONENTE (1 minuto)

> "Tudo está no arquivo `ListaTarefas.vue`, que é um **Single File Component** do Vue. Isso significa que template, script e estilo estão no mesmo arquivo, com CSS escopoado para não vazar para outras telas.  
>  
> No script, declarei quatro variáveis reativas com `ref`:  
> - `tarefas` — recebe os dados da API  
> - `termoBusca` — o que o usuário digita no campo de busca  
> - `filtroStatus` — o status selecionado no seletor  
> - `filtroPrioridade` — a prioridade selecionada no seletor  
>  
> Além de `carregando` e `erro` para gerenciar estados da requisição à API."

---

### C. BUSCA POR TÍTULO (1 minuto)

> "A busca funciona através de `v-model` no input. Quando o usuário digita, o Vue atualiza automaticamente a variável `termoBusca`.  
>  
> A filtragem acontece numa propriedade `computed` chamada `tarefasFiltradas`. Ela recebe o termo digitado, converte para minúsculas e verifica se o título de cada tarefa contém esse termo. Se o campo estiver vazio, retorna todas as tarefas.  
>  
> Importante: o array original `tarefas` nunca é modificado. A `computed` apenas devolve um novo array com os resultados da busca."

---

### D. FILTROS POR STATUS E PRIORIDADE (1 minuto)

> "Adicionei dois seletores (`<select>`), um para status e outro para prioridade. Cada um usa `v-model` vinculado a uma variável reativa (`filtroStatus` e `filtroPrioridade`).  
>  
> Os valores dos seletores correspondem exatamente aos contratos da API:  
> - Status: `a-fazer`, `em-andamento`, `em-revisao`, `concluida`  
> - Prioridade: `baixa`, `media`, `alta`  
>  
> Além disso, incluí uma opção com valor vazio (`Todos` / `Todas`) para permitir 'desfazer' o filtro."

---

### E. FILTROS COMBINADOS (1 minuto)

> "Os três filtros funcionam ao mesmo tempo. Na `computed`, verifico:  
> 1. Se há termo de busca, o título deve conter esse termo  
> 2. Se há status selecionado, a tarefa deve ter esse status  
> 3. Se há prioridade selecionada, a tarefa deve ter essa prioridade  
>  
> Só exibe a tarefa se todas as condições forem verdadeiras. Isso significa que o usuário pode buscar por 'modelar', filtrar por status 'Em andamento' e prioridade 'Alta' simultaneamente."

---

### E. BOTÃO LIMPAR FILTROS E MENSAGEM VAZIA (30 segundos)

> "Criei uma computed `temFiltrosAtivos` que verifica se algum dos três filtros está preenchido. Se sim, o botão 'Limpar filtros' aparece. Clicar nele reseta busca, status e prioridade para valores vazios.  
>  
> Se nenhum resultado corresponder aos critérios, uma mensagem avisa: 'Nenhuma tarefa encontrada com os critérios selecionados.'"

---

### F. O QUE O VUE.JS FAZ POR BAIXO DOS PANOS (1 minuto)

> "Resumindo os conceitos do Vue.js que apliquei:  
> 1. **`ref`**: variáveis reativas que disparam atualizações automáticas no template  
> 2. **`computed`**: valores derivados com cache automático; não recalcula se nada mudou  
> 3. **`v-model`**: ligação bidirecional entre inputs/selects e o estado  
> 4. **`v-if` / `v-else-if`**: renderização condicional que adiciona ou remove elementos do DOM  
> 5. **`v-for` com `:key`**: renderização eficiente de listas, identificando cada item de forma única  
> 6. **`<style scoped>`**: estilos isolados apenas para este componente"

---

## 4. FALHAS POSSÍVEIS E COMO RESOLVER

| Falha | Por que acontece | Solução no Vue.js |
|-------|------------------|-------------------|
| Busca não funciona ao digitar | Esquecer `v-model` no input | Vincular o input à variável reativa com `v-model="termoBusca"` |
| Filtros não se combinam | Fazer filtros separados que sobrescrevem um ao outro | Usar uma única `computed` que valide todas as condições com `&&` |
| Não dá para limpar o filtro | Não ter opção de valor vazio nos selects | Incluir `<option value="">Todos</option>` e tratar vazio como "ignorar filtro" |
| Dados originais somem após filtrar | Modificar o array `tarefas` diretamente | Manter `tarefas` imutável; usar `computed` para devolver novo array filtrado |
| Botão 'Limpar filtros' não some | Controlar a visibilidade com JavaScript manual | Usar `v-if="temFiltrosAtivos"` com uma `computed` reativa |

---

## 5. EXEMPLO DE DEMO AO VIVO (SUGESTÃO DE 2 MINUTOS)

| Passo | Ação | O que falar |
|-------|------|-------------|
| 1 | Abre `http://localhost:5173/` | "Esta é a listagem de tarefas." |
| 2 | Digita "modelar" na busca | "Reatividade: o filtro aplica sozinho, sem recarregar a página." |
| 3 | Seleciona status "Em andamento" | "Filtro de status funciona junto com a busca." |
| 4 | Seleciona prioridade "Alta" | "Três filtros simultâneos: busca + status + prioridade." |
| 5 | Clica em "Limpar filtros" | "Estado reativo volta ao normal; `computed` retorna tudo." |
| 6 | (Opcional) Abre o console | Mostra que a `computed` não recalca desnecessariamente (cache do Vue). |

---

## 6. COMO CONVERTER PARA .DOCX

Este arquivo está em Markdown (`.md`). Para entregar como documento do Word:

1. Abra o arquivo `Minhas_Issues_VueJS_Apresentacao.md` no Bloco de Notas, VS Code ou outro editor de texto.
2. Copie todo o conteúdo.
3. Cole no **Microsoft Word**.
4. Vá em **Arquivo > Salvar como** e escolha **Word Document (*.docx)**.

---

**Fim do documento**
