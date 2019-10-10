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
        <el-input @clear="loadUserList()" clearable placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchUser()"
          ></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
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
          <el-button
            size="mini"
            plain="true"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox()"
          ></el-button>
          <el-button size="mini" plain="true" type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
<!--    4.分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2,4,6,8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
<!--弹出添加用户框-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

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

        //添加用户框的属性
        dialogFormVisibleAdd:false,
        //添加用户表单数据
        form: {
          username:'',
          password:'',
          email:'',
          mobile:''
        }
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      //添加用户
      showAddUserDia() {
        this.dialogFormVisibleAdd = true
      },
      //点击确定添加用户发送请求
      async addUser() {
        //关闭对话框
        this.dialogFormVisibleAdd = false
        //获取异步数据
        const res = await this.$http.post(`users`,this.form)
        const {meta:{status,msg},data} = res.data
        if(status === 201) {
          this.$message.success(msg)
          //重新获取数据
          this.getUserList()
          //清空文本框
          this.form = {}
          //其它方式重置对象为空
          // for(const key in this.form) {
          //   if(this.form.hasOwnProperty(key)) {
          //     this.form[key] = ""
          //   }
          // }
        }else {
          this.$message.warning(msg)
        }
      },
      //删除提示框
      showDeleUserMsgBox() {
        this.$confirm('删除该用户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
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
      },
      //分页相关的方法 来自element文档
        //选择每页条数变化时触发
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`)
          this.pagesize = val
          this.getUserList()
        },
        //当前页变化时触发
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`)
          this.pagenum = val
          this.getUserList()
        },
      //搜索用户
      searchUser() {
        this.getUserList()
      },
      //清空输入框，重新获取数据
      loadUserList() {
        this.getUserList()
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
