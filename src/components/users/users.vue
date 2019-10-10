<template>
  <el-card class="box-card">
<!--    1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--    2.搜索  一行三列 再套用ui组件-->
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success">添加用户</el-button>
      </el-col>
    </el-row>
<!--    3.表格-->
    <el-table
      :data="userlist"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="60">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>

      <el-table-column
        label="创建时间">
        <template v-slot:default="scope">
          {{scope.row.create_time | fmtdate}}
        </template>

      </el-table-column>

      <el-table-column
        label="用户状态">
        <template v-slot:default="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        label="操作">
        <template v-slot:default="scope">
          <el-button size="mini" plain="true" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain="true" type="success" icon="el-icon-check" circle></el-button>
          <el-button size="mini" plain="true" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    4.分页-->
  </el-card>
</template>

<script>
  export default {
    name: 'users.vue',
    data() {
      return {
        query:'',
        //表格绑定的数据
        userlist:[],
        //分页相关的数据
        total:-1,
        pagenum:1,
        pagesize:2,
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌  https://www.kancloud.cn/yunye/axios/234845
        this.$http.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        console.log(res)
        const {meta:{status,msg},data:{users,total}} = res.data
        if(status === 200) {
          this.userlist = users
          this.total = total
          this.$message.success(msg)
        }else {
          this.$message.warning(msg)
        }
      }
    }
  }
</script>

<style scoped>
  .box-card {
    width: 100%;
  }
  .searchRow {
    margin-top: 20px;
  }
  .inputSearch {
    width:300px;
  }
</style>
