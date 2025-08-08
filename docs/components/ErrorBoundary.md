# ErrorBoundary 组件

React 错误边界组件，用于捕获子组件中的 JavaScript 错误并提供降级 UI。

## 📋 组件概述

ErrorBoundary 组件是一个类组件，用于：
- 捕获子组件中的 JavaScript 错误
- 记录错误信息到日志系统
- 显示用户友好的错误界面
- 提供错误恢复机制
- 支持自定义错误处理

## 🎯 功能特性

### 1. 错误捕获
- 捕获渲染过程中的 JavaScript 错误
- 捕获生命周期方法中的错误
- 捕获构造函数中的错误

### 2. 错误记录
- 自动记录错误信息到日志系统
- 包含错误堆栈和组件堆栈信息
- 支持自定义错误处理回调

### 3. 降级 UI
- 提供默认的错误界面
- 支持自定义错误界面
- 开发环境显示详细错误信息

### 4. 错误恢复
- 提供重试机制
- 支持通过 resetKeys 重置错误状态
- 页面刷新恢复功能

## 📖 API 文档

### Props

```typescript
interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetKeys?: any[]
}
```

| 属性 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `children` | `ReactNode` | ✅ | - | 需要错误边界保护的子组件 |
| `fallback` | `ReactNode \| Function` | ❌ | 默认错误界面 | 自定义错误界面或渲染函数 |
| `onError` | `Function` | ❌ | - | 错误处理回调函数 |
| `resetKeys` | `any[]` | ❌ | - | 重置错误状态的键值数组 |

### 状态

```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}
```

## 💻 使用示例

### 基本用法
```tsx
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

### 自定义错误界面
```tsx
function CustomErrorFallback({ error, errorInfo }) {
  return (
    <div className="error-container">
      <h2>页面出现错误</h2>
      <p>错误信息：{error.message}</p>
      <button onClick={() => window.location.reload()}>
        刷新页面
      </button>
    </div>
  )
}

<ErrorBoundary fallback={CustomErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

### 使用函数式 fallback
```tsx
<ErrorBoundary 
  fallback={(error, errorInfo) => (
    <div>
      <h2>错误：{error.message}</h2>
      <details>
        <summary>错误详情</summary>
        <pre>{errorInfo.componentStack}</pre>
      </details>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

### 错误处理回调
```tsx
<ErrorBoundary 
  onError={(error, errorInfo) => {
    // 发送错误到监控系统
    analytics.track('error', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }}
>
  <MyComponent />
</ErrorBoundary>
```

### 使用 resetKeys 重置错误
```tsx
function App() {
  const [key, setKey] = useState(0)
  
  return (
    <ErrorBoundary resetKeys={[key]}>
      <MyComponent />
      <button onClick={() => setKey(k => k + 1)}>
        重置错误边界
      </button>
    </ErrorBoundary>
  )
}
```

## 🔧 实现细节

### 错误捕获机制
```tsx
static getDerivedStateFromError(error: Error): ErrorBoundaryState {
  // 更新状态，下次渲染时显示降级 UI
  return {
    hasError: true,
    error,
    errorInfo: null,
  }
}

componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  // 记录错误信息
  logger.error('Error Boundary caught an error', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
  })

  // 更新状态
  this.setState({
    error,
    errorInfo,
  })

  // 调用错误处理回调
  this.props.onError?.(error, errorInfo)
}
```

### 错误状态重置
```tsx
componentDidUpdate(prevProps: ErrorBoundaryProps) {
  // 如果 resetKeys 发生变化，重置错误状态
  if (prevProps.resetKeys !== this.props.resetKeys) {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }
}
```

### 默认错误界面
```tsx
render() {
  const { hasError, error, errorInfo } = this.state
  const { children, fallback } = this.props

  if (hasError) {
    // 如果有自定义的 fallback，使用它
    if (fallback) {
      if (typeof fallback === 'function') {
        return fallback(error!, errorInfo!)
      }
      return fallback
    }

    // 默认的错误 UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          {/* 错误图标 */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600">
              {/* 错误图标 SVG */}
            </svg>
          </div>

          {/* 错误标题 */}
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            页面出现错误
          </h2>

          {/* 错误描述 */}
          <p className="text-gray-600 mb-6">
            抱歉，页面加载时遇到了问题。请尝试刷新页面或联系技术支持。
          </p>

          {/* 开发环境错误详情 */}
          {import.meta.env.DEV && error && (
            <details className="mb-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">
                错误详情
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
                {/* 错误详情内容 */}
              </div>
            </details>
          )}

          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <button onClick={this.handleReset}>
              重试
            </button>
            <button onClick={() => window.location.reload()}>
              刷新页面
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
```

## ⚠️ 注意事项

### 1. 错误边界限制
- 只能捕获子组件的错误
- 不能捕获事件处理函数中的错误
- 不能捕获异步代码中的错误
- 不能捕获服务端渲染中的错误

### 2. 性能考虑
- 错误边界会增加组件树的高度
- 避免在错误边界中放置过多逻辑
- 合理使用 resetKeys 避免不必要的重置

### 3. 错误处理最佳实践
- 在关键路径上使用错误边界
- 提供有意义的错误信息
- 记录错误信息用于调试
- 提供恢复机制

### 4. 开发环境
- 开发环境会显示详细的错误信息
- 生产环境只显示用户友好的错误界面
- 使用环境变量控制错误详情显示

## 🔗 相关组件

- [Layout](./Layout.md) - 布局组件
- [LoadingSpinner](./LoadingSpinner.md) - 加载状态组件
- [NotificationSystem](./NotificationSystem.md) - 通知系统组件

## 📝 更新日志

- **v1.0.0** - 初始版本，支持基本错误捕获
- **v1.1.0** - 添加自定义错误界面支持
- **v1.2.0** - 集成日志系统和错误处理回调
- **v1.3.0** - 优化错误恢复机制和用户体验

## 🧪 测试用例

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

// 模拟抛出错误的组件
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>正常组件</div>
}

test('renders children when no error', () => {
  render(
    <ErrorBoundary>
      <ThrowError shouldThrow={false} />
    </ErrorBoundary>
  )
  
  expect(screen.getByText('正常组件')).toBeInTheDocument()
})

test('renders error UI when error occurs', () => {
  render(
    <ErrorBoundary>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )
  
  expect(screen.getByText('页面出现错误')).toBeInTheDocument()
})

test('calls onError callback when error occurs', () => {
  const onError = jest.fn()
  
  render(
    <ErrorBoundary onError={onError}>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )
  
  expect(onError).toHaveBeenCalled()
})

test('resets error state when resetKeys change', () => {
  const { rerender } = render(
    <ErrorBoundary resetKeys={[1]}>
      <ThrowError shouldThrow={true} />
    </ErrorBoundary>
  )
  
  expect(screen.getByText('页面出现错误')).toBeInTheDocument()
  
  rerender(
    <ErrorBoundary resetKeys={[2]}>
      <ThrowError shouldThrow={false} />
    </ErrorBoundary>
  )
  
  expect(screen.getByText('正常组件')).toBeInTheDocument()
})
```
