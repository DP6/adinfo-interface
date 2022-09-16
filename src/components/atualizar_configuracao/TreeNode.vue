<template>
  <div>
    <div v-if="!hasChildren">
        <md-list-item :id="path + '/' + parentName" :style="nodeMargin">
            <md-icon class="excluir" @click.native="excluirItem(path + '/' + parentName)">delete</md-icon>
            <span class="md-list-item-text">{{this.parentName}}: {{this.node}}</span>
        </md-list-item>
    </div>
    <div v-else>
        <md-list-item md-expand :id="path + '/' + parentName" :style="nodeMargin">
            <md-icon 
                class="excluir"   
                @click.native="excluirItem(path + '/' + parentName)"
            >delete</md-icon>
            <span class="md-list-item-text">{{ this.parentName }}</span>
            <md-icon 
                @click.native="adicionarItem($event, path + '/' + parentName)"
                :id="path + '/' + parentName" 
                class="adicionar"
            >add</md-icon>
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
  computed: {
        hasChildren() {
        return typeof this.node === 'object';
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
            return;
        },
        adicionarItem(event, path) {
            console.log(path);
            console.log(event);
            return;
        },
        confirmar(event) {
            console.log(event)
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
    padding-right: 20px;
    right: 50px;
}

.botao-adicionar,
.botao-cancelar,
.campo-adicionar {
    /* display: none; */
}

</style>