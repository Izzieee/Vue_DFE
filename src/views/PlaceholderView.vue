<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const rota = useRoute()
</script>

<template>
  <section class="pagina">
    <h1 class="titulo-secao">Página não encontrada</h1>

    <div class="estado">
      <p class="mensagem">
        O endereço <code>{{ rota.fullPath }}</code> não corresponde a nenhuma página do sistema.
      </p>
      <p class="dica">Confira o endereço digitado ou volte para a lista de tarefas.</p>
      <RouterLink class="botao-voltar" to="/">Voltar para as tarefas</RouterLink>
    </div>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-3);
  border: 1px dashed hsl(var(--border));
  background: hsl(var(--card) / 0.9);
  color: hsl(var(--muted-foreground));
  text-align: center;
}

.mensagem,
.dica {
  margin: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.mensagem {
  font-size: 0.95rem;
}

.mensagem code {
  color: hsl(var(--ring));
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
}

.dica {
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.botao-voltar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.85rem;
  border: 1px solid hsl(var(--ring));
  border-radius: 4px;
  background: hsl(var(--ring) / 0.08);
  color: hsl(var(--ring));
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-decoration: none;
  text-transform: uppercase;
  transition: 0.2s ease;
}

.botao-voltar:hover {
  background: hsl(var(--ring) / 0.18);
  box-shadow: 0 0 12px hsl(var(--ring) / 0.15);
}
</style>
