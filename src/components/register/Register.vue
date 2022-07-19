<template>
    <div>
        <titulo-principal titulo="Registrar usuário"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-layout md-gutter">
                            <md-field>
                                <label for="adOpsTeam">AdOpsTeam</label>
                                <md-select v-model="form.adOpsTeam" name="adOpsTeam" id="adOpsTeam" >
                                    <md-optgroup label="AdOpsTeams">
                                        <md-option
                                            v-for="adOpsTeam in adOpsTeams"
                                            :key="adOpsTeam.id"
                                            :value="adOpsTeam.adOpsTeam"
                                        >{{adOpsTeam.adOpsTeam}}</md-option>
                                    </md-optgroup>
                                </md-select>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('email')">
                                <label for="email">E-mail</label>
                                <md-input name="email" id="email" v-model="form.email"/>
                                <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('senha')">
                                <label for="senha">Senha</label>
                                <md-input name="senha" id="senha" v-model="form.senha" type="password"/>
                                <span class="md-error" v-if="!$v.form.senha.required">The senha is required</span>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <botao-submit nome_do_botao="Criar" @botaoAtivado="createUser()"></botao-submit>
                </md-card-actions>
                <p v-if=apiError v-show="apiError" class="response">
                    {{ apiErrorMessage }}
                </p>
            </md-card>
        </form>
        <div class="load" v-show="show_load">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <div class="respostas" v-show="visivel">
            <titulo-principal :titulo="tituloResposta"></titulo-principal>
            <p v-show="apiError" class="response">
                {{ apiErrorMessage }}
            </p>
            <ul v-show="!apiError">
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
    maxLength, 
    email,
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
                // advertiser: localStorage.getItem('advertiser') || '',
                adOpsTeam: null,
                email: null,
                senha: null,
            },
            visivel: false,
            tituloResposta: 'Resposta',
            statusCode: null,
            showAuthAlert: false,
            respostaAPI: '',
            show_load: false,
            show_field: false,
            apiError: false,
            apiErrorMessage: '',
            adOpsTeams: [],
            selected_adOpsTeam:'',
        }
    },
    validations: {
        form: {
            adOpsTeam: {
            },
            advertiser: {
                required,
                minLength: minLength(3)
            },
            email: {
                required,
                email
            },
            senha: {
                required,
                minLength: minLength(5)
            }
        }
    },
    created() {
    if(localStorage.getItem('permission') !== 'adOpsManager'){
        this.show_field = true;
    }
    if(localStorage.getItem('permission')==='owner' || localStorage.getItem('permission')==='admin'){
        const urlAdOpsTeamList = `${this.$apiRoute}/adOpsTeam/list`;
        fetch(urlAdOpsTeamList, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('userToken')
            }
        }).then((response) => {
            this.statusCode = response.status;
            return response.json();
        }).then((response) => {
            if(this.statusCode !== 200) {
                throw new Error(response.responseText || response.errorMessage);
            }

            const adOpsTeams = JSON.parse(response.responseText)

            adOpsTeams.forEach((adOpsTeam, index) => {
                if(adOpsTeam.active){
                    this.adOpsTeams.push({id:index, adOpsTeam: adOpsTeam.name});
                }
            });
        }).catch((err) => {
            this.apiError = true;
            this.apiErrorMessage = err.message;
            this.tituloResposta = 'Erro ao recuperar configuração';
            this.showAuthAlert = this.isAuthError(this.statusCode);
        }).finally(() => {
            this.show_load = false;
        });
    } else{
        this.adOpsTeams.push({id:0, adOpsTeam: localStorage.getItem('adOpsTeam')});
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
            this.form.adOpsTeam = null
            this.form.advertiser = null
            this.form.email = null
            this.form.senha = null
        },
        createUser() {
            let statusCode;
            this.visivel = false;
            this.apiError = false;
            const url = `${this.$apiRoute}/register`;
            const formdata = new FormData();
            let permission = 'user';
            let adOpsTeam = this.form.adOpsTeam;
            if(!adOpsTeam) throw Error('O valor do AdOpsTeam é obrigatório!')
            formdata.append("email", this.form.email);
            formdata.append("password", this.form.senha);
            if(localStorage.getItem('permission') === 'owner'){
                permission = 'admin';
            } else if(localStorage.getItem('permission') === 'admin'){
                permission = 'adOpsManager';
            }
            if(localStorage.getItem('permission')==='adOpsManager'){
                permission = 'user'
            }
            formdata.append("adOpsTeam", adOpsTeam);
            formdata.append("permission", permission);
            console.log('formdata', formdata)
            const requestOptions = {
                method: 'POST',
                headers: {
                    token: localStorage.getItem('userToken')
                },
                body: formdata,
                redirect: 'follow'
            };
            this.show_load = true;
            fetch(url, requestOptions)
            .then((response) => {
                statusCode = response.status;
                return response.json();
            }).then((response) => {
                if(statusCode !== 200) {
                    throw new Error(response.responseText);
                }
                this.apiError = false;
                this.respostaAPI = response.responseText;
            }).catch((err) => {
                console.log(err);
                this.showAuthAlert = this.isAuthError(statusCode);
                this.apiError = true;
                this.apiErrorMessage = err.message;
                this.visibilidadeResposta = true;
                this.tituloResposta = 'Falha no Registro do Usuário';
                console.log(err);
            }).finally(() => {
                this.visivel = true;
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

    p.response {
        margin-left: 60px;
    }

    .csv {
        font-size: 16px;
        cursor: pointer;
    }

    .csv p:hover {
        color: #3f2b96;
    }

</style>