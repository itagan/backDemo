import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login'
import Home from '../components/home/home'
import Users from '../components/users/users'
import Right from '../components/rights/right'

Vue.use(Router)

export default new Router({
  routes: [
    { name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children:[
        {
          name:'users',
          path:'users',
          component:Users   //**component别加s**
        },
        {
          name:'right',
          path:'/rights',  //el-menu-item index="rights" 需要匹配Index
          component:Right
        }
      ]
    }
  ]
})
