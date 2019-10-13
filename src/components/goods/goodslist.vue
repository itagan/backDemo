<template>
  <el-card class="box-card">
    <!--    1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    2.搜索  一行三列 再套用ui组件-->
    <el-row class="searchRow">
      <el-col>
        <el-input @clear="loadGoodsList()" clearable placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchGoods()"
          ></el-button>
        </el-input>
        <el-button type="success" @click="addGood">添加商品</el-button>
      </el-col>
    </el-row>
    <!--    3.表格  默认自适应高度，可设置高度-->
    <el-table
      height="350px"
      :data="goodslist"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="350">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="200">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="150">
      </el-table-column>

      <el-table-column
        label="创建日期"
        width="150">
        <template v-slot:default="scope">
          {{scope.row.create_time | fmtdate}}
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
            @click="showEditGoodsDia(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            :plain="true"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleGoodsMsgBox(scope.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    4.分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5,10,20,30]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </el-card>
</template>

<script>
  export default {
    name: 'goodslist.vue',
    data() {
      return {
        goodslist:[],
        query:'',
        pagenum:1,
        pagesize:10,
        total:-1,
      }
    },
    created () {
      this.getGoodsList()
    },
    methods: {
      //添加商品
      addGood() {
        this.$router.push({name:'goodsadd'})
      },
      //获取数据
      async getGoodsList() {
        const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        console.log(res)
        const {meta:{status,msg},data:{goods,total}} = res.data
        if(status === 200) {
          this.goodslist = goods
          this.total = total
          this.$message.success(msg)
        }else {
          this.$message.warning(msg)
        }
      },
      //搜索用户
      searchGoods() {
        this.getGoodsList()
      },
      //清空输入框，重新获取数据
      loadGoodsList() {
        this.getGoodsList()
      },
      showEditGoodsDia() {

      },
      //删除提示框
      showDeleGoodsMsgBox(goods_id) {
        this.$confirm('删除该商品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          //发送删除请求：id --->用户id
          //data中找userId 并在绑定的点击事件里作为参数传入然后这个方法里也需要传入参数以便使用
          //删除配置看文档
          const res = await this.$http.delete(`goods/${goods_id}`)
          if(res.data.meta.status === 200) {
            this.pagenum = 1 //回到第一页
            //更新视图 提示删除成功
            this.getGoodsList()
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
      //分页相关的方法 来自element文档
      //选择每页条数变化时触发
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pagesize = val
        this.pagenum = 1
        this.getGoodsList()
      },
      //当前页变化时触发
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pagenum = val
        this.getGoodsList()    
      },
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
