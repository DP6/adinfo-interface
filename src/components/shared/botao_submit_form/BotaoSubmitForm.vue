<template>
    <md-button @click="disparaAcao($event)" type="submit" class="md-raised md-primary" :disabled="sending">{{ nome_do_botao }}</md-button>
</template>

<script>

export default {
    props: {
        nome_do_botao: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            sending: false
        }
    },
    methods: {
        disparaAcao(event) {
            event.preventDefault();
            this.$emit('botaoAtivado');
        }
    }
}

</script>

<style scoped>

</style>