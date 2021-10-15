<template>
    <div class="page-header header-filter fundo all-screen">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-6 ml-auto mr-auto">
                    <div class="card">
                        <div>
                            <form id="app" class="form" method="" action="">
                                <div class="card-header card-header-primary text-center">
                                    <h4>Login</h4>
                                </div>
                                <div class="card-body">
                                    <span class="input-group-text">
                                        <input type="text" v-model="email" class="form-control" placeholder="Email">
                                    </span>
                                    <span class="input-group-text">
                                        <input type="password" v-model="senha" class="form-control" placeholder="Senha" @keydown.enter.stop.prevent="getUserInfos()">
                                    </span>
                                </div>
                                <div class="text-center">
                                    <a @click="getUserInfos()" class="btn btn-primary btn-link btn-wd btn-lg">
                                    LOGIN
                                    </a>
                                </div>
                                <usuario-invalido :active="showAuthAlert"  v-on:setShowAlertFalse="setShowAlertFalse()" >
                                </usuario-invalido>
                            </form>
                            <md-dialog-alert
                                :md-active.sync="apiError"
                                md-title="Erro ao fazer login"
                                :md-content="apiErrorMessage" />
                            <div class="load" v-show="show_load">
                                <md-progress-bar class="barra" md-mode="indeterminate"></md-progress-bar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import InvalidUserAlert from '../components/shared/login/InvalidUser.vue';

export default {
    name: 'Login',

    components: {
        'usuario-invalido': InvalidUserAlert
    },
    data() {
        return {
            senha: '',
            email: '',
            showAuthAlert: false,
            show_load: false,
            apiError: false,
            apiErrorMessage: ''
        }
    },
    methods: {
        redirect(){
            this.$router.push('parametrizacao');
        },
        getUserInfos() {
            this.show_load = true;
            let statusCode = null; 
            const formdata = new FormData();
            formdata.append("email", this.email);
            formdata.append("password", this.senha);
            fetch(`${this.$apiRoute}/login`, {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            }).then((response) => {
                console.log(response)
                statusCode = response.status;
                localStorage.setItem('userToken', response.headers.get('Authorization'));
                localStorage.setItem('email', this.email);
                return statusCode === 204 ? undefined : response.json();
            }).then((response) => {
                if(statusCode !== 204) {
                throw new Error(response.responseText);
                }
                return fetch(`${this.$apiRoute}/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('userToken'),
                }
                });
            }).then((response) => {
                statusCode = response.status;
                return response.json();
            }).then((data) => {
                if(statusCode !== 200) {
                    throw new Error(data.responseText);
                }
                localStorage.setItem('permission', JSON.parse(data.responseText).permission);
                this.redirect();
            }).catch((err) => {
                console.log(err);
                this.apiErrorMessage = err.message;
                this.showAuthAlert = this.isAuthError(statusCode);
            }).finally(() => {
                this.show_load = false
            });
        },
        isAuthError(statusCode) {
            if(statusCode === 403)
                return true;
            this.apiError = true;
            return false;
        },
        setShowAlertFalse(){
            this.showAuthAlert = false;
        }
    },
    destroyed() {
        styles.unuse();
    }
}
</script>
<style src="../components/login/assets/css/material-kit.css?v=2.0.7" scoped></style>
<style scoped>
    /* @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons'); */
    /* @import url('https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css'); */
    /* @import '../components/login/assets/css/material-kit.css?v=2.0.7'; */
    /* TODO VER COMO IMPORTAR ISSO SEM BUGAR OS TITULOS */

    .fundo {
        background-image: url('../components/login/assets/img/bg7.jpg');
        background-size: cover;
        background-position: top center;
    }

    .all-screen {
        width: 100%;
        height: 100%;
    }

    .card-header {
        padding: 10px;
    }

    .load {
        margin-top: 10px;
        text-align: center;
    }
    
    .barra {
        border-bottom-left-radius: 250px;
        border-bottom-right-radius: 250px;
    }

</style>
