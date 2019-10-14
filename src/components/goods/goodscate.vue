<template>
  <el-card class="box-card">
<!--      //面包屑-->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
<!--    搜索框-->
    <el-row class="searchRow">
      <el-col>
        <el-input @clear="loadUserList()" clearable placeholder="请输入内容查看是否有该分类" v-model="query" :span="24" class="searchArea">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchUser()"
          ></el-button>
        </el-input>
        <el-button type="success" @click="addGoodscate()">添加分类</el-button>
      </el-col>
    </el-row>
<!--    弹出对话框-->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!--        级联选择器-->
        <el-form-item label="分类" label-width="120px">
          <el-cascader
            :show-all-levels="false"
            expand-trigger="hover"
            change-on-select
            v-model="selectedOptions"
            :options="caslist"
            :props="defaultProp"
            clearable	>
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
    <!--    3.表格  默认自适应高度，可设置高度-->
    <el-table
      height="450px"
      :data="list"
      style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelkey="cat_level"
        childkey="children"
      ></el-tree-grid>

      <el-table-column label="级别">
        <template v-slot="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>

      <el-table-column label="是否有效">
        <template v-slot="scope">
          <span v-if="scope.row.cat_deleted === false">有效</span>
          <span v-else-if="scope.row.cat_deleted === true">无效</span>
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
            @click="showEditDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            :plain="true"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDelefirm(scope.row.cat_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    4.分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="getListParams.pagenum"
      :page-sizes="[5,10,20,30]"
      :page-size="getListParams.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--弹出编辑对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="100px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editCate()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
  //引入element-tree-grid
  var ElTreeGrid = require('element-tree-grid')

  export default {
    name: 'goodscate.vue',
    data() {
      return {
        list:[],//表格数据
        dialogFormVisibleAdd: false,
        //表单数据
        form: {
          cat_id: -1 ,//	分类 ID
          cat_name: '',//	分类名称
          cat_pid: -1,//	分类父 ID
          cat_level: -1,//
        },
        //级联选择器参数
        caslist:[], //级联选择器所用数据
        selectedOptions:[], //被级联选择器选中的项
        defaultProp: { //每级的属性，可能没有children因为没有子选项集合
          label:'cat_name',
          value:'cat_id',
          children:'children'
        },
        query:'', //查询参数
        //分页相关的数据
        total:-1,
        getListParams: {
          type: 3, // 获取三级分类
          pagenum: 1, // 默认 展示第一页数据
          pagesize: 5, // 默认 每页显示5条数据
        },
        //编辑分类对话框
        dialogFormVisibleEdit:false
      }
    },
    components: {
      ElTreeGrid
    },
    created () {
      this.getlist()
    },
    methods: {
      //获取列表数据
      async getlist() {
        const res = await this.$http.get('categories',{
          params: this.getListParams
        })
        console.log(res)
        this.list = res.data.data.result
        this.total = res.data.data.total
      },
      //添加分类功能，打开对话框获取数据
      async addGoodscate() {
        this.dialogFormVisibleAdd = true
        //获取二级分类的数据,因为不能给第三级分类添加变成四级分类，只需要获取前面2级就行
        const res = await this.$http.get(`categories?type=3`)
        this.caslist = res.data.data
      },
      //添加分类 点击确定发送请求
      async addCate() {
        //添加分类的几种情况
        //1，一级分类 selectedOptions.length =0 cat_pid =0 cat_level=0
        //2，二级分类 selectedOptions.length =1 cat_pid =selectedOptions[0] cat_level=1
        //3，三级分类 selectedOptions.length =2 cat_pid =selectedOptions[1] cat_level=2
        if(this.selectedOptions.length === 0){
          this.form.cat_pid = 0
          this.form.cat_level = 0
        }else if(this.selectedOptions.length === 1) {
          this.form.cat_pid = this.selectedOptions[0]
          this.form.cat_level = 1
        }else if(this.selectedOptions === 2) {
          this.form.cat_pid = this.selectedOptions[1]
          this.form.cat_level = 2
        }
        const res = await this.$http.post(`categories`,this.form)
        // console.log(res)
        this.dialogFormVisibleAdd = false
        this.getlist()
      },
      //点击编辑按钮
      showEditDia(cate) {
        this.dialogFormVisibleEdit = true
        //获取列表的数据再展示在对话框上
        this.form = cate
        console.log(cate)
      },
      //点击删除框
      showDelefirm(cat_id) {
        //按element文档写
        this.$confirm('此操作将永久删除该文件, 是否继续?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`categories/${cat_id}`)
          console.log(res)
          if(res.data.meta.status === 200) {
            this.getlist()
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          }
        }).catch( () => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
        })
      },
      //编辑对话框操作
      async editCate() {
        //点击确定提交修改数据
        const res = await this.$http.put(`categories/${this.form.cat_id}`,this.form)
        console.log(res)
        this.dialogFormVisibleEdit = false
        this.getlist()
      },
      //分页相关的方法 来自element文档
      //选择每页条数变化时触发
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.getListParams.pagesize = val
        // this.getListParams.pagenum = 1
        this.getlist()
      },
      //当前页变化时触发
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.getListParams.pagenum = val
        this.getlist()
      },
      //根据参数查询商品分类
      async addQuery() {
        const res = await this.$http.get(`categories?query=${this.query}&cat_id=${this.form.cat_id}`)
        console.log(res)
      },
      //搜索用户
      searchUser() {
        this.addQuery()
        // this.getlist()
        // console.log('搜索')
      },
      //清空输入框，重新获取数据
      loadUserList() {
        this.getlist()
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
  .searchArea {
    width:300px;
  }
</style>
