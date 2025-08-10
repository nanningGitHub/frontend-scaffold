# Zustand 状态管理指南

## 概述

本项目已成功引入 **Zustand** 作为前沿的状态管理工具，替代了原有的 React Context API 方案。

## 为什么选择 Zustand？

### 优势
- **轻量级**: Bundle size 仅 1KB，性能优异
- **类型安全**: 完整的 TypeScript 支持
- **简单易用**: API 简洁，学习成本低
- **持久化**: 内置持久化中间件
- **模块化**: 支持多个 store，便于状态分离
- **开发工具**: 支持 Redux DevTools

### 与 Redux 对比
- 更少的样板代码
- 更简单的 API
- 更好的 TypeScript 支持
- 更小的包体积

## 项目中的 Zustand 实现

### 1. 认证状态管理 (`authStore.ts`)

```typescript
// 状态接口
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// 动作接口
interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (userData: UserData) => Promise<void>
  logout: () => Promise<void>
  initializeAuth: () => Promise<void>
}
```

**特性:**
- 持久化存储（用户信息和 token）
- 自动初始化认证状态
- 完整的错误处理
- 类型安全的 API

### 2. UI 状态管理 (`uiStore.ts`)

```typescript
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  globalLoading: boolean
  modals: Record<string, boolean>
}
```

**特性:**
- 主题切换功能
- 通知系统
- 全局加载状态
- 模态框管理

## 使用方法

### 导入 Store（推荐方式）

```typescript
// ✅ 推荐：通过 barrel 文件统一导入
import { useAuthStore, useUIStore, useThemeStore, useI18nStore } from '../stores'

// ❌ 不推荐：直接导入单个文件
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
```

### 在组件中使用 Store

const MyComponent = () => {
  // 认证状态
  const { user, isAuthenticated, login, logout } = useAuthStore()
  
  // UI 状态
  const { theme, toggleTheme, addNotification } = useUIStore()
  
  // 使用状态和方法
  const handleLogin = async () => {
    try {
      await login(email, password)
      addNotification({
        type: 'success',
        message: '登录成功！',
        duration: 3000
      })
    } catch (error) {
      addNotification({
        type: 'error',
        message: '登录失败',
        duration: 5000
      })
    }
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <p>欢迎，{user?.name}</p>
      ) : (
        <button onClick={handleLogin}>登录</button>
      )}
    </div>
  )
}
```

### 状态持久化

认证状态会自动持久化到 localStorage：

```typescript
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // store 实现
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
)
```

### 通知系统

```typescript
// 显示通知
addNotification({
  type: 'success', // 'success' | 'error' | 'warning' | 'info'
  message: '操作成功！',
  duration: 3000, // 自动消失时间（毫秒）
})

// 手动移除通知
removeNotification(notificationId)
```

## 最佳实践

### 1. Store 设计原则

- **单一职责**: 每个 store 专注于一个领域
- **类型安全**: 完整的 TypeScript 类型定义
- **不可变性**: 使用 `set` 函数更新状态
- **持久化**: 合理使用持久化中间件

### 2. 性能优化

```typescript
// 选择性订阅状态
const user = useAuthStore(state => state.user)
const isAuthenticated = useAuthStore(state => state.isAuthenticated)

// 避免不必要的重渲染
const login = useAuthStore(state => state.login)
```

### 3. 错误处理

```typescript
const handleAction = async () => {
  try {
    setLoading(true)
    await someAsyncAction()
    addNotification({ type: 'success', message: '成功' })
  } catch (error) {
    addNotification({ type: 'error', message: '失败' })
  } finally {
    setLoading(false)
  }
}
```

## 迁移指南

### 从 Context API 迁移

1. **移除 Context Provider**
   ```typescript
   // 删除 AuthProvider 包装
   // 删除 useAuth hook
   ```

2. **更新组件导入**
   ```typescript
   // 旧方式
   import { useAuth } from '../contexts/AuthContext'
   
   // 新方式
   import { useAuthStore } from '../stores/authStore'
   ```

3. **更新状态使用**
   ```typescript
   // 旧方式
   const { user, login } = useAuth()
   
   // 新方式
   const { user, login } = useAuthStore()
   ```

## 开发工具

### Redux DevTools 支持

在开发环境中，Zustand 自动支持 Redux DevTools：

1. 安装浏览器扩展
2. 打开开发者工具
3. 查看 Redux 标签页
4. 实时查看状态变化

### 调试技巧

```typescript
// 在组件中调试状态
const state = useAuthStore()
console.log('Auth State:', state)

// 在 store 中调试
const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      login: async (email, password) => {
        console.log('Login attempt:', { email, password })
        // ... 实现
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)
```

## 重要注意事项

### 类型导出要求

为了确保 TypeScript 类型系统正常工作，每个 store 文件都必须正确导出其类型：

```typescript
// ✅ 正确：导出类型定义
export type AuthStore = AuthState & AuthActions
export type ThemeStore = ThemeState & ThemeActions
export type I18nStore = I18nState & I18nActions
export type UIStore = UIState & UIActions

// ❌ 错误：类型未导出
type AuthStore = AuthState & AuthActions
```

### 导入最佳实践

1. **统一导入**: 始终通过 `../stores` 导入，而不是直接导入单个文件
2. **类型安全**: 确保所有 store 类型都被正确导出
3. **错误处理**: 如果遇到类型导入错误，检查 store 文件是否正确导出了类型

## 总结

Zustand 为项目提供了：

1. **更好的开发体验**: 简洁的 API，完整的类型支持
2. **更高的性能**: 轻量级，精确的更新机制
3. **更强的可维护性**: 模块化设计，清晰的代码结构
4. **更丰富的功能**: 持久化、通知系统、主题管理等

通过引入 Zustand，项目获得了现代化、高效的状态管理解决方案，为后续功能扩展奠定了坚实基础。
