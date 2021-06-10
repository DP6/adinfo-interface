<template>
    <div class="main">
        <h1>{{ titulo }}</h1>
    </div>
</template>

<script>

export default {
    props: {
        titulo: {
            required: true,
            type: String
        }
    }
}

</script>

<style scoped>
    h1 {
        color: #1428A0;
        margin-top: 50px;
        margin-left: 50px;
        padding-bottom: 10px;
        border-bottom: 2px solid #A9A4A4;
    }
</style>