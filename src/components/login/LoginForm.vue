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
      <router-link to="/template" @click="saveToken()" class="btn btn-primary btn-link btn-wd btn-lg">
        Login
        <!-- <router-link to="/interface">Login</router-link> -->
      </router-link>
    </div>
  </form>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      token: '',
      show: true
    }
  },
  methods: {
    saveToken() {
      localStorage.setItem("userToken", this.token);
    },
    redirect(){
      this.$router.push('template');
    }
  }
}

</script>
