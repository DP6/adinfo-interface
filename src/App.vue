<template>
  <div id="app">
    <menu-lateral :routes="routes">
    </menu-lateral>
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

</style>
