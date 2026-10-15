<script setup lang ="ts">
    import { onMounted, ref } from 'vue';
    import { RouterLink } from 'vue-router'
    import { listarProjetos } from '@/api'
    import type { Projeto } from '@/tipos'

    const projetos = ref<Projeto[]>([])
    onMounted(async () => {
    projetos.value = await listarProjetos()})
</script>

<template>
    <main>
        <h1>Projetos</h1>
        <ul>
            <li v-for="projeto in projetos" :key="projeto.id">
                <h2>{{ projeto.nome }}</h2>
                <p>{{ projeto.descricao }}</p>
                <p><strong>Disciplina:</strong>
                    {{ projeto.disciplina }}</p>
                <RouterLink :to="`/projetos/${projeto.id}`">Ver projeto</RouterLink>
            </li>
        </ul>
    </main>
</template>