<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-width="80px"
      :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username" placeholder="admin"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password" placeholder="123456"></el-input>
      </el-form-item>
      <el-button
        @click.prevent="handleLogin"
        type="primary" class="login-btn">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'login.vue',
    data() {
      return {
        formdata: {
          username:'',
          password:''
        }
      }
    },
    methods: {
      //登录请求
      // handleLogin() {
      //   this.$http.post('login',this.formdata).then(res => {
      //     console.log(res)
      //     const {
      //       data,
      //       meta:{msg,status}
      //     } = res.data
      //     // console.log(data)
      //     // console.log(msg)
      //     if(status === 200) {
      //       //登录成功 跳转页面
      //       this.$router.push({name:'home'})
      //       //提示成功
      //       this.$message.success(msg);
      //     }else  {
      //       this.$message.warning(msg);
      //     }
      //   })
      // }

      //用ES7 async await让异步代码看起来同步一样，函数前加async
     async handleLogin() {
       //找到异步操作有结果的代码前面加await  同时接受异步操作的结果
       //找到距离异步操作有结果的代码最近的方法， 前面加上async
        const res = await this.$http.post('login',this.formdata)
       console.log(res)
          const {
            data,
            meta:{msg,status}
          } = res.data
          if(status === 200) {
            //登录成功
            //保存token到浏览器，这样不登录也能够直接到home页面
            localStorage.setItem('token',data.token)
            // 跳转页面
            this.$router.push({name:'home'})
            //提示成功
            this.$message.success(msg);
          }else  {
            this.$message.warning(msg);
          }

      }
    }
  }
</script>

<style scoped>
  .login-wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-wrap .login-form {
    width: 400px;
    background-color: #ffffff;
    border-radius: 5px;
    padding: 30px;
  }
  .login-wrap .login-form h2 {
    text-align: center;
    padding-bottom: 20px;
  }
  .login-wrap .login-form .login-btn {
    width: 100%;
  }
</style>
