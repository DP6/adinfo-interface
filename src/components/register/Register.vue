<template>
    <div>
        <titulo-principal titulo="Registrar usuário"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('company')">
                                <label for="company">Empresa do novo usuário</label>
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
                    <botao-submit nome_do_botao="Criar" @botaoAtivado="createUser()"></botao-submit>
                </md-card-actions>
            </md-card>
        </form>
        <div class="load" v-show="show_load">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <div class="respostas" v-show="visivel">
            <titulo-principal :titulo="tituloResposta"></titulo-principal>
            <ul>
                <li>
                    <p>{{ respostaAPI }}</p>
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
    name: 'Register',
    mixins: [validationMixin],
    components: {
        'titulo-principal': TituloAreaPrincipal,
        'botao-submit': BotaoSubmitForm,
        'usuario-invalido': InvalidUserAlert
    },
    data() {
        return {
            form: {
                company: null,
                agency: null,
            },
            visivel: false,
            tituloResposta: 'Resposta',
            statusCode: null,
            showAuthAlert: false,
            respostaAPI: '',
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
        createUser() {
            var statusCode = null;
            const url = `https://adinfo.ue.r.appspot.com/register`
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('userToken'),
                    agency: document.querySelector('#agency').value,
                    permission: 'agency',
                }
            };
            this.show_load = true;
            fetch(url, requestOptions)
            .then(function(response) {
                statusCode = response.status;
                return response.text();
            }).then((response) => {
                this.respostaAPI = response;
                this.visivel = true;
            }).catch((err) => {
                this.showAuthAlert = this.isAuthError(statusCode);
                console.log(err);
            }).finally(() => {
                this.show_load = false;
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