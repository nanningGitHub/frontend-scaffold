# EnterpriseErrorBoundary 组件

企业级错误边界组件，提供高级错误捕获、日志记录和用户友好的错误恢复机制。

## 📋 组件概述

`EnterpriseErrorBoundary` 是一个企业级的错误边界组件，继承自 React 的 `ErrorBoundary`，专门用于生产环境中的错误处理和监控。它能够捕获子组件树中的 JavaScript 错误，记录错误信息，并显示降级 UI。

## 🎯 主要功能

- **错误捕获**: 捕获子组件中的 JavaScript 错误
- **错误日志**: 自动记录错误信息到日志系统
- **降级 UI**: 显示用户友好的错误页面
- **错误恢复**: 提供错误恢复和重试机制
- **性能监控**: 集成性能监控和错误追踪
- **用户反馈**: 收集用户反馈和错误报告

## 🔧 Props

```typescript
interface EnterpriseErrorBoundaryProps {
  /** 子组件 */
  children: React.ReactNode
  /** 错误发生时的降级 UI */
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  /** 错误处理回调 */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** 是否启用错误恢复 */
  enableRecovery?: boolean
  /** 错误报告配置 */
  errorReporting?: {
    enabled: boolean
    endpoint?: string
    includeStack?: boolean
  }
  /** 自定义错误页面 */
  errorPage?: React.ComponentType<{ error: Error; resetError: () => void }>
}
```

## 📝 基本用法

### 基础错误边界

```tsx
import { EnterpriseErrorBoundary } from '@/components/EnterpriseErrorBoundary'

function App() {
  return (
    <EnterpriseErrorBoundary>
      <YourApp />
    </EnterpriseErrorBoundary>
  )
}
```

### 自定义错误处理

```tsx
import { EnterpriseErrorBoundary } from '@/components/EnterpriseErrorBoundary'

function App() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('应用错误:', error)
    // 发送错误到监控系统
    sendErrorToMonitoring(error, errorInfo)
  }

  return (
    <EnterpriseErrorBoundary
      onError={handleError}
      enableRecovery={true}
      errorReporting={{
        enabled: true,
        endpoint: '/api/errors',
        includeStack: true
      }}
    >
      <YourApp />
    </EnterpriseErrorBoundary>
  )
}
```

### 自定义错误页面

```tsx
import { EnterpriseErrorBoundary } from '@/components/EnterpriseErrorBoundary'

function CustomErrorPage({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="error-page">
      <h1>抱歉，出现了一些问题</h1>
      <p>我们正在努力修复这个问题</p>
      <button onClick={resetError}>重试</button>
      <button onClick={() => window.location.reload()}>刷新页面</button>
    </div>
  )
}

function App() {
  return (
    <EnterpriseErrorBoundary errorPage={CustomErrorPage}>
      <YourApp />
    </EnterpriseErrorBoundary>
  )
}
```

## 🏗️ 核心实现

### 错误捕获机制

```tsx
class EnterpriseErrorBoundary extends React.Component<
  EnterpriseErrorBoundaryProps,
  EnterpriseErrorBoundaryState
> {
  constructor(props: EnterpriseErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): EnterpriseErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误信息
    this.logError(error, errorInfo)
    
    // 调用错误处理回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    
    // 发送错误报告
    if (this.props.errorReporting?.enabled) {
      this.reportError(error, errorInfo)
    }
  }

  private logError = (error: Error, errorInfo: React.ErrorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    // 使用企业级日志系统
    enterpriseLogger.error('React Error Boundary', errorData)
  }

  private reportError = async (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      const { endpoint, includeStack } = this.props.errorReporting || {}
      
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: error.message,
            stack: includeStack ? error.stack : undefined,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString()
          })
        })
      }
    } catch (reportError) {
      console.error('错误报告失败:', reportError)
    }
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, errorPage: ErrorPage } = this.props
      
      if (ErrorPage) {
        return <ErrorPage error={this.state.error!} resetError={this.resetError} />
      }
      
      if (Fallback) {
        return <Fallback error={this.state.error!} resetError={this.resetError} />
      }
      
      return this.renderDefaultErrorUI()
    }

    return this.props.children
  }

  private renderDefaultErrorUI() {
    return (
      <div className="enterprise-error-boundary">
        <div className="error-container">
          <h1>系统错误</h1>
          <p>抱歉，系统遇到了一个意外错误</p>
          <div className="error-actions">
            <button onClick={this.resetError} className="btn-primary">
              重试
            </button>
            <button onClick={() => window.location.reload()} className="btn-secondary">
              刷新页面
            </button>
          </div>
          {this.props.enableRecovery && (
            <div className="recovery-options">
              <p>如果问题持续存在，请尝试：</p>
              <ul>
                <li>清除浏览器缓存</li>
                <li>检查网络连接</li>
                <li>联系技术支持</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }
}
```

## 🎨 样式设计

### 默认错误页面样式

```css
.enterprise-error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.error-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 90%;
}

.error-container h1 {
  color: #e53e3e;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.error-container p {
  color: #4a5568;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3182ce;
  color: white;
}

.btn-primary:hover {
  background: #2c5aa0;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.recovery-options {
  text-align: left;
  background: #f7fafc;
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid #3182ce;
}

.recovery-options p {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #2d3748;
}

.recovery-options ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #4a5568;
}

.recovery-options li {
  margin-bottom: 0.25rem;
}
```

## 🧪 测试用例

### 基础测试

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { EnterpriseErrorBoundary } from './EnterpriseErrorBoundary'

// 模拟错误组件
const ThrowError = () => {
  throw new Error('测试错误')
}

describe('EnterpriseErrorBoundary', () => {
  beforeEach(() => {
    // 抑制控制台错误输出
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('应该正常渲染子组件', () => {
    render(
      <EnterpriseErrorBoundary>
        <div>正常内容</div>
      </EnterpriseErrorBoundary>
    )
    
    expect(screen.getByText('正常内容')).toBeInTheDocument()
  })

  it('应该捕获错误并显示错误 UI', () => {
    render(
      <EnterpriseErrorBoundary>
        <ThrowError />
      </EnterpriseErrorBoundary>
    )
    
    expect(screen.getByText('系统错误')).toBeInTheDocument()
    expect(screen.getByText('抱歉，系统遇到了一个意外错误')).toBeInTheDocument()
  })

  it('应该调用 onError 回调', () => {
    const onError = jest.fn()
    
    render(
      <EnterpriseErrorBoundary onError={onError}>
        <ThrowError />
      </EnterpriseErrorBoundary>
    )
    
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })

  it('应该支持错误恢复', () => {
    render(
      <EnterpriseErrorBoundary enableRecovery={true}>
        <ThrowError />
      </EnterpriseErrorBoundary>
    )
    
    expect(screen.getByText('如果问题持续存在，请尝试：')).toBeInTheDocument()
  })
})
```

### 集成测试

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EnterpriseErrorBoundary } from './EnterpriseErrorBoundary'

// 模拟 fetch
global.fetch = jest.fn()

describe('EnterpriseErrorBoundary 集成测试', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(global.fetch as jest.Mock).mockClear()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('应该发送错误报告到指定端点', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockResolvedValueOnce({ ok: true })

    render(
      <EnterpriseErrorBoundary
        errorReporting={{
          enabled: true,
          endpoint: '/api/errors',
          includeStack: true
        }}
      >
        <ThrowError />
      </EnterpriseErrorBoundary>
    )

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('测试错误')
      })
    })
  })

  it('应该支持自定义错误页面', () => {
    const CustomErrorPage = ({ error, resetError }: { error: Error; resetError: () => void }) => (
      <div>
        <h1>自定义错误页面</h1>
        <p>错误信息: {error.message}</p>
        <button onClick={resetError}>重置</button>
      </div>
    )

    render(
      <EnterpriseErrorBoundary errorPage={CustomErrorPage}>
        <ThrowError />
      </EnterpriseErrorBoundary>
    )

    expect(screen.getByText('自定义错误页面')).toBeInTheDocument()
    expect(screen.getByText('错误信息: 测试错误')).toBeInTheDocument()
  })
})
```

## 📊 性能考虑

### 错误边界性能优化

1. **懒加载错误页面**: 只在错误发生时加载错误 UI 组件
2. **错误信息缓存**: 避免重复的错误日志记录
3. **异步错误报告**: 使用 `requestIdleCallback` 延迟发送错误报告
4. **内存泄漏防护**: 确保错误边界不会导致内存泄漏

### 内存管理

```tsx
class EnterpriseErrorBoundary extends React.Component {
  private errorReportQueue: Array<{ error: Error; errorInfo: React.ErrorInfo }> = []
  private reportTimeoutId: NodeJS.Timeout | null = null

  componentWillUnmount() {
    if (this.reportTimeoutId) {
      clearTimeout(this.reportTimeoutId)
    }
  }

  private queueErrorReport = (error: Error, errorInfo: React.ErrorInfo) => {
    this.errorReportQueue.push({ error, errorInfo })
    
    if (this.reportTimeoutId) {
      clearTimeout(this.reportTimeoutId)
    }
    
    // 延迟发送错误报告，避免阻塞主线程
    this.reportTimeoutId = setTimeout(() => {
      this.flushErrorReports()
    }, 1000)
  }

  private flushErrorReports = async () => {
    const reports = [...this.errorReportQueue]
    this.errorReportQueue = []
    
    for (const report of reports) {
      await this.reportError(report.error, report.errorInfo)
    }
  }
}
```

## 🔒 安全考虑

### 错误信息脱敏

1. **敏感信息过滤**: 过滤掉包含密码、token 等敏感信息的错误
2. **用户信息保护**: 不记录用户的个人信息
3. **错误堆栈限制**: 在生产环境中限制错误堆栈的详细程度

### 错误报告安全

```tsx
private sanitizeErrorData = (error: Error, errorInfo: React.ErrorInfo) => {
  const sensitivePatterns = [
    /password/i,
    /token/i,
    /secret/i,
    /key/i,
    /api[_-]?key/i
  ]

  const sanitizeString = (str: string) => {
    let sanitized = str
    sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]')
    })
    return sanitized
  }

  return {
    message: sanitizeString(error.message),
    stack: process.env.NODE_ENV === 'production' 
      ? error.stack?.split('\n').slice(0, 3).join('\n') 
      : sanitizeString(error.stack || ''),
    componentStack: sanitizeString(errorInfo.componentStack),
    timestamp: new Date().toISOString()
  }
}
```

## 📚 最佳实践

### 1. 错误边界层级

```tsx
// 推荐：在应用根级别使用错误边界
function App() {
  return (
    <EnterpriseErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            {/* 路由内容 */}
          </Routes>
        </Layout>
      </Router>
    </EnterpriseErrorBoundary>
  )
}

// 推荐：在关键功能模块使用错误边界
function UserModule() {
  return (
    <EnterpriseErrorBoundary fallback={UserModuleErrorFallback}>
      <UserProfile />
      <UserSettings />
    </EnterpriseErrorBoundary>
  )
}
```

### 2. 错误恢复策略

```tsx
// 推荐：提供多种恢复选项
function AppErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  const [recoveryAttempts, setRecoveryAttempts] = useState(0)
  
  const handleRetry = () => {
    if (recoveryAttempts < 3) {
      setRecoveryAttempts(prev => prev + 1)
      resetError()
    } else {
      // 超过重试次数，显示最终错误页面
      setShowFinalError(true)
    }
  }

  return (
    <div className="app-error-fallback">
      <h1>应用错误</h1>
      <p>尝试次数: {recoveryAttempts}/3</p>
      <button onClick={handleRetry} disabled={recoveryAttempts >= 3}>
        重试
      </button>
      <button onClick={() => window.location.reload()}>
        刷新页面
      </button>
    </div>
  )
}
```

### 3. 错误监控集成

```tsx
// 推荐：集成多种监控系统
const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
  // Sentry 错误监控
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: errorInfo.componentStack
      }
    }
  })

  // 自定义错误监控
  customErrorMonitor.track({
    type: 'react_error_boundary',
    error: error.message,
    componentStack: errorInfo.componentStack,
    url: window.location.href,
    userAgent: navigator.userAgent
  })

  // 性能监控
  performance.mark('error-boundary-triggered')
}
```

## 🚀 未来改进

### 计划中的功能

1. **智能错误分类**: 基于错误类型自动分类和优先级排序
2. **用户行为追踪**: 记录错误发生前的用户操作路径
3. **自动错误修复**: 对于已知错误提供自动修复建议
4. **错误预测**: 基于历史数据预测可能的错误
5. **A/B 测试支持**: 测试不同错误处理策略的效果

### 技术债务

1. **TypeScript 类型优化**: 改进错误边界的状态类型定义
2. **测试覆盖率提升**: 增加更多边界情况的测试
3. **性能基准测试**: 建立性能基准和监控
4. **文档完善**: 添加更多使用示例和最佳实践

---

*最后更新: 2024年12月*  
*组件版本: v1.0.0*
