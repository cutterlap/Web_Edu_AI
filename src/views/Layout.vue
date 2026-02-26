<template>
  <el-container style="height: 100vh">
    <!-- 侧边栏 -->
    <el-aside width="200px" style="background: #2f4050">
      <div class="logo">后台管理</div>
      <el-menu background-color="#2f4050" text-color="#fff" active-text-color="#ffd04b" router>
        <el-menu-item index="/user">用户管理</el-menu-item>
        <el-menu-item index="/role">角色管理</el-menu-item>
        <el-menu-item index="/menu">菜单管理</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部 -->
      <el-header style="background: #fff; display: flex; justify-content: space-between; align-items: center">
        <span>欢迎，管理员</span>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </el-header>

      <!-- 内容区 -->
      <el-main style="background: #f3f3f4">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.logo {
  color: white;
  font-size: 18px;
  text-align: center;
  line-height: 60px;
  background: #1f2d3d;
}
</style>
