import { ref } from "vue"
import type { Prioridade, Status } from './tipos'

const busca = ref('')
const status = ref<Status | ''>('')
const prioridade = ref<Prioridade | ''>('')

export function useFiltrosTarefas(){
    return {
        busca,
        status,
        prioridade,
    }
}