import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RateLimitTestingPage from '../views/RateLimitTestingPage.vue'
import ChartsPage from '../views/ChartsPage.vue'
import TablePage from '../views/TablePage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/rate-limit-test',
    name: 'RateLimit',
    component:RateLimitTestingPage
  },
  {
    path: '/charts',
    name: 'ChartsPage',
    component:ChartsPage
  },
  {
    path: '/table',
    name: 'TablePage',
    component:TablePage
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

export default router
