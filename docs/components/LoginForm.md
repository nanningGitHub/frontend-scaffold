# LoginForm 组件

## 📋 概述

LoginForm 是一个功能完整的登录表单组件，提供用户认证、表单验证、错误处理、加载状态等功能。集成了现代化的 UI 设计和用户体验优化。

## 🎯 功能特性

- ✅ **表单验证** - 实时验证和错误提示
- ✅ **状态管理** - 与 Zustand 状态管理集成
- ✅ **错误处理** - 友好的错误信息展示
- ✅ **加载状态** - 提交时的加载指示器
- ✅ **响应式设计** - 适配不同屏幕尺寸
- ✅ **可访问性** - 支持键盘导航和屏幕阅读器
- ✅ **国际化** - 支持多语言文本

## 📦 安装和导入

```typescript
import { LoginForm } from '@/components/LoginForm'
```

## 🛠️ API 文档

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `onSuccess` | `(user: User) => void` | - | 否 | 登录成功回调 |
| `onError` | `(error: string) => void` | - | 否 | 登录失败回调 |
| `redirectTo` | `string` | `'/dashboard'` | 否 | 登录成功后重定向路径 |
| `className` | `string` | - | 否 | 自定义 CSS 类名 |

### 表单字段

| 字段名 | 类型 | 验证规则 | 说明 |
|--------|------|----------|------|
| `email` | `string` | 必填、邮箱格式 | 用户邮箱地址 |
| `password` | `string` | 必填、最小长度6位 | 用户密码 |

## 💡 使用示例

### 基本用法

```tsx
import { LoginForm } from '@/components/LoginForm'

function LoginPage() {
  const handleLoginSuccess = (user) => {
    console.log('登录成功:', user)
    // 可以在这里添加额外的逻辑
  }

  const handleLoginError = (error) => {
    console.error('登录失败:', error)
    // 可以在这里添加错误处理逻辑
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        redirectTo="/dashboard"
      />
    </div>
  )
}
```

### 自定义样式

```tsx
import { LoginForm } from '@/components/LoginForm'

function CustomLoginPage() {
  return (
    <div className="custom-login-container">
      <LoginForm
        className="custom-login-form"
        redirectTo="/profile"
      />
    </div>
  )
}
```

### 与路由集成

```tsx
import { LoginForm } from '@/components/LoginForm'
import { useNavigate, useLocation } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLoginSuccess = (user) => {
    // 获取用户想要访问的原始页面
    const from = location.state?.from?.pathname || '/dashboard'
    navigate(from, { replace: true })
  }

  return (
    <div className="login-page">
      <h1>用户登录</h1>
      <LoginForm
        onSuccess={handleLoginSuccess}
        redirectTo="/dashboard"
      />
    </div>
  )
}
```

### 与状态管理集成

```tsx
import { LoginForm } from '@/components/LoginForm'
import { useAuthStore } from '@/stores/authStore'
import { useNotification } from '@/components/NotificationSystem'

function LoginPage() {
  const { login } = useAuthStore()
  const { showNotification } = useNotification()

  const handleLoginSuccess = (user) => {
    showNotification({
      type: 'success',
      title: '登录成功',
      message: `欢迎回来，${user.name}！`
    })
  }

  const handleLoginError = (error) => {
    showNotification({
      type: 'error',
      title: '登录失败',
      message: error
    })
  }

  return (
    <LoginForm
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
    />
  )
}
```

## 🔧 实现细节

### 表单状态管理

```typescript
// 使用 useForm Hook 管理表单状态
const {
  values,
  errors,
  touched,
  isSubmitting,
  handleInputChange,
  handleSubmit,
} = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationRules: {
    email: commonValidationRules.email,
    password: commonValidationRules.password,
  },
  onSubmit: async (values) => {
    clearError()
    await login(values.email, values.password)
  },
  onError: (errors) => {
    logger.warn('Login form validation failed', errors)
  },
})
```

### 验证规则

```typescript
// 邮箱验证规则
const emailValidation = {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: '请输入有效的邮箱地址'
}

// 密码验证规则
const passwordValidation = {
  required: true,
  minLength: 6,
  message: '密码至少需要6个字符'
}
```

### 错误处理

```typescript
// 表单验证错误处理
const handleValidationError = (errors: Record<string, string>) => {
  logger.warn('Form validation failed', errors)
  
  // 显示第一个错误信息
  const firstError = Object.values(errors)[0]
  if (firstError) {
    showNotification({
      type: 'error',
      title: '表单验证失败',
      message: firstError
    })
  }
}

// API 错误处理
const handleApiError = (error: Error) => {
  logger.error('Login API error', error)
  
  let errorMessage = '登录失败，请稍后重试'
  
  if (error.message.includes('Invalid credentials')) {
    errorMessage = '邮箱或密码错误'
  } else if (error.message.includes('Network error')) {
    errorMessage = '网络连接异常，请检查网络设置'
  }
  
  showNotification({
    type: 'error',
    title: '登录失败',
    message: errorMessage
  })
}
```

### 加载状态管理

```typescript
// 提交状态管理
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (isSubmitting) return
  
  setIsSubmitting(true)
  
  try {
    await login(values.email, values.password)
    onSuccess?.(user)
  } catch (error) {
    onError?.(error.message)
  } finally {
    setIsSubmitting(false)
  }
}
```

## 🧪 测试用例

### 单元测试

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'
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

describe('LoginForm', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      login: jest.fn(),
      error: null,
      clearError: jest.fn()
    })
  })

  it('renders login form with email and password fields', () => {
    renderWithRouter(<LoginForm />)
    
    expect(screen.getByLabelText(/邮箱地址/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument()
  })

  it('validates email format', async () => {
    renderWithRouter(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/邮箱地址/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)
    
    await waitFor(() => {
      expect(screen.getByText(/请输入有效的邮箱地址/i)).toBeInTheDocument()
    })
  })

  it('validates password length', async () => {
    renderWithRouter(<LoginForm />)
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.blur(passwordInput)
    
    await waitFor(() => {
      expect(screen.getByText(/密码至少需要6个字符/i)).toBeInTheDocument()
    })
  })

  it('calls login function with form data', async () => {
    const mockLogin = jest.fn()
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      error: null,
      clearError: jest.fn()
    })

    renderWithRouter(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/邮箱地址/i)
    const passwordInput = screen.getByLabelText(/密码/i)
    const submitButton = screen.getByRole('button', { name: /登录/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('shows error message when login fails', () => {
    mockUseAuthStore.mockReturnValue({
      login: jest.fn(),
      error: 'Invalid credentials',
      clearError: jest.fn()
    })

    renderWithRouter(<LoginForm />)
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('disables submit button when form is submitting', async () => {
    const mockLogin = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      error: null,
      clearError: jest.fn()
    })

    renderWithRouter(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/邮箱地址/i)
    const passwordInput = screen.getByLabelText(/密码/i)
    const submitButton = screen.getByRole('button', { name: /登录/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    expect(submitButton).toBeDisabled()
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })
})
```

### 集成测试

```typescript
describe('LoginForm Integration', () => {
  it('integrates with authentication store', async () => {
    const mockLogin = jest.fn()
    const mockOnSuccess = jest.fn()
    
    mockUseAuthStore.mockReturnValue({
      login: mockLogin.mockResolvedValue({ id: '1', name: 'Test User' }),
      error: null,
      clearError: jest.fn()
    })

    renderWithRouter(
      <LoginForm onSuccess={mockOnSuccess} />
    )
    
    const emailInput = screen.getByLabelText(/邮箱地址/i)
    const passwordInput = screen.getByLabelText(/密码/i)
    const submitButton = screen.getByRole('button', { name: /登录/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(mockOnSuccess).toHaveBeenCalledWith({ id: '1', name: 'Test User' })
    })
  })
})
```

## 📝 注意事项

### 1. 安全性
- 密码字段使用 `type="password"` 隐藏输入
- 表单提交使用 HTTPS
- 实现 CSRF 保护
- 添加登录尝试次数限制

### 2. 用户体验
- 提供"记住我"功能
- 支持密码强度指示器
- 添加社交媒体登录选项
- 实现密码重置功能

### 3. 可访问性
- 使用语义化的 HTML 标签
- 提供适当的 ARIA 属性
- 支持键盘导航
- 确保足够的颜色对比度

### 4. 性能优化
- 使用防抖处理输入验证
- 避免不必要的重新渲染
- 优化表单提交性能
- 实现智能缓存策略

## 🔗 相关链接

- [组件文档索引](../README.md)
- [状态管理指南](../ZUSTAND_GUIDE.md)
- [表单验证工具](../utils/validation.md)

---

*最后更新: 2024年12月*
*组件版本: v1.0.0*
