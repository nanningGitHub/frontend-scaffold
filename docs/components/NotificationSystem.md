# NotificationSystem 组件

## 📋 概述

NotificationSystem 是一个功能完整的通知系统组件，提供多种类型的通知消息展示、自动消失、手动关闭等功能。

## 🎯 功能特性

- ✅ **多种通知类型** - 成功、错误、警告、信息
- ✅ **自动消失** - 可配置自动消失时间
- ✅ **手动关闭** - 支持手动关闭通知
- ✅ **动画效果** - 平滑的进入和退出动画
- ✅ **位置配置** - 支持多个显示位置
- ✅ **队列管理** - 自动管理通知队列
- ✅ **响应式设计** - 适配不同屏幕尺寸

## 📦 安装和导入

```typescript
import { NotificationSystem } from '@/components/NotificationSystem'
```

## 🛠️ API 文档

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `position` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | 否 | 通知显示位置 |
| `maxNotifications` | `number` | `5` | 否 | 最大同时显示的通知数量 |
| `autoClose` | `boolean` | `true` | 否 | 是否自动关闭 |
| `autoCloseDelay` | `number` | `5000` | 否 | 自动关闭延迟时间（毫秒） |

### 通知配置

```typescript
interface NotificationConfig {
  id?: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  closable?: boolean
  onClose?: () => void
}
```

## 💡 使用示例

### 基本用法

```tsx
import { NotificationSystem, useNotification } from '@/components/NotificationSystem'

function App() {
  const { showNotification } = useNotification()

  const handleShowSuccess = () => {
    showNotification({
      type: 'success',
      title: '操作成功',
      message: '数据已保存到服务器'
    })
  }

  return (
    <div>
      <button onClick={handleShowSuccess}>
        显示成功通知
      </button>
      <NotificationSystem />
    </div>
  )
}
```

### 高级用法

```tsx
import { NotificationSystem, useNotification } from '@/components/NotificationSystem'

function AdvancedExample() {
  const { showNotification, clearAll } = useNotification()

  const handleShowError = () => {
    showNotification({
      type: 'error',
      title: '操作失败',
      message: '网络连接异常，请检查网络设置',
      duration: 10000, // 10秒后自动关闭
      closable: true,
      onClose: () => {
        console.log('通知已关闭')
      }
    })
  }

  const handleShowWarning = () => {
    showNotification({
      type: 'warning',
      title: '警告',
      message: '您的操作可能会影响系统性能',
      duration: 0, // 不自动关闭
      closable: true
    })
  }

  return (
    <div>
      <button onClick={handleShowError}>显示错误通知</button>
      <button onClick={handleShowWarning}>显示警告通知</button>
      <button onClick={clearAll}>清除所有通知</button>
      
      <NotificationSystem 
        position="bottom-right"
        maxNotifications={3}
        autoClose={true}
        autoCloseDelay={3000}
      />
    </div>
  )
}
```

### 自定义样式

```tsx
import { NotificationSystem } from '@/components/NotificationSystem'

function CustomStyledExample() {
  return (
    <NotificationSystem 
      position="top-left"
      maxNotifications={10}
      autoClose={false}
      className="custom-notifications"
    />
  )
}
```

## 🎨 样式定制

### CSS 变量

```css
:root {
  --notification-bg-success: #f0fdf4;
  --notification-border-success: #22c55e;
  --notification-text-success: #166534;
  
  --notification-bg-error: #fef2f2;
  --notification-border-error: #ef4444;
  --notification-text-error: #991b1b;
  
  --notification-bg-warning: #fffbeb;
  --notification-border-warning: #f59e0b;
  --notification-text-warning: #92400e;
  
  --notification-bg-info: #eff6ff;
  --notification-border-info: #3b82f6;
  --notification-text-info: #1e40af;
}
```

### 自定义类名

```css
.custom-notifications {
  --notification-bg-success: #d1fae5;
  --notification-border-success: #10b981;
}

.custom-notifications .notification {
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

## 🔧 实现细节

### 核心逻辑

```typescript
// 通知状态管理
const [notifications, setNotifications] = useState<Notification[]>([])

// 添加通知
const addNotification = (config: NotificationConfig) => {
  const id = config.id || generateId()
  const notification = {
    ...config,
    id,
    timestamp: Date.now()
  }
  
  setNotifications(prev => [...prev, notification])
}

// 移除通知
const removeNotification = (id: string) => {
  setNotifications(prev => prev.filter(n => n.id !== id))
}

// 自动关闭逻辑
useEffect(() => {
  if (!autoClose) return
  
  const timers = notifications.map(notification => {
    if (notification.duration === 0) return null
    
    return setTimeout(() => {
      removeNotification(notification.id)
    }, notification.duration || autoCloseDelay)
  })
  
  return () => timers.forEach(timer => timer && clearTimeout(timer))
}, [notifications, autoClose, autoCloseDelay])
```

### 动画实现

```typescript
// 使用 CSS 动画实现平滑过渡
const notificationVariants = {
  enter: {
    opacity: 0,
    transform: 'translateX(100%)',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  center: {
    opacity: 1,
    transform: 'translateX(0%)',
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transform: 'translateX(100%)',
    transition: { duration: 0.2, ease: 'easeIn' }
  }
}
```

## 🧪 测试用例

### 单元测试

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationSystem, useNotification } from './NotificationSystem'

describe('NotificationSystem', () => {
  it('renders notification when showNotification is called', () => {
    const TestComponent = () => {
      const { showNotification } = useNotification()
      
      return (
        <div>
          <button onClick={() => showNotification({
            type: 'success',
            title: 'Test Notification'
          })}>
            Show Notification
          </button>
          <NotificationSystem />
        </div>
      )
    }
    
    render(<TestComponent />)
    
    fireEvent.click(screen.getByText('Show Notification'))
    
    expect(screen.getByText('Test Notification')).toBeInTheDocument()
  })

  it('auto-closes notification after specified duration', async () => {
    const TestComponent = () => {
      const { showNotification } = useNotification()
      
      return (
        <div>
          <button onClick={() => showNotification({
            type: 'info',
            title: 'Auto Close Test',
            duration: 100
          })}>
            Show Auto Close
          </button>
          <NotificationSystem autoCloseDelay={100} />
        </div>
      )
    }
    
    render(<TestComponent />)
    
    fireEvent.click(screen.getByText('Show Auto Close'))
    
    expect(screen.getByText('Auto Close Test')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.queryByText('Auto Close Test')).not.toBeInTheDocument()
    }, { timeout: 200 })
  })

  it('respects maxNotifications limit', () => {
    const TestComponent = () => {
      const { showNotification } = useNotification()
      
      return (
        <div>
          <button onClick={() => {
            for (let i = 0; i < 5; i++) {
              showNotification({
                type: 'success',
                title: `Notification ${i}`
              })
            }
          }}>
            Show Multiple
          </button>
          <NotificationSystem maxNotifications={3} />
        </div>
      )
    }
    
    render(<TestComponent />)
    
    fireEvent.click(screen.getByText('Show Multiple'))
    
    expect(screen.getByText('Notification 2')).toBeInTheDocument()
    expect(screen.queryByText('Notification 0')).not.toBeInTheDocument()
  })
})
```

### 集成测试

```typescript
describe('NotificationSystem Integration', () => {
  it('works with different notification types', () => {
    const TestComponent = () => {
      const { showNotification } = useNotification()
      
      return (
        <div>
          <button onClick={() => showNotification({
            type: 'success',
            title: 'Success'
          })}>Success</button>
          <button onClick={() => showNotification({
            type: 'error',
            title: 'Error'
          })}>Error</button>
          <button onClick={() => showNotification({
            type: 'warning',
            title: 'Warning'
          })}>Warning</button>
          <NotificationSystem />
        </div>
      )
    }
    
    render(<TestComponent />)
    
    fireEvent.click(screen.getByText('Success'))
    fireEvent.click(screen.getByText('Error'))
    fireEvent.click(screen.getByText('Warning'))
    
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })
})
```

## 📝 注意事项

### 1. 性能考虑
- 通知数量过多时会影响性能
- 建议设置合理的 `maxNotifications` 值
- 长时间运行的应用需要定期清理通知

### 2. 可访问性
- 通知支持键盘导航
- 提供屏幕阅读器支持
- 符合 WCAG 2.1 标准

### 3. 移动端适配
- 在小屏幕上调整通知大小
- 触摸友好的关闭按钮
- 支持手势关闭

### 4. 最佳实践
- 使用有意义的通知标题
- 避免过于频繁的通知
- 提供清晰的操作反馈
- 支持通知的持久化存储

## 🔗 相关链接

- [组件文档索引](../README.md)
- [状态管理指南](../ZUSTAND_GUIDE.md)
- [代码优化指南](../CODE_OPTIMIZATION.md)

---

*最后更新: 2024年12月*
*组件版本: v1.0.0*
