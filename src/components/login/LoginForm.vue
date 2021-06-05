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
          <input type="password" v-model="token" class="form-control" placeholder="Token...">
        </div>
      </div>
      <div class="text-center">
        <a @click="saveToken(), getUserInfos()" class="btn btn-primary btn-link btn-wd btn-lg">
          Login
          <!-- <router-link to="/interface">Login</router-link> -->
        </a>
      </div>
      <usuario-invalido :active="showAuthAlert"  v-on:setShowAlertFalse="setShowAlertFalse()" >
      </usuario-invalido>
    </form>
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
      show_load: false
    }
  },
  methods: {
    saveToken() {
      localStorage.setItem("userToken", this.token);
    },
    redirect(){
      this.$router.push('template');
    },
    getUserInfos() {
      this.show_load = true;
      var statusCode = null;
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
        const userData = JSON.parse(response.responseText);
        localStorage.setItem('company', userData.company);
        localStorage.setItem('agency', userData.agency);
        localStorage.setItem('permission', userData.permission);
        this.redirect();
      }).catch((err) => {
        this.showAuthAlert = this.isAuthError(statusCode);
        console.log(err);
      }).finally(() => {
        this.show_load = false
      });
    },
    isAuthError(statusCode) {
      if(statusCode === 403)
          return true;
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