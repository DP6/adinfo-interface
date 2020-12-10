<template>
  <div id="app">
    <login-screen></login-screen>
    <menu-lateral :routes="routes">
    </menu-lateral>
    <div class="area-principal">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Login from './components/login/LoginScreen.vue';
import MenuLateral from './components/shared/menu_lateral/MenuLateral.vue';
import { routes } from './routes';
export default {
  components: {
    'login-screen': Login,
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
