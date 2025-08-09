import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './i18n'
import i18n from './i18n'

/**
 * 应用入口文件
 * 
 * 主要功能：
 * 1. 创建 React 根节点
 * 2. 配置路由系统
 * 3. 挂载应用到 DOM
 * 4. 启用严格模式
 */

// 获取根 DOM 元素
const rootElement = document.getElementById('root')

// 确保根元素存在
if (!rootElement) {
  throw new Error('Root element not found')
}

// 创建 React 根节点
const root = ReactDOM.createRoot(rootElement)

// 根据语言方向设置 html[dir]
document.documentElement.setAttribute('dir', i18n.dir())
i18n.on('languageChanged', () => {
  document.documentElement.setAttribute('dir', i18n.dir())
})

// 渲染应用
root.render(
  <React.StrictMode>
    {/* 路由配置 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
