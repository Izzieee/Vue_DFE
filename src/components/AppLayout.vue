<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
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
      <p>ERROR 404 · Organização acadêmica</p>
    </footer>
  </div>
</template>

<style>
:root {
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  color: #252a34;
  background: #f5f7fb;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
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

.aplicacao {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.cabecalho {
  background: #ffffff;
  border-bottom: 1px solid #e3e8f0;
}

.cabecalho-conteudo {
  display: flex;
  width: min(1120px, 100%);
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: 0 auto;
  padding: 14px 24px;
}

.marca {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
}

.marca-icone {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 12px;
  background: #c83131;
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
}

.marca-texto {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.marca-texto strong {
  color: #0a1d50;
  font-size: 18px;
}

.marca-texto small {
  color: #90737e;
  font-size: 12px;
}

.navegacao {
  display: flex;
  align-items: center;
  gap: 8px;
}

.link-navegacao {
  padding: 10px 15px;
  border-radius: 9px;
  color: #596579;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.link-navegacao:hover {
  background: #ffeaeb;
  color: rgb(200, 49, 67);
}

.link-navegacao.ativo {
  background: #ffeaeb;
  color: rgb(200, 49, 67);
}

.conteudo {
  width: min(1120px, 100%);
  flex: 1;
  margin: 0 auto;
  padding: 32px 24px;
}

.rodape {
  border-top: 1px solid #e3e8f0;
  background: #ffffff;
  color: #737d90;
  text-align: center;
}

.rodape p {
  margin: 0;
  padding: 18px 24px;
  font-size: 12px;
}

@media (max-width: 560px) {
  .cabecalho-conteudo {
    align-items: flex-start;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
  }

  .navegacao {
    width: 100%;
  }

  .link-navegacao {
    flex: 1;
    padding: 10px;
    text-align: center;
  }

  .conteudo {
    padding: 24px 16px;
  }
}
</style>
