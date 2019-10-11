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
<!--    3.表格  默认自适应高度，可设置高度-->
    <el-table
      height="300px"
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
            @change = "changeMgState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column
        label="操作">
        <template v-slot:default="scope">
          <el-button
            size="mini"
            :plain="true"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            :plain="true"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(scope.row.id)"
          ></el-button>
          <el-button
            size="mini"
            :plain="true"
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetUserRoleDia(scope.row)"
          ></el-button>
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

    <!--弹出编辑用户框-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

<!--    分配角色对话框-->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          {{currUsername}}
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          {{currRoleId}}
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(item,i) in roles" :key="i" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
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
        userlist:[],   //相当于solt插入的scope ,若要获取该数组的某个，需要用scope.row
        //分页相关的数据
        total:-1,
        pagenum:1,
        pagesize:2,

        //添加用户框的属性
        dialogFormVisibleAdd:false,
        dialogFormVisibleEdit:false,
        dialogFormVisibleRol:false,
        //添加用户表单数据
        form: {
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        currRoleId:-1,  //分配角色，select绑定的数据跟options里value一样，才会显示options的label
        currUsername:'', //当前用户名
        roles:[], //保存所有角色数据
        currUserId:-1,//分配角色，当前用户id  点击事件没有能够传参，所以data绑定值传值
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      //修改分配角色
      async setRole() {
        const res = await this.$http.put(`users/${this.currUserId}/role`,{
          rid:this.currRoleId   //把当前分类的角色Id作为该用户的角色Id
        })
        //关闭对话框
        this.dialogFormVisibleRol = false

      },
      //分配角色点击弹出框
      async showSetUserRoleDia(user) {
        this.currUsername = user.username
        this.currUserId = user.id  //获取当前用户id
        //获取所有角色
        const res1 = await this.$http.get(`roles`)
        this.roles = res1.data.data

        //获取当前用户的角色id
        const res = await this.$http.get(`users/${user.id}`)
        this.currRoleId = res.data.data.rid
        this.dialogFormVisibleRol = true

      },
      //修改状态
      async changeMgState(user) {
        const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        console.log(res)
      },
      //添加用户
      showAddUserDia() {
        this.dialogFormVisibleAdd = true
        //开始的时候表单应该是空数据，由用户编辑操作
        this.form = {}
      },
      //编辑用户
      showEditUserDia(user) {
        this.dialogFormVisibleEdit = true
        //获取列表的数据再展示在表格上
        this.form = user
      },
      //确定编辑用户操作
      async editUser() {
        //点击编辑时候把数据传到列表中展示，所以这里可以获取来使用
        const res = await this.$http.put(`users/${this.form.id}`,this.form)
        this.dialogFormVisibleEdit = false
        this.getUserList()
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
      showDeleUserMsgBox(userId) {
        this.$confirm('删除该用户', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          //发送删除请求：id --->用户id
          //data中找userId 并在绑定的点击事件里作为参数传入然后这个方法里也需要传入参数以便使用
          //删除配置看文档
          const res = await this.$http.delete(`users/${userId}`)
          if(res.data.meta.status === 200) {
            this.pagenum = 1 //回到第一页
            //更新视图 提示删除成功
            this.getUserList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      async getUserList() {
        // 需要授权的 API ，必须在请求头中使用 Authorization 字段提供 token 令牌  https://www.kancloud.cn/yunye/axios/234845
        // this.$http.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        // console.log(res)
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
          this.pagenum = 1
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
