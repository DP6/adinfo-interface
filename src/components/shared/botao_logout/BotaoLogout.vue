<template>
    <div>
        <span @click="logout()" class="material-icons">logout</span>
        <div class="load_backgroud" v-show="show_load">
        </div>
        <div class="load" v-show="show_load">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbar" md-persistent>
            <span>{{ snackbar_message }}</span>
            <md-button class="md-primary" @click="showSnackbar = false">OK</md-button>
        </md-snackbar>
        <usuario-invalido :active="showAuthAlert" v-on:setShowAlertFalse="setShowAlertFalse()" >
        </usuario-invalido>
    </div>
</template>

<script>

import InvalidUserAlert from '../login/InvalidUser.vue';

export default {
    name: 'Logout',
    components: {
        'usuario-invalido': InvalidUserAlert,
    },
    data() {
        return {
            showAuthAlert: false,
            show_load: false,
            apiError: false,
            apiErrorMessage: 'Erro na API!',
            downloadError: false,
            downloadErrorMessage: 'Erro no Download!',
            responseVisibility: false,
            users_activates: [],
            users_deactivates: [],
            snackbar_message: '',
            showSnackbar: false,
            duration: 4000,
            position: 'center',
            isInfinity: false,
        }
    },
    methods: {
        isAuthError(statusCode) {
            if(statusCode === 403)
                return true;
            this.apiError = true;
            return false;
        },
        logout() {
            const url = `${this.$apiRoute}/logout`;
            this.show_load = true;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('userToken')
                }
            }).then((response) => {
                this.statusCode = response.status;
                return response.json();
            }).then((response) => {
                if(this.statusCode !== 200) {
                    throw new Error(response.responseText || response.errorMessage);
                }
                localStorage.setItem('userToken', '');
                localStorage.setItem('email', '');
            }).catch((err) => {
                this.apiError = true;
                this.apiErrorMessage = err.message;
                this.tituloResposta = 'Erro ao recuperar configuração';
                this.showAuthAlert = this.isAuthError(this.statusCode);
            }).finally(() => {
                this.show_load = false;
                localStorage.setItem('userToken', '');
                localStorage.setItem('email', '');
                this.$router.push('login');
            });
        }
    }
}

</script>

<style scoped>

    span {
        font-size: 26px;
        color: #E74C3C;
        cursor: pointer;
    }

    .load_backgroud {
        background-color: rgba(221, 221, 221, .7);
    }

    .load {
        margin-top: 50px;
        text-align: center;
        z-index: 3;
        position: absolute;
        display: block;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        top: 250px;
    }

</style>