# [组件名称] 组件

[组件功能概述]

## 📋 组件概述

[组件名称] 组件是 [功能描述]，负责：
- [功能点1]
- [功能点2]
- [功能点3]
- [功能点4]
- [功能点5]

## 🎯 功能特性

### 1. [特性1]
- [特性描述1]
- [特性描述2]
- [特性描述3]

### 2. [特性2]
- [特性描述1]
- [特性描述2]
- [特性描述3]

### 3. [特性3]
- [特性描述1]
- [特性描述2]
- [特性描述3]

## 📖 API 文档

### Props

```typescript
interface [组件名称]Props {
  // Props 定义
}
```

| 属性 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `prop1` | `type` | ✅/❌ | `default` | 属性描述 |
| `prop2` | `type` | ✅/❌ | `default` | 属性描述 |

### 状态

```typescript
interface [组件名称]State {
  // 状态定义
}
```

## 💻 使用示例

### 基本用法
```tsx
import [组件名称] from './components/[组件名称]'

// 基本使用示例
<[组件名称] />
```

### 高级用法
```tsx
// 高级使用示例
<[组件名称] 
  prop1="value1"
  prop2="value2"
  onAction={handleAction}
/>
```

### 在组件中使用
```tsx
function ParentComponent() {
  return (
    <div>
      <[组件名称] />
    </div>
  )
}
```

## 🔧 实现细节

### 核心逻辑
```tsx
// 核心实现代码
const [组件名称] = ({ prop1, prop2, onAction }) => {
  // 组件实现
}
```

### 状态管理
```tsx
// 状态管理相关代码
const [state, setState] = useState(initialState)
```

### 事件处理
```tsx
// 事件处理相关代码
const handleAction = useCallback(() => {
  // 事件处理逻辑
}, [dependencies])
```

## ⚠️ 注意事项

### 1. [注意事项1]
- [详细说明1]
- [详细说明2]
- [详细说明3]

### 2. [注意事项2]
- [详细说明1]
- [详细说明2]
- [详细说明3]

### 3. [注意事项3]
- [详细说明1]
- [详细说明2]
- [详细说明3]

### 4. [注意事项4]
- [详细说明1]
- [详细说明2]
- [详细说明3]

## 🔗 相关组件

- [相关组件1](./相关组件1.md) - 相关组件描述
- [相关组件2](./相关组件2.md) - 相关组件描述
- [相关组件3](./相关组件3.md) - 相关组件描述

## 📝 更新日志

- **v1.0.0** - 初始版本，支持基本功能
- **v1.1.0** - 添加新功能
- **v1.2.0** - 优化性能和用户体验
- **v1.3.0** - 修复已知问题

## 🧪 测试用例

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import [组件名称] from './[组件名称]'

test('renders with default props', () => {
  render(<[组件名称] />)
  // 测试断言
})

test('handles user interaction', () => {
  render(<[组件名称] />)
  // 测试用户交互
})

test('applies custom props', () => {
  render(<[组件名称] prop1="custom" />)
  // 测试自定义属性
})
```

## 📚 使用指南

### 何时使用
- [使用场景1]
- [使用场景2]
- [使用场景3]

### 何时不使用
- [不适用场景1]
- [不适用场景2]
- [不适用场景3]

### 替代方案
- [替代方案1] - 适用于 [场景]
- [替代方案2] - 适用于 [场景]
- [替代方案3] - 适用于 [场景]

## 🎨 样式定制

### CSS 变量
```css
:root {
  --[组件名]-primary-color: #3b82f6;
  --[组件名]-secondary-color: #6b7280;
  --[组件名]-border-radius: 0.375rem;
}
```

### Tailwind 类
```tsx
// 可用的 Tailwind 类
className="bg-blue-600 text-white rounded-md hover:bg-blue-700"
```

### 主题适配
```tsx
// 主题相关的样式
const themeClasses = {
  light: 'bg-white text-gray-900',
  dark: 'bg-gray-900 text-white'
}
```

## 🔧 故障排除

### 常见问题

#### 问题1：[问题描述]
**原因：** [问题原因]
**解决方案：** [解决方案]

#### 问题2：[问题描述]
**原因：** [问题原因]
**解决方案：** [解决方案]

#### 问题3：[问题描述]
**原因：** [问题原因]
**解决方案：** [解决方案]

### 调试技巧
- [调试技巧1]
- [调试技巧2]
- [调试技巧3]

## 📖 参考资料

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [相关技术文档链接]
