<template>
 <div id="interface">
    <menu-lateral :routes="routes">
    </menu-lateral>
    <div class="area-principal">
        <router-view>
        </router-view>
    </div>
  </div>
</template>

<script>
import MenuLateral from '../components/shared/menu_lateral/MenuLateral.vue';
import { routes } from '../routes';
export default {
  components: {
    'menu-lateral': MenuLateral,
  },
  data() {
    return {
      routes
    }
  },
  created() {
    if(localStorage.getItem('userToken')) {
     if(this.$router.currentRoute.fullPath !== '/parametrizacao') {
      this.$router.push('parametrizacao');
     }
    } else {
      this.$router.push('login');
    }
  }
}
</script>

<style scoped>

    #interface {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 100%;
    }

    .area-principal {
        width: calc(95% - 300px);
        margin-left: 300px;
    }

</style>
