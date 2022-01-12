<template>
    <div>
        <titulo-principal titulo="Cadastrar Campanha"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div  class="md-layout-item md-medium-size-100"> 
                            <md-field :class="getValidationClass('adOpsTeam')">
                            <label for="adOpsTeam">AdOpsTeam</label>
                                <md-select v-model="form.adOpsTeam" name="adOpsTeam" id="adOpsTeam">
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
                            <md-field :class="getValidationClass('campaign')">
                                <label for="campaign">Campanha</label>
                                <md-input name="campaign" id="campaign" v-model="form.campaign"/>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <botao-submit nome_do_botao="Criar" @botaoAtivado="createCampaign()"></botao-submit>
                </md-card-actions>
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
                adOpsTeam: null,
                campaign: null,
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
        }
    },
    validations: {
        form: {
            adOpsTeam: {
            },
            campaign: {
                required,
                minLength: minLength(2)
            }
        }
    },
    created() {
    if(localStorage.getItem('permission') !== 'adOpsTeamLeader'){
        this.show_field = true;
    }
    const url = `${this.$apiRoute}/adOpsTeam/list`;
    this.show_load = true;
    fetch(url, {
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
        let count = 0;
        const alladOpsTeams = JSON.parse(response.responseText).map(adOpsTeam =>{
            const adOpsTeamWithId = {id:count, adOpsTeam:adOpsTeam};
            count++
            return adOpsTeamWithId
        })
        if(localStorage.getItem('permission') === 'owner' || localStorage.getItem('permission') === 'admin'){
            alladOpsTeams.push({id:count, adOpsTeam:'Campanhas Internas'})
        }
        this.adOpsTeams = alladOpsTeams;
    }).catch((err) => {
        this.apiError = true;
        this.apiErrorMessage = err.message;
        this.tituloResposta = 'Erro ao recuperar configuração';
        this.showAuthAlert = this.isAuthError(this.statusCode);
    }).finally(() => {
        this.show_load = false;
    });
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
            // this.form.adOpsTeam = null
            this.form.campaign = null
        },
        createCampaign() {
            let statusCode;
            this.visivel = false;
            this.apiError = false;
            const url = `${this.$apiRoute}/campaign`;
            const formdata = new FormData();
            formdata.append("adOpsTeam", this.form.adOpsTeam === 'Campanhas Internas'? '': this.form.adOpsTeam);
            formdata.append("campaign", this.form.campaign);
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