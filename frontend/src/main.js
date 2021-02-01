import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import axios from 'axios';

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:5555'

new Vue({
  render: h => h(App),
}).$mount('#app')
