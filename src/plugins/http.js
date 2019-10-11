//封装axios插件
import axios from 'axios'
const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://39.108.193.251:8888/api/private/v1/'
  // axios.defaults.baseURL = 'http://api.xiaomadagege.cn:8888/api/private/v1/'
  // this.$http.defaults.headers.common['Authorization'] = localStorage.getItem('token')

  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log(config.url)
    if(config.url !== 'login') {
      //设置拦截
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] =AUTH_TOKEN
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });


  //  添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer
