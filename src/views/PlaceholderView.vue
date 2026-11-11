<script setup lang="ts">
import { useRoute } from 'vue-router'

const rota = useRoute()
</script>

<template>
  <section class="pagina">
    <h1 class="titulo-secao">{{ rota.meta.titulo ?? 'Página' }}</h1>

    <p class="estado">Esta página está preparada para receber sua implementação.</p>

    <p v-if="rota.params.id" class="identificador">Identificador: {{ rota.params.id }}</p>
  </section>
</template>

<style scoped>
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

.estado {
  padding: var(--space-5) var(--space-3);
  border: 1px dashed hsl(var(--border));
  background: hsl(var(--card) / 0.9);
  color: hsl(var(--muted-foreground));
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-align: center;
  text-transform: uppercase;
}

.identificador {
  margin: 0;
  color: hsl(var(--muted-foreground));
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}
</style>
