<template>
  <div>
    <div v-if="!hasChildren && plotable">
        <md-list-item :id="path + '/' + parentName" :style="nodeMargin">
            <md-icon class="excluir" @click.native="excluirItem(path + '/' + parentName)">delete</md-icon>
            <span class="md-list-item-text">{{this.parentName}}: {{this.node}}</span>
        </md-list-item>
    </div>
    <div v-else-if="plotable">
        <md-list-item md-expand :id="path + '/' + parentName" :style="nodeMargin">
            <md-icon 
                class="excluir"   
                @click.native="excluirItem(path + '/' + parentName)"
            >delete</md-icon>
            <span class="md-list-item-text">{{ this.parentName }}</span>
            <md-icon 
                @click.native="adicionarItem($event), $event.stopPropagation()"
                :id="path + '/' + parentName" 
                class="adicionar"
                v-if="(
                    !!this.toolsFixedOptions[this.parentName] 
                    && this.toolsFixedOptions[this.parentName].length !== Object.keys(node).length
                )
                || !this.toolsFixedOptions[this.parentName]
                || this.parentName === 'columns'"
            >add</md-icon>
            <md-list-item 
                v-if="!!this.toolsFixedOptions[this.parentName] 
                && this.toolsFixedOptions[this.parentName].length !== Object.keys(node).length"
                @click="$event.stopPropagation()"
            >
                <div class="md-layout md-gutter campo-adicionar">
                    <div class="md-layout-item">
                        <md-field>
                            <label for="field">Campo</label>
                            <md-select name="field" class="select-field" v-model="inputValue">
                                <md-option
                                    v-for="option in this.toolsFixedOptions[this.parentName].filter(el => Object.keys(node).indexOf(el) === -1)"
                                    :key="option"
                                    :value="option"
                                >
                                    {{option}}
                                </md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>
                <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event)">Adicionar</md-button>
                <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
            </md-list-item>
            <md-list-item 
                v-else-if="!!this.path.match(/(mediaTaxonomy|analyticsTools)\/.+/gi)"
                @click="$event.stopPropagation()"
            >
                <div class="md-layout md-gutter campo-adicionar">
                    <div class="md-layout-item">
                        <md-field>
                            <label for="field">Campo</label>
                            <md-select name="field" class="select-field" v-model="inputValue">
                                <md-option
                                    v-for="option in this.toolsFixedOptions['columns'].filter(el => this.node.indexOf(el) === -1)"
                                    :key="option"
                                    :value="option"
                                >
                                    {{option}}
                                </md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>
                <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event)">Adicionar</md-button>
                <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
            </md-list-item>
            <md-list-item v-else @click="$event.stopPropagation()">
                <div class="md-layout md-gutter campo-adicionar">
                    <div class="md-layout-item">
                        <md-field>
                            <label for="field">Campo</label>
                            <md-input name="field" class="input-field" autocomplete="given-name" v-model="inputValue"/>
                        </md-field>
                    </div>
                </div>
                <md-button class="md-primary md-raised botao-adicionar"  @click="confirmar($event)">Adicionar</md-button>
                <md-button class="md-raised md-accent botao-cancelar" @click="cancelar($event)">Cancelar</md-button>
            </md-list-item>
            <md-list slot="md-expand" v-if="!isArray">
                <TreeNode
                    v-for="child in Object.keys(node)"
                    :key="child"
                    :node="node[child]"
                    :spacing="spacing + 10"
                    :parentName="child"
                    :parentNode="node"
                    :path="path + '/' + parentName"
                    :toolsFixedOptions="toolsFixedOptions"
                ></TreeNode>
            </md-list>
            <md-list slot="md-expand" v-else-if="!childIsArray">
                <md-list-item 
                    :id="path + '/' + parentName + '/' + item" 
                    v-for="item in this.node" 
                    :key="item" 
                    :style="nodeMargin"
                >
                    <md-icon 
                        class="excluir" 
                        @click.native="excluirItem(path + '/' + parentName + '/' + item)"
                    >delete</md-icon>
                    <span class="md-list-item-text">{{ item }}</span>
                </md-list-item>
            </md-list>
        </md-list-item>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TreeNode',
  props: {
    node: {
      type: Object,
      required: true
    },
    parentName: {
        type: String,
        required: false
    },
    spacing: {
        type: Number,
        default: 25
    },
    parentNode: {
        type: Object,
        default: false
    },
    path: {
        type: String,
        default: ''
    },
    toolsFixedOptions: {
        type: Object,
        required: true
    }
  },
  data() {
    return {
        inputValue: ''
    }
  },
  computed: {
        hasChildren() {
            return typeof this.node === 'object';
        },
        plotable() {
            return this.parentName !== 'version' && this.parentName !== 'dependenciesConfig';
        },
        isString() {
            return typeof this.node === 'string';
        },
        isArray() {
            return Array.isArray(this.node);
        },
        childIsArray() {
            return Array.isArray(this.child)
        },
        nodeMargin() {
            return {
                'padding-left': `${this.spacing}px`
            }
        }
    },
    methods: {
        excluirItem(path) {
            const target = path.split('/')[path.split('/').length - 1];
            delete this.parentNode[target];
            document.getElementById(path).remove();
            this.updateToolFixedOptions(path);
            return;
        },
        updateToolFixedOptions(path) {
            const pathSplit = path.split('/');
            const root = pathSplit[1];
            const target = pathSplit[pathSplit.length - 1];
            if(!!this.toolsFixedOptions[root]) {
                this.removeItemFromArray(target, this.toolsFixedOptions[root]);
            }
            if(Array.isArray(this.node)) {
                this.removeItemFromArray(target, this.node);
            }
        },
        removeItemFromArray(item, ar) {
            const index = ar.indexOf(item);
            if (index !== -1) {
                ar.splice(index, 1);
            }
        },
        adicionarItem(event) {
            event.target.style.display = 'none';
            event.target.parentNode.querySelector('.campo-adicionar').style.display = 'inline-flex';
            event.target.parentNode.querySelector('.botao-adicionar').style.display = 'inline-flex';
            event.target.parentNode.querySelector('.botao-cancelar').style.display = 'inline-flex';
            this.inputValue = '';
        },
        confirmar(event) {
            if(Array.isArray(this.node)) {
                this.node.push(this.inputValue);
            } else if(Object.keys(this.toolsFixedOptions).indexOf(this.parentName) > -1) {
                this.node[this.inputValue] = new Array();
            } else {
                this.node[this.inputValue] = {};
            }
            if(this.parentName === 'columns') {
                this.toolsFixedOptions['columns'].push(this.inputValue);
            }
            event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.adicionar').style.display = 'inline-flex';
            event.target.parentNode.parentNode.parentNode.querySelector('.campo-adicionar').style.display = 'none';
            event.target.parentNode.parentNode.parentNode.querySelector('.botao-adicionar').style.display = 'none';
            event.target.parentNode.parentNode.parentNode.querySelector('.botao-cancelar').style.display = 'none';
            this.inputValue = '';
        },
        cancelar(event) {
            event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.adicionar').style.display = 'inline-flex';
            event.target.parentNode.parentNode.parentNode.querySelector('.campo-adicionar').style.display = 'none';
            event.target.parentNode.parentNode.parentNode.querySelector('.botao-adicionar').style.display = 'none';
            event.target.parentNode.parentNode.parentNode.querySelector('.botao-cancelar').style.display = 'none';
            this.inputValue = '';
        }
    }
}

</script>

<style scoped>

.excluir {
    color: red;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
}

.adicionar {
    color: green;
    font-size: 20px;
    cursor: pointer;
    user-select: none;
    position: absolute;
    margin-right: 20px;
    width: 50px;
    right: 50px;
}

.botao-adicionar,
.botao-cancelar,
.campo-adicionar {
    display: none;
}

</style>