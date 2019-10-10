import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login'
import AA from '../components/aa/aa'

Vue.use(Router)

export default new Router({
  routes: [
    { name:'login',
      path: '/login',
      component:Login
    },
    {
      name: 'AA',
      path: '/aa',
      component: AA
    }
  ]
})
