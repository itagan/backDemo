<template>
    <el-card>
      <my-bread level1="数据统计" level2="数据报表"></my-bread>
      <div id="main" style="width: 600px;height: 400px;"></div>
    </el-card>
</template>

<script>
  var echarts = require('echarts')
  export default {
    name: 'report.vue',
    data() {
      return {

      }
    },
    mounted () {
      this.useEchart()
    },
    methods: {
      async useEchart() {
        var myChart = echarts.init(document.getElementById('main'))
        //获取表格数据
        const res = await this.$http.get(`reports/1`)
        if (res.meta.status !== 200) return this.$message.error('获取报表数据失败！')

        let option2 = res.data.data
        //指定数据表中的配置项
        let option1 = {
          title: {
            text: '堆叠区域图'
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          // legend: {
          //   data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
          // },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              data : ['周一','周二','周三','周四','周五','周六','周日']
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
        }
      },
    }
  }
</script>

<style scoped>

</style>
