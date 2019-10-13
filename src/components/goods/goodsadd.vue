<template>
  <el-card>
<!--    1，面包屑-->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
<!--    提示-->
    <el-alert
      class="alert"
      title="成功提示的文案"
      type="success"
      center
      show-icon>
    </el-alert>
<!--    步骤条 el-step-->
    <el-steps :active="1 * active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息" ></el-step>
      <el-step title="商品参数" ></el-step>
      <el-step title="商品属性" ></el-step>
      <el-step title="商品图片" ></el-step>
      <el-step title="商品内容" ></el-step>
    </el-steps>

<!--最外层是el-form-->
    <el-form
      label-position="top"
      label-width="80px"
      :model="form"
      style="height:400px;overflow: auto;"
    >
      <!--tab页-->
      <el-tabs v-model="active" tab-position="left" @tab-click="tabChange()">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
        <!--  级联选择器-->
          <el-form-item label="商品分类" >
              <el-cascader
                expand-trigger="hover"
                v-model="selectedOptions"
                :options="options"
                :props="defaultProp"
                @change="handleChange"
                clearable	>
              </el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="2" label="商品参数">
          <!--        显示的是该三级分类的商品参数  动态参数-->
          <el-form-item
            :label="item1.attr_name"
            :key="i"
            v-for="(item1,i) in arrDyparams"
          >
<!--            v-model不能丢 不然报错 表示被选中的项目-->
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox
                v-for="(item2,i) in item1.attr_vals"
                :key="i"
                :label="item2"
                border
              > </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

        </el-tab-pane>

        <el-tab-pane name="3" label="商品属性">
<!--            静态参数的数据-->
          <el-form-item v-for="(item,i) in arrStaticparams" :key="i" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="4" label="商品图片">
          <el-form-item label="商品数量">
            <el-upload
              class="upload-demo"
              action="http://39.108.193.251:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headers"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods()">点我-添加商品</el-button>
<!--            富文本编辑器-->
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

<!--    <el-tabs :tab-position="tabPosition" style="height: 200px;">-->
<!--    联动效果实现：点击tab切换，实现name切换，name对应父级v-model，而这绑定的跟步骤条绑定一致，注意data定义绑定的变量值-->
  </el-card>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'

  export default {
    name: 'goodsadd.vue',
    data() {
      return {
        // tabPosition: 'left'
        active:'1' ,  //表单元素,v-model可以去绑定实现双向数据绑定
        //添加商品表单数据
        form: {
          goods_name: '', // 商品名称
          goods_price: '', // 商品价格
          goods_weight: '', // 商品重量
          goods_number: '', // 商品数量
          goods_cat: [], // 商品所属的分类
          goods_introduce: '', // 商品的描述
          pics: [], // 商品的图片
          attrs: [] // 商品的属性数组
        },
        selectedOptions:[453, 473, 486 ],   //最终选中的label对应的value会放在这个数组中
        options:[], //选择器的数据
        defaultProp: { //每级的属性，可能没有children因为没有子选项集合
          label:'cat_name',
          value:'cat_id',
          children:'children'
        },
        //动态参数的数据数组
        arrDyparams:[],
        //静态参数的数据数组
        arrStaticparams:[],
        //除了登录请求都需要设置头部所以上传图片也需要这样设置
        headers: {
          //设置拦截
          // const AUTH_TOKEN = localStorage.getItem('token')
          // config.headers['Authorization'] =AUTH_TOKEN
          //写法来源上面
          Authorization:localStorage.getItem('token')
        }
      }
    },
    components: {
      quillEditor //局部注册编辑器
    },
    created() {
      this.getGoodCate()
    },
    methods: {
      //添加商品 发送请求
      async addGoods() {
        //发送请求之前，处理this.form中未处理的数据
        //处理商品的参数变成数组对象,包括动态和静态参数
        let arr1 = this.arrDyparams.map(item => {
          return {
            attr_id:item.attr_id,
            attr_value:item.attr_value
          }
        })
        let arr2 = this.arrStaticparams.map(item => {
          return {
            attr_id:item.attr_id,
            attr_value:item.attr_value
          }
        })
        this.form.attrs = [...arr1,...arr2]
        //处理分类，按照要求的格式合成
        this.form.goods_cat = this.selectedOptions.join(',')
        const res = await this.$http.post(`goods`,this.form)
        // console.log(res)
        //回到商品列表页
        this.$router.push({name:'goods'})


      },
      //点击不同的tab时候
      async tabChange() {
        // 如果点击的是第二个tab，同时三级分类要有值
        if(this.active === '2') {
          if(this.selectedOptions.length !== 3){
            //提示
            this.$message.warning('请先选择商品的三级分类')
            return
          }
          //获取数据
          //id 当前分类的id   sel=many表示获取动态参数的数据
          // const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes`,
            {
              params: { sel: 'many' }
            }
          )
          this.arrDyparams = res.data.data
          console.log(this.arrDyparams)
          // this.arrDyparms每个对象.attr_vals字符串 -》数组 =》v-for遍历
          this.arrDyparams.forEach(item => {
            //有些三级分类没有动态参数
            item.attr_vals =
              item.attr_vals.length ? item.attr_vals.trim().split(','):[]
          })
        }else if(this.active === '3') {
          if(this.selectedOptions.length !== 3){
            //提示
            this.$message.warning('请先选择商品的三级分类')
            return
          }
          //获取静态参数
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes`,
            {
              params: { sel: 'only' }
            }
          )
          this.arrStaticparams = res.data.data
        }
      },
      //级联选择器@change触发的方法
      handleChange() {

      },
      //获取商品分类数据
      async getGoodCate() {
        // const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
        //上边比较完整的写法，加入参数。下边用模板字符串
        const res = await this.$http.get(`categories?type=3`)
        this.options = res.data.data
      },
      //图片上传相关操作方法 file是图片的相关信息，有图片名，图片路径等
      //已上传的文件 预览
      handlePreview(file) {

      },
      //移除
      handleRemove(file) {
      //从图片路径列表中找到点击删除的那张图片再删除
        let Index = this.form.pics.findIndex((item) => {
          return item.pic === file.response.data.tmp_path
        })
        this.form.pics.splice(Index,1)
        console.log(this.form.pics)
      },
      //上传成功
      handleSuccess(file) {
        //处理图片路径
        this.form.pics.push({
          pic:file.data.tmp_path
        })
      }
    }
  }
</script>

<style scoped>

  .alert {
    margin-top: 20px;
  }
  .ql-editor {
    min-height: 400px;
  }
</style>
