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
                <md-select name="tipo" id="tipo">
                  <md-option value="separator">Separator</md-option>
                  <md-option value="sepace-separator">Space Separator</md-option>
                  <md-option value="ferramenta-midia">Ferramenta/Mídia</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item">
              <md-field>
                <label for="first-name">First Name</label>
                <md-input name="first-name" id="first-name" autocomplete="given-name"/>
              </md-field>
            </div>
          </div>

          <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event)">Adicionar</md-button>
          <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
        </md-list-item>

        <md-list-item v-for="item in generalConfig.filter(key => typeof(configJson[key]) === 'string')" :id="item">
          <span class="md-list-item-text">{{item}} : {{ configJson[item] }}</span>
          <md-icon class="excluir" @click.native="excluirItem(item)">delete</md-icon>
        </md-list-item>

        <md-list-item md-expand v-for="item in generalConfig.filter(key => typeof(configJson[key]) === 'object')" :id="item">
          <span class="md-list-item-text">{{ item }}</span>
          <md-icon class="excluir" @click.native="excluirItem(item)">delete</md-icon>

          <md-list slot="md-expand">

            <md-list-item v-if="item === 'ga'" class="nivel2">
              <md-icon @click.native="adicionarItem($event, item)" class="adicionar">add</md-icon>
              <div class="md-layout md-gutter campo-adicionar">
                <div class="md-layout-item">
                  <md-field>
                    <label for="first-name">First Name</label>
                    <md-input name="first-name" id="first-name" autocomplete="given-name"/>
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
                    <label for="tipo">Tipo</label>
                    <md-select name="tipo" id="tipo">
                      <md-option value="dynamicValues">Dynamic Values</md-option>
                      <md-option value="utm">UTM</md-option>
                    </md-select>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label for="first-name">First Name</label>
                    <md-input name="first-name" id="first-name" autocomplete="given-name"/>
                  </md-field>
                </div>
              </div>
              <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event, item)">Adicionar</md-button>
              <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
            </md-list-item>

            <md-list-item v-for="param in Object.keys(configJson[item]).filter(key => typeof(configJson[item][key]) !== 'object')" :id="concatId(item, param)" class="nivel2">
              <span class="md-list-item-text">{{param}} : {{ configJson[item][param] }}</span>
              <md-icon class="excluir" @click.native="excluirItem(item, param)">delete</md-icon>
            </md-list-item>

            <md-list-item md-expand v-for="param in Object.keys(configJson[item]).filter(key => typeof(configJson[item][key]) === 'object')" :id="concatId(item, param)" class="nivel2">
              <span class="md-list-item-text">{{param}}</span>
              <md-icon class="excluir" @click.native="excluirItem(item, param)">delete</md-icon>

              <md-list slot="md-expand">

                <md-list-item class="nivel3">
                  <md-icon @click.native="adicionarItem($event, item, param)" class="adicionar">add</md-icon>
                  <div class="md-layout md-gutter campo-adicionar">
                    <div class="md-layout-item">
                      <md-field>
                        <label for="first-name">First Name</label>
                        <md-input name="first-name" id="first-name" autocomplete="given-name"/>
                      </md-field>
                    </div>
                  </div>
                  <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event, item, param)">Adicionar</md-button>
                  <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
                </md-list-item>

                <md-list-item md-expand v-for="t in Object.keys(configJson[item][param])" :id="concatId(item, param, t)" class="nivel3">
                  <span class="md-list-item-text">{{t}}</span>
                  <md-icon class="excluir" @click.native="excluirItem(item, param, t)">delete</md-icon>

                  <md-list slot="md-expand">

                    <md-list-item class="nivel4">
                      <md-icon @click.native="adicionarItem($event, item, param, t)" class="adicionar">add</md-icon>
                      <div class="md-layout md-gutter campo-adicionar">
                        <div class="md-layout-item">
                          <md-field>
                            <label for="first-name">First Name</label>
                            <md-input name="first-name" id="first-name" autocomplete="given-name"/>
                          </md-field>
                        </div>
                      </div>
                      <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event, item, param, t)">Adicionar</md-button>
                      <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
                    </md-list-item>

                    <md-list-item v-for="seila in configJson[item][param][t]" :id="concatId(item, param, t, seila)" class="nivel4">
                      <span class="md-list-item-text">{{seila}}</span>
                      <md-icon class="excluir" @click.native="excluirItem(item, param, t, seila)">delete</md-icon>
                    </md-list-item>
                  </md-list>

                </md-list-item>
              </md-list>

            </md-list-item>
          </md-list>

        </md-list-item>
      </md-list>
      <md-card-actions>
        <botao-submit @botaoAtivado="updateConfig()" nome_do_botao="Atualizar Configuração"></botao-submit>
      </md-card-actions>
    </md-card>
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
import { validationMixin } from 'vuelidate'
import {
    required,
    minLength,
    maxLength
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
      showSnackbar: false,
      position: 'center',
      duration: 4000,
      isInfinity: false,
      snackbar_message: '',
      statusCode: null,
      showAuthAlert: false,
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
    const url = `https://adinfo.ue.r.appspot.com/config`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        company: 'arthurltda',
        token: localStorage.getItem('userToken')
      }
    }).then(function(response) {
      this.statusCode = response.status;
      return response.json();
    }).then((data) => {
      delete data[0].insertTime;
      this.configJson = data[0];
      this.generalConfig = Object.keys(data[0]);
    }).catch((err) => {
      this.showAuthAlert = this.isAuthError(this.statusCode);
      console.log(err);
    });
  },
  methods: {
    updateConfig() {
      const url = `https://adinfo.ue.r.appspot.com/config`;
      const formdata = new FormData();
      formdata.append("config", JSON.stringify(this.configJson));
      formdata.append("company", 'arthurltda');
      formdata.append("token", localStorage.getItem('userToken'));
      fetch(url, {
        method: 'POST',
        body: formdata
      }).then((response) => {
        this.snackbar_message = 'Configuração atualizada com sucesso!';
        this.showSnackbar = true;
        this.statusCode = response.status;
      }).catch((err) => {
        this.showAuthAlert = this.isAuthError(this.statusCode);
        this.snackbar_message = 'Erro ao atualizar a configuração!';
        this.showSnackbar = true;
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
    },
    confirmar(event, ...ids) {
      const divAdd = event.target.parentNode.parentNode.parentNode;
      const inputValue = divAdd.querySelector('input#first-name').value;
      divAdd.querySelector('input#first-name').value = '';
      if(ids.length === 0) {
        const type = divAdd.querySelector('.md-select input').value;
        if(type === 'Ferramenta/Mídia') {
          this.configJson[inputValue] = {};
        } else {
          const keyType = (type.charAt(0).toLowerCase() + type.slice(1)).replace(' ', '');
          this.configJson[keyType] = inputValue;
        }
      } else if(ids.length === 1) {
        const type = divAdd.querySelector('.md-select input') ? divAdd.querySelector('.md-select input').value : '';
        if(type === "Dynamic Values") {
          const keyType = (type.charAt(0).toLowerCase() + type.slice(1)).replace(' ', '');
          this.configJson[ids[0]][keyType] = (inputValue == 'true');
        } else if(type === "UTM") {
          this.configJson[ids[0]][inputValue] = '';
        } else {
          console.log( divAdd.querySelector('input#first-name').value);
          this.configJson[ids[0]][inputValue] = {};
        }
      } else if(ids.length === 2) {
        this.configJson[ids[0]][ids[1]][inputValue] = [];
      } else if(ids.length === 3) {
        this.configJson[ids[0]][ids[1]][ids[2]].push(inputValue);
      }
      this.generalConfig = Object.keys(this.configJson);
      divAdd.querySelector('.campo-adicionar').style.display = 'none';
      divAdd.querySelector('.botao-adicionar').style.display = 'none';
      divAdd.querySelector('.botao-cancelar').style.display = 'none';
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
        const exclude = Object.keys(objectKey)[0];
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
    },
    isAuthError(statusCode){
      if(statusCode === 403)
        return true;
      return false;
    }
  }
}
</script>

<style scoped>

  .card {
    margin-left: 50px;
  }

  .main {
    margin-bottom: 50px;
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

  .excluir {
    color: red;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
  }

</style>