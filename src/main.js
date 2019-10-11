import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
//MyBread其实是组件选项所在的对象
import MyBread from './components/cuscom/myBread'
import MyServerHttp from './plugins/http'
import moment from 'moment'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(MyServerHttp)

//全局过滤器，使用时间处理类库
Vue.filter('fmtdate',(v) => {
  return moment(v).format('YYYY-MM-DD')
})

//全局使用自定义组件
Vue.component('my-bread',MyBread)

// 全局组件注册方式：Vue.component(组件名,{方法})
// 1.全局组件必须写在Vue实例创建之前，才在该根元素下面生效；
// 2.模板里面第一级只能有一个标签，不能并行；
// 案例
// Vue.component("my-component",{
//   template:"<h1>我是全局组件</h1>"
// });


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
