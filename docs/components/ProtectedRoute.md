# ProtectedRoute 组件

## 📋 概述

ProtectedRoute 是一个路由保护组件，用于保护需要认证才能访问的页面。当用户未登录时，会自动重定向到登录页面。

## 🎯 功能特性

- ✅ **认证检查** - 自动检查用户登录状态
- ✅ **自动重定向** - 未登录时重定向到登录页
- ✅ **状态保持** - 登录后返回原页面
- ✅ **权限控制** - 支持基于角色的权限控制
- ✅ **加载状态** - 认证检查期间的加载提示
- ✅ **错误处理** - 优雅的错误处理机制

## 📦 安装和导入

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute'
```

## 🛠️ API 文档

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `children` | `ReactNode` | - | 是 | 需要保护的路由内容 |
| `requiredRole` | `string \| string[]` | - | 否 | 需要的用户角色 |
| `fallback` | `ReactNode` | `<Navigate to="/login" />` | 否 | 未认证时的替代内容 |
| `loadingComponent` | `ReactNode` | `<LoadingSpinner />` | 否 | 加载状态组件 |

## 💡 使用示例

### 基本用法

```tsx
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserProfile } from '@/components/UserProfile'

function App() {
  return (
    <Routes>
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
```

### 带角色权限的用法

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminPanel } from '@/components/AdminPanel'

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminPanel />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole={['admin', 'manager']}>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
```

### 自定义加载和错误状态

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { CustomLoading } from '@/components/CustomLoading'
import { AccessDenied } from '@/components/AccessDenied'

function CustomProtectedRoute() {
  return (
    <ProtectedRoute
      requiredRole="admin"
      loadingComponent={<CustomLoading />}
      fallback={<AccessDenied />}
    >
      <AdminContent />
    </ProtectedRoute>
  )
}
```

### 与状态管理集成

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuthStore } from '@/stores/authStore'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <Routes>
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile user={user} />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute requiredRole="premium">
          <PremiumSettings />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
```

## 🔧 实现细节

### 核心逻辑

```typescript
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { LoadingSpinner } from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[]
  fallback?: React.ReactNode
  loadingComponent?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback = <Navigate to="/login" state={{ from: location }} replace />,
  loadingComponent = <LoadingSpinner />
}) => {
  const { isAuthenticated, user, loading } = useAuthStore()
  const location = useLocation()

  // 显示加载状态
  if (loading) {
    return <>{loadingComponent}</>
  }

  // 检查认证状态
  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  // 检查角色权限
  if (requiredRole && user) {
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.some(role => user.roles?.includes(role))
      : user.roles?.includes(requiredRole)

    if (!hasRequiredRole) {
      return <Navigate to="/access-denied" replace />
    }
  }

  return <>{children}</>
}
```

### 权限检查逻辑

```typescript
// 角色权限检查函数
const checkRolePermission = (
  userRoles: string[],
  requiredRole: string | string[]
): boolean => {
  if (!userRoles || userRoles.length === 0) {
    return false
  }

  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => userRoles.includes(role))
  }

  return userRoles.includes(requiredRole)
}

// 权限级别检查
const checkPermissionLevel = (
  userLevel: number,
  requiredLevel: number
): boolean => {
  return userLevel >= requiredLevel
}
```

### 路由状态管理

```typescript
// 保存原始路由信息
const saveOriginalRoute = (pathname: string) => {
  sessionStorage.setItem('originalRoute', pathname)
}

// 恢复原始路由
const restoreOriginalRoute = (): string | null => {
  const originalRoute = sessionStorage.getItem('originalRoute')
  sessionStorage.removeItem('originalRoute')
  return originalRoute
}

// 在登录成功后重定向到原页面
const handleLoginSuccess = () => {
  const originalRoute = restoreOriginalRoute()
  if (originalRoute) {
    navigate(originalRoute, { replace: true })
  } else {
    navigate('/dashboard', { replace: true })
  }
}
```

## 🧪 测试用例

### 单元测试

```typescript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuthStore } from '../stores/authStore'

// 模拟 useAuthStore
jest.mock('../stores/authStore')

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false
    })
  })

  it('renders children when user is authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User' },
      loading: false
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    // 应该重定向到登录页面
    expect(window.location.pathname).toBe('/login')
  })

  it('shows loading component when authentication is loading', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: true
    })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('checks role permissions correctly', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', name: 'Test User', roles: ['user'] },
      loading: false
    })

    renderWithRouter(
      <ProtectedRoute requiredRole="admin">
        <div>Admin Content</div>
      </ProtectedRoute>
    )

    // 用户没有 admin 角色，应该重定向到访问拒绝页面
    expect(window.location.pathname).toBe('/access-denied')
  })
})
```

### 集成测试

```typescript
describe('ProtectedRoute Integration', () => {
  it('works with authentication flow', async () => {
    const TestApp = () => {
      const [isAuthenticated, setIsAuthenticated] = useState(false)
      
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <div>Profile Page</div>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      )
    }

    render(<TestApp />)

    // 初始状态未登录，访问受保护页面应该重定向到登录页
    fireEvent.click(screen.getByText('Profile Page'))
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
```

## 📝 注意事项

### 1. 性能考虑
- 避免在 ProtectedRoute 中进行复杂的权限计算
- 使用缓存机制减少重复的权限检查
- 考虑使用 React.memo 优化渲染性能

### 2. 安全性
- 客户端权限检查仅用于用户体验
- 重要的权限验证必须在服务器端进行
- 敏感数据不应在客户端存储

### 3. 用户体验
- 提供清晰的加载状态提示
- 友好的错误信息
- 支持记住用户想要访问的页面

### 4. 最佳实践
- 使用统一的权限管理
- 提供权限不足的友好提示
- 支持多级权限控制
- 实现权限的动态更新

## 🔗 相关链接

- [组件文档索引](../README.md)
- [状态管理指南](../ZUSTAND_GUIDE.md)
- [认证上下文](../contexts/AuthContext.md)

---

*最后更新: 2024年12月*
*组件版本: v1.0.0*
