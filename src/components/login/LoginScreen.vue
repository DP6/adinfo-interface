<template>
    <div class="page-header header-filter fundo all-screen">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-6 ml-auto mr-auto">
                <div class="card">
                    <login-form></login-form>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import LoginForm from './LoginForm.vue';

export default {
    name: 'Login',

    components: {
        'login-form': LoginForm
    },

    methods: {

    }
}
</script>



<style >
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons');
    @import url('https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css');
    @import './assets/css/material-kit.css?v=2.0.7';

    .fundo {
        background-image: url('./assets/img/bg7.jpg');
        background-size: cover;
        background-position: top center;
    }

    .all-screen {
        width: 100%;
        height: 100%;
    }
</style>