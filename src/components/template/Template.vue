<template>
    <div id="content">
        <titulo-principal titulo="Template"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('company')">
                                <label for="company">Empresa</label>
                                <md-input name="company" id="company" v-model="form.company"/>
                                <span class="md-error" v-if="!$v.form.company.required">The first name is required</span>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <botao-submit nome_do_botao="Consultar Template" @botaoAtivado="getTemplate()"></botao-submit>
                </md-card-actions>
            </md-card>
        </form>

        <div class="respostas" v-show="visivel">
            <titulo-principal titulo="Resultado"></titulo-principal>
            <md-card md-card>
                <md-table md-fixed-header v-model="tabela" >
                    <md-table-toolbar>
                        <h1 class="md-title">Colunas</h1>
                    </md-table-toolbar>

                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                        <md-table-cell md-label="Campo" md-sort-by="id">{{ item.campo }}</md-table-cell>
                        <md-table-cell md-label="Valor" md-sort-by="name">{{ item.valor }}</md-table-cell>
                    </md-table-row>

                </md-table>
                <md-button @click="downloadTemplate()" class="md-dense md-raised md-primary button-download">Download Template</md-button>
            </md-card>
        </div>
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
            form: {
                company: null,
            },
            templateFile: new Blob(),
            colunas: [],
            tabela: [],
            visivel: false,
            statusCode: null,
            showAuthAlert: false,
        }
    },
    validations: {
        form: {
            company: {
                required,
                minLength: minLength(3)
            }
        }
    },
    created() {
        this.redirectIfHasNoToken ()
    },

    methods: {
        redirectIfHasNoToken (){
            if (!localStorage.getItem('userToken')){
                this.redirectLogin();
            }
        },
        redirectLogin (){
            this.$router.push('login');
        },
        getValidationClass (fieldName) {
            const field = this.$v.form[fieldName]
            if (field) {
                return {
                    'md-invalid': field.$invalid && field.$dirty
                }
            }
        },
        clearForm() {
            this.$v.$reset()
            this.form.company = null
        },
        downloadTemplate() {
            const url = window.URL.createObjectURL(this.templateFile);
            const a = document.createElement('a');
            a.href = url;
            a.download = "template.csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
        },
        getTemplate() {
            fetch('http://localhost:443/config', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // agency: document.querySelector('#agency').value,
                    // company: document.querySelector('#company').value
                    company: document.querySelector('#company').value,
                    token: localStorage.getItem('userToken')
                }
            }).then(configPromise => {
                this.statusCode = configPromise.status;
                return configPromise.json();
            }).then(configJson => {
                const lastConfig = configJson[0].ga || configJson[0].adobe;
                Object.keys(lastConfig).map(key => {
                    Object.keys(lastConfig[key]).map(coluna => {
                        this.tabela.push({
                            valor: lastConfig[key][coluna].join(', '),
                            campo: coluna
                        });
                    });
                });
            }).then(() => {
                return fetch('http://localhost:443/template', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // agency: document.querySelector('#agency').value,
                        // company: document.querySelector('#company').value
                        company: document.querySelector('#company').value,
                        token: localStorage.getItem('userToken')
                    }
                })
            }).then(function(response) {
                return response.blob();
            }).then((blob) => {
                this.templateFile = blob;
                blob.text().then(text => {
                    this.colunas = text.split(';');
                });
                this.visivel = true;
            }).catch((err) => {
                this.showAuthAlert = this.isAuthError(this.statusCode);
                console.log(err);
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

    .md-card {
        margin-left: 50px;
    }

    .button-download {
        float: right;
    }

    .tabela-respostas {
        max-height: calc(100vh - 400px);
    }

</style>