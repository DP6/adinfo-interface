<template>
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
      var statusCode = null;
      fetch(`${this.$apiRoute}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          token: this.token
        }
      }).then(function(response) {
        statusCode = response.status;
        return response.json();
      }).then((userData) => {
        localStorage.setItem('company', userData.company);
        localStorage.setItem('agency', userData.agency);
        localStorage.setItem('permission', userData.permission);
        this.redirect()
      }).catch((err) => {
        console.log(this.isAuthError(statusCode))
        this.showAuthAlert = this.isAuthError(statusCode);
        console.log(err);
      });
    },
    isAuthError(statusCode){
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
