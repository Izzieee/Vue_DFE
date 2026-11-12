# Apresentações

Esta pasta reúne os roteiros e os arquivos de apresentação do projeto **ERROR 404 —
Organização acadêmica**.

| Arquivo | Uso | Duração |
|---|---|---|
| [`MARCO6.md`](./MARCO6.md) | Roteiro do Marco 6 (build, publicação e deploy) | até 5 minutos |
| [`MARCO6.pptx`](./MARCO6.pptx) | Versão em PowerPoint do Marco 6 | até 5 minutos |
| [`FINAL.md`](./FINAL.md) | Roteiro da apresentação final | até 20 minutos |
| [`FINAL.pptx`](./FINAL.pptx) | Versão em PowerPoint da apresentação final | até 20 minutos |

Os arquivos `.md` usam a sintaxe do [Marp](https://marp.app/) e podem ser editados como texto.
Os arquivos `.pptx` são gerados a partir deles pelo script
[`scripts/gerar_apresentacoes.py`](../scripts/gerar_apresentacoes.py).

## Como abrir

- **PowerPoint / Google Slides / LibreOffice:** abra `MARCO6.pptx` ou `FINAL.pptx`.
- **Marp (VS Code):** instale a extensão *Marp for VS Code* e abra o `.md`; use o botão de
  pré-visualização.
- **Marp CLI (PDF/PPTX/HTML):**

  ```sh
  npx @marp-team/marp-cli apresentacoes/MARCO6.md --pdf
  npx @marp-team/marp-cli apresentacoes/FINAL.md --pdf
  npx @marp-team/marp-cli apresentacoes/FINAL.md --html
  ```

## Como regerar os PPTX

Requisitos: Python 3 e `python-pptx`.

```sh
python -m pip install --user python-pptx
python scripts/gerar_apresentacoes.py
```

O script lê os dois arquivos `.md`, remove o front matter do Marp, converte os títulos,
marcadores e notas do orador e grava os `.pptx` nesta pasta.

## Divisão da fala

### Marco 6 (5 minutos)

| Pessoa | Blocos | Tempo aproximado |
|---|---|---|
| Raquel Aires | O que entregamos, arquitetura, deploy da API, resultados | 1 min 40 s |
| Jacyane Carvalho | Build, variáveis de ambiente, deploy do frontend, responsividade | 1 min 40 s |
| Ryllen Alves | Rotas internas, demonstração, limitações e encerramento | 1 min 40 s |

### Apresentação final (20 minutos)

| Pessoa | Blocos | Tempo aproximado |
|---|---|---|
| Raquel Aires | Problema, stack, componentização, partes fáceis | 5 min |
| Jacyane Carvalho | Framework, modelo conceitual, rotas/SPA, build/deploy, qualidade | 6 min |
| Ryllen Alves | Contrato, decisões técnicas, demonstração, partes difíceis, lições | 9 min |

## Dicas para a demo

1. Abra a aplicação publicada e deixe a aba da API aberta para eventuais consultas.
2. Se o Render estiver hibernando, faça uma primeira requisição e aguarde o aquecimento.
3. Demonstre primeiro a lista, a busca e os filtros; depois o quadro e o arrastar-e-soltar.
4. Abra `/tarefas/2` diretamente para provar o fallback de SPA e recarregue a página.
5. Finalize com uma rota inexistente para mostrar a página 404.
6. Tenha o [`VALIDACAO_ROTAS.md`](../VALIDACAO_ROTAS.md) à mão para responder perguntas.
