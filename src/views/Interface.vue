<template>
 <div id="interface">
    <menu-lateral :routes="routes">
    </menu-lateral>
    <div class="area-principal">
        <botao-logout></botao-logout>
        <router-view>
        </router-view>
    </div>
  </div>
</template>

<script>
import MenuLateral from '../components/shared/menu_lateral/MenuLateral.vue';
import BotaoLogout from '../components/shared/botao_logout/BotaoLogout.vue'
import { routes } from '../routes';
export default {
  components: {
    'menu-lateral': MenuLateral,
    'botao-logout': BotaoLogout,
  },
  data() {
    return {
      routes
    }
  },
  created() {
    this.redirectIfHasNoToken ()
  },
  methods: {
        redirectIfHasNoToken (){
          if (!localStorage.getItem('userToken')){
            this.redirectLogin();
          }
        },
        redirectLogin (){
          this.$router.push('login');
        },
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
