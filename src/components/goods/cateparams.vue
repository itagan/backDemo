<template>
  <el-card>
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert title="只允许为第三级分类设置参数" type="error" class="alert"></el-alert>
    <el-form
      label-position="left"
      label-width="80px"
      class="formcas"
    >
    <el-form-item label="商品分类" >
      <el-cascader
        :show-all-levels="false"
        expand-trigger="hover"
        v-model="selectedOptions"
        :options="options"
        :props="defaultProp"
        @change="handleChange"
        clearable	>
      </el-cascader>
    </el-form-item>
    </el-form>
<!--    el-tabs v-model="active" 绑定选项卡中的name值，data中赋初始值-->
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="danger">设置动态参数</el-button>
        <el-table
          :data="arrDyparams"
          style="width: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="scope">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name,tag)">
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)"
                @blur="handleInputConfirm(scope.row.attr_vals,scope.row.attr_id,scope.row.attr_name)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column
            label="属性名称"
            prop="attr_name">
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
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
<!--      静态参数-->
      <el-tab-pane label="静态参数" name="2">
        <el-button type="danger">设置静态参数</el-button>
        <el-table
        :data="arrStaticparams"
        style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>

        <el-table-column
          label="属性名称"
          prop="attr_name">
        </el-table-column>

        <el-table-column
          label="属性值"
          prop="attr_vals">
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
          </template>
        </el-table-column>

        </el-table>
      </el-tab-pane>
    </el-tabs>

  </el-card>
</template>

<script>
  export default {
    name: 'cateparms.vue',
    data() {
      return {
        //级联选择器的参数
        selectedOptions:[70, 75, 92 ],   //最终选中的label对应的value会放在这个数组中
        options:[], //选择器的数据
        defaultProp: { //每级的属性，可能没有children因为没有子选项集合
          label:'cat_name',
          value:'cat_id',
          children:'children'
        },
        arrDyparams:[], //动态参数
        inputVisible: false,
        inputValue: '',
        //静态参数
        arrStaticparams:[],
        active:'1'
      }
    },
    created() {
      this.getGoodCate()
    },
    methods: {
//级联选择器@change触发的方法
      async handleChange() {
        //获取动态参数展示
        if(this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes`,
            {
              params: { sel: 'many' }
            }
          )
          this.arrDyparams = res.data.data
          this.arrDyparams.forEach(item => {
            item.attr_vals =
              item.attr_vals.length ? item.attr_vals.trim().split(','):[]
          })
        }
      },
      //获取商品三级分类数据
      async getGoodCate() {
        // const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
        //上边比较完整的写法，加入参数。下边用模板字符串
        const res = await this.$http.get(`categories?type=3`)
        this.options = res.data.data
      },
      //切换tabs触发
      async handleClick() {
        if (this.active === '2') {
          if (this.selectedOptions.length === 3){
            //获取静态参数
            const res = await this.$http.get(
              `categories/${this.selectedOptions[2]}/attributes`,
              {
                params: { sel: 'only' }
              }
            )
            console.log(res)
            this.arrStaticparams = res.data.data
          }
        }else {
          console.log('有误')
        }
      },
      //动态teg标签
      //点击x按钮
      async handleClose(attr_vals,attr_id,attr_name,tag) {
        attr_vals.splice(attr_vals.indexOf(tag), 1);
        let putData = {
          attr_name:attr_name,   //变量，不是字符串引号包裹
          attr_sel:'many',
          attr_vals:attr_vals.join(',')   //发送给服务器不能直接是数组，应该连接成字符串，按要求分割
        }
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr_id}`,putData)
        // console.log(res)
      },
      //点击newTag+按钮
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //回车键or失去焦点
      async handleInputConfirm(attr_vals,attr_id,attr_name) {
        let inputValue = this.inputValue;
        if (inputValue) {
          attr_vals.push(inputValue);
          //发送请求
          let putData = {
            attr_name:attr_name,   //变量，不是字符串引号包裹
            attr_sel:'many',
            attr_vals:attr_vals.join(',')   //发送给服务器不能直接是数组，应该连接成字符串，按要求分割
          }
          const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr_id}`,putData)
          // console.log(res)
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  }
</script>

<style scoped>
  .alert {
    margin-top: 20px;
  }
  .formcas {
    margin-top: 20px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
