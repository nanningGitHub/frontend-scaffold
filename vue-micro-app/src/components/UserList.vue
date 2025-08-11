<template>
  <div class="vue-user-list">
    <el-card class="user-list-card">
      <template #header>
        <div class="card-header">
          <span>👥 Vue 用户列表</span>
          <el-button @click="refreshUsers" type="primary" size="small">
            🔄 刷新
          </el-button>
        </div>
      </template>
      
      <div class="user-list-content">
        <div class="user-controls">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input
                v-model="searchQuery"
                placeholder="搜索用户..."
                prefix-icon="Search"
                clearable
                @input="filterUsers"
              />
            </el-col>
            <el-col :span="8">
              <el-select v-model="roleFilter" placeholder="选择角色" clearable @change="filterUsers">
                <el-option label="全部角色" value="" />
                <el-option label="管理员" value="admin" />
                <el-option label="用户" value="user" />
                <el-option label="访客" value="guest" />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-button @click="addUser" type="success">
                ➕ 添加用户
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <el-divider />
        
        <div class="user-table">
          <el-table :data="filteredUsers" style="width: 100%" v-loading="loading">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="role" label="角色" width="100">
              <template #default="scope">
                <el-tag :type="getRoleTagType(scope.row.role)">
                  {{ scope.row.role }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                  {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button @click="editUser(scope.row)" type="primary" size="small">
                  编辑
                </el-button>
                <el-button @click="deleteUser(scope.row)" type="danger" size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <el-divider />
        
        <div class="user-stats">
          <h3>📊 用户统计</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-statistic title="总用户数" :value="totalUsers" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="活跃用户" :value="activeUsers" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="管理员" :value="adminUsers" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="普通用户" :value="regularUsers" />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    
    <!-- 用户编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" type="email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userForm.role" placeholder="选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="用户" value="user" />
            <el-option label="访客" value="guest" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="userForm.status"
            active-value="active"
            inactive-value="inactive"
            active-text="活跃"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 用户类型定义
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  createdAt: string
}

// 响应式状态
const users = ref<User[]>([])
const filteredUsers = ref<User[]>([])
const loading = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('')
const userForm = ref<Partial<User>>({})

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-02 11:00:00'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: 'guest',
    status: 'inactive',
    createdAt: '2024-01-03 12:00:00'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-04 13:00:00'
  }
]

// 计算属性
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => u.status === 'active').length)
const adminUsers = computed(() => users.value.filter(u => u.role === 'admin').length)
const regularUsers = computed(() => users.value.filter(u => u.role === 'user').length)

// 方法
const refreshUsers = () => {
  loading.value = true
  setTimeout(() => {
    users.value = [...mockUsers]
    filterUsers()
    loading.value = false
    ElMessage.success('用户列表已刷新')
  }, 500)
}

const filterUsers = () => {
  let filtered = [...users.value]
  
  if (searchQuery.value) {
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }
  
  filteredUsers.value = filtered
}

const getRoleTagType = (role: string) => {
  switch (role) {
    case 'admin': return 'danger'
    case 'user': return 'primary'
    case 'guest': return 'info'
    default: return 'default'
  }
}

const addUser = () => {
  userForm.value = {
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  }
  dialogTitle.value = '添加用户'
  dialogVisible.value = true
}

const editUser = (user: User) => {
  userForm.value = { ...user }
  dialogTitle.value = '编辑用户'
  dialogVisible.value = true
}

const deleteUser = (user: User) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${user.name}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    users.value = users.value.filter(u => u.id !== user.id)
    filterUsers()
    ElMessage.success('用户已删除')
  })
}

const saveUser = () => {
  if (!userForm.value.name || !userForm.value.email) {
    ElMessage.error('请填写完整信息')
    return
  }
  
  if (userForm.value.id) {
    // 编辑用户
    const index = users.value.findIndex(u => u.id === userForm.value.id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...userForm.value }
    }
    ElMessage.success('用户已更新')
  } else {
    // 添加用户
    const newUser: User = {
      id: Date.now(),
      name: userForm.value.name!,
      email: userForm.value.email!,
      role: userForm.value.role!,
      status: userForm.value.status!,
      createdAt: new Date().toLocaleString()
    }
    users.value.push(newUser)
    ElMessage.success('用户已添加')
  }
  
  filterUsers()
  dialogVisible.value = false
}

// 生命周期
onMounted(() => {
  refreshUsers()
})
</script>

<style scoped>
.vue-user-list {
  padding: 20px;
}

.user-list-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-list-content {
  text-align: left;
}

.user-controls {
  margin: 20px 0;
}

.user-table {
  margin: 20px 0;
}

.user-stats {
  margin: 30px 0;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

