<template>
    <div id="content">
        <titulo-principal titulo="Template"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <!-- <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('company')">
                                <label for="company">Empresa</label>
                                <md-input disabled=disable name="company" id="company" v-model="form.company"/>
                                <span class="md-error" v-if="!$v.form.company.required">The first name is required</span>
                            </md-field>
                        </div>
                    </div> -->
                </md-card-content>
                <md-card-actions>
                    <botao-submit nome_do_botao="Consultar Template" @botaoAtivado="getTemplate()"></botao-submit>
                </md-card-actions>
            </md-card>
        </form>
        <div class="load" v-show="show_load">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <div class="respostas" v-show="visivel">
            <titulo-principal titulo="Resultado"></titulo-principal>
            <p class="md-body-1" v-show="!apiError">Template gerado a partir da configuração de versão n° <b>{{configVersion}}</b>, criada/atualizada em <b>{{configDate}}</b>.</p>
            <md-card md-card v-show="!apiError">
                <md-table md-fixed-header v-model="tabela" >
                    <md-table-toolbar>
                        <h1 class="md-title">Colunas</h1>
                    </md-table-toolbar>

                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                        <md-table-cell md-label="Campo" md-sort-by="id">{{ item.campo }}</md-table-cell>
                        <md-table-cell md-label="Valor" md-sort-by="name">{{ item.valor }}</md-table-cell>
                    </md-table-row>

                </md-table>
                <md-button @click="downloadTemplateExcel()" class="md-dense md-raised md-primary button-download">Download .XLSX</md-button>
                <md-button @click="downloadTemplate()" class="md-dense md-raised md-primary button-download">Download .CSV</md-button>
            </md-card>
            <p v-show="apiError" class="response">
                {{ apiErrorMessage }}
            </p>
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
            templateFile: new Blob(),
            colunas: [],
            tabela: [],
            visivel: false,
            statusCode: null,
            showAuthAlert: false,
            show_load: false,
            apiError: false,
            apiErrorMessage: '',
            configVersion: '',
            configDate: '',
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
            this.download(this.templateFile, 'template.csv');
        },
        downloadTemplateExcel() {
            fetch(`${this.$apiRoute}/template/excel`, {
                method: 'GET',
                headers: {
                    token: localStorage.getItem('userToken')
                }
            }).then(response => response.blob()).then(blob => {
                this.download(blob, 'template.xlsx')
            })
        },
        download(item, fileName) {
            const url = window.URL.createObjectURL(item);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        },
        getTemplate() {
            this.show_load = true;
            this.visivel = false;
            fetch(`${this.$apiRoute}/config`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('userToken')
                }
            }).then(configPromise => {
                this.statusCode = configPromise.status;
                return configPromise.json();
            }).then(response => {
                if(this.statusCode !== 200) {
                    throw new Error(response.responseText);
                }
                this.apiError = false;
                const configJson = JSON.parse(response.responseText);
                const columnsConfig = configJson.columns;
                this.tabela = [];
                this.colunas = [];
                Object.keys(columnsConfig).map(column => {
                    this.tabela.push({
                        valor: columnsConfig[column].join(', '),
                        campo: column
                    });
                });
                this.colunas = Object.keys(columnsConfig).map(key => key);
                this.templateFile = new Blob([['Url'].concat(this.colunas).join(',')], {
                    type: 'application/json'
                });
                this.configVersion = configJson.version;
                this.configDate = `${configJson.insertTime.substring(6, 8)}/${configJson.insertTime.substring(4, 6)}/${configJson.insertTime.substring(0, 4)}`;
            }).catch((err) => {
                this.showAuthAlert = this.isAuthError(this.statusCode);
                this.apiError = true;
                this.apiErrorMessage = err.message;
            }).finally(() => {
                this.visivel = true;
                this.show_load = false;
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

    p.response {
        margin-left: 60px;
    }

    .load {
        margin-top: 50px;
        text-align: center;
    }

    .tabela-respostas {
        max-height: calc(100vh - 400px);
    }

    p.md-body-1 {
        margin-left: 50px;
    }

</style>