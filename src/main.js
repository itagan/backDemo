import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
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

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
