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
        color: #3f2b96;
        margin-top: 50px;
        margin-left: 50px;
        padding-bottom: 10px;
        border-bottom: 2px solid #a8c0ff;
    }
</style>