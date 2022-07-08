<template>
    <div>
        <titulo-principal titulo="Baixar Configuração"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <!-- div class="md-layout md-gutter">
                        < div class="md-layout-item md-medium-size-100">
                            <md-field>
                                <label>Baixe o a última Configuração</label>
                            </md-field>
                        </div>
                    </div-->
                </md-card-content>
                <md-card-actions>
                    <botao-submit @botaoAtivado="downloadConfig()" nome_do_botao="Baixar Configuração"></botao-submit>
                </md-card-actions>
            </md-card>
        </form>
        <div class="load" v-show="show_load">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbar" md-persistent>
            <span>{{ snackbar_message }}</span>
            <md-button class="md-primary" @click="showSnackbar = false">OK</md-button>
        </md-snackbar>
        <usuario-invalido :active="showAuthAlert"></usuario-invalido>
    </div>
</template>

<script>

import TituloAreaPrincipal from '../shared/titulo_area_principal/TituloAreaPrincipal.vue';
import InvalidUserAlert from '../shared/login/InvalidUser.vue';
import { validationMixin } from 'vuelidate'
import {
    required,
    minLength,
    maxLength
} from 'vuelidate/lib/validators'
import BotaoSubmitForm from '../shared/botao_submit_form/BotaoSubmitForm.vue';

export default {
    components: {
        'titulo-principal': TituloAreaPrincipal,
        'botao-submit': BotaoSubmitForm,
        'usuario-invalido': InvalidUserAlert
    },
    data() {
        return {
            showSnackbar: false,
            position: 'center',
            duration: 4000,
            isInfinity: false,
            snackbar_message: '',
            statusCode: null,
            showAuthAlert: false,
            show_load: false
        }
    },
    validations: {
        form: {
            file: {
                required
            }
        }
    },
    methods: {
        getValidationClass (fieldName) {
            const field = this.$v.form[fieldName]
            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        downloadConfig() {
            const urlConfig = `${this.$apiRoute}/config`;   
            fetch(urlConfig, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('userToken')
                }
            }).then((response) => {                
                this.statusCode = response.status;
                return response.json();
            }).then((response) => {             
                if(this.statusCode === 401) {
                    this.$router.push('login');
                } else if(this.statusCode !== 200) {
                    throw new Error(response.rescreateObjectURLponseText || response.errorMessage);
                }
                this.fileConfig = response.responseText;
                this.fileConfig = JSON.parse(this.fileConfig);
                return this.fileConfig;
            }).then((response) => {
                const url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'config.json';
                document.body.appendChild(a);
                a.click();
                a.remove();
            });
        },
        isAuthError(statusCode){
            if(statusCode === 403)
                return true;
            return false;
        }        
    }
}

</script>

<style scoped>

    form {
        margin-left: 50px;
    }

    .previa div.md-table-content {
        max-height: 300px;
    }

    .load {
        margin-top: 50px;
        text-align: center;
    }

    .tabela-resposta {
        margin-left: 50px;
    }

</style>