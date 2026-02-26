<template>
  <el-card title="模块安装">
    <el-upload
      action="/api/module/install"
      :headers="{ token: $store.token }"
      :show-file-list="false"
      :on-success="handleSuccess"
    >
      <el-button type="primary">上传模块ZIP</el-button>
    </el-upload>
  </el-card>
</template>

<script setup>
import { ElMessage } from 'element-plus'
const handleSuccess = res => {
  if (res.code === 0) {
    ElMessage.success(res.msg)
    setTimeout(() => location.reload(), 1500)
  } else {
    ElMessage.error(res.msg)
  }
}
</script>
