<template>
 <el-card>
<!--   按钮-->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

   <el-row class="addrolebtn">
     <el-col>
       <el-button type="info">添加角色</el-button>
     </el-col>
   </el-row>

<!--  表格-->
   <el-table
     height="300px"
     :data="rolelist"
     style="width: 100%">

     <el-table-column type="expand" width="150">
<!--       这个slot写法element还是老版本，请注意按官方文档写，不然报错-->
        <template slot-scope="scope">
          <el-row v-for="(item1,i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag @close="deleRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <el-col :span="20">
              <el-row v-for="(item2,i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag @close="deleRight(scope.row,item2.id)" type="success" closable >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col :span="20">
                  <el-tag v-for="(item3,i) in item2.children" :key="i" type="warning" closable @close="deleRight(scope.row,item3.id)"
                  >{{item3.authName}}</el-tag>
                </el-col>

              </el-row>
            </el-col>
          </el-row>
<!--          没有权限的提示-->
          <span v-if="scope.row.children.length === 0">未分配权限</span>
        </template>
     </el-table-column>

     <el-table-column
       type="index"
       label="#"
       width="150">
     </el-table-column>

     <el-table-column
       prop="roleName"
       label="角色名称"
       width="200">
     </el-table-column>
     <el-table-column
       prop="roleDesc"
       label="角色描述"
       width="200">
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

 </el-card>
</template>

<script>
  export default {
    name: 'role.vue',
    data() {
      return {
        rolelist:[]
      }
    },
    created () {
      this.getRolelist()
    },
    methods: {
      //取消权限
      async deleRight(role,rightId) {
        const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        // console.log(res)
        //roleId 当前角色id  ightId当前权限id
        //删除成功 返回了状态200和该角色的剩余权限
        // this.getRolelist()
        //优化，删除不应该更新整个视图，而是根据返回的数据更新当前角色的权限，达到删除可以看到删除效果，而不被删除的不会被刷新 所以传入是角色 为参数
        role.children = res.data.data
      },
      async getRolelist() {
        const res = await this.$http.get(`roles`)
        this.rolelist = res.data.data

      }
    }
  }
</script>

<style scoped>
  .addrolebtn {
    margin-top: 20px;
  }
</style>
