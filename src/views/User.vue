<template>
  <el-card>
    <el-button type="primary" @click="openDialog()">新增用户</el-button>

    <el-table :data="list" border style="margin-top: 10px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="username" label="账号" />
      <el-table-column prop="role_name" label="角色" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="openDialog(row)">编辑</el-button>
          <el-button type="danger" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="用户" width="500px">
      <el-form v-model="form" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!form.id">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="form.role_id">
            <el-option v-for="r in roleList" :key="r.id" :label="r.name" :value="r.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const list = ref([])
const roleList = ref([])
const dialogVisible = ref(false)
const formRef = ref()
const form = ref({ id: '', username: '', password: '', role_id: '' })
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  role_id: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const getList = async () => {
  const { data } = await axios.get('http://localhost:3000/api/user/list')
  list.value = data.data
}

const getRoleList = async () => {
  const { data } = await axios.get('http://localhost:3000/api/role/list')
  roleList.value = data.data
}

const openDialog = (row = null) => {
  dialogVisible.value = true
  form.value = { id: '', username: '', password: '', role_id: '' }
  if (row) {
    form.value = { ...row }
  }
}

const submit = async () => {
  await formRef.value.validate()
  if (form.value.id) {
    await axios.post('http://localhost:3000/api/user/edit', form.value)
  } else {
    await axios.post('http://localhost:3000/api/user/add', form.value)
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  getList()
}

const del = async id => {
  await ElMessageBox.confirm('确定删除？')
  await axios.post('http://localhost:3000/api/user/del', { id })
  ElMessage.success('删除成功')
  getList()
}

onMounted(() => {
  getList()
  getRoleList()
})
</script>
