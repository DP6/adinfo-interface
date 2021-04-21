<template>
  <div class="main">
    <titulo-principal titulo="Configuração de Dependências"></titulo-principal>
    <md-card class="md-layout-item md-larger-size card">
        <md-list>

            <md-list-item>
                <md-icon @click.native="adicionarItem($event)" class="adicionar">add</md-icon>

                <div class="md-layout md-gutter campo-adicionar">
                    <div class="md-layout-item">
                        <md-field>
                            <label for="columnReference">Coluna de Referência</label>
                            <md-select name="columnReference" id="columnReference" v-model="add_dependency_select_columnReference">
                                <md-option v-for="column in Object.keys(configJson.columns)" :value="column" :key="column">{{ column }}</md-option>
                            </md-select>
                        </md-field>
                    </div>
                    <div class="md-layout-item">
                        <md-field>
                            <label for="columnDestiny">Coluna de Destino</label>
                            <md-select name="columnDestiny" id="columnDestiny" v-model="add_dependency_select_columnDestiny">
                                <md-option v-for="column in Object.keys(configJson.columns)" :value="column" :key="column">{{ column }}</md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>
                <div class="md-layout md-gutter campo-adicionar">
                    <div class="md-layout-item">
                        <md-field>
                            <label for="valuesReference">Valores de Referência</label>
                            <md-input name="valuesReference" id="add_valuesReference" class="input-field" autocomplete="given-name"/>
                        </md-field>
                    </div>
                    <div class="md-layout-item">
                        <md-field>
                            <label for="matches">Valores de Destino</label>
                            <md-input name="matches" id="add_matches" class="input-field" autocomplete="given-name"/>
                        </md-field>
                    </div>
                </div>
                <div class="md-layout md-gutter campo-adicionar">
                    <div class="md-layout-item">
                        <md-field>
                            <label for="hasMatch">Match</label>
                            <md-select name="hasMatch" id="hasMatch" v-model="add_hasMatch">
                                <md-option value="true">True</md-option>
                                <md-option value="false">False</md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>

                <md-button class="md-primary md-raised botao-adicionar"  @click="adicionarDependencia($event)">Adicionar</md-button>
                <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
            </md-list-item>

            <md-list-item md-expand v-for="item in dependenciesConfig" :key="item.columnDestiny" :id="item.columnDestiny">
                <span class="md-list-item-text">Referência: {{ item.columnReference }}<br>Destino: {{ item.columnDestiny }}</span>
                <md-icon class="excluir" @click.native="excluirItem(item)">delete</md-icon>

                <md-list slot="md-expand">
                    <md-list-item>
                        Coluna de Referência: {{ item.columnReference }}
                    </md-list-item>
                    <md-list-item>
                        Valores de Referência: {{ item.valuesReference }}
                        <md-icon class="modificar" @click.native="adicionarItem($event)">edit</md-icon>
                        <div class="md-layout md-gutter campo-adicionar">
                            <div class="md-layout-item">
                                <md-field>
                                    <label for="param">Coluna de Referência</label>
                                    <md-input name="param" class="input-field" :value="item.valuesReference" autocomplete="given-name"/>
                                </md-field>
                            </div>
                        </div>
                        <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event, item, 'valuesReference')">Adicionar</md-button>
                        <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
                    </md-list-item>
                    <md-list-item>
                        Match: {{ item.hasMatch }}
                    </md-list-item>
                    <md-list-item>
                        Coluna de Destino: {{ item.columnDestiny }}
                    </md-list-item>
                    <md-list-item>
                        Valores de Destino: {{ item.matches }}
                        <md-icon class="modificar" @click.native="adicionarItem($event)">edit</md-icon>
                        <div class="md-layout md-gutter campo-adicionar">
                            <div class="md-layout-item">
                                <md-field>
                                    <label for="param">Coluna de Referência</label>
                                    <md-input name="param" class="input-field" :value="item.matches" autocomplete="given-name"/>
                                </md-field>
                            </div>
                        </div>
                        <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event, item, 'matches')">Adicionar</md-button>
                        <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
                    </md-list-item>
                </md-list>

            </md-list-item>


        </md-list>

        <md-card-actions>
            <botao-submit @botaoAtivado="updateConfig()" nome_do_botao="Atualizar Dependências"></botao-submit>
        </md-card-actions>

    </md-card>
    
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

export default {
    name: 'DependencyConfig',
    components: {
        'titulo-principal': TituloAreaPrincipal,
        'botao-submit': BotaoSubmitForm,
        'usuario-invalido': InvalidUserAlert
    },
    data() {
        return {
            tituloResposta: 'Resposta',
            statusCode: null,
            showAuthAlert: false,
            show_load: false,
            dependenciesConfig: [],
            configJson: {},
            select_hasMatch: {},
            add_dependency_select_columnReference: '',
            add_dependency_select_columnDestiny: '',
            add_hasMatch: '',
            showAuthAlert: false,
            show_load: false,
            showSnackbar: false
        }
    },
    methods: {
        adicionarDependencia(event) {
            const divAdd = event.target.parentNode.parentNode.parentNode;
            const valuesReference = divAdd.querySelector('#add_valuesReference').value.split(',');
            const matches = divAdd.querySelector('#add_matches').value.split(',');
            divAdd.querySelector('#add_valuesReference').value = '';
            divAdd.querySelector('#add_matches').value = '';
            this.dependenciesConfig.push({
                columnReference: this.add_dependency_select_columnReference,
                columnDestiny: this.add_dependency_select_columnDestiny,
                matches: matches,
                valuesReference: valuesReference,
                hasMatch: this.add_hasMatch === "True" ? true : false
            });
            this.add_dependency_select_columnReference = '';
            this.add_dependency_select_columnDestiny = '';
            this.add_matches = '';
            this.add_valuesReference = '';
            this.add_hasMatch = '';
            divAdd.querySelectorAll('.campo-adicionar').forEach(field => {
                field.style.display = 'none';
            });
            divAdd.querySelector('.botao-adicionar').style.display = 'none';
            divAdd.querySelector('.botao-cancelar').style.display = 'none';
        },
        adicionarItem(event) {
            const addField = event.target.parentNode;
            addField.querySelectorAll('.campo-adicionar').forEach(field => {
                field.style.display = 'inline-flex';
            });
            addField.querySelector('.botao-adicionar').style.display = 'inline-flex';
            addField.querySelector('.botao-cancelar').style.display = 'inline-flex';
        },
        confirmar(event, objectConfig, field) {
            const objectToModify = this.dependenciesConfig.filter(dependency => JSON.stringify(dependency) === JSON.stringify(objectConfig))[0];
            const divAdd = event.target.parentNode.parentNode.parentNode;
            const inputValue = divAdd.querySelector('input.input-field').value;
            objectToModify[field] = inputValue.split(',');
            divAdd.querySelectorAll('.campo-adicionar').forEach(field => {
                field.style.display = 'none';
            });
            divAdd.querySelector('.botao-adicionar').style.display = 'none';
            divAdd.querySelector('.botao-cancelar').style.display = 'none';
        },
        excluirItem(objectConfig) {
            this.dependenciesConfig = this.dependenciesConfig.reduce((acc, cur) => {
                if(JSON.stringify(cur) !== JSON.stringify(objectConfig)) {
                    acc.push(cur);
                }
                return acc;
            }, []);
        },
        cancelar(event) {
            const divField = event.target.parentNode.parentNode.parentNode;
            divField.querySelectorAll('.campo-adicionar').forEach(field => {
                field.style.display = 'none';
            });
            divField.querySelector('.botao-adicionar').style.display = 'none';
            divField.querySelector('.botao-cancelar').style.display = 'none';
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
                if(response.status === 403) {
                    throw new Error('Você não possui permissão para realizar esta ação!');
                }
                this.snackbar_message = 'Configuração atualizada com sucesso!';
                this.showSnackbar = true;
                this.statusCode = response.status;
            }).catch((err) => {
                this.showAuthAlert = this.isAuthError(this.statusCode);
                this.snackbar_message = 'Erro ao atualizar a configuração!';
                this.showSnackbar = true;
            }).finally(() => {
                this.show_load = false;
            });
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
        }).then((data) => {
            this.show_load = false;
            delete data.insertTime;
            this.dependenciesConfig = data.dependenciesConfig;
            delete data.dependenciesConfig;
            this.configJson = data;
        }).catch((err) => {
            this.showAuthAlert = this.isAuthError(this.statusCode);
            console.log(err);
        });
    },
}

</script>

<style scoped>

    .card {
        margin-left: 50px;
    }

    .adicionar {
        color: green;
        font-size: 20px;
        cursor: pointer;
        user-select: none;
    }

    .modificar {
        font-size: 20px;
        cursor: pointer;
        user-select: none;
    }

    .botao-adicionar,
    .botao-cancelar,
    .campo-adicionar {
        display: none;
    }

    .load {
        margin-top: 50px;
        text-align: center;
    }

</style>