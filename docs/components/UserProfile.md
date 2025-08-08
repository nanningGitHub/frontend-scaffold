# UserProfile 组件

## 📋 概述

UserProfile 是一个用户资料管理组件，提供用户信息的展示、编辑、更新等功能。支持头像上传、个人信息管理、偏好设置等特性。

## 🎯 功能特性

- ✅ **用户信息展示** - 完整的用户资料展示
- ✅ **信息编辑** - 支持在线编辑用户信息
- ✅ **头像管理** - 头像上传和预览功能
- ✅ **偏好设置** - 用户偏好和设置管理
- ✅ **响应式设计** - 适配不同屏幕尺寸
- ✅ **实时保存** - 自动保存用户更改
- ✅ **权限控制** - 基于用户角色的权限管理

## 📦 安装和导入

```typescript
import { UserProfile } from '@/components/UserProfile'
```

## 🛠️ API 文档

### Props

| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `user` | `User` | - | 是 | 用户信息对象 |
| `onUpdate` | `(user: User) => void` | - | 否 | 用户信息更新回调 |
| `onAvatarChange` | `(file: File) => void` | - | 否 | 头像更改回调 |
| `editable` | `boolean` | `true` | 否 | 是否允许编辑 |
| `showAvatar` | `boolean` | `true` | 否 | 是否显示头像 |
| `className` | `string` | - | 否 | 自定义 CSS 类名 |

### 用户信息接口

```typescript
interface User {
  id: string
  username: string
  email: string
  name?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  phone?: string
  birthDate?: string
  preferences?: UserPreferences
  roles?: string[]
  createdAt: string
  updatedAt: string
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends'
    showEmail: boolean
    showPhone: boolean
  }
}
```

## 💡 使用示例

### 基本用法

```tsx
import { UserProfile } from '@/components/UserProfile'
import { useAuthStore } from '@/stores/authStore'

function ProfilePage() {
  const { user, updateUser } = useAuthStore()

  const handleUserUpdate = (updatedUser) => {
    console.log('用户信息已更新:', updatedUser)
    updateUser(updatedUser)
  }

  return (
    <div className="profile-page">
      <UserProfile
        user={user}
        onUpdate={handleUserUpdate}
      />
    </div>
  )
}
```

### 只读模式

```tsx
import { UserProfile } from '@/components/UserProfile'

function PublicProfilePage({ user }) {
  return (
    <div className="public-profile">
      <UserProfile
        user={user}
        editable={false}
        showAvatar={true}
      />
    </div>
  )
}
```

### 自定义头像处理

```tsx
import { UserProfile } from '@/components/UserProfile'
import { useNotification } from '@/components/NotificationSystem'

function ProfileWithAvatar() {
  const { showNotification } = useNotification()

  const handleAvatarChange = async (file) => {
    try {
      // 上传头像到服务器
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await api.post('/user/avatar', formData)
      
      showNotification({
        type: 'success',
        title: '头像更新成功',
        message: '您的头像已成功更新'
      })
      
      return response.data.avatarUrl
    } catch (error) {
      showNotification({
        type: 'error',
        title: '头像上传失败',
        message: '请检查文件格式和大小后重试'
      })
      throw error
    }
  }

  return (
    <UserProfile
      user={user}
      onAvatarChange={handleAvatarChange}
    />
  )
}
```

### 与状态管理集成

```tsx
import { UserProfile } from '@/components/UserProfile'
import { useAuthStore } from '@/stores/authStore'
import { useNotification } from '@/components/NotificationSystem'

function ProfileWithState() {
  const { user, updateUser } = useAuthStore()
  const { showNotification } = useNotification()

  const handleUserUpdate = async (updatedUser) => {
    try {
      await updateUser(updatedUser)
      showNotification({
        type: 'success',
        title: '信息更新成功',
        message: '您的个人信息已成功保存'
      })
    } catch (error) {
      showNotification({
        type: 'error',
        title: '更新失败',
        message: '保存失败，请稍后重试'
      })
    }
  }

  return (
    <UserProfile
      user={user}
      onUpdate={handleUserUpdate}
    />
  )
}
```

## 🔧 实现细节

### 表单状态管理

```typescript
// 使用 useForm Hook 管理编辑表单
const {
  values,
  errors,
  touched,
  isSubmitting,
  handleInputChange,
  handleSubmit,
  reset,
} = useForm({
  initialValues: {
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    phone: user.phone || '',
    birthDate: user.birthDate || '',
  },
  validationRules: {
    name: {
      maxLength: 50,
      message: '姓名不能超过50个字符'
    },
    bio: {
      maxLength: 200,
      message: '个人简介不能超过200个字符'
    },
    website: {
      pattern: /^https?:\/\/.+/,
      message: '请输入有效的网址'
    },
    phone: {
      pattern: /^[\d\-\+\(\)\s]+$/,
      message: '请输入有效的电话号码'
    }
  },
  onSubmit: async (values) => {
    const updatedUser = { ...user, ...values }
    await onUpdate(updatedUser)
  },
})
```

### 头像上传处理

```typescript
// 头像上传组件
const AvatarUpload = ({ currentAvatar, onAvatarChange }) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showNotification({
        type: 'error',
        title: '文件类型错误',
        message: '请选择图片文件'
      })
      return
    }

    // 验证文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification({
        type: 'error',
        title: '文件过大',
        message: '图片大小不能超过5MB'
      })
      return
    }

    setIsUploading(true)
    
    try {
      await onAvatarChange(file)
    } catch (error) {
      console.error('Avatar upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="avatar-upload">
      <div className="avatar-preview">
        <img
          src={currentAvatar || '/default-avatar.png'}
          alt="用户头像"
          className="avatar-image"
        />
        {isUploading && (
          <div className="upload-overlay">
            <LoadingSpinner size="small" />
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="upload-button"
      >
        {isUploading ? '上传中...' : '更换头像'}
      </button>
    </div>
  )
}
```

### 偏好设置管理

```typescript
// 用户偏好设置组件
const PreferencesSection = ({ preferences, onPreferencesChange }) => {
  const [localPreferences, setLocalPreferences] = useState(preferences)

  const handlePreferenceChange = (key, value) => {
    const updatedPreferences = {
      ...localPreferences,
      [key]: value
    }
    setLocalPreferences(updatedPreferences)
    onPreferencesChange(updatedPreferences)
  }

  return (
    <div className="preferences-section">
      <h3>偏好设置</h3>
      
      {/* 主题设置 */}
      <div className="preference-item">
        <label>主题模式</label>
        <select
          value={localPreferences.theme}
          onChange={(e) => handlePreferenceChange('theme', e.target.value)}
        >
          <option value="light">浅色模式</option>
          <option value="dark">深色模式</option>
          <option value="auto">跟随系统</option>
        </select>
      </div>

      {/* 语言设置 */}
      <div className="preference-item">
        <label>语言</label>
        <select
          value={localPreferences.language}
          onChange={(e) => handlePreferenceChange('language', e.target.value)}
        >
          <option value="zh-CN">中文</option>
          <option value="en-US">English</option>
        </select>
      </div>

      {/* 通知设置 */}
      <div className="preference-item">
        <label>通知设置</label>
        <div className="notification-options">
          <label>
            <input
              type="checkbox"
              checked={localPreferences.notifications.email}
              onChange={(e) => handlePreferenceChange('notifications', {
                ...localPreferences.notifications,
                email: e.target.checked
              })}
            />
            邮件通知
          </label>
          <label>
            <input
              type="checkbox"
              checked={localPreferences.notifications.push}
              onChange={(e) => handlePreferenceChange('notifications', {
                ...localPreferences.notifications,
                push: e.target.checked
              })}
            />
            推送通知
          </label>
        </div>
      </div>
    </div>
  )
}
```

### 实时保存功能

```typescript
// 自动保存 Hook
const useAutoSave = (data, saveFunction, delay = 2000) => {
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef(null)

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        await saveFunction(data)
      } catch (error) {
        console.error('Auto save failed:', error)
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [data, saveFunction, delay])

  return { isSaving }
}
```

## 🧪 测试用例

### 单元测试

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { UserProfile } from './UserProfile'

const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test User',
  avatar: '/avatar.jpg',
  bio: 'Test bio',
  location: 'Test City',
  website: 'https://example.com',
  phone: '123-456-7890',
  birthDate: '1990-01-01',
  preferences: {
    theme: 'light',
    language: 'zh-CN',
    notifications: {
      email: true,
      push: false,
      sms: false
    }
  },
  roles: ['user'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('UserProfile', () => {
  it('renders user information correctly', () => {
    renderWithRouter(<UserProfile user={mockUser} />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Test bio')).toBeInTheDocument()
    expect(screen.getByText('Test City')).toBeInTheDocument()
  })

  it('shows edit mode when editable is true', () => {
    renderWithRouter(<UserProfile user={mockUser} editable={true} />)
    
    expect(screen.getByText('编辑资料')).toBeInTheDocument()
  })

  it('hides edit mode when editable is false', () => {
    renderWithRouter(<UserProfile user={mockUser} editable={false} />)
    
    expect(screen.queryByText('编辑资料')).not.toBeInTheDocument()
  })

  it('calls onUpdate when form is submitted', async () => {
    const mockOnUpdate = jest.fn()
    
    renderWithRouter(
      <UserProfile user={mockUser} onUpdate={mockOnUpdate} />
    )
    
    // 进入编辑模式
    fireEvent.click(screen.getByText('编辑资料'))
    
    // 修改姓名
    const nameInput = screen.getByLabelText(/姓名/i)
    fireEvent.change(nameInput, { target: { value: 'New Name' } })
    
    // 保存更改
    fireEvent.click(screen.getByText('保存'))
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockUser,
          name: 'New Name'
        })
      )
    })
  })

  it('validates form fields', async () => {
    renderWithRouter(<UserProfile user={mockUser} />)
    
    // 进入编辑模式
    fireEvent.click(screen.getByText('编辑资料'))
    
    // 输入无效的网址
    const websiteInput = screen.getByLabelText(/个人网站/i)
    fireEvent.change(websiteInput, { target: { value: 'invalid-url' } })
    fireEvent.blur(websiteInput)
    
    await waitFor(() => {
      expect(screen.getByText(/请输入有效的网址/i)).toBeInTheDocument()
    })
  })

  it('handles avatar upload', async () => {
    const mockOnAvatarChange = jest.fn()
    
    renderWithRouter(
      <UserProfile 
        user={mockUser} 
        onAvatarChange={mockOnAvatarChange}
      />
    )
    
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' })
    const fileInput = screen.getByLabelText(/更换头像/i)
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(mockOnAvatarChange).toHaveBeenCalledWith(file)
    })
  })
})
```

### 集成测试

```typescript
describe('UserProfile Integration', () => {
  it('integrates with authentication store', async () => {
    const mockUpdateUser = jest.fn()
    const mockUser = { ...mockUser }
    
    renderWithRouter(
      <UserProfile 
        user={mockUser}
        onUpdate={mockUpdateUser}
      />
    )
    
    // 编辑用户信息
    fireEvent.click(screen.getByText('编辑资料'))
    
    const nameInput = screen.getByLabelText(/姓名/i)
    const bioInput = screen.getByLabelText(/个人简介/i)
    
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } })
    fireEvent.change(bioInput, { target: { value: 'Updated bio' } })
    
    fireEvent.click(screen.getByText('保存'))
    
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Name',
          bio: 'Updated bio'
        })
      )
    })
  })
})
```

## 📝 注意事项

### 1. 数据安全
- 敏感信息（如邮箱、电话）需要用户确认后才显示
- 实现数据加密传输
- 添加访问权限控制
- 支持数据导出功能

### 2. 用户体验
- 提供头像裁剪功能
- 支持拖拽上传头像
- 添加表单验证提示
- 实现撤销更改功能

### 3. 性能优化
- 图片懒加载
- 表单防抖处理
- 缓存用户偏好设置
- 优化大文件上传

### 4. 可访问性
- 提供键盘导航支持
- 添加屏幕阅读器标签
- 确保足够的颜色对比度
- 支持高对比度模式

## 🔗 相关链接

- [组件文档索引](../README.md)
- [状态管理指南](../ZUSTAND_GUIDE.md)
- [表单验证工具](../utils/validation.md)

---

*最后更新: 2024年12月*
*组件版本: v1.0.0*
