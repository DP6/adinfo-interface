import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueMaterial from 'vue-material';
import { routes } from './routes';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';


Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.use(Vuelidate);

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
