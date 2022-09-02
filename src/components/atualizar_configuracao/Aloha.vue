<template>
  <ul class="folders">
    <li>Configuração TONETTAO</li>
    <folder v-bind:folder="folder"></folder>
  </ul>
</template>


<script>
import Folder from './Folder.vue';

export default {
  name: 'root',
  props: {
    folder: Object
  },
  components: {
    Folder
  }
};
</script>

<style scoped>
ul.folders {
  padding: 1rem;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  list-style: none
}
ul.folders > li:first-child {
  padding: 1rem 1rem 1rem 0
}

</style>