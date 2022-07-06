<template>
    <div>
        <titulo-principal titulo="Parametrização"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-layout md-gutter">
                            <md-field>
                                <label for="adOpsTeam">AdOpsTeam</label>
                                <md-select v-model="selected_adOpsTeam" name="adOpsTeam" id="adOpsTeam" @md-selected="getCampaigns()">
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
                        <div class="md-layout-item md-layout md-gutter">
                            <md-field>
                                <label for="campaign">Campanha</label>
                                <md-select v-model="form.campaignId" name="campaign" id="campaign">
                                    <md-optgroup label="Campanhas">
                                        <md-option
                                            v-for="campaign in elegible_campaigns"
                                            :key="campaign.campaignId"
                                            :value="campaign.campaignId"
                                        >{{campaign.campaignName}}</md-option>
                                    </md-optgroup>
                                </md-select>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-layout md-gutter">
                            <md-field>
                                <label>Upload files</label>
                                <md-file v-model="file" id="file" placeholder="Anexar Arquivo" />
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-layout md-gutter">
                            <md-field>
                                <label for="tool">Ferramenta de Analytics</label>
                                <md-select v-model="tool" name="tool" id="tool">
                                    <md-option
                                        v-for="tool in parametrizers.filter(parametrizer => parametrizer.type === 'analytics')"
                                        :value="tool.value"
                                        :key="tool.title"
                                    >{{ tool.title }}</md-option>
                                </md-select>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-layout md-gutter">
                            <md-field>
                                <label for="vehicle">Mídia</label>
                                <md-select v-model="vehicle" name="vehicle" id="vehicle">
                                    <md-option
                                        v-for="vehicle in parametrizers.filter(parametrizer => parametrizer.type === 'media')"
                                        :value="vehicle.value"
                                        :key="vehicle.value"
                                    >{{ vehicle.title }}</md-option>
                                </md-select>
                            </md-field>
                        </div>
                    </div>
                </md-card-content>
                <md-card-actions>
                    <botao-submit @botaoAtivado="build()" nome_do_botao="Parametrizar"></botao-submit>
                </md-card-actions>
            </md-card>
        </form>
        <div class="load" v-show="show_load">
            <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
        </div>
        <div class="resposta" v-show="visibilidadeResposta">
            <titulo-principal :titulo="tituloResposta"></titulo-principal>
            <p class="md-body-1" v-show="!apiError">Parametrização realizada a partir da configuração de versão n° <b>{{configVersion}}</b>, criada/atualizada em <b>{{configDate}}</b>.</p>
            <div class="tabela-resposta" v-show="!apiError">
                {{ respostaAPI }}
                <md-card md-card v-show="visibilidadePrevia">
                    <md-table  md-height="300px" class="previa" md-fixed-header v-model="tabela" >
                        <md-table-toolbar>
                            <h1 class="md-title">Colunas</h1>
                        </md-table-toolbar>

                        <md-table-row slot="md-table-row" slot-scope="{ item }">
                            <md-table-cell v-for="titulo in previaTitulo" :md-label="titulo" :key="titulo">{{ item[titulo] }}</md-table-cell>
                        </md-table-row>

                    </md-table>
                    <md-button @click="downloadParametrizacao()" class="md-dense md-raised md-primary button-download">Download Parametrização</md-button>
                </md-card>
            </div>
            <p v-show="apiError" class="response">
                {{ apiErrorMessage }}
            </p>
        </div>
        <md-dialog-alert
            :md-active.sync="downloadError"
            md-title="Erro ao baixar CSV"
            :md-content="downloadErrorMessage" />
        <usuario-invalido :active="showAuthAlert"></usuario-invalido>
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
        'usuario-invalido': InvalidUserAlert
    },
    data() {
        return {
            form: {
                adOpsTeam: '',
                campaignId: '',
                campaign: ''
            },
            tool: null,
            vehicle: null,
            tituloResposta: '',
            visibilidadeResposta: false,
            visibilidadePrevia: false,
            respostaAPI: '',
            builderFile: null,
            previaTitulo: [],
            previaCampos: [],
            tabela: [],
            file: null,
            statusCode: null,
            showAuthAlert: false,
            show_load: false,
            configJson: {},
            parametrizers: [],
            apiError: false,
            apiErrorMessage: '',
            downloadError: false,
            downloadErrorMessage: 'Erro no Download!',
            configVersion: '',
            configDate: '',
            adOpsTeams: [],
            campaigns: [],
            elegible_campaigns: [],
            selected_adOpsTeam:'',
        }
    },
    validations: {
        form: {
            adOpsTeam: {
                required,
                minLength: minLength(3)
            },
            advertiser: {
                required,
                minLength: minLength(3)
            },
            campaign: {
                required,
                minLength: minLength(3)
            },
            file: {
                required,
                minLength: minLength(3)
            }
        }
    },
    created() {
        const urlConfig = `${this.$apiRoute}/config`;
        this.apiError = false;
        this.show_load = true;
        fetch(urlConfig, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('userToken')
            }
        }).then((response) => {
            this.statusCode = response.status;
            return response.json();
        }).then((response) => {
            if(this.statusCode === 401) {
                this.$router.push('login');
            } else if(this.statusCode !== 200) {
                throw new Error(response.responseText || response.errorMessage);
            }
            const data = JSON.parse(response.responseText);
            this.configVersion = data.version;
            this.configDate = `${data.insertTime.substring(6, 8)}/${data.insertTime.substring(4, 6)}/${data.insertTime.substring(0, 4)}`;
            delete data.insertTime;
            this.configJson = data;

            Object.keys(this.configJson.analyticsTools).forEach(key => {
                this.parametrizers.push({
                    title: key === 'ga'? 'Google Analytics': 'Adobe',
                    value: key,
                    type: 'analytics',
                })
            });
            Object.keys(this.configJson.mediaTaxonomy).forEach(key => {
                this.parametrizers.push({
                    title: key,
                    value: key,
                    type: 'media',
                })
            });
        }).catch((err) => {
            this.visibilidadeResposta = true;
            this.tituloResposta = 'Erro ao recuperar configuração';
            this.showAuthAlert = this.isAuthError(this.statusCode);
            this.apiError = true;
            this.apiErrorMessage = err.message;
        });

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
        }).then(()=>{
            this.adOpsTeams.forEach(adOpsTeam => {
                const urlCampaignList = `${this.$apiRoute}/campaign/${adOpsTeam.adOpsTeam}/list`;
                fetch(urlCampaignList, {
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

                    const campaigns = JSON.parse(response.responseText);

                    campaigns.forEach(campaign => this.campaigns.push(campaign))
                }).catch((err) => {
                    this.apiError = true;
                    this.apiErrorMessage = err.message;
                    this.tituloResposta = 'Erro ao recuperar configuração';
                    this.showAuthAlert = this.isAuthError(this.statusCode);
                }).finally(() => {
                    this.show_load = false;
                });
            });
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
            this.form.campaignId = null;
            this.form.advertiser = null;
            this.form.file = null;
            this.form.campaign = null;
            this.elegible_campaigns = null;
        },
        clearResposta() {
            this.tituloResposta = '';
            this.visibilidadeResposta = false;
            this.visibilidadePrevia = false;
            this.respostaAPI = '';
            this.builderFile = null;
            this.previaTitulo = [];
            this.previaCampos = [];
        },
        build() {
            this.clearResposta();
            let url = `${this.$apiRoute}/build/${this.tool}`;
            if(this.vehicle) url += `/${this.vehicle}`
            const formdata = new FormData();
            formdata.append("data", document.querySelector('#file').files[0]);
            this.apiError = false;
            this.show_load = true;
            const campaignName = this.campaigns.filter(campanha => campanha.campaignId===this.form.campaignId)[0].campaignName;
            this.form.campaign = campaignName;
            const requestOptions = {
                method: 'POST',
                headers: {
                    token: localStorage.getItem('userToken'),
                    campaign: this.form.campaign,
                    adOpsTeam: this.form.adOpsTeam === 'AdvertiserCampaigns'? '': this.form.adOpsTeam
                },
                body: formdata,
                redirect: 'follow'
            };
            fetch(url, requestOptions)
                .then(response => {
                    this.statusCode = response.status;
                    if(response.status === 200) {
                        return response.blob();
                    } else {
                        return response.json();
                    }
                }).then(response => {
                    if(this.statusCode !== 200) {
                        throw new Error(response.responseText || response.errorMessage);
                    }
                    this.builderFile = response;
                    return response.text();
                }).then(textInFile => {
                    this.previaTitulo = [];
                    this.previaCampos = [];
                    this.tabela = [];
                    const csvSeparator = /\,/.test(textInFile.split('\n')[0]) ? ',' : ';';
                    this.visibilidadeResposta = true;
                    this.tituloResposta = 'Prévia';
                    this.visibilidadePrevia = true;
                    this.previaTitulo = textInFile.split('\n')[0].split(csvSeparator);
                    const linhas = textInFile.split('\n').slice(1);
                    linhas.every((linha, index) => {
                        if(linha.split(csvSeparator)[0] === '' || index === 6) {
                            return false;
                        }
                        const objeto = {};
                        linha.split(csvSeparator).forEach((campo, indexCampo) => {
                            objeto[this.previaTitulo[indexCampo]] = campo;
                        });
                        this.tabela.push(objeto);
                        return true;
                    });
                }).catch(err => {
                    this.apiError = true;
                    this.showAuthAlert = this.isAuthError(this.statusCode);
                    this.visibilidadeResposta = true;
                    this.tituloResposta = 'Falha na parametrização';
                    this.apiErrorMessage = err.message;
                    console.log(err);
                }).finally(() => {
                    this.show_load = false;
                });
        },
        downloadParametrizacao() {
            const url = window.URL.createObjectURL(this.builderFile);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${document.querySelector('#file').files[0].name.replace(/\.csv$/, '')}_parametrizado.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        },
        isAuthError(statusCode){
            if(statusCode === 403)
                return true;
            return false;
        },
        getCampaigns() {
            this.form.campaignId = null;
            let selectedCampaigns = [];
            this.selected_adOpsTeam === 'Campanhas Internas'? this.form.adOpsTeam = 'AdvertiserCampaigns': this.form.adOpsTeam = this.selected_adOpsTeam;

            this.campaigns.forEach(campaignObject => {
                if(campaignObject.adOpsTeam === this.form.adOpsTeam && campaignObject.active === true){
                    selectedCampaigns.push({campaignId:campaignObject.campaignId, campaignName: campaignObject.campaignName})
                }
            })
            this.elegible_campaigns = selectedCampaigns;
        }
    }
}

</script>

<style scoped>

    form {
        margin-left: 50px;
    }

    p.response {
        margin-left: 60px;
    }

    .load {
        margin-top: 50px;
        text-align: center;
    }

    .previa div.md-table-content {
        max-height: 300px;
    }

    .tabela-resposta {
        margin-left: 50px;
    }

    p.md-body-1 {
        margin-left: 50px;
    }

    .adOpsTeam-select {
        margin-right: 30px;
        margin-bottom: 10px;
        margin-left: -30px;
        border: 40px solid white;
    }

    .campaign-select {
        margin-right: 30px;
        margin-left: -30px;
        margin-bottom: 10px;
        border: 40px solid white;
    }

    .upload-file {
        margin-right: 20px;
        margin-left: 10px;
        margin-top: 10px;
        border: 40px solid white;
    }

    .midia-select {
        margin-right: 20px;
        margin-left: 10px;
        margin-top: 10px;
        border: 40px solid white;
    }
    /* .adOpsTeam-select {
        margin-right: 30px;
        margin-bottom: 10px;
        margin-left: -30px;
        width: 200px;
        border: 40px solid white;
    }

    .campaign-select {
        margin-right: 10px;
        margin-left: -30px;
        margin-bottom: 10px;
        width: 200px;
        border: 40px solid white;
    }

    .upload-file {
        margin-right: 20px;
        width: 250px;
        margin-left: 10px;
        margin-top: 10px;
        border: 40px solid white;
    } */

</style>