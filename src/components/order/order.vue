<template>
  <el-card class="box-card">
<!--    面包屑-->
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <!--    2.搜索  一行三列 再套用ui组件-->
    <el-row class="searchRow">
      <el-col>
        <el-input @clear="loadOrdersList()" clearable placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchOrders()"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!--    2.表格  默认自适应高度，可设置高度-->
    <el-table
      height="350px"
      :data="ordersList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="350">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="200">
      </el-table-column>
      <el-table-column
        prop="pay_status"
        label="是否付款"
        width="150">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.pay_status === '0'" size="small">未付款</el-tag>
          <el-tag type="success" v-else size="small">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="150">
      </el-table-column>
      <el-table-column
        label="下单时间"
        width="150">
        <template v-slot:default="scope">
          {{scope.row.update_time | fmtdate}}
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
            @click="showEditOrdersDia(scope.row)"
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

    <!--弹出编辑对话框-->
    <el-dialog title="修改地址" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="省市区" label.width="120pxx" :prop="form.addressCas" >
          <el-cascader
            expand-trigger="hover"
            v-model="selectedOptions"
            :options="cityData"
            clearable	>
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="100px">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editOrders()">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
  import cityData from '../../assets/js/cityData'
  export default {
    name: 'order.vue',
    data() {
      return {
        ordersList:[],
        query:'',
        pagenum:1,
        pagesize:10,
        total:-1,
        dialogFormVisibleEdit:false,
        form: {
          address:'',
        },
        Address:'',
        //级联选择器
        cityData:[],
        selectedOptions:[],
        // defaultProp: { //每级的属性，可能没有children因为没有子选项集合
        //   label:'1',
        //   value:'1',
        //   children:cityData
        // },

      }
    },
    created () {
      this.getOrders()
    },
    methods: {
      async getOrders() {
        const res = await this.$http.get(`orders`,{
          params: {
            query:this.query,
            pagenum:this.pagenum,
            pagesize:this.pagesize,
          }
        })
        // const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        console.log(res)
        this.ordersList = res.data.data.goods
        this.total = res.data.data.total
      },
      //展开编辑
      showEditOrdersDia() {
        this.dialogFormVisibleEdit = true
        this.cityData = cityData
      },
      //确定编辑
      editOrders() {
        this.dialogFormVisibleEdit = false
        //获取选项和具体地址
        // console.log( this.selectedOptions)
        // console.log(this.form.address)
        this.Address = this.selectedOptions.join('') + this.form.address
        console.log(this.Address)
      },
      //分页相关的方法 来自element文档
      //选择每页条数变化时触发
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.pagesize = val
        this.pagenum = 1
        this.getOrders()
      },
      //当前页变化时触发
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        this.pagenum = val
        this.getOrders()
      },
      //搜索用户
      searchOrders() {
        this.getOrders()
      },
      //清空输入框，重新获取数据
      loadOrdersList() {
        this.getOrders()
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
