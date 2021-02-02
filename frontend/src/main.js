import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import axios from 'axios';
import router from './router'

import { BIconPlusCircle, BIconXCircle } from 'bootstrap-vue'
Vue.component('b-icon-plus-circle', BIconPlusCircle)
Vue.component('b-icon-x-circle', BIconXCircle)

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:5555'

Vue.mixin({
  methods: {
    toast(title, message, autohide = true) {
      let options = {
          title: title,
          toaster: 'b-toaster-bottom-right',
          noAutoHide: !autohide
        }
      autohide? null : options.id = title
      this.$bvToast.toast(message, options)
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
