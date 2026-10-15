<script setup lang = "ts">
    import { onMounted, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import { buscarProjetoComTarefas } from '@/api'
    import type { Projeto, Tarefa } from '@/tipos'
    import CartaoTarefa from '@/components/CartaoTarefa.vue'

    const route = useRoute()
    const projeto = ref<Projeto | null >(null)
    const tarefas = ref<Tarefa[]>([])

    onMounted(async() => {
        const id = String(route.params.id)
        const resultado = await buscarProjetoComTarefas(id)

        projeto.value = resultado
        tarefas.value = resultado.tarefas
    })
</script>

<template>
    <main v-if="projeto">
        <h1>{{ projeto.nome }}</h1>
        <p>{{ projeto.descricao }}</p>
        <p><strong>Disciplina:</strong>
            {{ projeto.disciplina }}</p>

        <h2>Tarefas</h2>
        <CartaoTarefa 
            v-for="tarefa in tarefas" :key="tarefa.id" :tarefa="tarefa"/>
    </main>
</template>