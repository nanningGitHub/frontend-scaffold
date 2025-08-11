<template>
  <div class="vue-counter">
    <el-card class="counter-card">
      <template #header>
        <div class="card-header">
          <span>🧮 Vue 计数器演示</span>
        </div>
      </template>
      
      <div class="counter-content">
        <div class="counter-display">
          <h2>当前计数: {{ count }}</h2>
          <div class="counter-buttons">
            <el-button @click="decrement" type="danger" size="large">
              ➖ 减少
            </el-button>
            <el-button @click="reset" type="warning" size="large">
              🔄 重置
            </el-button>
            <el-button @click="increment" type="primary" size="large">
              ➕ 增加
            </el-button>
          </div>
        </div>
        
        <el-divider />
        
        <div class="counter-history">
          <h3>📊 计数历史</h3>
          <el-table :data="history" style="width: 100%">
            <el-table-column prop="action" label="操作" width="120" />
            <el-table-column prop="value" label="数值" width="100" />
            <el-table-column prop="timestamp" label="时间" />
          </el-table>
        </div>
        
        <el-divider />
        
        <div class="counter-actions">
          <h3>⚙️ 高级功能</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-input-number
                v-model="step"
                :min="1"
                :max="100"
                label="步长"
                @change="updateStep"
              />
              <p>当前步长: {{ step }}</p>
            </el-col>
            <el-col :span="8">
              <el-button @click="addStep" type="success">
                增加 {{ step }}
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-button @click="subtractStep" type="danger">
                减少 {{ step }}
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <el-divider />
        
        <div class="counter-stats">
          <h3>📈 统计信息</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-statistic title="总操作次数" :value="totalOperations" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="最大值" :value="maxValue" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="最小值" :value="minValue" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="平均值" :value="averageValue" :precision="2" />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 响应式状态
const count = ref(0)
const step = ref(1)
const history = ref<Array<{
  action: string
  value: number
  timestamp: string
}>>([])

// 计算属性
const totalOperations = computed(() => history.value.length)
const maxValue = computed(() => Math.max(...history.value.map(h => h.value), 0))
const minValue = computed(() => Math.min(...history.value.map(h => h.value), 0))
const averageValue = computed(() => {
  if (history.value.length === 0) return 0
  const sum = history.value.reduce((acc, h) => acc + h.value, 0)
  return sum / history.value.length
})

// 方法
const addToHistory = (action: string, value: number) => {
  history.value.push({
    action,
    value,
    timestamp: new Date().toLocaleString()
  })
}

const increment = () => {
  count.value++
  addToHistory('增加', count.value)
  sendCounterUpdate()
}

const decrement = () => {
  count.value--
  addToHistory('减少', count.value)
  sendCounterUpdate()
}

const reset = () => {
  count.value = 0
  addToHistory('重置', count.value)
  sendCounterUpdate()
}

const addStep = () => {
  count.value += step.value
  addToHistory(`增加${step.value}`, count.value)
  sendCounterUpdate()
}

const subtractStep = () => {
  count.value -= step.value
  addToHistory(`减少${step.value}`, count.value)
  sendCounterUpdate()
}

const updateStep = (newStep: number) => {
  step.value = newStep
}

const sendCounterUpdate = () => {
  // 发送计数器更新到主应用
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'vue:counter-update',
      payload: {
        count: count.value,
        step: step.value,
        history: history.value,
        stats: {
          totalOperations: totalOperations.value,
          maxValue: maxValue.value,
          minValue: minValue.value,
          averageValue: averageValue.value
        }
      },
      source: 'vue-micro-app'
    }, '*')
  }
}

// 监听计数变化
watch(count, (newValue, oldValue) => {
  console.log(`计数器从 ${oldValue} 变为 ${newValue}`)
})
</script>

<style scoped>
.vue-counter {
  padding: 20px;
}

.counter-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.counter-content {
  text-align: center;
}

.counter-display {
  margin: 30px 0;
}

.counter-display h2 {
  font-size: 2.5rem;
  color: #409eff;
  margin-bottom: 30px;
}

.counter-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.counter-history {
  margin: 30px 0;
  text-align: left;
}

.counter-actions {
  margin: 30px 0;
}

.counter-stats {
  margin: 30px 0;
}
</style>

