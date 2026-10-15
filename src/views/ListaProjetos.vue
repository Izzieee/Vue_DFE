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
  <section>
    <h1>Projetos</h1>

    <p v-if="carregando">Carregando...</p>
    <p v-else-if="erro">Erro: {{ erro }}</p>
    <p v-else-if="projetos.length === 0">Nenhum projeto.</p>

    <ul v-else class="lista-projetos">
      <li v-for="projeto in projetos" :key="projeto.id" class="cartao-projeto">
        <header class="cartao-cabecalho">
          <h2>{{ projeto.nome }}</h2>
          <time class="cartao-data" :datetime="projeto.criadoEm">{{ projeto.criadoEm }}</time>
        </header>

        <p class="cartao-descricao">{{ projeto.descricao }}</p>

        <footer class="cartao-rodape">
          <span class="cartao-disciplina">{{ projeto.disciplina }}</span>
          <RouterLink class="cartao-link" :to="`/projetos/${projeto.id}`"> Ver projeto </RouterLink>
        </footer>
      </li>
    </ul>
  </section>
</template>

<style scoped>
h1 {
  color: #0a1d50;
  font-size: 28px;
  margin: 0 0 24px;
}

.lista-projetos {
  display: grid;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.cartao-projeto {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 1px solid #e3e8f0;
  border-radius: 12px;
  background: #ffffff;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.cartao-projeto:hover {
  box-shadow: 0 10px 24px rgba(10, 29, 80, 0.08);
  transform: translateY(-2px);
}

.cartao-cabecalho {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.cartao-cabecalho h2 {
  margin: 0;
  color: #0a1d50;
  font-size: 18px;
}

.cartao-data {
  color: #90737e;
  font-size: 12px;
  white-space: nowrap;
}

.cartao-descricao {
  margin: 0;
  color: #596579;
  font-size: 14px;
}

.cartao-rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
}

.cartao-disciplina {
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffeaeb;
  color: #c83131;
  font-size: 12px;
  font-weight: 600;
}

.cartao-link {
  color: #c83131;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.cartao-link:hover {
  text-decoration: underline;
}
</style>
