<template>
  <div class="vue-about">
    <el-card class="about-card">
      <template #header>
        <div class="card-header">
          <span>ℹ️ 关于 Vue 微前端应用</span>
        </div>
      </template>
      
      <div class="about-content">
        <el-descriptions title="应用信息" :column="1" border>
          <el-descriptions-item label="应用名称">Vue 微前端应用</el-descriptions-item>
          <el-descriptions-item label="版本">1.0.0</el-descriptions-item>
          <el-descriptions-item label="端口">3004</el-descriptions-item>
          <el-descriptions-item label="框架">Vue 3 + TypeScript</el-descriptions-item>
          <el-descriptions-item label="构建工具">Vite</el-descriptions-item>
          <el-descriptions-item label="微前端">模块联邦</el-descriptions-item>
        </el-descriptions>
        
        <el-divider />
        
        <div class="architecture-section">
          <h3>🏗️ 架构特点</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="arch-card">
                <h4>🔌 模块联邦</h4>
                <p>基于 Vite 的模块联邦插件，支持微应用的动态加载和依赖共享</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="arch-card">
                <h4>🔄 状态管理</h4>
                <p>使用 Pinia 进行状态管理，支持与主应用的状态同步</p>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="arch-card">
                <h4>📡 通信机制</h4>
                <p>通过 postMessage 实现微应用间的消息传递和事件通信</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
        <el-divider />
        
        <div class="features-section">
          <h3>✨ 核心功能</h3>
          <el-timeline>
            <el-timeline-item
              v-for="(feature, index) in features"
              :key="index"
              :timestamp="feature.timestamp"
              placement="top"
            >
              <el-card>
                <h4>{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        
        <el-divider />
        
        <div class="communication-demo">
          <h3>📡 通信演示</h3>
          <el-button @click="sendStatusUpdate" type="primary">
            发送状态更新
          </el-button>
          <el-button @click="requestData" type="success">
            请求数据
          </el-button>
          <el-button @click="broadcastEvent" type="warning">
            广播事件
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const features = ref([
  {
    title: '独立开发',
    description: '支持独立开发和调试，不依赖主应用环境',
    timestamp: '2024-01-01'
  },
  {
    title: '模块联邦',
    description: '基于 Vite 的模块联邦，实现微应用的动态加载',
    timestamp: '2024-01-02'
  },
  {
    title: '状态同步',
    description: '与主应用的状态管理同步，支持跨应用状态共享',
    timestamp: '2024-01-03'
  },
  {
    title: '通信机制',
    description: '完善的微前端通信机制，支持消息传递和事件广播',
    timestamp: '2024-01-04'
  }
])

const sendStatusUpdate = () => {
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'vue:status-update',
      payload: {
        status: 'running',
        timestamp: new Date().toISOString(),
        metrics: {
          memory: performance.memory?.usedJSHeapSize || 0,
          loadTime: performance.now()
        }
      },
      source: 'vue-micro-app'
    }, '*')
    
    ElMessage.success('状态更新已发送')
  }
}

const requestData = () => {
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'vue:request-data',
      payload: {
        requestId: Date.now(),
        dataType: 'user-profile',
        params: { userId: 123 }
      },
      source: 'vue-micro-app'
    }, '*')
    
    ElMessage.info('数据请求已发送')
  }
}

const broadcastEvent = () => {
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'vue:broadcast',
      payload: {
        event: 'user-action',
        data: {
          action: 'button-click',
          component: 'About.vue',
          timestamp: new Date().toISOString()
        }
      },
      source: 'vue-micro-app'
    }, '*')
    
    ElMessage.warning('事件广播已发送')
  }
}
</script>

<style scoped>
.vue-about {
  padding: 20px;
}

.about-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.about-content {
  text-align: left;
}

.architecture-section {
  margin: 30px 0;
}

.arch-card {
  margin-bottom: 20px;
  text-align: center;
}

.arch-card h4 {
  color: #409eff;
  margin-bottom: 10px;
}

.features-section {
  margin: 30px 0;
}

.communication-demo {
  margin: 30px 0;
  text-align: center;
}

.communication-demo .el-button {
  margin: 0 10px;
}
</style>

