<template>
    <div>
        <titulo-principal titulo="Nova Configuração"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field>
                                <label>Upload files</label>
                                <md-file v-model="file" id="file" placeholder="Anexar Arquivo" />
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <botao-submit @botaoAtivado="newConfig()" nome_do_botao="Enviar Nova Configuração"></botao-submit>
                </md-card-actions>
            </md-card>
        </form>
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
    name: 'CSVForm',
    mixins: [validationMixin],
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
        newConfig() {
            var reader = new FileReader();
            reader.readAsText(document.querySelector('#file').files[0], "UTF-8")
            reader.onload = (evt) => {
                const url = `https://adinfo.ue.r.appspot.com/config`;
                const formdata = new FormData();
                formdata.append("company", 'arthurltda');
                formdata.append("config", evt.target.result);
                formdata.append("token", localStorage.getItem('userToken'));
                fetch(url, {
                    method: 'POST',
                    body: formdata
                }).then((response) => {
                    this.statusCode = response.status;
                    this.snackbar_message = 'Configuração atualizada com sucesso!';
                    this.showSnackbar = true;
                }).catch((err) => {
                    this.showAuthAlert = this.isAuthError(this.statusCode);
                    this.snackbar_message = 'Erro ao atualizar a configuração!';
                    this.showSnackbar = true;
                });
            }
        },
        downloadParametrizacao() {
            const url = window.URL.createObjectURL(this.builderFile);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${document.querySelector('#file').files[0].name.replace(/\.csv$/, '')}_parametrizado.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
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

    .tabela-resposta {
        margin-left: 50px;
    }

</style>