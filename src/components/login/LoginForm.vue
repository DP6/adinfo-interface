<template>
  <div>
    <form id="app" class="form" method="" action="">
      <div class="card-header card-header-primary text-center">
        <h4 class="card-title">Login</h4>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="material-icons">lock_outline</i>
            </span>
          </div>
          <input type="password" v-model="token" class="form-control samsung-input" placeholder="Token..." @keydown.enter.stop.prevent="saveToken(), getUserInfos()">
        </div>
      </div>
      <div class="text-center">
        <a @click="saveToken(), getUserInfos()" class="login-btn btn btn-link btn-wd btn-lg">
          Login
          <!-- <router-link to="/interface">Login</router-link> -->
        </a>
      </div>
      <usuario-invalido :active="showAuthAlert"  v-on:setShowAlertFalse="setShowAlertFalse()" >
      </usuario-invalido>
    </form>
    <md-dialog-alert
      :md-active.sync="apiError"
      md-title="Erro ao fazer login"
      :md-content="apiErrorMessage" />
    <div class="load" v-show="show_load">
      <md-progress-bar class="barra" md-mode="indeterminate"></md-progress-bar>
    </div>
  </div>
</template>

<script>
import InvalidUserAlert from '../shared/login/InvalidUser.vue';
export default {
  name: 'app',
  components: {
    'usuario-invalido': InvalidUserAlert
  },
  data () {
    return {
      token: '',
      showAuthAlert: false,
      show_load: false,
      apiError: false,
      apiErrorMessage: ''
    }
  },
  methods: {
    saveToken() {
      localStorage.setItem("userToken", this.token);
    },
    redirect(){
      this.$router.push('parametrizacao');
    },
    getUserInfos() {
      this.show_load = true;
      let statusCode = null;
      fetch(`${this.$apiRoute}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: this.token
        }
      }).then((response) => {
        statusCode = response.status;
        return response.json();
      }).then((response) => {
        if(statusCode !== 200) {
          throw new Error(response.responseText);
        }
        const userData = JSON.parse(response.responseText);
        localStorage.setItem('company', userData.company);
        localStorage.setItem('agency', userData.agency);
        localStorage.setItem('permission', userData.permission);
        this.redirect();
      }).catch((err) => {
        this.apiErrorMessage = err.message;
        this.showAuthAlert = this.isAuthError(statusCode);
      }).finally(() => {
        this.show_load = false
      });
    },
    isAuthError(statusCode) {
      if(statusCode === 403)
        return true;
      this.apiError = true;
      return false;
    },
    setShowAlertFalse(){
      this.showAuthAlert = false;
    },
    setShowAlertFalse(){
      this.showAuthAlert = false;
    }
  }
}

</script>

<style scoped>
  .load {
    margin-top: 10px;
    text-align: center;
  }
  .barra {
    border-bottom-left-radius: 250px;
    border-bottom-right-radius: 250px;
  }
  .card-header {
    background: #1428A0;
  }
  .login-btn {
    color: #001522;
    font-weight: 600;
    letter-spacing: 2px;
  }
  .form-control:focus, .is-focused {
    background-image: linear-gradient(to top,  #1428A0 2px, rgba(156, 39, 176, 0) 2px), linear-gradient(to top, #1428A0 1px, rgba(210, 210, 210, 0) 1px)
  }
</style>