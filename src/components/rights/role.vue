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
           @click="showSetRightDia(scope.row)"
         ></el-button>
       </template>
     </el-table-column>
   </el-table>
<!--  修改权限的对话框-->
   <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
<!--    树形结构   需要看看各项参数-->
     <!-- 树形结构组件 -->
     <!-- :data 用来指定当前这棵树，要绑定到的数据 -->
     <!-- node-key 用来指定，每个节点，被选中时候，所选中的哪个值 -->
     <!-- :props 用来指定每个节点的配置项 -->
     <!--     比如，通过 label 指定要展示的名称 -->
     <!--     比如，通过 children 属性指定 通过 哪个属性来实现嵌套 -->
     <el-tree
       ref = "tree"
       :data="treelist"
       show-checkbox
       node-key="id"
       default-expand-all
       :default-checked-keys="arrcheck"
       :props="defaultProps">
     </el-tree>

     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
       <el-button type="primary" @click="setRoleRight()">确 定</el-button>
     </div>
   </el-dialog>
 </el-card>
</template>

<script>
  export default {
    name: 'role.vue',
    data() {
      return {
        rolelist:[],
        dialogFormVisibleRight:false,
        treelist:[],
        defaultProps: {
          label:'authName',
          children:'children'  //该节点所在子节点的数组
        },
        arrexpand:[],
        arrcheck:[],
        currRoleId:-1 //角色树形权限在对话框中，无法直接在方法里传参获取，所以这里定义来获取角色id
      }
    },
    created () {
      this.getRolelist()
    },
    methods: {
      //修改角色权限，点击确定生效
      async setRoleRight() {
        //获取全选打钩的权限id
        let arr1 = this.$refs.tree.getCheckedKeys()
        //获取半选的权限id
        let arr2 = this.$refs.tree.getHalfCheckedKeys()
        let arr = [...arr1,...arr2]
        console.log(arr)
        //currRoleId已经通过打开对话框方法获取到了
        const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
          rids: arr.join(',')
        })
        //先更新视图再关闭对话框
        this.getRolelist()
        console.log(res)
        if (res.data.meta.status !== 200) return this.$message.error('更新权限失败！')
        this.$message.success('更新权限成功！')
        this.dialogFormVisibleRight = false

      },
      //点击操作的check按钮，修改权限
      async showSetRightDia(role) {
        //给当前角色Id获取值
        this.currRoleId = role.id
        //先获取树形结构的数据
        const res = await this.$http.get(`rights/tree`)
        this.treelist = res.data.data
        //通过遍历三层数组方式把所有Id值取得加入到空数组中
        // var arrtemp1 = []
        // this.treelist.forEach(item1 => {
        //   arrtemp1.push(item1.id)
        //   item1.children.forEach(item2 => {
        //     arrtemp1.push(item2.id)
        //     item2.children.forEach(item3 => {
        //       arrtemp1.push(item3.id)
        //     })
        //   })
        // })

        //获取当前角色的权限id，放到数组中  注意只拿需要的打钩，所以有些不能放入数组
        var arrtemp2 = []
        role.children.forEach(item1 => {
          // arrtemp2.push(item1.id)
          item1.children.forEach(item2 => {
            // arrtemp2.push(item2.id)
            item2.children.forEach(item3 => {
              arrtemp2.push(item3.id)
            })
          })
        })
        this.arrcheck = arrtemp2
        this.dialogFormVisibleRight = true
      },
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
