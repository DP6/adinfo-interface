<template>
    <div>
        <titulo-principal titulo="Gerencimaneto de Usuários"></titulo-principal>
        
        <span class="titulo_categoria" v-if="users_activates.length > 0">Usuários Ativos</span>
        <md-card class="md-layout-item md-larger-size card" v-if="users_activates.length > 0">
            <md-list class="lista_usuarios">
                <md-list-item v-for="user in users_activates" :key="user.id" class="usuario">
                    {{user.email}} ({{user.permission}})
                <md-icon class="md-size-2x desativar_usuario" @click.native="gerenciaUsuario(user.id, 'desativa')">toggle_on</md-icon>
                </md-list-item>
            </md-list>
        </md-card>
        <span class="titulo_categoria" v-if="users_deactivates.length > 0">Usuários Desativados</span>
        <md-card class="md-layout-item md-larger-size card" v-if="users_deactivates.length > 0">
            <md-list class="lista_usuarios_desativados lista_usuarios">
                <md-list-item v-for="user in users_deactivates" :key="user.id" class="usuario">
                    {{user.email}} ({{user.permission}})
                <md-icon class="md-size-2x ativar_usuario usuario" @click.native="gerenciaUsuario(user.id, 'ativa')">toggle_off</md-icon>
                </md-list-item>
            </md-list>
        </md-card>

        <div class="load" v-show="show_load">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>

        <div class="respostas" v-show="responseVisibility">
            <titulo-principal :titulo="tituloResposta"></titulo-principal>
            <p v-show="apiError" class="response">
                {{ apiErrorMessage }}
            </p>
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

import TituloAreaPrincipal from '../shared/titulo_area_principal/TituloAreaPrincipal.vue';
import InvalidUserAlert from '../shared/login/InvalidUser.vue';
import { validationMixin } from 'vuelidate'
import BotaoSubmitForm from '../shared/botao_submit_form/BotaoSubmitForm.vue';

export default {
    name: 'CSVForm',
    mixins: [validationMixin],
    components: {
        'titulo-principal': TituloAreaPrincipal,
        'botao-submit': BotaoSubmitForm,
        'usuario-invalido': InvalidUserAlert,
    },
    data() {
        return {
            tituloResposta: 'Resposta',
            statusCode: null,
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
            showSnackbar: false
        }
    },
    created() {
        const url = `${this.$apiRoute}/users`;
        this.show_load = true;
        fetch(url, {
            method: 'GET',
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
            const allUsers = JSON.parse(response.responseText).filter(user => user.email !== localStorage.getItem('email'));
            this.users_activates = allUsers.filter(user => user.activate == true);
            this.users_deactivates = allUsers.filter(user => user.activate == false);
        }).catch((err) => {
            this.apiError = true;
            this.apiErrorMessage = err.message;
            this.tituloResposta = 'Erro ao recuperar configuração';
            this.showAuthAlert = this.isAuthError(this.statusCode);
        }).finally(() => {
            this.show_load = false;
        });
    },
    methods: {
        isAuthError(statusCode) {
            if(statusCode === 403)
                return true;
            this.apiError = true;
            return false;
        },
        gerenciaUsuario(id, opcao) {
            let url;
            if(opcao === 'ativa') {
                url = `${this.$apiRoute}/user/${id}/reactivate`;
            } else if(opcao  === 'desativa') {
                url = `${this.$apiRoute}/user/${id}/deactivate`;
            }
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
                this.show_load = true;
                return fetch(`${this.$apiRoute}/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: localStorage.getItem('userToken')
                    }
                });
            }).then((response) => {
                this.statusCode = response.status;
                return response.json();
            }).then((response) => {
                if(this.statusCode !== 200) {
                    throw new Error(response.responseText || response.errorMessage);
                }
                const allUsers = JSON.parse(response.responseText).filter(user => user.email !== localStorage.getItem('email'));
                this.users_activates = allUsers.filter(user => user.activate == true);
                this.users_deactivates = allUsers.filter(user => user.activate == false);
            }).catch((err) => {
                this.showAuthAlert = this.isAuthError(this.statusCode);
                this.snackbar_message = 'Erro ao mudar status do usuário!';
                this.showSnackbar = true;
            }).finally(() => {
                this.show_load = false;
            });
        }
    }
}

</script>

<style scoped>

    .card {
        margin-left: 50px;
    }

    .load {
        margin-top: 50px;
        text-align: center;
    }

    .respostas {
        width: 100%;
    }

    p.response {
        margin-left: 60px;
    }

    ul {
        margin-left: 15px;
        list-style: none;
    }

    .titulo_categoria {
        font-size: 20px;
        margin-left: 60px;
        padding-bottom: 20px;
        padding-top: 25px;
        display: block;
    }

    .lista_usuarios {
        margin-left: 0px!important;
    }

    .lista_usuarios_desativados {
        background-color: #ececec;
    }

    .usuario:hover {
        background-color: #ecf1fd;
    }

    i.ativar_usuario {
        font-size: 20px;
        cursor: pointer;
        color: red!important;
    }

    i.desativar_usuario {
        font-size: 20px;
        cursor: pointer;
        color: green!important;
    }

</style>