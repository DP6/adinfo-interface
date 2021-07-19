<template>
    <div>
        <titulo-principal titulo="CSV"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('company')">
                                <label for="company">Empresa</label>
                                <md-input disabled=disable name="company" id="company" v-model="form.company"/>
                                <span class="md-error" v-if="!$v.form.company.required">Empresa é um campo obrigatório</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-100" v-show="form.agency !== ''">
                            <md-field :class="getValidationClass('agency')">
                                <label for="agency">Agência</label>
                                <md-input disabled=disable name="agency" id="agency" v-model="form.agency"/>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('campaign')">
                                <label for="campaign">Campanha</label>
                                <md-input name="campaign" id="campaign" v-model="form.campaign"/>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <botao-submit nome_do_botao="Consultar" @botaoAtivado="getCsvList()"></botao-submit>
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
            <div v-show="!apiError">
                <p v-if="csvList.length === 1 && csvList[0] === ''" class="response">
                    Nenhum arquivo foi encontrado!
                </p>
                <ul v-if="csvList.length > 0">
                    <li v-for="csv in csvList" class="csv" :key="csv">
                        <p @click="downloadCSV(csv)">{{ csv }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <md-dialog-alert
            :md-active.sync="downloadError"
            md-title="Erro ao baixar CSV"
            :md-content="downloadErrorMessage" />
        <usuario-invalido :active="showAuthAlert" v-on:setShowAlertFalse="setShowAlertFalse()" >
        </usuario-invalido>
    </div>
</template>

<script>

import TituloAreaPrincipal from '../shared/titulo_area_principal/TituloAreaPrincipal.vue';
import InvalidUserAlert from '../shared/login/InvalidUser.vue';
import { validationMixin } from 'vuelidate'
import {
    required,
    minLength
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
                agency: localStorage.getItem('agency') || '',
                company: localStorage.getItem('company') || '',
                campaign: '',
            },
            csvList: [],
            tituloResposta: 'Resposta',
            statusCode: null,
            showAuthAlert: false,
            show_load: false,
            apiError: false,
            apiErrorMessage: 'Erro na API!',
            downloadError: false,
            downloadErrorMessage: 'Erro no Download!',
            responseVisibility: false
        }
    },
    validations: {
        form: {
            agency: {
                required,
                minLength: minLength(3)
            },
            company: {
                required,
                minLength: minLength(3)
            },
            campaign: {
                required,
                minLength: minLength(3)
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
        clearForm () {
            this.$v.$reset()
            this.form.agency = null
            this.form.company = null
            this.form.campaign = null
        },
        getCsvList() {
            let fetchStatusCode;
            this.show_load = true;
            this.responseVisibility = false;
            fetch(`${this.$apiRoute}/csv/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('userToken'),
                    campaign: document.querySelector('#campaign').value
                }
            }).then(function(response) {
               fetchStatusCode = response.status;
               return response.json();
            }).then((data) => {
                if(fetchStatusCode !== 200) {
                    throw new Error(data.responseText);
                }
                this.apiError = false;
                this.tituloResposta = 'Lista de CSVs';
                this.csvList = data.responseText.split(',');
            }).catch((err) => {
                this.apiError = true;
                this.apiErrorMessage = err.message;
                this.showAuthAlert = this.isAuthError(fetchStatusCode);
                this.tituloResposta = 'Erro';
            }).finally(() => {
                this.show_load = false;
                this.responseVisibility = true;
            });
        },
        downloadCSV(csv) {
            const fileName = csv.match(/\/.*\/.*\/(.*)\./) || csv.match(/\/.*\/(.*)\./);
            let campaign = document.querySelector('#campaign').value;
            if(!campaign) {
                campaign = csv.match(/\/.*\/(.*)\/.*\./) || csv.match(/.*\/(.*)\/.*\./);
                campaign = campaign[1]
            }
            fetch(`${this.$apiRoute}/csv`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    file: fileName[1],
                    token: localStorage.getItem('userToken'),
                    campaign: campaign
                }
            }).then(response => {
                this.statusCode = response.status;
                if(response.status !== 200) {
                    return response.json();
                }
                return response.blob();
            }).then(response => {
                if(response instanceof Blob) {
                    const fileBlob = response;
                    const url = window.URL.createObjectURL(fileBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${csv}`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                } else {
                    console.log(response.errorMessage);
                    throw new Error(response.responseText);
                }
            }).catch(err => {
                this.downloadError = true;
                this.downloadErrorMessage = err.message;
                this.showAuthAlert = this.isAuthError(this.statusCode);
            });
        },
        isAuthError(statusCode){
            if(statusCode === 403)
                return true;
            return false;
        },
        setShowAlertFalse(){
            this.showAuthAlert = false;
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

    .csv {
        font-size: 16px;
        cursor: pointer;
    }

    .csv p:hover {
        color: #3f2b96;
    }

</style>