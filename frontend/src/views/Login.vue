<template>
  <div class="login-container">
    <div class="login-box">
      <h2>企业后台管理系统</h2>
      <el-form v-model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" class="btn-login"> 登录 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

const login = async () => {
  try {
    const { data } = await axios.post('http://localhost:3000/api/login', form.value)
    if (data.code === 0) {
      localStorage.setItem('token', data.token)
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error(data.msg || '登录失败')
    }
  } catch (err) {
    ElMessage.error('网络或服务器异常')
  }
}
</script>
<!-- 添加结束标签 -->

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}
.login-box {
  width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.btn-login {
  width: 100%;
}
</style>
