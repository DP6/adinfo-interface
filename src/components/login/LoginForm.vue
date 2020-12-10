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
      <a @click="saveToken(), redirect()" class="btn btn-primary btn-link btn-wd btn-lg">Confirmar</a>
    </div>
  </form>
    <!-- text -->
<!-- <form id="app">
    <p>
      <input type="password" v-model="token" @keyup.enter="saveToken">
    </p>
  </form> -->
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      token: ''
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
