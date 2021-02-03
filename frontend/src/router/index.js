import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RateLimitTestingPage from '../views/RateLimitTestingPage.vue'
import ChartsPage from '../views/ChartsPage.vue'
import TablePage from '../views/TablePage.vue'
import GeoPage from '../views/GeoPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component:Home,
    meta: {
      title:'🏠 Home [ws-product-node-js]'
    }
  },
  {
    path: '/rate-limit-test',
    name: 'RateLimit',
    component:RateLimitTestingPage,
    meta: {
      title:'🌐 Rate Limit Tester [ws-product-node-js]'
    }
  },
  {
    path: '/charts',
    name: 'ChartsPage',
    component:ChartsPage,
    meta: {
      title:'📈 Data Charts [ws-product-node-js]'
    }
  },
  {
    path: '/table',
    name: 'TablePage',
    component:TablePage,
    meta: {
      title:'🗃️ Data Tables [ws-product-node-js]'
    }
  },
  {
    path: '/geo',
    name: 'GeoPage',
    component:GeoPage,
    meta: {
      title:'🌎 Geo Visualization [ws-product-node-js]'
    }
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

export default router
