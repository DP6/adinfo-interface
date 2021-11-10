<template>
    <div>
        <titulo-principal titulo="Alterar Senha"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field>
                                <label for="passwordAtual">Senha atual</label>
                                <md-input type="password" name="passwordAtual" id="passwordAtual" v-model="form.passwordAtual" v-on:keyup="activateButton()"/>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-100">
                            <md-field >
                                <label for="newPassword">Nova Senha</label>
                                <md-input type="password" name="newPassword" id="newPassword" v-model="form.newPassword" v-on:keyup="activateButton()"/>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="validatePasswords">
                                <label for="newPasswordRepeated">Repetir nova senha</label>
                                <md-input type="password" name="newPasswordRepeated" id="newPasswordRepeated" v-model="form.newPasswordRepeated" v-on:keyup="activateButton()"/>
                                <span class="md-error" v-if="senhasIguais">As novas senhas não correspondem!</span>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <botao-submit :disabled="desabilitarAlteracaoSenha" nome_do_botao="Alterar Senha" @botaoAtivado="changePassword()"></botao-submit>
                </md-card-actions>
            </md-card>
        </form>


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
import {
    required
} from 'vuelidate/lib/validators'
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
            form: {
                passwordAtual: '',
                newPassword: '',
                newPasswordRepeated: ''
            },
            tituloResposta: 'Resposta',
            statusCode: null,
            showAuthAlert: false,
            show_load: false,
            apiError: false,
            apiErrorMessage: 'Erro na API!',
            downloadError: false,
            downloadErrorMessage: 'Erro no Download!',
            responseVisibility: false,
            desabilitarAlteracaoSenha: true,
            position: 'center',
            senhasIguais: true
        }
    },
    validations: {
        form: {
            passwordAtual: {
                required,
            },
            newPassword: {
                required,
            },
            newPasswordRepeated: {
                required,
            },
        }
    },
    computed: {
        validatePasswords() {
            if(this.form.newPassword === this.form.newPasswordRepeated || !this.form.newPassword || !this.form.newPasswordRepeated) {
                return {
                    'md-invalid': false
                }
            } else {
                return {
                    'md-invalid': true
                }
            }
        }
    },
    methods: {
        isAuthError(statusCode) {
            if(statusCode === 403)
                return true;
            this.apiError = true;
            return false;
        },
        changePassword() {
            const url = `${this.$apiRoute}/user/changepass`;
            this.show_load = true;
            const formdata = new FormData();
            formdata.append("password", this.form.passwordAtual);
            formdata.append("newPassword", this.form.newPasswordRepeated);
            fetch(url, {
                method: 'POST',
                headers: {
                    token: localStorage.getItem('userToken')
                },
                body: formdata
            }).then((response) => {
                return response.json();
            }).then(response => {
                this.snackbar_message = response.responseText || response.errorMessage;
                this.showSnackbar = true;
                this.statusCode = response.status;
            }).catch((err) => {
                this.showAuthAlert = this.isAuthError(this.statusCode);
                this.snackbar_message = 'Erro ao alterar senha!';
                this.showSnackbar = true;
            }).finally(() => {
                this.show_load = false;
            });
        },
        activateButton() {
            if(
                this.form.passwordAtual && 
                this.form.newPassword && 
                this.form.newPasswordRepeated && 
                this.form.newPassword === this.form.newPasswordRepeated
            ) {
                this.desabilitarAlteracaoSenha = false;
            } else {
                this.desabilitarAlteracaoSenha = true;
            }
        }
    }
}

</script>

<style scoped>

    form {
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

</style>