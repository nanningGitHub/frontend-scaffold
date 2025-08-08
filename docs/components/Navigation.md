# Navigation 组件

响应式导航栏组件，提供应用导航、用户认证状态显示和主题切换功能。

## 📋 组件概述

Navigation 组件是应用的主要导航组件，负责：
- 提供响应式导航菜单
- 显示用户认证状态
- 支持主题切换功能
- 移动端侧边栏菜单
- 路由状态管理

## 🎯 功能特性

### 1. 响应式设计
- 桌面端：水平导航菜单
- 移动端：汉堡菜单 + 侧边栏
- 自适应布局和交互

### 2. 用户认证集成
- 显示登录/注册按钮（未认证）
- 显示用户信息和登出按钮（已认证）
- 动态路由权限控制

### 3. 主题切换
- 支持浅色/深色主题切换
- 主题状态持久化
- 图标动态切换

### 4. 路由状态
- 当前路由高亮显示
- 路由状态同步
- 导航历史管理

## 📖 API 文档

### Props
该组件不接受任何 props，所有状态通过 Zustand store 管理。

### 内部状态
```typescript
// 认证状态
const { user, isAuthenticated, logout } = useAuthStore()

// UI 状态
const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore()
```

### 路由状态
```typescript
const location = useLocation()
const isActive = (path: string) => location.pathname === path
```

## 💻 使用示例

### 基本用法
```tsx
import Navigation from './components/Navigation'

function Layout() {
  return (
    <div>
      <Navigation />
      <main>
        {/* 页面内容 */}
      </main>
    </div>
  )
}
```

### 在布局中使用
```tsx
// Layout.tsx
<div className="min-h-screen bg-gray-50">
  <Navigation />
  <main className="container mx-auto px-4 py-8">
    <Outlet />
  </main>
</div>
```

## 🔧 实现细节

### 响应式导航结构
```tsx
<nav className="bg-white shadow-lg border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      {/* 左侧：Logo 和导航链接 */}
      <div className="flex items-center">
        {/* 移动端菜单按钮 */}
        <button className="md:hidden">
          <svg>...</svg>
        </button>
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          前端脚手架
        </Link>
        
        {/* 桌面端导航链接 */}
        <div className="hidden md:ml-6 md:flex md:space-x-8">
          {/* 导航链接 */}
        </div>
      </div>
      
      {/* 右侧：主题切换和用户菜单 */}
      <div className="flex items-center space-x-4">
        {/* 主题切换按钮 */}
        <button onClick={toggleTheme}>
          {/* 主题图标 */}
        </button>
        
        {/* 用户菜单 */}
        {isAuthenticated ? (
          <div>用户信息 + 登出</div>
        ) : (
          <div>登录 + 注册</div>
        )}
      </div>
    </div>
  </div>
  
  {/* 移动端侧边栏 */}
  {sidebarOpen && (
    <div className="md:hidden">
      {/* 移动端菜单项 */}
    </div>
  )}
</nav>
```

### 路由激活状态
```tsx
const isActive = (path: string) => {
  return location.pathname === path
}

// 使用示例
<Link
  to="/"
  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive('/')
      ? 'text-blue-600 bg-blue-50'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
  }`}
>
  首页
</Link>
```

### 主题切换实现
```tsx
const toggleTheme = useCallback(() => {
  setTheme(theme === 'light' ? 'dark' : 'light')
}, [theme, setTheme])

// 主题图标
{theme === 'light' ? (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
) : (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
)}
```

## ⚠️ 注意事项

### 1. 状态管理依赖
- 依赖 `useAuthStore` 获取认证状态
- 依赖 `useUIStore` 获取 UI 状态
- 确保 store 正确配置和初始化

### 2. 路由集成
- 使用 `useLocation` 获取当前路由
- 确保在 Router 上下文中使用
- 路由变化时自动更新激活状态

### 3. 响应式设计
- 移动端菜单需要手动关闭
- 主题切换状态需要持久化
- 确保所有交互元素可访问

### 4. 性能优化
- 使用 `useCallback` 优化事件处理
- 避免不必要的重新渲染
- 合理使用 `useMemo` 缓存计算结果

## 🔗 相关组件

- [Layout](./Layout.md) - 布局组件
- [ProtectedRoute](./ProtectedRoute.md) - 路由保护组件
- [UserProfile](./UserProfile.md) - 用户资料组件

## 📝 更新日志

- **v1.0.0** - 初始版本，支持基本导航功能
- **v1.1.0** - 添加响应式设计和移动端菜单
- **v1.2.0** - 集成主题切换功能
- **v1.3.0** - 优化用户认证状态显示

## 🧪 测试用例

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navigation from './Navigation'

test('renders navigation with logo', () => {
  render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  )
  
  expect(screen.getByText('前端脚手架')).toBeInTheDocument()
})

test('toggles mobile menu', () => {
  render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  )
  
  const menuButton = screen.getByRole('button', { name: /menu/i })
  fireEvent.click(menuButton)
  
  expect(screen.getByText('首页')).toBeInTheDocument()
})

test('shows login/register when not authenticated', () => {
  render(
    <BrowserRouter>
      <Navigation />
    </BrowserRouter>
  )
  
  expect(screen.getByText('登录')).toBeInTheDocument()
  expect(screen.getByText('注册')).toBeInTheDocument()
})
```
