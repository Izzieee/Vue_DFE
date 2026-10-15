<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const integrantes = [
  { nome: 'Raquel Aires', usuario: 'RaquelAires' },
  { nome: 'Jacyane Martins', usuario: 'Izzieee' },
  { nome: 'Ryllen Alves', usuario: 'Ryllen' },
]

const hoje = new Date().toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})
</script>

<template>
  <div class="aplicacao">
    <header class="cabecalho">
      <div class="cabecalho-conteudo">
        <RouterLink to="/" class="marca" aria-label="Ir para o início">
          <span class="marca-icone">𖦹</span>
          <span class="marca-texto">
            <strong>ERROR 404</strong>
            <small>Organização acadêmica</small>
          </span>
        </RouterLink>

        <nav class="navegacao" aria-label="Navegação principal">
          <RouterLink to="/" class="link-navegacao" exact-active-class="ativo">
            Tarefas
          </RouterLink>

          <RouterLink to="/projetos" class="link-navegacao" active-class="ativo">
            Projetos
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="conteudo">
      <RouterView />
    </main>

    <footer class="rodape">
      <p class="rodape-materia">Desenvolvimento Front End</p>

      <nav class="rodape-autoras" aria-label="Integrantes do grupo">
        <a
          v-for="pessoa in integrantes"
          :key="pessoa.usuario"
          :href="`https://github.com/${pessoa.usuario}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ pessoa.nome }}
        </a>
      </nav>

      <p class="rodape-data">{{ hoje }}</p>
    </footer>
  </div>
</template>

<style>
/* ==========================================================================
   TEMA — azul-esverdeado (teal)
   ========================================================================== */

:root {
  --background: 190 45% 6%;
  --foreground: 185 40% 96%;

  --card: 189 34% 10%;
  --card-foreground: 185 40% 96%;

  --secondary: 188 28% 16%;
  --secondary-foreground: 185 40% 96%;

  --muted: 188 24% 15%;
  --muted-foreground: 185 20% 74%;

  --accent: 185 36% 20%;
  --accent-foreground: 185 40% 96%;

  --destructive: 0 78% 62%;
  --destructive-foreground: 0 0% 98%;

  --border: 186 26% 32%;
  --input: 188 24% 14%;
  --ring: 172 82% 46%;

  --terminal-green: 152 58% 55%;
  --terminal-amber: 38 96% 62%;
  --terminal-cyan: 191 82% 58%;
  --terminal-dim: 186 14% 60%;

  --priority-high: 0 78% 60%;
  --priority-medium: 28 94% 58%;
  --priority-low: 142 52% 50%;

  --grid-color: 188 30% 13%;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2.5rem;
  --focus-ring: 3px solid hsl(var(--ring));
  --ease-glass: cubic-bezier(0.22, 1, 0.36, 1);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

:focus-visible {
  outline: var(--focus-ring);
  outline-offset: 2px;
}

html {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) hsl(var(--background));
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  font-family: 'JetBrains Mono', ui-monospace, 'Segoe UI', monospace;
  font-size: 1rem;
  line-height: 1.55;
  color: hsl(var(--foreground));
  background-color: hsl(var(--background));
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -10%, hsl(var(--ring) / 0.14), transparent 60%),
    linear-gradient(hsl(var(--grid-color)) 1px, transparent 1px),
    linear-gradient(90deg, hsl(var(--grid-color)) 1px, transparent 1px);
  background-size:
    100% 100%,
    32px 32px,
    32px 32px;
  background-position:
    0 0,
    -1px -1px,
    -1px -1px;
  position: relative;
}

body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 180px rgba(0, 0, 0, 0.75);
  z-index: 40;
}

::selection {
  background: hsl(var(--ring));
  color: hsl(var(--background));
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--background));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border: 2px solid hsl(var(--background));
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--ring));
}

button,
input,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
}

@keyframes liquid-drift {
  0% {
    background-position: 30% 20%;
    transform: scale(1) translateX(0);
  }
  33% {
    transform: scale(1.04) translateX(8px) translateY(-4px);
  }
  66% {
    transform: scale(0.97) translateX(-5px) translateY(6px);
  }
  100% {
    transform: scale(1.02) translateX(12px) translateY(-8px);
  }
}

/* ==========================================================================
   ESTRUTURA
   ========================================================================== */

.aplicacao {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  min-height: 100vh;
  padding: var(--space-3);
}

.cabecalho {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  border: 1px solid hsl(var(--ring) / 0.5);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4),
    0 8px 40px hsl(var(--ring) / 0.15);
}

.cabecalho::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 60% 140% at 15% 10%,
    hsl(var(--ring) / 0.16) 0%,
    transparent 65%
  );
  animation: liquid-drift 8s ease-in-out infinite alternate;
  z-index: 0;
}

.cabecalho-conteudo {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 96px;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-4) var(--space-5);
}

.marca {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
}

.marca-icone {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 1px solid hsl(var(--ring));
  background: hsl(var(--ring) / 0.12);
  color: hsl(var(--ring));
  font-size: 28px;
  font-weight: 700;
  box-shadow:
    0 0 20px hsl(var(--ring) / 0.25),
    inset 0 0 12px hsl(var(--ring) / 0.15);
}

.marca-texto {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.marca-texto strong {
  color: hsl(var(--foreground));
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-shadow: 0 0 18px hsl(var(--ring) / 0.45);
}

.marca-texto small {
  color: hsl(var(--muted-foreground));
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
}

.navegacao {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.link-navegacao {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--secondary) / 0.8);
  color: hsl(var(--muted-foreground));
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s var(--ease-glass);
}

.link-navegacao:hover {
  border-color: hsl(var(--ring));
  color: hsl(var(--ring));
}

.link-navegacao.ativo {
  background: hsl(var(--ring));
  border-color: hsl(var(--ring));
  color: hsl(var(--background));
  box-shadow: 0 0 20px hsl(var(--ring) / 0.4);
}

.conteudo {
  display: flex;
  width: 100%;
  max-width: 1200px;
  flex: 1;
  flex-direction: column;
  gap: var(--space-3);
}

.rodape {
  position: relative;
  overflow: hidden;
  display: flex;
  width: 100%;
  max-width: 1200px;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  margin-top: auto;
  padding: var(--space-4);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card) / 0.6);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 -4px 24px rgba(0, 0, 0, 0.3);
  color: hsl(var(--muted-foreground));
  text-align: center;
}

.rodape::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, hsl(var(--ring) / 0.5), transparent);
}

.rodape-materia {
  margin: 0;
  color: hsl(var(--ring));
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-shadow: 0 0 16px hsl(var(--ring) / 0.3);
}

.rodape-autoras {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.rodape-autoras a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--secondary) / 0.6);
  color: hsl(var(--muted-foreground));
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: all 0.25s var(--ease-glass);
}

.rodape-autoras a::before {
  content: '';
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: hsl(var(--ring));
}

.rodape-autoras a:hover {
  border-color: hsl(var(--ring));
  background: hsl(var(--ring) / 0.1);
  color: hsl(var(--ring));
  transform: translateY(-2px);
}

.rodape-data {
  margin: 0;
  color: hsl(var(--terminal-dim));
  font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media (max-width: 560px) {
  .cabecalho-conteudo {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
    padding: var(--space-3);
  }

  .navegacao {
    width: 100%;
  }

  .link-navegacao {
    flex: 1;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cabecalho::before {
    animation: none;
  }
}
</style>
