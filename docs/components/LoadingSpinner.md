# LoadingSpinner 组件

可配置的加载动画组件，支持多种尺寸、颜色和显示模式。

## 📋 组件概述

LoadingSpinner 组件是一个灵活的加载动画组件，提供：
- 多种尺寸和颜色配置
- 全屏和遮罩模式
- 可选的加载文本
- 骨架屏加载效果
- 专门化的加载组件

## 🎯 功能特性

### 1. 可配置外观
- 4种尺寸：sm、md、lg、xl
- 4种颜色：primary、secondary、white、gray
- 可选的加载文本
- 平滑的动画效果

### 2. 多种显示模式
- 默认模式：内联显示
- 全屏模式：覆盖整个屏幕
- 遮罩模式：覆盖父容器
- 骨架屏模式：模拟内容结构

### 3. 专门化组件
- PageLoading：页面级加载
- ButtonLoading：按钮内加载
- CardLoading：卡片骨架屏
- TableLoading：表格骨架屏

## 📖 API 文档

### Props

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  text?: string
  fullScreen?: boolean
  overlay?: boolean
}
```

| 属性 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | ❌ | `'md'` | 加载动画的尺寸 |
| `color` | `'primary' \| 'secondary' \| 'white' \| 'gray'` | ❌ | `'primary'` | 加载动画的颜色 |
| `text` | `string` | ❌ | - | 显示的加载文本 |
| `fullScreen` | `boolean` | ❌ | `false` | 是否全屏显示 |
| `overlay` | `boolean` | ❌ | `false` | 是否显示遮罩 |

### 尺寸配置
```typescript
const sizeClasses = {
  sm: 'w-4 h-4',    // 16px
  md: 'w-6 h-6',    // 24px
  lg: 'w-8 h-8',    // 32px
  xl: 'w-12 h-12',  // 48px
}
```

### 颜色配置
```typescript
const colorClasses = {
  primary: 'text-blue-600',   // 主色调
  secondary: 'text-gray-600', // 次要色
  white: 'text-white',        // 白色
  gray: 'text-gray-400',      // 灰色
}
```

## 💻 使用示例

### 基本用法
```tsx
import LoadingSpinner from './components/LoadingSpinner'

// 默认样式
<LoadingSpinner />

// 自定义尺寸和颜色
<LoadingSpinner size="lg" color="primary" text="加载中..." />
```

### 全屏加载
```tsx
// 全屏模式
<LoadingSpinner 
  fullScreen 
  size="xl" 
  text="页面加载中..." 
/>

// 遮罩模式
<LoadingSpinner 
  overlay 
  size="lg" 
  text="处理中..." 
/>
```

### 专门化组件
```tsx
import { 
  PageLoading, 
  ButtonLoading, 
  CardLoading, 
  TableLoading 
} from './components/LoadingSpinner'

// 页面加载
<PageLoading text="正在加载页面..." />

// 按钮加载
<ButtonLoading size="sm" />

// 卡片骨架屏
<CardLoading />

// 表格骨架屏
<TableLoading rows={10} columns={5} />
```

### 在组件中使用
```tsx
function UserList() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <LoadingSpinner size="lg" text="加载用户列表..." />
  }

  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

### 按钮加载状态
```tsx
function SubmitButton() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await submitForm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleSubmit}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {loading ? <ButtonLoading /> : '提交'}
    </button>
  )
}
```

## 🔧 实现细节

### 核心动画组件
```tsx
const Spinner = () => (
  <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}>
    <span className="sr-only">加载中...</span>
  </div>
)
```

### 基础加载组件
```tsx
const BaseSpinner = () => (
  <div className="flex flex-col items-center justify-center space-y-3">
    <Spinner />
    {text && (
      <p className={`text-sm ${colorClasses[color]} animate-pulse`}>
        {text}
      </p>
    )}
  </div>
)
```

### 显示模式逻辑
```tsx
// 全屏模式
if (fullScreen) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
      <BaseSpinner />
    </div>
  )
}

// 遮罩模式
if (overlay) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-white bg-opacity-75">
      <BaseSpinner />
    </div>
  )
}

// 默认模式
return <BaseSpinner />
```

### 骨架屏实现
```tsx
export const CardLoading: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
)
```

## ⚠️ 注意事项

### 1. 可访问性
- 使用 `sr-only` 类为屏幕阅读器提供文本
- 确保加载状态对键盘用户友好
- 避免过度使用动画影响用户体验

### 2. 性能考虑
- 骨架屏比旋转动画更轻量
- 避免在不需要时显示加载状态
- 合理设置加载超时时间

### 3. 用户体验
- 提供有意义的加载文本
- 避免过长的加载时间
- 考虑使用进度条替代无限加载

### 4. 样式定制
- 可以通过 CSS 变量自定义颜色
- 支持 Tailwind CSS 主题配置
- 可以扩展更多尺寸和颜色选项

## 🔗 相关组件

- [ErrorBoundary](./ErrorBoundary.md) - 错误边界组件
- [NotificationSystem](./NotificationSystem.md) - 通知系统组件
- [ProtectedRoute](./ProtectedRoute.md) - 路由保护组件

## 📝 更新日志

- **v1.0.0** - 初始版本，支持基本加载动画
- **v1.1.0** - 添加全屏和遮罩模式
- **v1.2.0** - 新增专门化加载组件
- **v1.3.0** - 优化骨架屏和动画性能

## 🧪 测试用例

```tsx
import { render, screen } from '@testing-library/react'
import LoadingSpinner from './LoadingSpinner'

test('renders with default props', () => {
  render(<LoadingSpinner />)
  expect(screen.getByText('加载中...')).toBeInTheDocument()
})

test('renders with custom text', () => {
  render(<LoadingSpinner text="自定义文本" />)
  expect(screen.getByText('自定义文本')).toBeInTheDocument()
})

test('renders fullscreen mode', () => {
  render(<LoadingSpinner fullScreen />)
  const container = screen.getByRole('generic')
  expect(container).toHaveClass('fixed', 'inset-0', 'z-50')
})

test('renders overlay mode', () => {
  render(<LoadingSpinner overlay />)
  const container = screen.getByRole('generic')
  expect(container).toHaveClass('absolute', 'inset-0', 'z-40')
})

test('applies correct size classes', () => {
  const { rerender } = render(<LoadingSpinner size="sm" />)
  const spinner = screen.getByRole('generic').querySelector('.animate-spin')
  expect(spinner).toHaveClass('w-4', 'h-4')
  
  rerender(<LoadingSpinner size="xl" />)
  expect(spinner).toHaveClass('w-12', 'h-12')
})
```
