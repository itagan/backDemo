<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  // 自己封装一个全局组件，需要main.js注册
  export default {
    name: 'my-bread',
    data() {
      return {

      }
    },
    //由使用者传值决定
    props: ['level1','level2']
  }
</script>

<style scoped>

</style>
