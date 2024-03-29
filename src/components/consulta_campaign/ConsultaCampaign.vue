<template>
    <div>
        <titulo-principal titulo="Consultar CSVs"></titulo-principal>
        <span class="titulo_categoria">Agência</span>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size card">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field>
                                <label for="agency">Agência</label>
                                <md-select v-model="agency" name="agency" id="agency">
                                    <md-optgroup label="Agências">
                                        <md-option 
                                            v-for="agency in agencies" 
                                            :key="agency.id"
                                            :value="agency.agency"
                                        >{{agency.agency}}</md-option>
                                    </md-optgroup>
                                </md-select>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <botao-submit nome_do_botao="Confirmar" @botaoAtivado="getCampaigns()"></botao-submit> 
                </md-card-actions>
            </md-card>
        </form>

        <span class="titulo_categoria" v-if="campaigns.length > 0">Campanha</span>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size card" v-if="campaigns.length > 0">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field>
                                <label for="campaign">Campanha</label>
                                <md-select v-model="campaignId" name="campaign" id="campaign">
                                    <md-optgroup label="Agências">
                                        <md-option 
                                            v-for="campaign in campaigns" 
                                            :key="campaign.campaignId"
                                            :value="campaign.campaignId"
                                        >{{campaign.campaignName}}</md-option>
                                    </md-optgroup>
                                </md-select>
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
    name: 'Campaign',
    mixins: [validationMixin],
    components: {
        'titulo-principal': TituloAreaPrincipal,
        'botao-submit': BotaoSubmitForm,
        'usuario-invalido': InvalidUserAlert,
    },
    data() {
        return {
            csvList: [],
            tituloResposta: 'Resposta',
            statusCode: null,
            showAuthAlert: false,
            show_load: false,
            apiError: false,
            apiErrorMessage: 'Erro na API!',
            downloadError: false,
            downloadErrorMessage: 'Erro no Download!',
            responseVisibility: false,
            agencies: [],
            campaigns: [],
            agency: '',
            campaignId: '',
        }
    },
    created() {
        const url = `${this.$apiRoute}/agency/list`;
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
        const allAgencies = JSON.parse(response.responseText).map(agency =>{
            const agencyWithId = {id:count, agency:agency};
            count++
            return agencyWithId
        })
        if(localStorage.getItem('permission') === 'owner' || localStorage.getItem('permission') === 'admin'){
            allAgencies.push({id:count, agency:'Campanhas Internas'})
        }
        this.agencies = allAgencies;
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
        getCampaigns() {
            this.campaigns=[];
            let agencia = this.agency;
            const url = `${this.$apiRoute}/campaign/${agencia}/list`;
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
                const allCampaigns = JSON.parse(response.responseText).filter(campaign => campaign.agency !== agency);
                this.campaigns = allCampaigns.filter(campaign => campaign.activate === true);
            }).catch((err) => {
                this.apiError = true;
                this.apiErrorMessage = err.message;
                this.tituloResposta = 'Erro ao recuperar configuração';
                this.showAuthAlert = this.isAuthError(this.statusCode);
            }).finally(() => {
                this.show_load = false;
            });
        },
        getCsvList() {
            let agencia = this.agency;
            let fetchStatusCode;
            this.show_load = true;
            this.responseVisibility = false;
            fetch(`${this.$apiRoute}/${agencia}/${this.campaignId}/csv/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('userToken'),
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
            let campaign = this.campaigns.filter(campanha => campanha.campaignId===this.campaignId)[0].campaignName;
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
                    campaign: campaign,
                    agency: this.agency === 'Campanhas Internas'? '' : this.agency
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

    .titulo_categoria {
        font-size: 20px;
        margin-left: 60px;
        padding-bottom: 20px;
        padding-top: 25px;
        display: block;
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