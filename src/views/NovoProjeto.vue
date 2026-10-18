<script setup lang="ts">
    import {ref} from 'vue'

    const nome = ref('')
    const descricao = ref('')
    const disciplina = ref('')

    function salvarProjeto(){
        console.log({
            nome : nome.value,
            descricao: descricao.value,
            disciplina : disciplina.value
        })

        // função que ainda vai ser feita
    }
</script>
<template>
    <section class="pagina">
        <h1 class="titulo-secao">Novo Projeto</h1>

        <form class="formulario" @submit.prevent="salvarProjeto">
            <div class="campo">
                <label for="nome">Nome</label>
                <input id="nome" v-model="nome" type="text"/>
            </div>

            <div class="campo">
                <label for="descricao">Descrição</label>
                <textarea id="descricao" v-model="descricao"></textarea>
            </div>

            <div class="campo">
                <label for="disciplina">disciplina</label>
                <input id="disciplina" v-model="disciplina" type="text"/>
            </div>

            <button class="botao-salvar" type="submit">Salvar projeto</button>
        </form>
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

.formulario {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid hsl(var(--border));
  border-left: 3px solid hsl(var(--ring));
  background: hsl(var(--card) / 0.94);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 4px 24px rgba(0, 0, 0, 0.4);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.campo label {
  color: hsl(var(--ring));
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.campo input,
.campo textarea {
  width: 100%;
  box-sizing: border-box;
  padding: var(--space-2);
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font: inherit;
}

.campo textarea {
  min-height: 120px;
  resize: vertical;
}

.campo input:focus,
.campo textarea:focus {
  border-color: hsl(var(--ring));
  outline: none;
  box-shadow: 0 0 12px hsl(var(--ring) / 0.15);
}

.botao-salvar {
  width: fit-content;
  padding: var(--space-2) var(--space-3);
  border: 1px solid hsl(var(--ring));
  background: hsl(var(--ring) / 0.1);
  color: hsl(var(--ring));
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.botao-salvar:hover {
  background: hsl(var(--ring) / 0.2);
  box-shadow: 0 0 18px hsl(var(--ring) / 0.2);
}
</style>