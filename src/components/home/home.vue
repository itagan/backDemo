<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
          <img src="../../assets/img/my.png" alt="无法显示图片" class="myimg">
        </div>
        </el-col>
        <el-col :span="18" class="middle">
            <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="2"><div class="grid-content bg-purple">
          <a href="#" class="loginout" @click.prevent="handleSignout()">退出</a>
        </div></el-col>
      </el-row>
    </el-header>
    <el-container>

      <el-aside width="200px" class="aside">
        <el-menu
          :unique-opened="true"
          :router="true"
        >
<!--          el-submenu是一个导航组，里面分上下，上面标题等，下面是具体选项-->
<!--          el-submenu index如果是一样的话，那么点开一个，其它也会展开的-->

          <el-submenu
            :index="''+item1.order"
            v-for="(item1,index) in menus"
            :key="index">

            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>

                <el-menu-item
                  :index="item2.path"
                  v-for="(item2,index) in item1.children"
                  :key="index">
                  <i class="el-icon-circle-check"></i>
                  <span>{{item2.authName}}</span>
                </el-menu-item>
          </el-submenu>

<!--          <el-submenu index="2">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>权限管理</span>-->
<!--            </template>-->
<!--            <el-menu-item index="role">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>角色列表</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="rights">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>权限列表</span>-->
<!--            </el-menu-item>-->
<!--          </el-submenu>-->

<!--          <el-submenu index="3">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>商品管理</span>-->
<!--            </template>-->
<!--            <el-menu-item index="1-1">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>商品列表</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="1-1">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>分类参数</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="1-1">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>商品分类</span>-->
<!--            </el-menu-item>-->
<!--          </el-submenu>-->

<!--          <el-submenu index="4">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>订单管理</span>-->
<!--            </template>-->
<!--            <el-menu-item index="1-1">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>订单列表</span>-->
<!--            </el-menu-item>-->
<!--          </el-submenu>-->

<!--          <el-submenu index="5">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>数据统计</span>-->
<!--            </template>-->
<!--            <el-menu-item index="1-1">-->
<!--              <i class="el-icon-location"></i>-->
<!--              <span>数据报表</span>-->
<!--            </el-menu-item>-->
<!--          </el-submenu>-->

        </el-menu>
      </el-aside>

      <el-main class="main">
        <router-view></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'home.vue',
    data() {
      return {
        menus:[]
      }
    },
    beforeCreate () {
      //获取token   注意是字符串键key
      // const token = localStorage.getItem('token')
      // if(!token) {
      //   //token没有 =》回到登录
      //   this.$router.push({name:'login'})
      // }

      //路由设置那里设置了导航守卫，顺便取代本功能了
    },
    created() {
      this.getMenus()
    },
    methods: {
      //获取导航数据
      async getMenus() {
        const res = await this.$http.get(`menus`)
        // console.log(res)
        this.menus = res.data.data
      },
      handleSignout() {
        //清除token
        localStorage.clear()
        //提示
        this.$message.success('退出成功')
        //来到登录页面
        this.$router.push({name:'login'})
      }
    }
  }
</script>

<style scoped>
  .container {
    height: 100%;
  }

  .header {
    background-color: #b3c0d1;
  }
  .header .myimg {
    height: 60px;
    width: 80px;
  }

  .aside {
    background-color: #d3dce6;
  }

  .main {
    background-color: #e9eef3;
    height: 100%;
  }

  .middle {
    text-align: center;
    color: red;
  }
  .loginout {
    line-height: 60px;
    text-decoration: none;
  }

</style>
