<template>
  <div class="category">
    <el-button type="success" @click="showAddDialog" plain>商品分类</el-button>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :data="categoryList"
    >
      <!--
        tree-key: 嵌套解析的key 默认id
        childKey: 查找子属性的属性名  默认是children
        parentKey: 指定父节点的id值  如果不设置，那么节点找不到爹，没办法缩起来
        levelKey: 指定节点的深度，级别
      -->
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indentSize="20"
      ></el-table-tree-column>

      <el-table-column label="是否删除" prop="cat_deleted">
        <template slot-scope="{row}">{{row.cat_deleted ? '是': '否'}}</template>
      </el-table-column>
      <el-table-column label="排序" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button @click="delCat(row)" type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%">
      <el-form status-icon ref="addForm" :rules="rules" :model="addForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <!--
            v-model="addForm.cat_pid" ：cat_pid必须是一个数组
          -->
          <el-cascader
            :options="options"
            v-model="addForm.cat_pid"
            change-on-select
            clearable
            :props="props"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      addDialogVisible: false,
      addForm: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { result, total }
      } = res
      if (status === 200) {
        this.total = total
        this.categoryList = result
        this.loading = false
      }
    },
    async showAddDialog() {
      this.addDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      // console.log(res)

      if (res.meta.status === 200) {
        this.options = res.data
      }
    },
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false

        // 发送ajax请求  cat_name  cat_pid  cat_level
        let { cat_pid: catPid, cat_name: catName } = this.addForm
        let res = await this.axios.post('categories', {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        if (res.meta.status === 201) {
          this.getCategoryList()
          this.$message.success('添加成功了')
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
        }
      })
    },
    async delCat(role) {
      try {
        await this.$confirm('你确定要删除该分类吗', '温馨提示', {
          type: 'warning'
        })
        let res = await this.axios.delete(`categories/${role.cat_id}`)
        if (res.meta.status === 200) {
          if (this.categoryList.length <= 1 && this.currentPage > 1) {
            this.currentPage--
          }
          this.getCategoryList()
          this.$message.success('删除成功')
        }
      } catch (e) {}
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>
</style>
