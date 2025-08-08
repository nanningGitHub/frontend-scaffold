# Layout 组件

应用的主布局组件，提供整体页面结构和初始化功能。

## 📋 组件概述

Layout 组件是应用的核心布局组件，负责：
- 提供统一的页面布局结构
- 包含导航栏组件
- 渲染子路由内容
- 初始化应用状态
- 显示通知系统

## 🎯 功能特性

### 1. 响应式布局
- 使用 Tailwind CSS 实现响应式设计
- 适配桌面端和移动端
- 统一的容器宽度和间距

### 2. 应用初始化
- 自动初始化认证状态
- 显示欢迎通知
- 错误处理和用户提示

### 3. 路由集成
- 使用 React Router 的 `Outlet` 组件
- 支持嵌套路由结构
- 保持导航状态

## 📖 API 文档

### Props
该组件不接受任何 props，所有配置通过内部状态管理。

### 内部状态
- 认证状态管理（通过 `useAuthStore`）
- UI 状态管理（通过 `useUIStore`）

### 依赖组件
- `Navigation` - 导航栏组件
- `NotificationSystem` - 通知系统组件
- `Outlet` - React Router 路由出口

## 💻 使用示例

### 基本用法
```tsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  )
}
```

### 在路由配置中使用
```tsx
// App.tsx
<Routes>
  <Route path="/" element={<Layout />}>
    {/* 所有子路由都会在 Layout 的 <Outlet /> 位置渲染 */}
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="profile" element={<UserProfile />} />
  </Route>
</Routes>
```

## 🔧 实现细节

### 初始化流程
```tsx
useEffect(() => {
  const initApp = async () => {
    try {
      // 1. 初始化认证状态
      await initializeAuth()
      
      // 2. 显示欢迎通知
      addNotification({
        type: 'success',
        message: '欢迎使用前端脚手架！',
        duration: 3000,
      })
    } catch (error) {
      // 3. 错误处理
      logger.error('App initialization failed', error)
      addNotification({
        type: 'error',
        message: '应用初始化失败，请刷新页面重试',
        duration: 5000,
      })
    }
  }

  initApp()
}, [initializeAuth, addNotification])
```

### 布局结构
```tsx
<div className="min-h-screen bg-gray-50">
  {/* 导航栏 */}
  <Navigation />
  
  {/* 主要内容区域 */}
  <main className="container mx-auto px-4 py-8">
    <Outlet />
  </main>
  
  {/* 通知系统 */}
  <NotificationSystem />
</div>
```

## ⚠️ 注意事项

### 1. 路由配置
- Layout 组件必须与 React Router 配合使用
- 子路由通过 `Outlet` 组件渲染
- 确保路由配置正确，避免嵌套错误

### 2. 状态管理
- 依赖 Zustand 状态管理
- 确保 `useAuthStore` 和 `useUIStore` 正确配置
- 初始化失败时提供用户友好的错误提示

### 3. 性能考虑
- 初始化逻辑在 `useEffect` 中执行
- 避免在渲染过程中进行异步操作
- 使用 `useCallback` 优化回调函数

## 🔗 相关组件

- [Navigation](./Navigation.md) - 导航栏组件
- [NotificationSystem](./NotificationSystem.md) - 通知系统组件
- [ErrorBoundary](./ErrorBoundary.md) - 错误边界组件

## 📝 更新日志

- **v1.0.0** - 初始版本，支持基本布局和初始化功能
- **v1.1.0** - 添加错误处理和用户通知
- **v1.2.0** - 优化响应式设计和性能

## 🧪 测试用例

```tsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from './Layout'

test('renders layout with navigation', () => {
  render(
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
  
  expect(screen.getByRole('navigation')).toBeInTheDocument()
  expect(screen.getByRole('main')).toBeInTheDocument()
})
```
