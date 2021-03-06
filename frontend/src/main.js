import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import axios from 'axios';
import router from './router'

import { BIconPlusCircle, BIconXCircle, BIconThreeDots, BIconArrowDown, BIconGrid3x3, BIconGraphUp, BIconEnvelope, BIconArrowCounterclockwise, BIconSearch } from 'bootstrap-vue'
Vue.component('b-icon-plus-circle', BIconPlusCircle)
Vue.component('b-icon-x-circle', BIconXCircle)
Vue.component('b-icon-three-dots', BIconThreeDots)
Vue.component('b-icon-arrow-down', BIconArrowDown)
Vue.component('b-icon-grid', BIconGrid3x3)
Vue.component('b-icon-graph-up', BIconGraphUp)
Vue.component('b-icon-envelope', BIconEnvelope)
Vue.component('b-icon-refresh', BIconArrowCounterclockwise)
Vue.component('b-icon-search', BIconSearch)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'ws-product-node-js'
  next();
})

Vue.config.productionTip = false
axios.defaults.baseURL = 'https://api.kylegrimsrudma.nz'

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
