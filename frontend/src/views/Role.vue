<template>
  <el-card>
    <el-button type="primary" @click="openDialog()">新增角色</el-button>

    <el-table :data="list" border style="margin-top: 10px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="openDialog(row)">编辑</el-button>
          <el-button type="danger" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="角色" width="500px">
      <el-form v-model="form" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="form.name" />
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
const dialogVisible = ref(false)
const formRef = ref()
const form = ref({ id: '', name: '' })
const rules = {
  name: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
}

const getList = async () => {
  const { data } = await axios.get('http://localhost:3000/api/role/list')
  list.value = data.data
}

const openDialog = (row = null) => {
  dialogVisible.value = true
  form.value = { id: '', name: '' }
  if (row) form.value = { ...row }
}

const submit = async () => {
  await formRef.value.validate()
  if (form.value.id) {
    await axios.post('http://localhost:3000/api/role/edit', form.value)
  } else {
    await axios.post('http://localhost:3000/api/role/add', form.value)
  }
  ElMessage.success('保存成功')
  dialogVisible.value = false
  getList()
}

const del = async id => {
  await ElMessageBox.confirm('确定删除？')
  await axios.post('http://localhost:3000/api/role/del', { id })
  ElMessage.success('删除成功')
  getList()
}

onMounted(() => getList())
</script>
