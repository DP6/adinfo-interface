<template>
    <div>
        <titulo-principal titulo="Gerenciamento de Usuários"></titulo-principal>
    
        <span class="titulo_categoria" v-if="usersActivates.length > 0">Usuários Ativos</span>
        <md-list class="lista_usuarios" v-for="adOpsTeam in adOpsTeams_active" :key="adOpsTeam">
            <md-list-item class="lista_adOpsTeam">
                <div class="name_adOpsTeam">{{adOpsTeam}}</div> 
            </md-list-item>
            
            <md-card class="md-layout-item md-larger-size card">
                <md-list-item v-for="user in usersActivates.filter(activeUser => activeUser.adOpsTeam === adOpsTeam)" :key="user.id" class="usuario">
                    {{user.email}} ({{user.permission}})
                <md-icon v-if="user.permission !== 'admin'" class="md-size-2x desativar_usuario" @click.native="gerenciaUsuario(user.id, 'desativa')">toggle_on</md-icon>
                </md-list-item>
            </md-card>
        </md-list>
        
        <span class="titulo_categoria" v-if="usersDeactivates.length > 0">Usuários Desativados</span>
        <md-list class="lista_usuarios" v-for="adOpsTeam in adOpsTeams_deactivate" :key="adOpsTeam">
            <md-list-item class="lista_adOpsTeam">
                <div class="name_adOpsTeam">{{adOpsTeam}}</div>
            </md-list-item>
            <md-card class="md-layout-item md-larger-size card">
                    <md-list-item v-for="user in usersDeactivates.filter(deactivateUser => deactivateUser.adOpsTeam === adOpsTeam)" :key="user.id" class="usuario">
                        {{user.email}} ({{user.permission}})
                    <md-icon v-if="user.permission !== 'admin'" class="md-size-2x ativar_usuario usuario" @click.native="gerenciaUsuario(user.id, 'ativa')">toggle_off</md-icon>
                    </md-list-item>
            </md-card>
        </md-list>

        <div class="load" v-show="show_load">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>

        <div class="respostas" v-show="responseVisibility">
            <titulo-principal :titulo="tituloResposta"></titulo-principal>
            <p v-show="apiError" class="response">
                {{ apiErrorMessage }}
            </p>
        </div>
        <md-snackbar :md-position="position" :md-duration="6000" :md-active.sync="showSnackbar" md-persistent>
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
            adOpsTeams_active: new Set(),
            adOpsTeams_deactivate: new Set(),
            allUsers: [],
            adOpsTeam: '',
            usersActivates: [],
            usersDeactivates: [],
            snackbar_message: '',
            position: 'center',
            showSnackbar: false
        }
    },
    created() {
        const url = localStorage.getItem('permission') === 'adOpsManager'?`${this.$apiRoute}/adOpsTeam/users`:`${this.$apiRoute}/users`;
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
            this.usersActivates = allUsers.filter(user => user.active == true);
            this.usersDeactivates = allUsers.filter(user => user.active == false);
            this.usersActivates.forEach(user => this.adOpsTeams_active.add(user.adOpsTeam));
            this.usersDeactivates.forEach(user => this.adOpsTeams_deactivate.add(user.adOpsTeam));
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
        resetAdOpsTeams(){
            this.adOpsTeams_active.clear();
            this.adOpsTeams_deactivate.clear();
            this.usersActivates.forEach(user => this.adOpsTeams_active.add(user.adOpsTeam));
            this.usersDeactivates.forEach(user => this.adOpsTeams_deactivate.add(user.adOpsTeam));
        },
        gerenciaUsuario(id, opcao) {
            let url;
            if(opcao === 'ativa') {
                url = `${this.$apiRoute}/user/${id}/reactivate`;
            } else if(opcao  === 'desativa') {
                url = `${this.$apiRoute}/user/${id}/deactivate`;
            }
            this.show_load = true;
            const urlUsers = localStorage.getItem('permission') === 'adOpsManager'?`${this.$apiRoute}/adOpsTeam/users`:`${this.$apiRoute}/users`;
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
                return fetch(urlUsers, {
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
                this.usersActivates = allUsers.filter(user => user.active == true);
                this.usersDeactivates = allUsers.filter(user => user.active == false);
                this.resetAdOpsTeams();
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
        margin-top: 10px;
        margin-left: 10px;
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
        font-size: 22px;
        margin-left: 60px;
        padding-bottom: 20px;
        padding-top: 25px;
        display: block;
    }
    .lista_usuarios {
        margin-left: 40px!important;
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
    .lista_adOpsTeam {
        margin-left: 8px;
        border-bottom: 1px solid #a8c0ff;
    }
    .name_adOpsTeam{
        font-size: 16px;
        font-weight: bold;
        color: #3f2b96;
    }
</style>