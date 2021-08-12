<template>
  <div>
    <form id="app" class="form" method="" action="">
      <div class="card-header card-header-primary text-center">
        <h4 class="card-title">Login</h4>
      </div>
      <div class="card-body">
        <!-- <div class="input-group"> -->
          <!-- <div class="input-group-prepend"> -->
            <!-- <span class="input-group-text">
              <i class="material-icons">lock_outline</i>
            </span> -->
          <!-- </div> -->
          <span class="input-group-text">
            <input type="text" v-model="email" class="form-control" placeholder="Email">
          </span>
          <span class="input-group-text">
            <input type="password" v-model="senha" class="form-control" placeholder="Senha..." @keydown.enter.stop.prevent="getUserInfos()">
          </span>
        <!-- </div> -->
      </div>
      <div class="text-center">
        <a @click="getUserInfos()" class="btn btn-primary btn-link btn-wd btn-lg">
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
      senha: '',
      email: '',
      showAuthAlert: false,
      show_load: false,
      apiError: false,
      apiErrorMessage: ''
    }
  },
  methods: {
    redirect(){
      this.$router.push('parametrizacao');
    },
    getUserInfos() {
      this.show_load = true;
      let statusCode = null; 
      const formdata = new FormData();
      formdata.append("email", this.email);
      formdata.append("password", this.senha);
      fetch(`${this.$apiRoute}/login`, {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      }).then((response) => {
        statusCode = response.status;
        localStorage.setItem('userToken', response.headers.get('Authorization'));
        return statusCode === 204 ? undefined : response.json();
      }).then((response) => {
        if(statusCode !== 204) {
          throw new Error(response.responseText);
        }
        return fetch(`${this.$apiRoute}/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('userToken'),
          }
        });
      }).then((response) => {
        statusCode = response.status;
        return response.json();
      }).then((data) => {
        if(statusCode !== 200) {
            throw new Error(data.responseText);
        }
        localStorage.setItem('permission', JSON.parse(data.responseText).permission);
        this.redirect();
      }).catch((err) => {
        console.log(err);
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
</style>