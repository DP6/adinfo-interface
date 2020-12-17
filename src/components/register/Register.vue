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
        <div class="respostas" v-show="visivel">
            <titulo-principal :titulo="tituloResposta"></titulo-principal>
            <md-card md-card>
                <ul>
                    <li>
                        <p> usuário criado com sucesso. Um email com um token de acesso foi enviado para o email @email.</p>
                    </li>
                </ul>
            </md-card>
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
            const formdata = new FormData();
            formdata.append("company", document.querySelector('#company').value);
            formdata.append("agency", document.querySelector('#agency').value);
            formdata.append("token", localStorage.getItem('userToken'));
            const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            fetch(url, requestOptions)
            .then(function(response) {
                statusCode = response.status;
                return response.text();
            }).then((response) => {
                console.log(response)
                this.visivel = true;
            }).catch((err) => {
                this.showAuthAlert = this.isAuthError(statusCode);
                console.log(err);
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