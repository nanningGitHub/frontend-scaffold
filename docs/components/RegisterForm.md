# RegisterForm 组件

## 📋 概述

RegisterForm 是一个功能完整的用户注册表单组件，提供用户注册、表单验证、密码强度检查、错误处理等功能。支持多种注册方式和用户友好的交互体验。

## 🎯 功能特性

- ✅ **完整表单验证** - 实时验证所有字段
- ✅ **密码强度检查** - 实时密码强度指示器
- ✅ **邮箱验证** - 邮箱格式和唯一性检查
- ✅ **用户名检查** - 用户名可用性验证
- ✅ **加载状态** - 提交和验证时的加载指示
- ✅ **错误处理** - 友好的错误信息展示
- ✅ **响应式设计** - 适配不同屏幕尺寸
- ✅ **可访问性** - 支持键盘导航和屏幕阅读器

## 📦 安装和导入

```typescript
import { RegisterForm } from '@/components/RegisterForm'
```

## 🛠️ API 文档

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `onSuccess` | `(user: User) => void` | - | 否 | 注册成功回调 |
| `onError` | `(error: string) => void` | - | 否 | 注册失败回调 |
| `redirectTo` | `string` | `'/login'` | 否 | 注册成功后重定向路径 |
| `className` | `string` | - | 否 | 自定义 CSS 类名 |
| `showPasswordStrength` | `boolean` | `true` | 否 | 是否显示密码强度指示器 |

### 表单字段

| 字段名 | 类型 | 验证规则 | 说明 |
|--------|------|----------|------|
| `username` | `string` | 必填、3-20字符、唯一性 | 用户名 |
| `email` | `string` | 必填、邮箱格式、唯一性 | 邮箱地址 |
| `password` | `string` | 必填、最小8位、包含大小写字母和数字 | 密码 |
| `confirmPassword` | `string` | 必填、与密码一致 | 确认密码 |
| `agreeToTerms` | `boolean` | 必填 | 同意服务条款 |

## 💡 使用示例

### 基本用法

```tsx
import { RegisterForm } from '@/components/RegisterForm'

function RegisterPage() {
  const handleRegisterSuccess = (user) => {
    console.log('注册成功:', user)
    // 可以在这里添加额外的逻辑
  }

  const handleRegisterError = (error) => {
    console.error('注册失败:', error)
    // 可以在这里添加错误处理逻辑
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RegisterForm
        onSuccess={handleRegisterSuccess}
        onError={handleRegisterError}
        redirectTo="/dashboard"
      />
    </div>
  )
}
```

### 自定义配置

```tsx
import { RegisterForm } from '@/components/RegisterForm'

function CustomRegisterPage() {
  return (
    <div className="custom-register-container">
      <RegisterForm
        className="custom-register-form"
        showPasswordStrength={true}
        redirectTo="/profile"
      />
    </div>
  )
}
```

### 与状态管理集成

```tsx
import { RegisterForm } from '@/components/RegisterForm'
import { useAuthStore } from '@/stores/authStore'
import { useNotification } from '@/components/NotificationSystem'

function RegisterPage() {
  const { register } = useAuthStore()
  const { showNotification } = useNotification()

  const handleRegisterSuccess = (user) => {
    showNotification({
      type: 'success',
      title: '注册成功',
      message: `欢迎加入，${user.username}！请登录您的账户。`
    })
  }

  const handleRegisterError = (error) => {
    showNotification({
      type: 'error',
      title: '注册失败',
      message: error
    })
  }

  return (
    <RegisterForm
      onSuccess={handleRegisterSuccess}
      onError={handleRegisterError}
    />
  )
}
```

### 与路由集成

```tsx
import { RegisterForm } from '@/components/RegisterForm'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const navigate = useNavigate()

  const handleRegisterSuccess = (user) => {
    // 注册成功后跳转到登录页面
    navigate('/login', { 
      state: { 
        message: '注册成功！请使用您的邮箱和密码登录。' 
      } 
    })
  }

  return (
    <div className="register-page">
      <h1>创建新账户</h1>
      <RegisterForm
        onSuccess={handleRegisterSuccess}
        redirectTo="/login"
      />
    </div>
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
  validate,
} = useForm({
  initialValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  },
  validationRules: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      custom: async (value) => {
        // 检查用户名唯一性
        const isAvailable = await checkUsernameAvailability(value)
        return isAvailable ? null : '用户名已被使用'
      }
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: async (value) => {
        // 检查邮箱唯一性
        const isAvailable = await checkEmailAvailability(value)
        return isAvailable ? null : '邮箱已被注册'
      }
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    },
    confirmPassword: {
      required: true,
      custom: (value) => {
        return value === values.password ? null : '密码不匹配'
      }
    },
    agreeToTerms: {
      required: true,
      custom: (value) => {
        return value ? null : '请同意服务条款'
      }
    }
  },
  onSubmit: async (values) => {
    clearError()
    await register({
      username: values.username,
      email: values.email,
      password: values.password,
    })
  },
})
```

### 密码强度检查

```typescript
// 密码强度检查函数
const checkPasswordStrength = (password: string) => {
  let score = 0
  const feedback = []

  // 长度检查
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('密码至少需要8个字符')
  }

  // 包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含小写字母')
  }

  // 包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含大写字母')
  }

  // 包含数字
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('需要包含数字')
  }

  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('建议包含特殊字符')
  }

  // 返回强度等级
  if (score <= 2) return { level: 'weak', score, feedback }
  if (score <= 4) return { level: 'medium', score, feedback }
  return { level: 'strong', score, feedback }
}
```

### 实时验证

```typescript
// 用户名可用性检查
const checkUsernameAvailability = async (username: string) => {
  try {
    const response = await api.get(`/auth/check-username?username=${username}`)
    return response.data.available
  } catch (error) {
    logger.error('Username availability check failed', error)
    return true // 默认允许，避免阻塞用户
  }
}

// 邮箱可用性检查
const checkEmailAvailability = async (email: string) => {
  try {
    const response = await api.get(`/auth/check-email?email=${email}`)
    return response.data.available
  } catch (error) {
    logger.error('Email availability check failed', error)
    return true // 默认允许，避免阻塞用户
  }
}

// 防抖处理
const debouncedUsernameCheck = useDebounceCallback(
  checkUsernameAvailability,
  500
)

const debouncedEmailCheck = useDebounceCallback(
  checkEmailAvailability,
  500
)
```

### 错误处理

```typescript
// 注册错误处理
const handleRegisterError = (error: Error) => {
  logger.error('Registration error', error)
  
  let errorMessage = '注册失败，请稍后重试'
  
  if (error.message.includes('Username already exists')) {
    errorMessage = '用户名已被使用，请选择其他用户名'
  } else if (error.message.includes('Email already exists')) {
    errorMessage = '邮箱已被注册，请使用其他邮箱或尝试登录'
  } else if (error.message.includes('Invalid email format')) {
    errorMessage = '邮箱格式不正确，请检查后重试'
  } else if (error.message.includes('Password too weak')) {
    errorMessage = '密码强度不够，请使用更复杂的密码'
  } else if (error.message.includes('Network error')) {
    errorMessage = '网络连接异常，请检查网络设置'
  }
  
  showNotification({
    type: 'error',
    title: '注册失败',
    message: errorMessage
  })
}
```

## 🧪 测试用例

### 单元测试

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RegisterForm } from './RegisterForm'
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

describe('RegisterForm', () => {
  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      register: jest.fn(),
      error: null,
      clearError: jest.fn()
    })
  })

  it('renders all form fields', () => {
    renderWithRouter(<RegisterForm />)
    
    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/邮箱地址/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/确认密码/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /注册/i })).toBeInTheDocument()
  })

  it('validates username format', async () => {
    renderWithRouter(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText(/用户名/i)
    fireEvent.change(usernameInput, { target: { value: 'ab' } })
    fireEvent.blur(usernameInput)
    
    await waitFor(() => {
      expect(screen.getByText(/用户名至少需要3个字符/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    renderWithRouter(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/邮箱地址/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)
    
    await waitFor(() => {
      expect(screen.getByText(/请输入有效的邮箱地址/i)).toBeInTheDocument()
    })
  })

  it('validates password strength', async () => {
    renderWithRouter(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/密码/i)
    fireEvent.change(passwordInput, { target: { value: 'weak' } })
    fireEvent.blur(passwordInput)
    
    await waitFor(() => {
      expect(screen.getByText(/密码至少需要8个字符/i)).toBeInTheDocument()
    })
  })

  it('validates password confirmation', async () => {
    renderWithRouter(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/密码/i)
    const confirmPasswordInput = screen.getByLabelText(/确认密码/i)
    
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password456' } })
    fireEvent.blur(confirmPasswordInput)
    
    await waitFor(() => {
      expect(screen.getByText(/密码不匹配/i)).toBeInTheDocument()
    })
  })

  it('requires terms agreement', async () => {
    renderWithRouter(<RegisterForm />)
    
    const submitButton = screen.getByRole('button', { name: /注册/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/请同意服务条款/i)).toBeInTheDocument()
    })
  })

  it('calls register function with form data', async () => {
    const mockRegister = jest.fn()
    mockUseAuthStore.mockReturnValue({
      register: mockRegister,
      error: null,
      clearError: jest.fn()
    })

    renderWithRouter(<RegisterForm />)
    
    const usernameInput = screen.getByLabelText(/用户名/i)
    const emailInput = screen.getByLabelText(/邮箱地址/i)
    const passwordInput = screen.getByLabelText(/密码/i)
    const confirmPasswordInput = screen.getByLabelText(/确认密码/i)
    const termsCheckbox = screen.getByRole('checkbox')
    const submitButton = screen.getByRole('button', { name: /注册/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } })
    fireEvent.click(termsCheckbox)
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      })
    })
  })
})
```

### 集成测试

```typescript
describe('RegisterForm Integration', () => {
  it('integrates with authentication store', async () => {
    const mockRegister = jest.fn()
    const mockOnSuccess = jest.fn()
    
    mockUseAuthStore.mockReturnValue({
      register: mockRegister.mockResolvedValue({ 
        id: '1', 
        username: 'testuser',
        email: 'test@example.com'
      }),
      error: null,
      clearError: jest.fn()
    })

    renderWithRouter(
      <RegisterForm onSuccess={mockOnSuccess} />
    )
    
    // 填写表单并提交
    const usernameInput = screen.getByLabelText(/用户名/i)
    const emailInput = screen.getByLabelText(/邮箱地址/i)
    const passwordInput = screen.getByLabelText(/密码/i)
    const confirmPasswordInput = screen.getByLabelText(/确认密码/i)
    const termsCheckbox = screen.getByRole('checkbox')
    const submitButton = screen.getByRole('button', { name: /注册/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123' } })
    fireEvent.click(termsCheckbox)
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      })
      expect(mockOnSuccess).toHaveBeenCalledWith({
        id: '1',
        username: 'testuser',
        email: 'test@example.com'
      })
    })
  })
})
```

## 📝 注意事项

### 1. 安全性
- 密码字段使用 `type="password"` 隐藏输入
- 实现密码强度要求
- 添加验证码或 reCAPTCHA
- 限制注册频率

### 2. 用户体验
- 提供密码强度实时反馈
- 支持社交媒体注册
- 添加邮箱验证流程
- 实现注册进度指示器

### 3. 可访问性
- 使用语义化的 HTML 标签
- 提供适当的 ARIA 属性
- 支持键盘导航
- 确保足够的颜色对比度

### 4. 性能优化
- 使用防抖处理实时验证
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
