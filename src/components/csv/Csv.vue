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
                                <md-input name="company" id="company" v-model="form.company"/>
                                <span class="md-error" v-if="!$v.form.company.required">The first name is required</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('agency')">
                                <label for="agency">Agência</label>
                                <md-input name="agency" id="agency" v-model="form.agency"/>
                                <span class="md-error" v-if="!$v.form.agency.required">The first name is required</span>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <botao-submit nome_do_botao="Consultar" @botaoAtivado="getCsvList()"></botao-submit>
                </md-card-actions>
            </md-card>
        </form>

        <div class="respostas">
            <titulo-principal :titulo="tituloResposta"></titulo-principal>
            <div class="load" v-show="show_load">
                <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
            </div>
            <ul>
                <li v-for="csv in csvList" class="csv">
                    <p @click="downloadCSV(csv)">{{ csv }}</p>
                </li>
            </ul>
        </div>
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
            form: {
                agency: localStorage.getItem('agency') || '',
                company: localStorage.getItem('company') || '',
            },
            csvList: [],
            tituloResposta: 'Resposta',
            statusCode: null,
            showAuthAlert: false,
            show_load: false,
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
        },
        getCsvList() {
            var fetchStatusCode = null;
            this.show_load = true;
            fetch('https://adinfo.ue.r.appspot.com/csv/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    agency: document.querySelector('#agency').value,
                    company: document.querySelector('#company').value,
                    token: localStorage.getItem('userToken')
                    // agency: 'bigodaria',
                    // company: 'arthurltda'
                }
            }).then(function(response) {
               fetchStatusCode = response.status;
               return response.json();
            }).then((data) => {
                this.tituloResposta = 'Lista de CSVs';
                this.csvList = data.map(fileName => fileName.split('/')[1]);
            }).catch((err) => {
                this.showAuthAlert = this.isAuthError(fetchStatusCode);
                this.tituloResposta = 'Erro';
                console.log(err);
            }).finally(() => {
                this.show_load = false;
            });
        },
        downloadCSV(csv) {
            fetch('https://adinfo.ue.r.appspot.com/csv', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    agency: document.querySelector('#agency').value,
                    file: csv.replace(/\.csv$/,''),
                    company: document.querySelector('#company').value,
                    token: localStorage.getItem('userToken')
                }
            }).then(response => {
                this.statusCode = response.status;
                return response.blob();
            }).then(fileBlob => {
                const url = window.URL.createObjectURL(fileBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${csv}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }).catch(err => {
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