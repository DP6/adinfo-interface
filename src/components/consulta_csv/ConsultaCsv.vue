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
                                <md-select v-model="agency" name="agency" id="agency" @md-selected="getCampaigns()">
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
            </md-card>
        </form>

        <span class="titulo_categoria" v-if="elegible_campaigns.length > 0">Campanha</span>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size card" v-if="elegible_campaigns.length > 0">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field>
                                <label for="campaign">Campanha</label>
                                <md-select v-model="campaignId" name="campaign" id="campaign" @md-selected="getCsvList()">
                                    <md-optgroup label="Agências">
                                        <md-option
                                            class="campaign-displayed"
                                            v-for="campaign in elegible_campaigns"
                                            :key="campaign.campaignId"
                                            :value="campaign.campaignId"
                                        >{{campaign.campaignName}}</md-option>
                                    </md-optgroup>
                                </md-select>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
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
                <p v-if="show_error" class="response">
                    Nenhum arquivo foi encontrado!
                </p>
                <ul v-if="!show_error">
                        <md-button class="md-dense md-raised md-primary" @click="downloadAllCsvs()">Baixar Csvs</md-button>
                        <br>
                        <md-checkbox v-model="selected_csvs"
                            v-for="csv in csvList"
                            class="csv"
                            :key="csv.id"
                            :value="csv.csvName">
                            {{ csv.csvName }}
                            <br>
                        </md-checkbox>
                    <!-- </div> -->
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
            // novas variaveis
            elegible_campaigns: [],
            selected_csvs: [],
            show_error: false,
        }
    },
    created() {
        this.show_load = true;
        const urlAgencyList = `${this.$apiRoute}/agencies/campaigns`;
        fetch(urlAgencyList, {
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
            response.forEach(agency => {
                Object.keys(agency).forEach(agencyName => {
                    if(agencyName === 'CompanyCampaigns'){
                        this.agencies.push({id:count, agency: 'Campanhas Internas'});
                    }else{
                        this.agencies.push({id:count, agency: agencyName});
                    }
                    count++
                })
            });

            const nestedCampaigns = []

            response.forEach(agencyObject => {
                Object.values(agencyObject).forEach(agencyCampaigns => {
                    nestedCampaigns.push(agencyCampaigns);
                })
            });

            nestedCampaigns.forEach(campaign => {
                campaign.forEach(campaignObject => {
                    this.campaigns.push(campaignObject)
                })
            })
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
            this.responseVisibility = false;
            this.campaignId = null;
            let selectedCampaigns = [];
            let selected_agency = '';
            this.agency === 'Campanhas Internas'? selected_agency = 'CompanyCampaigns': selected_agency = this.agency

            this.campaigns.forEach(campaignObject => {
                if(campaignObject.agency === selected_agency && campaignObject.activate === true){
                    selectedCampaigns.push({campaignId:campaignObject.campaignId, campaignName: campaignObject.campaignName})
                }
            })
            this.elegible_campaigns = selectedCampaigns;
        },
        getCsvList() {
            this.csvList = [];
            this.selected_csvs=[];
            let agencia = this.agency;
            if(this.campaignId){
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
                    // this.csvList = data.responseText.split(','); legado

                    const listCsv = data.responseText.split(',');

                    let count = 0;
                    console.log('listCsv:', listCsv)
                    if(listCsv.length === 1 && listCsv[0] === ''){
                        this.show_error = true;
                    }else{
                        this.show_error = false;
                        console.log('fiz o push')
                        listCsv.forEach(csv => {
                        this.csvList.push({id:count, csvName: csv});
                            count++
                        });
                    }

                    console.log('csvlist length === 1', this.csvList.length)
                    console.log('csvlist[0]', this.csvList[0])
                }).catch((err) => {
                    console.log(err)
                    this.apiError = true;
                    this.apiErrorMessage = err.message;
                    this.showAuthAlert = this.isAuthError(fetchStatusCode);
                    this.tituloResposta = 'Erro';
                }).finally(() => {
                    this.show_load = false;
                    this.responseVisibility = true;
                });
            }
        },
        downloadCSV(csv) {
            const fileName = csv.match(/\/.*\/.*\/(.*)\./) || csv.match(/\/.*\/(.*)\./);
            let campaign = this.campaigns.filter(campanha => campanha.campaignId===this.campaignId).campaignName;
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
                    agency: this.agency === 'Campanhas Internas' ? '' : this.agency
                }
            }).then(response => {
                this.statusCode = response.status;
                if(response.status !== 200) {
                    return response.json();
                }
                return response.blob();
            })
            .then(response => {
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
            })
            .catch(err => {
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
        },
        downloadAllCsvs(){
            this.selected_csvs.forEach(csv => {
                console.log('csvs da lista:', csv)
                this.downloadCSV(csv);
            })
            this.selected_csvs = [];
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
    .md-checkbox {
    display: flex;
    }

</style>