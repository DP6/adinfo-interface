<template>
  <div class="main">
    <titulo-principal titulo="Configuração Atual"></titulo-principal>
    <md-card class="md-layout-item md-larger-size card">
      <md-list>
        <md-list-item>
          <md-icon @click.native="adicionarItem($event)" class="adicionar">add</md-icon>

          <div class="md-layout md-gutter campo-adicionar">
            <div class="md-layout-item">
              <md-field>
                <label for="tipo">Tipo</label>
                <md-select name="tipo" id="tipo" v-model="selected_field">
                  <md-option value="columns">Colunas</md-option>
                  <md-option value="separator">Separator</md-option>
                  <md-option value="sepace-separator">Space Separator</md-option>
                  <md-option value="csv-separator">Csv Separator</md-option>
                  <md-option value="ferramenta-midia">Ferramenta/Mídia</md-option>
                  <md-option value="custom-ferramenta-midia">Ferramenta/Mídia Personalizada</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item">
              <md-field v-show="!show_select && show_field">
                <label for="value">Valor</label>
                <md-input name="value" class="input-field" autocomplete="given-name"/>
              </md-field>
              <md-field v-show="show_select">
                <label for="tool">Mídia</label>
                <md-select name="tool" class="select-field" v-model="ferramenta_midia">
                  <md-optgroup label="Ferramentas">
                    <md-option value="adobe">Adobe Analytics</md-option>
                    <md-option value="ga">Google Analytics</md-option>
                  </md-optgroup>
                  <md-optgroup label="Mídias">
                    <md-option value="facebookads">Facebook Ads</md-option>
                    <md-option value="googleads">Google Ads</md-option>
                  </md-optgroup>
                </md-select>
              </md-field>
            </div>
          </div>

          <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event)">Adicionar</md-button>
          <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
        </md-list-item>

        <md-list-item 
          v-for="item in generalConfig.filter(key => typeof(configJson[key]) === 'string')" 
          :key="item"
          :id="item"
        >
          <md-icon class="excluir" @click.native="excluirItem(item)">delete</md-icon>
          <span class="md-list-item-text">{{item}} : {{ configJson[item] }}</span>
        </md-list-item>

        <md-list-item md-expand 
          v-for="item in generalConfig.filter(key => typeof(configJson[key]) === 'object')" 
          :key="item"
          :id="item"
        >
          <md-icon class="excluir" @click.native="excluirItem(item)">delete</md-icon>
          <span class="md-list-item-text">{{ item }}</span>

          <md-list slot="md-expand">

            <md-list-item v-if="['ga', 'adobe', 'googleads', 'facebookads'].indexOf(item) > -1" class="nivel2">
              <md-icon v-show="toolFields[item].length !== 0" @click.native="adicionarItem($event, item)" class="adicionar">add</md-icon>
              <div class="md-layout md-gutter campo-adicionar">
                <div class="md-layout-item">
                  <md-field>
                    <label for="param">Parâmetro</label>
                    <md-select name="param" class="select-field" v-model="toolConfigValues[item]">
                      <md-option 
                        v-for="param in toolFields[item]" 
                        :key="param"
                        :value="param"
                      >{{param}}</md-option>
                    </md-select>
                  </md-field>
                </div>
              </div>
              <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event, item)">Adicionar</md-button>
              <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
            </md-list-item>

            <md-list-item v-else class="nivel2">
              <md-icon @click.native="adicionarItem($event, item)" class="adicionar">add</md-icon>
              <div class="md-layout md-gutter campo-adicionar">
                <div class="md-layout-item">
                  <md-field>
                    <label for="field">Campo</label>
                    <md-input name="field" class="input-field" autocomplete="given-name"/>
                  </md-field>
                </div>
              </div>
              <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event, item)">Adicionar</md-button>
              <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
            </md-list-item>

            <md-list-item 
              v-for="param in Object.keys(configJson[item]).filter(key => typeof(configJson[item][key]) !== 'object')" 
              :key="concatId(item, param)"
              :id="concatId(item, param)" 
              class="nivel2"
            >
              <md-icon class="excluir" @click.native="excluirItem(item, param)">delete</md-icon>
              <span class="md-list-item-text">{{param}} : {{ configJson[item][param] }}</span>
            </md-list-item>

            <md-list-item 
              md-expand v-for="param in Object.keys(configJson[item]).filter(key => typeof(configJson[item][key]) === 'object')" 
              :key="concatId(item, param)"
              :id="concatId(item, param)" 
              class="nivel2"
            >
              <md-icon class="excluir" @click.native="excluirItem(item, param)">delete</md-icon>
              <span class="md-list-item-text">{{param}}</span>

              <md-list slot="md-expand">
                <md-list-item v-if="item === 'columns'" class="nivel3">
                  <md-icon @click.native="adicionarItem($event, item, param)" class="adicionar">add</md-icon>
                  <div class="md-layout md-gutter campo-adicionar">
                    <div class="md-layout-item">
                      <md-field>
                        <label for="field">Coluna</label>
                        <md-input name="field" class="input-field" autocomplete="given-name"/>
                      </md-field>
                    </div>
                  </div>
                  <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event, item, param)">Adicionar</md-button>
                  <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
                </md-list-item>
                
                <md-list-item v-else class="nivel3">
                  <md-icon v-if="columns.filter(c => configJson[item][param].indexOf(c) === -1).length > 0" @click.native="adicionarItem($event, item, param)" class="adicionar">add</md-icon>
                  <div class="md-layout md-gutter campo-adicionar">
                    <div class="md-layout-item">
                      <md-field>
                        <label for="column">Coluna</label>
                        <md-select name="column" class="select-field" v-model="column_select">
                          <md-option 
                            v-for="column in columns.filter(c => configJson[item][param].indexOf(c) === -1)" 
                            :key="column"
                            :value="column"
                          >{{column}}</md-option>
                        </md-select>
                      </md-field>
                    </div>
                  </div>
                  <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event, item, param)">Adicionar</md-button>
                  <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
                </md-list-item>

                <md-list-item 
                  v-for="t in configJson[item][param]" 
                  :key="concatId(item, param, t)"
                  :id="concatId(item, param, t)" 
                  class="nivel4"
                >
                  <md-icon class="excluir" @click.native="excluirItem(item, param, t)">delete</md-icon>
                  <span class="md-list-item-text">{{t}}</span>
                </md-list-item>
                
              </md-list>

            </md-list-item>
            
          </md-list>

        </md-list-item>
      </md-list>
      <md-card-actions>
        <botao-submit @botaoAtivado="updateConfig()" nome_do_botao="Atualizar Configuração" :disabled="disable_button"></botao-submit>
      </md-card-actions>
    </md-card>

    <div class="msg-enviar-configuracao" v-show="disable_button && show_field_message">
      <p>Campos obrigatórios para a configuração: 
        <b>Separator</b>,
        <b>Space Separator</b>, 
        <b>Columns</b>, 
        alguma ferramenta de mídia (GA ou Adobe)
      </p>
    </div>

    <div class="respostas" v-show="apiError">
      <titulo-principal :titulo="tituloResposta"></titulo-principal>
      <p v-show="apiError" class="response">
        {{ apiErrorMessage }}
      </p>
    </div>
    
    <div class="load" v-show="show_load">
      <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    </div>
    <md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbar_message }}</span>
      <md-button class="md-primary" @click="showSnackbar = false">OK</md-button>
    </md-snackbar>
    <usuario-invalido :active="showAuthAlert"></usuario-invalido>
  </div>
</template>

<script>
import TituloAreaPrincipal from '../shared/titulo_area_principal/TituloAreaPrincipal.vue';
import BotaoSubmitForm from '../shared/botao_submit_form/BotaoSubmitForm.vue';
import InvalidUserAlert from '../shared/login/InvalidUser.vue';
import {
    required,
    minLength
} from 'vuelidate/lib/validators'
export default {
  components: {
    'titulo-principal': TituloAreaPrincipal,
    'botao-submit': BotaoSubmitForm,
    'usuario-invalido': InvalidUserAlert
  },
  data() {
    return {
      form: {
        company: null
      },
      generalConfig: [],
      configJson: {},
      dependenciesConfig: [],
      showSnackbar: false,
      position: 'center',
      duration: 4000,
      isInfinity: false,
      snackbar_message: '',
      statusCode: null,
      showAuthAlert: false,
      show_load: false,
      selected_field: '',
      show_select: false,
      show_field: false,
      disable_button: true,
      show_field_message: false,
      apiError: false,
      apiErrorMessage: '',
      tituloResposta: '',
      ferramenta_midia: '',
      dynamicValues: '',
      column_select: '',
      columns: [],
      toolConfigValues: {
        'adobe': '',
        'ga': '',
        'googleads': '',
        'facebookads': ''
      },
      toolFieldsFixed: {
        'adobe': ['cid'],
        'ga': ['utm_medium', 'utm_source', 'utm_campaign', 'utm_content', 'utm_term'],
        'googleads': ['campanha', 'ad', 'ad-set'],
        'facebookads': ['ad.id', 'campaign.name', 'ad.name']
      },
      toolFields: {
        'adobe': [],
        'ga': [],
        'googleads': [],
        'facebookads': []
      },
    }
  },
  validations: {
    form: {
      company: {
        required,
        minLength: minLength(3)
      }
    }
  },
  created() {
    const url = `${this.$apiRoute}/config`;
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
      const data = JSON.parse(response.responseText);
      this.show_load = false;
      delete data.insertTime;
      this.dependenciesConfig = data.dependenciesConfig;
      delete data.dependenciesConfig;
      this.configJson = data;
      this.generalConfig = Object.keys(data);
      this.columns = Object.keys(data.columns);
      this.updateToolFields();
    }).catch((err) => {
      this.apiError = true;
      this.apiErrorMessage = err.message;
      this.tituloResposta = 'Erro ao recuperar configuração';
      this.showAuthAlert = this.isAuthError(this.statusCode);
      console.log(err);
    }).finally(() => {
      this.show_load = false;
    });
  },
  methods: {
    habilitar_envio() {
      this.show_field_message = true;
      const fields = Object.keys(this.configJson);
      const checks = [
        fields.indexOf("separator"),
        fields.indexOf("spaceSeparator"),
        fields.indexOf("columns"),
        (fields.indexOf("ga") > -1 || fields.indexOf("adobe") > -1) ? 1 : -1
      ];
      this.disable_button = checks.filter(check => check === -1).length > 0;
    },
    updateToolFields() {
      const toolsToUpdate = Object.keys(this.toolConfigValues);
      toolsToUpdate.forEach(tool => {
        if(Object.keys(this.toolFieldsFixed).indexOf(tool) > -1) {
          if(this.configJson[tool]) {
            this.toolFields[tool] = this.toolFieldsFixed[tool].filter(elm => Object.keys(this.configJson[tool]).indexOf(elm) === -1);
          } else {
            this.toolFields[tool] = this.toolFieldsFixed[tool];
          }
        }
      });
      this.columns = Object.keys(this.configJson['columns']);
      this.habilitar_envio();
    },
    updateConfig() {
      const url = `${this.$apiRoute}/config`;
      this.show_load = true;
      const formdata = new FormData();
      const configToUpdate = this.configJson;
      configToUpdate.dependenciesConfig = this.dependenciesConfig;
      formdata.append("config", JSON.stringify(configToUpdate));
      fetch(url, {
        method: 'POST',
        headers: {
          token: localStorage.getItem('userToken')
        },
        body: formdata
      }).then((response) => {
        return response.json();
      }).then(response => {
        this.snackbar_message = response.responseText || response.errorMessage;
        this.showSnackbar = true;
        this.statusCode = response.status;
      }).catch((err) => {
        this.showAuthAlert = this.isAuthError(this.statusCode);
        this.snackbar_message = 'Erro ao atualizar a configuração!';
        this.showSnackbar = true;
      }).finally(() => {
        this.show_load = false;
      });
    },
    concatId(...ids) {
      return ids.join('-');
    },
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    adicionarItem(event) {
      const addField = event.target.parentNode;
      addField.querySelector('.campo-adicionar').style.display = 'inline-flex';
      addField.querySelector('.botao-adicionar').style.display = 'inline-flex';
      addField.querySelector('.botao-cancelar').style.display = 'inline-flex';
      this.updateToolFields();
    },
    confirmar(event, ...ids) {
      const divAdd = event.target.parentNode.parentNode.parentNode;
      let inputValue;
      if(this.show_select && ids.length === 0) {
        inputValue = this.ferramenta_midia;
      } else if(!this.show_field && ids.length === 0) {
        this.configJson['columns'] = {};
      } else if(divAdd.querySelector('input.input-field')) {
        inputValue = divAdd.querySelector('input.input-field').value;
        divAdd.querySelector('input.input-field').value = '';
      }
      if(ids.length === 0) {
        const type = divAdd.querySelector('.md-select input').value;
        if(type.indexOf('Ferramenta/Mídia') > -1) {
          this.configJson[inputValue] = {};
        } else if(this.show_field) {
          const keyType = (type.charAt(0).toLowerCase() + type.slice(1)).replace(' ', '');
          this.configJson[keyType] = inputValue;
        }
      } else if(ids.length === 1) {
        if(!inputValue) {
          inputValue = this.toolConfigValues[ids[0]];
        }
        if(inputValue) {
          this.configJson[ids[0]][inputValue] = [];
        }
        this.toolConfigValues[ids[0]] = undefined;
      } else if(ids.length === 2) {
        if(inputValue) {
          this.configJson[ids[0]][ids[1]].push(inputValue);
        } else if(this.column_select) {
          this.configJson[ids[0]][ids[1]].push(this.column_select);
          this.column_select = '';
        }
      }
      this.generalConfig = Object.keys(this.configJson);
      divAdd.querySelector('.campo-adicionar').style.display = 'none';
      divAdd.querySelector('.botao-adicionar').style.display = 'none';
      divAdd.querySelector('.botao-cancelar').style.display = 'none';
      this.updateToolFields();
    },
    cancelar(event) {
      const divField = event.target.parentNode.parentNode.parentNode;
      divField.querySelector('.campo-adicionar').style.display = 'none';
      divField.querySelector('.botao-adicionar').style.display = 'none';
      divField.querySelector('.botao-cancelar').style.display = 'none';
    },
    excluirItem(...ids) {
      const keyToExcludeValue = ids.reduce((acc, id) => {
        return acc[id];
      }, this.configJson);
      const objectKey = ids.slice(0, -1).reduce((acc, id) => {
        return acc[id];
      }, this.configJson);
      if(Array.isArray(keyToExcludeValue)){
        const exclude = ids.slice(-1)[0];
        const t = ids.slice(0, -1).reduce((acc, id) => {
          return acc[id];
        }, this.configJson);
        delete t[exclude];
      } else if(typeof(keyToExcludeValue) === 'undefined') {
        objectKey.splice(objectKey.indexOf(ids.slice(-1)[0]), 1);
      } else {
        delete objectKey[ids.slice(-1)[0]]
      }
      this.generalConfig = Object.keys(this.configJson);
      this.updateToolFields();
    },
    isAuthError(statusCode){
      if(statusCode === 403)
        return true;
      return false;
    }
  },
  watch: {
    selected_field: function(event) {
      this.show_select = this.selected_field === 'ferramenta-midia' ? true : false;
      this.show_field = this.selected_field === 'columns' ? false : true;
    }
  }
}
</script>

<style scoped>

  .card {
    margin-left: 50px;
  }

  .nivel2 {
    padding-left: 25px;
  }

  .nivel3 {
    padding-left: 50px;
  }

  .nivel4 {
    padding-left: 75px;
  }

  .msg-enviar-configuracao {
    color: rgb(194, 6, 6);
    font-size: 16px;
    margin-left: 50px;
  }

  .botao-adicionar,
  .botao-cancelar,
  .campo-adicionar {
    display: none;
  }

  .adicionar {
    color: green;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
  }

  p.response {
    margin-left: 60px;
  }

  .excluir {
    color: red;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
  }

  .load {
    margin-top: 50px;
    text-align: center;
  }

</style>