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
            <ul>
                <li v-for="csv in csvList" class="csv">
                    <p @click="downloadCSV(csv)">{{ csv }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import TituloAreaPrincipal from '../shared/titulo_area_principal/TituloAreaPrincipal.vue';
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
        'botao-submit': BotaoSubmitForm
    },
    data() {
        return {
            form: {
                agency: null,
                company: null,
            },
            csvList: [],
            tituloResposta: 'Resposta'
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
            fetch('https://adinfo.ue.r.appspot.com/csv/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    agency: document.querySelector('#agency').value,
                    company: document.querySelector('#company').value
                    // agency: 'bigodaria',
                    // company: 'arthurltda'
                }
            }).then(function(response) {
               return response.json();
            }).then((data) => {
                this.tituloResposta = 'Lista de CSVs';
                this.csvList = data.map(fileName => fileName.split('/')[1]);
            }).catch((err) => {
                this.tituloResposta = 'Erro';
                console.log(err);
            });
        },
        downloadCSV(csv) {
            fetch('http://localhost:443/csv', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    agency: document.querySelector('#agency').value,
                    file: csv.replace(/\.csv$/,''),
                    company: document.querySelector('#company').value
                }
            }).then(response => {
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
                
            });
        }
    }
}

</script>

<style scoped>

    form {
        margin-left: 50px;
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