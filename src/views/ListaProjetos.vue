<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { listarProjetos } from '@/api'
import type { Projeto } from '@/tipos'

const projetos = ref<Projeto[]>([])
const carregando = ref(true)
const erro = ref<string | null>(null)

onMounted(async () => {
  try {
    projetos.value = await listarProjetos()
  } catch (e) {
    erro.value = (e as Error).message
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <section class="pagina">
    <h1 class="titulo-secao">Projetos</h1>

    <div class="acoes-pagina">
      <RouterLink class="botao-novo" to="/projetos/novo"> + Novo Projeto</RouterLink>
    </div>

    <p v-if="carregando" class="estado">Carregando...</p>
    <p v-else-if="erro" class="estado estado-erro">Erro: {{ erro }}</p>
    <p v-else-if="projetos.length === 0" class="estado">Nenhum projeto.</p>

    <ul v-else class="lista-projetos">
      <li v-for="projeto in projetos" :key="projeto.id" class="cartao-projeto">
        <header class="cartao-cabecalho">
          <h3>{{ projeto.nome }}</h3>
          <time class="cartao-data" :datetime="projeto.criadoEm">{{
            projeto.criadoEm.slice(0, 10)
          }}</time>
        </header>

        <p class="cartao-descricao">{{ projeto.descricao }}</p>

        <footer class="cartao-rodape">
          <span class="tag-disciplina">{{ projeto.disciplina }}</span>
          <RouterLink class="cartao-link" :to="`/projetos/${projeto.id}`">
            Ver projeto →
          </RouterLink>
        </footer>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.acoes-pagina {
  display: flex;
  justify-content: flex-end;
}

.botao-novo {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border: 1px solid hsl(var(--ring));
  background: hsl(var(--ring) / 0.1);
  color: hsl(var(--ring));
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.botao-novo:hover {
  background: hsl(var(--ring) / 0.2);
  box-shadow: 0 0 18px hsl(var(--ring) / 0.2);
}
.pagina {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.titulo-secao {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  padding-bottom: var(--space-2);
  border-bottom: 3px solid hsl(var(--border));
  color: hsl(var(--ring));
  font-size: clamp(1.3rem, 1.05rem + 0.9vw, 1.7rem);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-shadow: 0 0 20px hsl(var(--ring) / 0.35);
}

.titulo-secao::before {
  content: '//';
  letter-spacing: 0;
}

.lista-projetos {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.cartao-projeto {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid hsl(var(--border));
  border-left: 3px solid hsl(var(--ring));
  background: hsl(var(--card) / 0.94);
  transition: all 0.3s var(--ease-glass);
}

.cartao-projeto:hover {
  border-color: hsl(var(--ring));
  background: hsl(var(--secondary) / 0.96);
  transform: translateY(-3px);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.45),
    0 0 24px hsl(var(--ring) / 0.15);
}

.cartao-cabecalho {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}

.cartao-cabecalho h3 {
  margin: 0;
  color: hsl(var(--foreground));
  font-size: 0.98rem;
  font-weight: 500;
}

.cartao-data {
  color: hsl(var(--muted-foreground));
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  white-space: nowrap;
}

.cartao-descricao {
  margin: 0;
  color: hsl(var(--muted-foreground));
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
  font-size: 0.82rem;
}

.cartao-rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-top: auto;
  padding-top: var(--space-1);
}

.tag-disciplina {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  border: 1px solid hsl(var(--ring) / 0.5);
  background: hsl(var(--ring) / 0.1);
  color: hsl(var(--ring));
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cartao-link {
  color: hsl(var(--ring));
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

.cartao-link:hover {
  text-decoration: underline;
  text-shadow: 0 0 12px hsl(var(--ring) / 0.5);
}

.estado {
  grid-column: 1 / -1;
  padding: var(--space-5) var(--space-3);
  border: 1px dashed hsl(var(--border));
  background: hsl(var(--card) / 0.9);
  color: hsl(var(--muted-foreground));
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-align: center;
  text-transform: uppercase;
}

.estado-erro {
  border: 1px solid hsl(var(--destructive) / 0.5);
  background: hsl(var(--destructive) / 0.06);
  color: hsl(var(--destructive-foreground));
}

@media (min-width: 680px) {
  .lista-projetos {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1080px) {
  .lista-projetos {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
