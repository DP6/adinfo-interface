<template>
  <div id="app">
    <menu-lateral :routes="routes">
    </menu-lateral>
    <div class="area-principal">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import MenuLateral from './components/shared/menu_lateral/MenuLateral.vue';
import { routes } from './routes';
export default {
  components: {
    'menu-lateral': MenuLateral
  },
  data() {
    return {
      routes
    }
  }
}
</script>

<style scoped>

  #app {
    display: flex;
    flex-wrap: wrap;
  }

  .area-principal {
    width: calc(95% - 300px);
    margin-left: 300px;
  }

</style>
