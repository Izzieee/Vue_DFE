<script setup lang="ts">
import { useRoute } from 'vue-router'

const rota = useRoute()
</script>

<template>
  <main class="pagina">
    <h1>{{ rota.meta.titulo ?? 'Página' }}</h1>

    <p>Esta página está preparada para receber sua implementação.</p>

    <p v-if="rota.params.id">Identificador: {{ rota.params.id }}</p>
  </main>
</template>

<style scoped>
.pagina {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  font-size: 28px;
}
</style>
