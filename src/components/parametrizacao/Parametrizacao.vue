<template>
    <div>
        <titulo-principal titulo="Parametrização"></titulo-principal>
        <form class="md-layout">
            <md-card class="md-layout-item md-larger-size">
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('company')">
                                <label for="company">Empresa</label>
                                <md-input name="company" id="company" v-model="form.company"/>
                                <span class="md-error" v-if="!$v.form.company.required">The first name is required</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-100">
                            <md-field :class="getValidationClass('agency')">
                                <label for="agency">Agência</label>
                                <md-input name="agency" id="agency" v-model="form.agency"/>
                                <span class="md-error" v-if="!$v.form.agency.required">The first name is required</span>
                            </md-field>
                        </div>
                        <div class="md-layout-item md-medium-size-100">
                            <md-field>
                                <label>Upload files</label>
                                <md-file v-model="file" id="file" placeholder="Anexar Arquivo" />
                            </md-field>
                        </div>
                    </div>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-medium-size-100">
                            <md-field>
                                <label for="tool">Mídia</label>
                                <md-select v-model="tool" name="tool" id="tool">
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
                </md-card-content>
                <md-card-actions>
                    <botao-submit @botaoAtivado="build()" nome_do_botao="Parametrizar"></botao-submit>
                </md-card-actions>
            </md-card>
        </form>
        <div class="resposta" v-show="visibilidadeResposta">
            <titulo-principal :titulo="tituloResposta"></titulo-principal>
            <div class="tabela-resposta">
                {{ respostaAPI }}
                <md-card md-card v-show="visibilidadePrevia">
                    <md-table  md-height="300px" class="previa" md-fixed-header v-model="tabela" >
                        <md-table-toolbar>
                            <h1 class="md-title">Colunas</h1>
                        </md-table-toolbar>

                        <md-table-row slot="md-table-row" slot-scope="{ item }">
                            <md-table-cell v-for="titulo in previaTitulo" :md-label="titulo">{{ item[titulo] }}</md-table-cell>
                        </md-table-row>

                    </md-table>
                    <md-button @click="downloadParametrizacao()" class="md-dense md-raised md-primary button-download">Download Parametrização</md-button>
                </md-card>
            </div>
        </div>
    </div>
</template>

<script>

import TituloAreaPrincipal from '../shared/titulo_area_principal/TituloAreaPrincipal.vue';
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
        'botao-submit': BotaoSubmitForm
    },
    data() {
        return {
            form: {
                agency: null,
                company: null
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
            file: null
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
            file: {
                required,
                minLength: minLength(3)
            }
        }
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
            const url = `https://adinfo.ue.r.appspot.com/build/${this.tool}`
            // fetch(url, {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         agency: document.querySelector('#agency').value,
            //         file: 'bigodaria-202009021901',
            //         company: document.querySelector('#company').value
            //     }
            const formdata = new FormData();
            formdata.append("data", document.querySelector('#file').files[0]);
            formdata.append("company", document.querySelector('#company').value);
            formdata.append("agency", document.querySelector('#agency').value);
            const requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            fetch(url, requestOptions)
            .then(response => {
                if(response.status === 200) {
                    return response.blob();
                } else {
                    return response.json();
                }
            }).then(file => {
                if(file.message) throw new Error(file.message);
                this.builderFile = file;
                return file.text();
            }).then(textInFile => {
                const csvSeparator = /;/.test(textInFile) ? ';' : ',';
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
                this.visibilidadeResposta = true;
                this.tituloResposta = 'Falha na requisição';
                this.respostaAPI = err;
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
        }
    }
}

</script>

<style scoped>

    form {
        margin-left: 50px;
    }

    .previa div.md-table-content {
        max-height: 300px;
    }

    .tabela-resposta {
        margin-left: 50px;
    }

</style>