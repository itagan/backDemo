
import axios from 'axios'
const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://39.108.193.251:8888/api/private/v1/'
  // axios.defaults.baseURL = 'http://api.xiaomadagege.cn:8888/api/private/v1/'

  // 4. 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer
