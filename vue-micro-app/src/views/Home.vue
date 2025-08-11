<template>
  <div class="vue-home">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>🎉 欢迎使用 Vue 微前端应用</span>
        </div>
      </template>
      
      <div class="welcome-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="feature-card">
              <h3>🚀 微前端特性</h3>
              <ul>
                <li>基于 Vite 模块联邦</li>
                <li>支持独立开发和部署</li>
                <li>与主应用无缝集成</li>
                <li>共享依赖管理</li>
              </ul>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card class="feature-card">
              <h3>🛠️ 技术栈</h3>
              <ul>
                <li>Vue 3 + TypeScript</li>
                <li>Vue Router 4</li>
                <li>Pinia 状态管理</li>
                <li>Element Plus UI</li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
        
        <el-divider />
        
        <div class="demo-section">
          <h3>📱 功能演示</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-button type="primary" @click="goToCounter">
                🧮 计数器演示
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="success" @click="goToUsers">
                👥 用户列表
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="warning" @click="goToAbout">
                ℹ️ 关于页面
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <el-divider />
        
        <div class="communication-section">
          <h3>📡 微前端通信</h3>
          <el-button @click="sendMessage" type="info">
            发送消息到主应用
          </el-button>
          <p class="message-info">消息将发送到主应用，演示微前端通信功能</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCounter = () => {
  router.push('/counter')
}

const goToUsers = () => {
  router.push('/users')
}

const goToAbout = () => {
  router.push('/about')
}

const sendMessage = () => {
  // 发送消息到主应用
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'vue:message',
      payload: {
        message: 'Hello from Vue micro app!',
        timestamp: new Date().toISOString(),
        data: {
          app: 'vue-micro-app',
          version: '1.0.0'
        }
      },
      source: 'vue-micro-app'
    }, '*')
    
    ElMessage.success('消息已发送到主应用')
  } else {
    ElMessage.info('独立运行模式，无法发送消息到主应用')
  }
}
</script>

<style scoped>
.vue-home {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content {
  text-align: center;
}

.feature-card {
  margin-bottom: 20px;
  text-align: left;
}

.feature-card h3 {
  color: #409eff;
  margin-bottom: 15px;
}

.feature-card ul {
  list-style: none;
  padding: 0;
}

.feature-card li {
  padding: 5px 0;
  color: #666;
}

.demo-section {
  margin: 30px 0;
}

.communication-section {
  margin: 30px 0;
}

.message-info {
  color: #999;
  font-size: 14px;
  margin-top: 10px;
}
</style>

