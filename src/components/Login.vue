<template>
  <div class="login">
    <!--
      el-form：整个form组件
      :model="form" ： 必须提供的对象
      label-width="80px"： label宽度
      el-form-item： 一个表单项

      element-ui中所有的组件在渲染的时候，这个组件名其实就是类名
    -->
    <el-form status-icon ref="form" :rules="rules" :model="form" label-width="80px">
      <img src="@/assets/avatar.jpg" alt>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          // 非空校验 trigger： blur  change
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 3,
            max: 9,
            message: '用户名长度在 3 到 9 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '密码长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    login() {
      // 让整个表单校验
      this.$refs.form.validate(async valid => {
        // valid如果为true，就表示通过 否则不通过
        if (!valid) return false
        // 发送ajax请求，进行登录
        let res = await this.axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        let {
          meta: { status, msg },
          data: { token }
        } = res
        if (status === 200) {
          // alert('登录成功')
          this.$message.success('登录成功')
          // 把后台颁发的token存起来
          localStorage.setItem('token', token)
          // 跳转到Home组件
          // 参数：跳转的路径
          // 类似于location.href
          this.$router.push('/home')
        } else {
          // 失败的消息  this.$message: 弹出一个消息提示
          this.$message({
            message: msg,
            type: 'error',
            duration: 1000
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.login {
  height: 100%;
  width: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px;
    position: relative;
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -70px;
      border-radius: 50%;
      border: 5px solid #fff;
    }

    .el-button:nth-child(2) {
      margin-left: 80px;
    }
  }
}
</style>
