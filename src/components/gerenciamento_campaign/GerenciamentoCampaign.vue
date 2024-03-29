<template>
    <div>
        <titulo-principal titulo="Gerencimaneto de Campanhas"></titulo-principal>
        <span class="titulo_categoria">Agência</span>

        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size card">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field>
                                <label for="agency">Agência</label>
                                <md-select v-model="agency" name="agency" id="agency" @md-selected="getFilteredCampaigns()">
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

        <span class="titulo_categoria" v-if="campaign_activates.length > 0">Campanhas Ativas</span>
        <md-card class="md-layout-item md-larger-size card" v-if="agency">
            <md-list class="lista_campanhas">
                <md-list-item v-for="campaign in campaign_activates" :key="campaign.id" class="campaign">
                    {{campaign.campaignName}}
                <md-icon class="md-size-2x desativar_campaign" @click.native="gerenciaCampanha(campaign.campaignId, 'desativa')">toggle_on</md-icon>
                </md-list-item>
            </md-list>
        </md-card>
        <span class="titulo_categoria" v-if="campaign_deactivates.length > 0">Campanhas Desativadas</span>
        <md-card class="md-layout-item md-larger-size card" v-if="campaign_deactivates.length > 0">
            <md-list class="lista_campanhas_desativados lista_campanhas">
                <md-list-item v-for="campaign in campaign_deactivates" :key="campaign.id" class="campaign">
                    {{campaign.campaignName}}
                <md-icon class="md-size-2x ativar_campaign campaign" @click.native="gerenciaCampanha(campaign.campaignId, 'ativa')">toggle_off</md-icon>
                </md-list-item>
            </md-list>
        </md-card>

        <div class="load" v-show="show_load">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>

        <div class="respostas" v-show="responseVisibility">
            <titulo-principal :titulo="tituloResposta"></titulo-principal>
            <p v-show="apiError" class="response">
                {{ apiErrorMessage }}
            </p>
        </div>
        <md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbar" md-persistent>
            <span>{{ snackbar_message }}</span>
            <md-button class="md-primary" @click="showSnackbar = false">OK</md-button>
        </md-snackbar>
        <usuario-invalido :active="showAuthAlert" v-on:setShowAlertFalse="setShowAlertFalse()" >
        </usuario-invalido>
    </div>
</template>

<script>

import TituloAreaPrincipal from '../shared/titulo_area_principal/TituloAreaPrincipal.vue';
import InvalidUserAlert from '../shared/login/InvalidUser.vue';
import { validationMixin } from 'vuelidate'
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
            tituloResposta: 'Resposta',
            statusCode: null,
            showAuthAlert: false,
            show_load: false,
            apiError: false,
            apiErrorMessage: 'Erro na API!',
            downloadError: false,
            downloadErrorMessage: 'Erro no Download!',
            responseVisibility: false,
            campaign_activates: [],
            campaign_deactivates: [],
            agencies: [],
            campaigns: [],
            selected_agency:  '',
            snackbar_message: '',
            position: 'center',
            showSnackbar: false
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
        resetCampaigns(){
            this.campaign_activates = [];
            this.campaign_deactivates = [];
        },
        getFilteredCampaigns() {
            this.resetCampaigns();
            let agencia = this.agency === 'Campanhas Internas'? 'CompanyCampaigns': this.agency;
            const allCampaigns = this.campaigns.filter(campaign => campaign.agency === agencia);
            allCampaigns.forEach(campanha => {
                if(campanha.activate){
                    this.campaign_activates.push(campanha)
                }else {
                    this.campaign_deactivates.push(campanha)
                }
            })
        },
        isAuthError(statusCode) {
            if(statusCode === 403)
                return true;
            this.apiError = true;
            return false;
        },
        gerenciaCampanha(id, opcao) {
            let url;

            this.show_load = true;

            if(opcao === 'ativa') {
                url = `${this.$apiRoute}/campaign/${id}/reactivate`;
                const campanhaAtivada = this.campaign_deactivates.filter(campaign => campaign.campaignId === id);
                this.campaign_activates.push(campanhaAtivada[0]);
                this.campaign_deactivates = this.campaign_deactivates.filter(campaign => campaign.campaignId !== id);
            } else if(opcao  === 'desativa') {
                url = `${this.$apiRoute}/campaign/${id}/deactivate`;
                const campanhaDesativada = this.campaign_activates.filter(campaign => campaign.campaignId === id);
                this.campaign_deactivates.push(campanhaDesativada[0]);
                this.campaign_activates = this.campaign_activates.filter(campaign => campaign.campaignId !== id);
            }

            fetch(url, {
                method: 'POST',
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
            }).catch((err) => {
                this.showAuthAlert = this.isAuthError(this.statusCode);
                this.snackbar_message = 'Erro ao mudar status do usuário!';
                this.showSnackbar = true;
            }).finally(() => {
                this.show_load = false;
            });
        }
    }
}

</script>

<style scoped>

    .card {
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

    .titulo_categoria {
        font-size: 20px;
        margin-left: 60px;
        padding-bottom: 20px;
        padding-top: 25px;
        display: block;
    }

    .lista_campanhas {
        margin-left: 0px!important;
    }

    .lista_campanhas_desativados {
        background-color: #ececec;
    }

    .campaign:hover {
        background-color: #ecf1fd;
    }

    i.ativar_campaign {
        font-size: 20px;
        cursor: pointer;
        color: red!important;
    }

    i.desativar_campaign {
        font-size: 20px;
        cursor: pointer;
        color: green!important;
    }

</style>