<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain>添加用户</el-button>

    <!-- 表格组件 -->
    <!--
      el-table : 表格组件
      data : 指定表格最终需要渲染的数据（数组）
      style： 让表格宽度100%
      el-table-column： 定义表格的每一列
        label="日期"： 列的标题
        prop： 对应显示的数据的属性名
        width： 列的宽度 不支持百分比

      在el-tabel中，如果想要自定义列模版
      在el-table-column中使用template
        <template slot-scope="scope">自己定义的内容</template>
    -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button
            type="danger"
            @click="delUser(scope.row.id)"
            icon="el-icon-delete"
            plain
            size="mini"
          ></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2,4,6,8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 用户列表
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0
    }
  },
  methods: {
    getUserList() {
      // axios如果是get/delete请求，参数要么直接拼地址栏，要么放到params中
      // 如果post/put/patch请求，参数放到data中
      // 除了login请求，其他所有的接口都必须携带token， 要求设置给请求头：Authorization
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
        }
      })
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      // 修改this.pageSize
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      // 把currentPage修改成val
      this.currentPage = val
      this.getUserList()
    },
    search() {
      // 搜索的时候，把当前页第一页
      this.currentPage = 1
      this.getUserList()
    },
    delUser(id) {
      // console.log(id)
      this.$confirm('您确定要删除吗', '温馨提示', {
        type: 'warning'
      }).then(() => {
        // 发送ajax请求，删除数据
        axios({
          method: 'delete',
          url: `http://localhost:8888/api/private/v1/users/${id}`,
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
          .then(res => {
            if (res.data.meta.status === 200) {
              if (this.userList.length <= 1 && this.currentPage > 1) {
                this.currentPage--
              }
              this.getUserList()
              this.$message.success('恭喜你，删除成功了')
            }
          })
          .catch(() => {
            this.$message.info('取消删除了')
          })
      })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 50px;
  line-height: 50px;
}
.el-input {
  width: 300px;
  margin: 5px 0;
}
</style>
