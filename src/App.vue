<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Login from './views/Login.vue';
import MenuLateral from './components/shared/menu_lateral/MenuLateral.vue';
import { routes } from './routes';
export default {
  components: {
    'login-screen': Login,
    'menu-lateral': MenuLateral
  },
  data() {
    return {
      routes,
    }
  }
}
</script>

<style scoped>

  #app {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
  }

  .area-principal {
    width: calc(95% - 300px);
    margin-left: 300px;
  }

</style>
