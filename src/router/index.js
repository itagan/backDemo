import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login'
import Home from '../components/home/home'
import Users from '../components/users/users'
import Right from '../components/rights/right'
import Role from '../components/rights/role'
import { Message } from 'element-ui'
import Goodslist from '../components/goods/goodslist'

Vue.use(Router)

const router = new Router({
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
        },
        {
          name:'roles',
          path:'/roles',  //el-menu-item index="rights" 需要匹配Index
          component:Role
        },
        {
          name:'goods',
          path:'goods',
          component:Goodslist   //**component别加s**
        },
      ]
    }
  ]
})

//在路由配置生效之前 统一判断toekn
//路由守卫 在路由配置生效之前
//路由/导航 守卫
router.beforeEach((to, from, next) => {
  // to  要去的路由配置
  //from  当前的路由配置
  //next 有这个才能进行下一步操作  让to的路由配置继续生效

  //如果要去的是登录  -》next()
  //如果要去的不是登录
  //判断 token
  // 如果没有token =》login登录
  //如果有token -》  next（）
  if(to.path === '/login') {
    next()
  }else {
    const token = localStorage.getItem('token')
    if(!token) {
      //加个提示框，需要单独引用element
      Message.warning('回到登录页！')
      // this.$router.push() 不用这个，因为这个不是vue文件，而this是指当前vue实例
      //router这里是路由对象 this.$router也是指对象
      router.push({
        name:'login'
      })
      return //直接跳过，不再执行下文  这样不必写else了
    }
  next()  //如果有token -》  next（）
  }
  // console.log(to,from)
  // next()
})

export default router
