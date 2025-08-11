<template>
  <div id="vue-app" class="vue-micro-app">
    <el-container>
      <el-header class="vue-header">
        <h2>Vue 微前端应用</h2>
        <div class="header-controls">
          <el-button @click="toggleTheme" :type="theme === 'dark' ? 'primary' : 'default'" size="small">
            {{ theme === 'dark' ? '🌞 浅色' : '🌙 深色' }}
          </el-button>
          <el-button @click="changeLocale('zh')" :type="locale === 'zh' ? 'primary' : 'default'" size="small">
            中文
          </el-button>
          <el-button @click="changeLocale('en')" :type="locale === 'en' ? 'primary' : 'default'" size="small">
            English
          </el-button>
        </div>
      </el-header>
      
      <el-main>
        <div class="status-info">
          <el-card class="status-card">
            <template #header>
              <span>应用状态</span>
            </template>
            <div class="status-content">
              <p><strong>当前主题:</strong> {{ theme === 'dark' ? '深色' : '浅色' }}</p>
              <p><strong>当前语言:</strong> {{ locale === 'zh' ? '中文' : 'English' }}</p>
              <p><strong>运行端口:</strong> 3004</p>
            </div>
          </el-card>
        </div>
        
        <router-view />
        
        <div class="message-log">
          <el-card class="log-card">
            <template #header>
              <span>消息通信日志</span>
            </template>
            <div class="log-content">
              <div v-if="messageLog.length === 0" class="no-messages">
                暂无通信消息
              </div>
              <div v-else class="message-list">
                <div v-for="(msg, index) in messageLog.slice().reverse()" :key="index" class="message-item">
                  <span class="timestamp">{{ msg.timestamp }}</span>
                  <span class="type">{{ msg.type }}</span>
                  <span class="payload">{{ JSON.stringify(msg.payload) }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-main>
      
      <el-footer class="vue-footer">
        <p>Vue 微应用 - 端口: 3004 | 主题: {{ theme }} | 语言: {{ locale }}</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const theme = ref('light')
const locale = ref('zh')
const messageLog = ref<Array<{type: string, payload: any, timestamp: string}>>([])

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.body.className = `theme-${theme.value}`
  
  // 发送主题变更消息到主应用
  if (window.parent !== window) {
    const message = {
      type: 'THEME_CHANGE',
      payload: { theme: theme.value },
      source: 'vue-micro-app'
    }
    window.parent.postMessage(message, '*')
    addMessageLog('THEME_CHANGE', message.payload)
  }
}

const changeLocale = (newLocale: string) => {
  locale.value = newLocale
  
  // 发送语言变更消息到主应用
  if (window.parent !== window) {
    const message = {
      type: 'LOCALE_CHANGE',
      payload: { locale: newLocale },
      source: 'vue-micro-app'
    }
    window.parent.postMessage(message, '*')
    addMessageLog('LOCALE_CHANGE', message.payload)
  }
}

const addMessageLog = (type: string, payload: any) => {
  messageLog.value.push({
    type,
    payload,
    timestamp: new Date().toLocaleTimeString()
  })
  
  // 保持最多10条记录
  if (messageLog.value.length > 10) {
    messageLog.value.shift()
  }
}

onMounted(() => {
  console.log('Vue微应用已挂载')
  
  // 监听来自主应用的消息
  window.addEventListener('message', (event) => {
    console.log('Vue微应用收到消息:', event.data)
    
    if (event.data?.source === 'react-host') {
      switch (event.data.type) {
        case 'THEME_CHANGE':
          theme.value = event.data.payload.theme
          document.body.className = `theme-${theme.value}`
          addMessageLog('收到主题切换', event.data.payload)
          break
        case 'LOCALE_CHANGE':
          locale.value = event.data.payload.locale
          addMessageLog('收到语言切换', event.data.payload)
          break
        default:
          addMessageLog('收到未知消息', event.data)
      }
    }
  })
  
  // 发送初始化完成消息
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'VUE_APP_READY',
      payload: { status: 'ready', theme: theme.value, locale: locale.value },
      source: 'vue-micro-app'
    }, '*')
  }
})
</script>

<style scoped>
.vue-micro-app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.vue-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.vue-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.vue-footer {
  background: #f5f5f5;
  text-align: center;
  padding: 20px;
  color: #666;
}

.theme-dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.theme-light {
  background-color: #ffffff;
  color: #333333;
}

.status-info {
  margin-bottom: 20px;
}

.status-card {
  margin-bottom: 20px;
}

.status-content p {
  margin: 8px 0;
  font-size: 14px;
}

.message-log {
  margin-top: 20px;
}

.log-card {
  margin-bottom: 20px;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
}

.no-messages {
  text-align: center;
  color: #999;
  padding: 20px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-item {
  display: flex;
  gap: 10px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
  align-items: center;
}

.timestamp {
  color: #666;
  min-width: 80px;
}

.type {
  color: #007bff;
  font-weight: bold;
  min-width: 100px;
}

.payload {
  color: #333;
  flex: 1;
  word-break: break-all;
}

/* 深色主题样式 */
.theme-dark .message-item {
  background: #2d3748;
  color: #e2e8f0;
}

.theme-dark .timestamp {
  color: #a0aec0;
}

.theme-dark .type {
  color: #63b3ed;
}

.theme-dark .payload {
  color: #e2e8f0;
}
</style>
