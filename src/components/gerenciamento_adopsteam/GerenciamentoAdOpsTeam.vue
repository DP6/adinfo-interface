<template>
    <div>
        <titulo-principal titulo="Gerenciamento de AdOpsTeams"></titulo-principal>

        <span class="titulo_categoria" v-if="adopsteam_activates.length > 0">AdOpsTeams Ativos</span>
        <md-card class="md-layout-item md-larger-size card">
            <md-list class="lista_campanhas">
                <md-list-item v-for="adopsteam in adopsteam_activates" :key="adopsteam.name" class="campaign">
                    {{adopsteam.name}}
                <md-icon class="md-size-2x desativar_campaign" @click.native="gerenciaAdOpsTeams(adopsteam.name, 'desativa')">toggle_on</md-icon>
                </md-list-item>
            </md-list>
        </md-card>
        <span class="titulo_categoria" v-if="adopsteam_deactivates.length > 0">AdOpsTeams Desativados</span>
        <md-card class="md-layout-item md-larger-size card" v-if="adopsteam_deactivates.length > 0">
            <md-list class="lista_campanhas_desativados lista_campanhas">
                <md-list-item v-for="adopsteam in adopsteam_deactivates" :key="adopsteam.name" class="campaign">
                    {{adopsteam.name}}
                <md-icon class="md-size-2x ativar_campaign campaign" @click.native="gerenciaAdOpsTeams(adopsteam.name, 'ativa')">toggle_off</md-icon>
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
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
            adopsteam_activates: [],
            adopsteam_deactivates: [],
            adOpsTeams: [],
            selected_adOpsTeam:  '',
            snackbar_message: '',
            position: 'center',
            showSnackbar: false
        }
    },
    created() {
        this.show_load = true;
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

          adOpsTeams.forEach((adOpsTeam) => {
                    this.adOpsTeams.push(adOpsTeam);
          });
        }).then(() => {
          this.resetAdOpsTeams();
          this.adOpsTeams.forEach(adOpsTeam => {
                    if(adOpsTeam.active){
                              this.adopsteam_activates.push(adOpsTeam)
                    }else {
                              this.adopsteam_deactivates.push(adOpsTeam)
                    }
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
        resetAdOpsTeams(){
            this.campaign_activates = [];
            this.campaign_deactivates = [];
        },
        isAuthError(statusCode) {
            if(statusCode === 403)
                return true;
            this.apiError = true;
            return false;
        },
        gerenciaAdOpsTeams(adOpsTeamName, opcao) {
            let url;

            this.show_load = true;

            if(opcao === 'ativa') {
                url = `${this.$apiRoute}/adOpsTeam/${adOpsTeamName}/reactivate`;
                const adOpsTeamAtivada = this.adopsteam_deactivates.filter(adOpsTeam => adOpsTeam.name === adOpsTeamName);
                this.adopsteam_activates.push(adOpsTeamAtivada[0]);
                this.adopsteam_deactivates = this.adopsteam_deactivates.filter(adOpsTeam => adOpsTeam.name !== adOpsTeamName);
            } else if(opcao  === 'desativa') {
                url = `${this.$apiRoute}/adOpsTeam/${adOpsTeamName}/deactivate`;
                const adOpsTeamDesativada = this.adopsteam_activates.filter(adOpsTeam => adOpsTeam.name === adOpsTeamName);
                this.adopsteam_deactivates.push(adOpsTeamDesativada[0]);
                this.adopsteam_activates = this.adopsteam_activates.filter(adOpsTeam => adOpsTeam.name !== adOpsTeamName);
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
                this.snackbar_message = 'Erro ao mudar status do AdOpsTeam!';
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