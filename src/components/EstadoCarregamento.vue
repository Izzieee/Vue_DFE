<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Texto exibido ao lado do indicador. */
    mensagem?: string
  }>(),
  { mensagem: 'Carregando...' },
)
</script>

<template>
  <p class="estado-carregamento" role="status" aria-live="polite" aria-atomic="true">
    <span class="girador" aria-hidden="true"></span>
    <span>{{ mensagem }}</span>
  </p>
</template>

<style scoped>
.estado-carregamento {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin: 0;
  padding: var(--space-5) var(--space-3);
  border: 1px dashed hsl(var(--border));
  background: hsl(var(--card) / 0.9);
  color: hsl(var(--muted-foreground));
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  text-align: center;
  text-transform: uppercase;
}

.girador {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  border: 2px solid hsl(var(--ring) / 0.25);
  border-top-color: hsl(var(--ring));
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}

/* Sem animação, o indicador continua visível e o texto segue informando o estado. */
@media (prefers-reduced-motion: reduce) {
  .girador {
    animation: none;
    border-top-color: hsl(var(--ring) / 0.25);
    background: hsl(var(--ring) / 0.35);
  }
}
</style>
