<template>
  <el-card>
<!--    1面包屑-->
<!--    <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--      <el-breadcrumb-item>首页</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>权限管理</el-breadcrumb-item>-->
<!--      <el-breadcrumb-item>权限列表</el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
<!--    2表格-->
    <el-table
      height="400px"
      :data="rightlist"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="100%">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template v-slot="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '3'">三级</span>
        </template>
      </el-table-column>

    </el-table>

  </el-card>
</template>

<script>
  export default {
    name: 'right.vue',
    data() {
      return {
        rightlist:[]
      }
    },
    created () {
      this.getRightlist()
    },
    methods: {
      async getRightlist() {
        //除了登录之外的所有请求都需要设置头部
        // this.$http.defaults.headers.common['Authorization'] = localStorage.getItem('token')
        //type参数可以是list 表格形式用list  树形结构用tree
        const res = await this.$http.get(`rights/list`)
        console.log(res)
        this.rightlist = res.data.data

      }
    }
  }
</script>

<style scoped>

</style>
