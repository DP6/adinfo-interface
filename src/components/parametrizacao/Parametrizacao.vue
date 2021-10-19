<template>
    <div>
        <titulo-principal titulo="Parametrização"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <form class="md-layout">
                            <md-card class="md-layout-item md-larger-size card">
                                <md-card-content>
                                    <div class="md-layout md-gutter">
                                        <div class="md-layout-item md-medium-size-100">
                                            <md-field>
                                                <label for="agency">Agência</label>
                                                <md-select v-model="form.agency" name="agency" id="agency">
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
                        <form class="md-layout">
                            <md-card class="md-layout-item md-larger-size card">
                                <md-card-content>
                                    <div class="md-layout md-gutter">
                                        <div class="md-layout-item md-medium-size-100">
                                            <md-field>
                                                <label for="campaign">Campanha</label>
                                                <md-select v-model="form.campaignId" name="campaign" id="campaign">
                                                    <md-optgroup label="Campanhas">
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
                            </md-card>
                        </form>
                        <div class="md-layout-item md-medium-size-100">
                            <!-- <md-card class="md-layout-item md-larger-size card"> -->
                                <md-field>
                                    <label>Upload files</label>
                                    <md-file v-model="file" id="file" placeholder="Anexar Arquivo" />
                                </md-field>
                            <!-- </md-card> -->
                        </div>
                    </div>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <!-- <md-card class="md-layout-item md-larger-size card"> -->
                                <md-field>
                                    <label for="tool">Mídia</label>
                                    <md-select v-model="tool" name="tool" id="tool">
                                        <md-optgroup v-if="parametrizers.filter(parametrizer => parametrizer.type === 'analytics')" label="Ferramentas">
                                            <md-option 
                                                v-for="tool in parametrizers.filter(parametrizer => parametrizer.type === 'analytics')" 
                                                :value="tool.value"
                                                :key="tool.title"
                                            >{{ tool.title }}</md-option>
                                        </md-optgroup>

                                        <md-optgroup v-if="parametrizers.filter(parametrizer => parametrizer.type === 'media')" label="Mídias">
                                            <md-option 
                                                v-for="vehicle in parametrizers.filter(parametrizer => parametrizer.type === 'media')" 
                                                :value="vehicle.value"
                                                :key="vehicle.value"
                                            >{{ vehicle.title }}</md-option>
                                        </md-optgroup>
                                    </md-select>
                                </md-field>
                            <!-- </md-card> -->
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
                agency: '',
                campaignId: '',
                campaign: ''
            },
            tool: null,
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
            agencies: [],
            campaigns: [],
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
            this.show_load = false;
            this.configVersion = data.version;
            this.configDate = `${data.insertTime.substring(6, 8)}/${data.insertTime.substring(4, 6)}/${data.insertTime.substring(0, 4)}`;
            delete data.insertTime;
            this.configJson = data;
            const titles = {
                'ga': 'Google Analytics',
                'adobe': 'Adobe Analytics',
                'facebookads': 'Facebook Ads',
                'googleads': 'Google Ads'
            };
            Object.keys(this.configJson).forEach(key => {
                if(typeof this.configJson[key] === 'object' && key !== 'columns') {
                    if(key != 'dependenciesConfig' && key.charAt(0).toUpperCase() + key.slice(1) !== 'CsvSeparator') {
                        this.parametrizers.push({
                            title: titles[key] ? titles[key] : key.charAt(0).toUpperCase() + key.slice(1),
                            value: key,
                            type: (key === 'ga' || key === 'adobe') ? 'analytics' : 'media'
                        });
                    }
                }
            });
        }).catch((err) => {
            this.visibilidadeResposta = true;
            this.tituloResposta = 'Erro ao recuperar configuração';
            this.showAuthAlert = this.isAuthError(this.statusCode);
            this.apiError = true;
            this.apiErrorMessage = err.message;
        }).finally(() => {
            this.show_load = false;
        });

        const urlAgencyList = `${this.$apiRoute}/agency/list`;
        this.show_load = true;
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
        const allAgencies = JSON.parse(response.responseText).map(agency =>{
            const agencyWithId = {id:count, agency:agency};
            count++
            return agencyWithId
        })
        if(localStorage.getItem('permission') === 'owner' || localStorage.getItem('permission') === 'admin')
        allAgencies.push({id:count, agency:'Nenhuma Agência'})
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
        clearForm () {
            this.$v.$reset()
            this.form.agency = null
            this.form.company = null
            this.form.file = null
            this.form.campaign = null
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
            const url = `${this.$apiRoute}/build/${this.tool}`;
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
                    agency: this.form.agency
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
            let agencia = this.form.agency;
            if((localStorage.getItem('permission') === 'owner' || localStorage.getItem('permission') === 'admin') && this.agency === 'Nenhuma Agência'){
                agencia = 'CompanyCampaigns';
            }
            console.log(agencia)
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
                console.log(this.campaigns)
            }).catch((err) => {
                this.apiError = true;
                this.apiErrorMessage = err.message;
                this.tituloResposta = 'Erro ao recuperar configuração';
                this.showAuthAlert = this.isAuthError(this.statusCode);
            }).finally(() => {
                this.show_load = false;
            });
        },
        getCampaignName() {
                const campaignName = this.campaigns.filter(campanha => campanha.campaignId===this.form.campaignId)[0].campaignName;
                this.form.campaign = campaignName;
                console.log(this.form.campaign)
                console.log(campaignId)
                console.log(this.form.campaignId)
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

</style>