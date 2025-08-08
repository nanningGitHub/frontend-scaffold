# ApiExample 组件

## 📋 概述

ApiExample 是一个 API 请求示例组件，展示了如何使用项目中的 API 工具进行各种类型的 HTTP 请求。包含完整的错误处理、加载状态、数据展示等功能。

## 🎯 功能特性

- ✅ **多种请求类型** - GET、POST、PUT、DELETE 请求示例
- ✅ **错误处理** - 完整的错误处理和用户提示
- ✅ **加载状态** - 请求过程中的加载指示器
- ✅ **数据展示** - 响应数据的格式化展示
- ✅ **请求配置** - 可配置的请求参数和头部
- ✅ **重试机制** - 自动重试失败的请求
- ✅ **缓存支持** - 智能缓存响应数据

## 📦 安装和导入

```typescript
import { ApiExample } from '@/components/ApiExample'
```

## 🛠️ API 文档

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `baseUrl` | `string` | `'/api'` | 否 | API 基础 URL |
| `timeout` | `number` | `10000` | 否 | 请求超时时间（毫秒） |
| `retryTimes` | `number` | `3` | 否 | 重试次数 |
| `showHeaders` | `boolean` | `true` | 否 | 是否显示请求头信息 |
| `className` | `string` | - | 否 | 自定义 CSS 类名 |

### 请求配置接口

```typescript
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
  retryTimes?: number
}

interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: RequestConfig
}
```

## 💡 使用示例

### 基本用法

```tsx
import { ApiExample } from '@/components/ApiExample'

function ApiDemoPage() {
  return (
    <div className="api-demo-page">
      <h1>API 请求示例</h1>
      <ApiExample />
    </div>
  )
}
```

### 自定义配置

```tsx
import { ApiExample } from '@/components/ApiExample'

function CustomApiExample() {
  return (
    <ApiExample
      baseUrl="https://api.example.com"
      timeout={15000}
      retryTimes={5}
      showHeaders={false}
      className="custom-api-example"
    />
  )
}
```

### 与状态管理集成

```tsx
import { ApiExample } from '@/components/ApiExample'
import { useNotification } from '@/components/NotificationSystem'

function ApiExampleWithNotifications() {
  const { showNotification } = useNotification()

  const handleRequestSuccess = (response) => {
    showNotification({
      type: 'success',
      title: '请求成功',
      message: 'API 请求已成功完成'
    })
  }

  const handleRequestError = (error) => {
    showNotification({
      type: 'error',
      title: '请求失败',
      message: error.message
    })
  }

  return (
    <ApiExample
      onSuccess={handleRequestSuccess}
      onError={handleRequestError}
    />
  )
}
```

### 自定义请求示例

```tsx
import { ApiExample } from '@/components/ApiExample'

function CustomApiExamples() {
  const customExamples = [
    {
      name: '获取用户列表',
      config: {
        method: 'GET',
        url: '/users',
        params: { page: 1, limit: 10 }
      }
    },
    {
      name: '创建新用户',
      config: {
        method: 'POST',
        url: '/users',
        data: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
    },
    {
      name: '更新用户信息',
      config: {
        method: 'PUT',
        url: '/users/1',
        data: {
          name: 'Jane Doe',
          email: 'jane@example.com'
        }
      }
    }
  ]

  return (
    <ApiExample
      examples={customExamples}
      baseUrl="https://jsonplaceholder.typicode.com"
    />
  )
}
```

## 🔧 实现细节

### 请求管理

```typescript
// API 请求管理 Hook
const useApiRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<any>(null)

  const executeRequest = async (config: RequestConfig) => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await api.request(config)
      setResponse(result)
      return result
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    response,
    executeRequest
  }
}
```

### 请求示例配置

```typescript
// 默认请求示例
const defaultExamples = [
  {
    name: '获取用户列表',
    description: '获取所有用户信息',
    config: {
      method: 'GET',
      url: '/users',
      params: { page: 1, limit: 10 }
    }
  },
  {
    name: '获取单个用户',
    description: '根据 ID 获取用户信息',
    config: {
      method: 'GET',
      url: '/users/1'
    }
  },
  {
    name: '创建新用户',
    description: '创建新的用户账户',
    config: {
      method: 'POST',
      url: '/users',
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      }
    }
  },
  {
    name: '更新用户信息',
    description: '更新现有用户信息',
    config: {
      method: 'PUT',
      url: '/users/1',
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com'
      }
    }
  },
  {
    name: '删除用户',
    description: '删除指定用户',
    config: {
      method: 'DELETE',
      url: '/users/1'
    }
  }
]
```

### 响应格式化

```typescript
// 响应数据格式化组件
const ResponseFormatter = ({ response }) => {
  const [format, setFormat] = useState<'json' | 'table' | 'raw'>('json')

  const formatResponse = (data) => {
    switch (format) {
      case 'json':
        return (
          <pre className="response-json">
            {JSON.stringify(data, null, 2)}
          </pre>
        )
      case 'table':
        return <DataTable data={data} />
      case 'raw':
        return <pre className="response-raw">{data}</pre>
      default:
        return null
    }
  }

  return (
    <div className="response-formatter">
      <div className="format-controls">
        <button
          className={format === 'json' ? 'active' : ''}
          onClick={() => setFormat('json')}
        >
          JSON
        </button>
        <button
          className={format === 'table' ? 'active' : ''}
          onClick={() => setFormat('table')}
        >
          表格
        </button>
        <button
          className={format === 'raw' ? 'active' : ''}
          onClick={() => setFormat('raw')}
        >
          原始
        </button>
      </div>
      
      <div className="response-content">
        {formatResponse(response)}
      </div>
    </div>
  )
}
```

### 错误处理

```typescript
// 错误处理组件
const ErrorHandler = ({ error, onRetry }) => {
  const getErrorMessage = (error) => {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          return '请求参数错误，请检查输入数据'
        case 401:
          return '未授权访问，请先登录'
        case 403:
          return '权限不足，无法访问该资源'
        case 404:
          return '请求的资源不存在'
        case 500:
          return '服务器内部错误，请稍后重试'
        default:
          return data?.message || '请求失败，请稍后重试'
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      return '请求超时，请检查网络连接'
    }
    
    return error.message || '未知错误'
  }

  return (
    <div className="error-handler">
      <div className="error-icon">
        <svg>...</svg>
      </div>
      <div className="error-content">
        <h3>请求失败</h3>
        <p>{getErrorMessage(error)}</p>
        <button onClick={onRetry} className="retry-button">
          重试
        </button>
      </div>
    </div>
  )
}
```

### 请求历史记录

```typescript
// 请求历史管理
const useRequestHistory = () => {
  const [history, setHistory] = useState<RequestHistory[]>([])

  const addToHistory = (request: RequestConfig, response: any, error?: any) => {
    const historyItem: RequestHistory = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      request,
      response,
      error,
      duration: response?.duration || 0
    }

    setHistory(prev => [historyItem, ...prev.slice(0, 9)]) // 保留最近10条
  }

  const clearHistory = () => {
    setHistory([])
  }

  return {
    history,
    addToHistory,
    clearHistory
  }
}
```

## 🧪 测试用例

### 单元测试

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ApiExample } from './ApiExample'
import { api } from '../utils/api'

// 模拟 API 工具
jest.mock('../utils/api')

const mockApi = api as jest.Mocked<typeof api>

describe('ApiExample', () => {
  beforeEach(() => {
    mockApi.request.mockClear()
  })

  it('renders API examples', () => {
    render(<ApiExample />)
    
    expect(screen.getByText('获取用户列表')).toBeInTheDocument()
    expect(screen.getByText('创建新用户')).toBeInTheDocument()
    expect(screen.getByText('更新用户信息')).toBeInTheDocument()
  })

  it('executes GET request successfully', async () => {
    const mockResponse = {
      data: [{ id: 1, name: 'John Doe' }],
      status: 200,
      statusText: 'OK'
    }
    
    mockApi.request.mockResolvedValue(mockResponse)

    render(<ApiExample />)
    
    fireEvent.click(screen.getByText('获取用户列表'))
    
    await waitFor(() => {
      expect(mockApi.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/users',
        params: { page: 1, limit: 10 }
      })
    })
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('handles request errors', async () => {
    const mockError = new Error('Network error')
    mockApi.request.mockRejectedValue(mockError)

    render(<ApiExample />)
    
    fireEvent.click(screen.getByText('获取用户列表'))
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('shows loading state during request', async () => {
    const mockResponse = { data: [], status: 200 }
    mockApi.request.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
    )

    render(<ApiExample />)
    
    fireEvent.click(screen.getByText('获取用户列表'))
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
    })
  })

  it('executes POST request with data', async () => {
    const mockResponse = {
      data: { id: 1, name: 'John Doe', email: 'john@example.com' },
      status: 201,
      statusText: 'Created'
    }
    
    mockApi.request.mockResolvedValue(mockResponse)

    render(<ApiExample />)
    
    fireEvent.click(screen.getByText('创建新用户'))
    
    await waitFor(() => {
      expect(mockApi.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/users',
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890'
        }
      })
    })
  })

  it('retries failed requests', async () => {
    const mockError = new Error('Network error')
    mockApi.request
      .mockRejectedValueOnce(mockError)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValue({ data: [], status: 200 })

    render(<ApiExample retryTimes={3} />)
    
    fireEvent.click(screen.getByText('获取用户列表'))
    
    await waitFor(() => {
      expect(mockApi.request).toHaveBeenCalledTimes(3)
    })
  })
})
```

### 集成测试

```typescript
describe('ApiExample Integration', () => {
  it('integrates with notification system', async () => {
    const mockShowNotification = jest.fn()
    
    render(
      <ApiExample
        onSuccess={() => mockShowNotification('success', '请求成功')}
        onError={() => mockShowNotification('error', '请求失败')}
      />
    )
    
    fireEvent.click(screen.getByText('获取用户列表'))
    
    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledWith('success', '请求成功')
    })
  })

  it('handles different response formats', async () => {
    const jsonResponse = { data: { users: [] }, status: 200 }
    const textResponse = 'Success'
    
    mockApi.request
      .mockResolvedValueOnce(jsonResponse)
      .mockResolvedValueOnce({ data: textResponse, status: 200 })

    render(<ApiExample />)
    
    // 测试 JSON 响应
    fireEvent.click(screen.getByText('获取用户列表'))
    await waitFor(() => {
      expect(screen.getByText('"users": []')).toBeInTheDocument()
    })
    
    // 测试文本响应
    fireEvent.click(screen.getByText('创建新用户'))
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument()
    })
  })
})
```

## 📝 注意事项

### 1. 安全性
- 不要在示例中暴露敏感信息
- 使用环境变量管理 API 密钥
- 实现请求签名验证
- 添加 CSRF 保护

### 2. 性能优化
- 实现请求缓存机制
- 使用请求去重
- 优化大量数据的展示
- 添加请求取消功能

### 3. 用户体验
- 提供请求进度指示
- 支持请求参数编辑
- 添加响应时间统计
- 实现请求历史记录

### 4. 错误处理
- 区分不同类型的错误
- 提供详细的错误信息
- 实现自动重试机制
- 支持错误上报

## 🔗 相关链接

- [组件文档索引](../README.md)
- [API 工具文档](../utils/api.md)
- [错误处理指南](../utils/error-handling.md)

---

*最后更新: 2024年12月*
*组件版本: v1.0.0*
