# LanguageSwitcher 组件

语言切换器组件，提供多语言支持和国际化切换功能。

## 📋 组件概述

`LanguageSwitcher` 是一个多语言切换组件，支持动态语言切换、语言检测和本地化配置。它集成了 i18next 国际化框架，提供流畅的语言切换体验。

## 🎯 主要功能

- **多语言支持** - 支持中文、英文等多种语言
- **动态切换** - 实时切换应用语言
- **语言检测** - 自动检测用户浏览器语言
- **本地化存储** - 记住用户的语言偏好
- **响应式设计** - 适配不同屏幕尺寸
- **无障碍支持** - 支持键盘导航和屏幕阅读器

## 🔧 Props

```typescript
interface LanguageSwitcherProps {
  /** 支持的语言列表 */
  languages?: Language[]
  /** 当前语言 */
  currentLanguage?: string
  /** 语言切换回调 */
  onLanguageChange?: (language: string) => void
  /** 是否显示语言名称 */
  showLanguageName?: boolean
  /** 是否显示国旗图标 */
  showFlag?: boolean
  /** 自定义样式类名 */
  className?: string
  /** 下拉菜单位置 */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** 是否禁用 */
  disabled?: boolean
}

interface Language {
  code: string
  name: string
  nativeName: string
  flag?: string
}
```

## 📝 基本用法

### 基础语言切换器

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

function App() {
  return (
    <div className="app">
      <header>
        <LanguageSwitcher />
      </header>
      {/* 应用内容 */}
    </div>
  )
}
```

### 自定义语言配置

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

const customLanguages = [
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' }
]

function App() {
  const handleLanguageChange = (language: string) => {
    console.log('语言切换到:', language)
    // 执行语言切换逻辑
  }

  return (
    <LanguageSwitcher
      languages={customLanguages}
      onLanguageChange={handleLanguageChange}
      showLanguageName={true}
      showFlag={true}
    />
  )
}
```

### 受控组件模式

```tsx
import { useState } from 'react'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

function App() {
  const [currentLanguage, setCurrentLanguage] = useState('zh')

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
    // 更新 i18next 语言
    i18n.changeLanguage(language)
  }

  return (
    <LanguageSwitcher
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
    />
  )
}
```

## 🏗️ 核心实现

### 组件结构

```tsx
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  languages = DEFAULT_LANGUAGES,
  currentLanguage: controlledLanguage,
  onLanguageChange,
  showLanguageName = false,
  showFlag = true,
  className = '',
  placement = 'bottom',
  disabled = false
}) => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(
    controlledLanguage || i18n.language || 'zh'
  )
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [storedLanguage, setStoredLanguage] = useLocalStorage('preferred-language', 'zh')

  // 检测用户浏览器语言
  useEffect(() => {
    if (!controlledLanguage && !storedLanguage) {
      const browserLanguage = navigator.language.split('-')[0]
      const supportedLanguage = languages.find(lang => lang.code === browserLanguage)
      if (supportedLanguage) {
        setSelectedLanguage(browserLanguage)
        setStoredLanguage(browserLanguage)
        i18n.changeLanguage(browserLanguage)
      }
    }
  }, [controlledLanguage, storedLanguage, languages, i18n, setStoredLanguage])

  // 点击外部关闭下拉菜单
  useClickOutside(dropdownRef, () => setIsOpen(false))

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    setIsOpen(false)
    
    if (!controlledLanguage) {
      setStoredLanguage(languageCode)
      i18n.changeLanguage(languageCode)
    }
    
    onLanguageChange?.(languageCode)
  }

  const currentLanguageData = languages.find(lang => lang.code === selectedLanguage)

  return (
    <div className={`language-switcher ${className}`} ref={dropdownRef}>
      <button
        className="language-switcher__trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label={`当前语言: ${currentLanguageData?.nativeName}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {showFlag && currentLanguageData?.flag && (
          <span className="language-switcher__flag">
            {currentLanguageData.flag}
          </span>
        )}
        
        {showLanguageName && currentLanguageData && (
          <span className="language-switcher__name">
            {currentLanguageData.nativeName}
          </span>
        )}
        
        <span className="language-switcher__arrow">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className={`language-switcher__dropdown language-switcher__dropdown--${placement}`}>
          <ul className="language-switcher__list" role="listbox">
            {languages.map((language) => (
              <li
                key={language.code}
                className={`language-switcher__item ${
                  language.code === selectedLanguage ? 'language-switcher__item--active' : ''
                }`}
                role="option"
                aria-selected={language.code === selectedLanguage}
                onClick={() => handleLanguageSelect(language.code)}
              >
                {showFlag && language.flag && (
                  <span className="language-switcher__flag">
                    {language.flag}
                  </span>
                )}
                
                <span className="language-switcher__name">
                  {language.nativeName}
                </span>
                
                {language.code === selectedLanguage && (
                  <span className="language-switcher__check">✓</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### 默认语言配置

```tsx
const DEFAULT_LANGUAGES: Language[] = [
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  }
]
```

### 自定义 Hook

```tsx
// useClickOutside Hook
export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}
```

## 🎨 样式设计

### 基础样式

```css
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-switcher__trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  color: #374151;
}

.language-switcher__trigger:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
}

.language-switcher__trigger:focus {
  outline: none;
  ring: 2px;
  ring-color: #3182ce;
  ring-offset: 2px;
}

.language-switcher__flag {
  font-size: 1.25rem;
  line-height: 1;
}

.language-switcher__name {
  font-weight: 500;
}

.language-switcher__arrow {
  font-size: 0.75rem;
  color: #6b7280;
  transition: transform 0.2s;
}

.language-switcher__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  min-width: 120px;
}

.language-switcher__dropdown--top {
  top: auto;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 0.25rem;
}

.language-switcher__dropdown--left {
  left: auto;
  right: 100%;
  top: 0;
  margin-top: 0;
  margin-right: 0.25rem;
}

.language-switcher__dropdown--right {
  left: 100%;
  right: auto;
  top: 0;
  margin-top: 0;
  margin-left: 0.25rem;
}

.language-switcher__list {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.language-switcher__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.language-switcher__item:hover {
  background: #f7fafc;
}

.language-switcher__item--active {
  background: #ebf8ff;
  color: #3182ce;
}

.language-switcher__check {
  margin-left: auto;
  color: #3182ce;
  font-weight: bold;
}
```

### 响应式样式

```css
@media (max-width: 640px) {
  .language-switcher__name {
    display: none;
  }
  
  .language-switcher__trigger {
    padding: 0.375rem 0.5rem;
  }
  
  .language-switcher__dropdown {
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .language-switcher__flag {
    font-size: 1rem;
  }
  
  .language-switcher__arrow {
    font-size: 0.625rem;
  }
}
```

### 深色主题支持

```css
@media (prefers-color-scheme: dark) {
  .language-switcher__trigger {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }
  
  .language-switcher__trigger:hover {
    background: #111827;
    border-color: #4b5563;
  }
  
  .language-switcher__dropdown {
    background: #1f2937;
    border-color: #374151;
  }
  
  .language-switcher__item:hover {
    background: #111827;
  }
  
  .language-switcher__item--active {
    background: #1e3a8a;
    color: #93c5fd;
  }
}
```

## 🧪 测试用例

### 基础功能测试

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'

const mockLanguages = [
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' }
]

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  )
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // 重置 i18n 语言
    i18n.changeLanguage('zh')
  })

  it('应该渲染语言切换器', () => {
    renderWithI18n(<LanguageSwitcher languages={mockLanguages} />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('🇨🇳')).toBeInTheDocument()
  })

  it('应该显示当前语言', () => {
    renderWithI18n(
      <LanguageSwitcher 
        languages={mockLanguages} 
        showLanguageName={true} 
      />
    )
    
    expect(screen.getByText('中文')).toBeInTheDocument()
  })

  it('应该打开下拉菜单', () => {
    renderWithI18n(<LanguageSwitcher languages={mockLanguages} />)
    
    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)
    
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('应该切换语言', async () => {
    const onLanguageChange = jest.fn()
    
    renderWithI18n(
      <LanguageSwitcher 
        languages={mockLanguages}
        onLanguageChange={onLanguageChange}
      />
    )
    
    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)
    
    const englishOption = screen.getByText('English')
    fireEvent.click(englishOption)
    
    await waitFor(() => {
      expect(onLanguageChange).toHaveBeenCalledWith('en')
    })
  })

  it('应该记住用户语言偏好', async () => {
    // 模拟 localStorage
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue('en'),
      setItem: jest.fn()
    }
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    })
    
    renderWithI18n(<LanguageSwitcher languages={mockLanguages} />)
    
    await waitFor(() => {
      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    })
  })
})
```

### 无障碍性测试

```tsx
describe('LanguageSwitcher 无障碍性', () => {
  it('应该支持键盘导航', () => {
    renderWithI18n(<LanguageSwitcher languages={mockLanguages} />)
    
    const trigger = screen.getByRole('button')
    trigger.focus()
    
    // 按 Enter 键打开菜单
    fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(screen.getByText('English')).toBeInTheDocument()
    
    // 按 Escape 键关闭菜单
    fireEvent.keyDown(trigger, { key: 'Escape' })
    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })

  it('应该支持 ARIA 属性', () => {
    renderWithI18n(<LanguageSwitcher languages={mockLanguages} />)
    
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('应该支持屏幕阅读器', () => {
    renderWithI18n(<LanguageSwitcher languages={mockLanguages} />)
    
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-label', '当前语言: 中文')
  })
})
```

## 📊 性能考虑

### 性能优化策略

1. **懒加载语言包**: 只在需要时加载语言资源
2. **防抖处理**: 避免频繁的语言切换操作
3. **内存管理**: 及时清理不需要的语言资源
4. **缓存机制**: 缓存已加载的语言配置

### 性能监控

```tsx
import { useEffect, useRef } from 'react'

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = (props) => {
  const performanceRef = useRef<PerformanceMark | null>(null)
  
  const handleLanguageSelect = async (languageCode: string) => {
    // 开始性能监控
    performanceRef.current = performance.mark('language-switch-start')
    
    try {
      // 执行语言切换
      await i18n.changeLanguage(languageCode)
      
      // 记录性能指标
      if (performanceRef.current) {
        performance.measure(
          'language-switch',
          'language-switch-start'
        )
        
        const measure = performance.getEntriesByName('language-switch')[0]
        console.log('语言切换耗时:', measure.duration, 'ms')
      }
    } catch (error) {
      console.error('语言切换失败:', error)
    } finally {
      // 清理性能标记
      if (performanceRef.current) {
        performance.clearMarks('language-switch-start')
        performance.clearMeasures('language-switch')
      }
    }
  }
  
  // ... 其他实现
}
```

## 🔒 安全考虑

### 输入验证

```tsx
const validateLanguageCode = (code: string): boolean => {
  // 只允许字母和连字符
  const validPattern = /^[a-z]{2}(-[A-Z]{2})?$/
  return validPattern.test(code)
}

const handleLanguageSelect = (languageCode: string) => {
  if (!validateLanguageCode(languageCode)) {
    console.error('无效的语言代码:', languageCode)
    return
  }
  
  // 继续处理语言切换
  // ...
}
```

### XSS 防护

```tsx
const sanitizeLanguageName = (name: string): string => {
  // 移除潜在的 HTML 标签
  return name.replace(/<[^>]*>/g, '')
}

// 在渲染时使用
<span className="language-switcher__name">
  {sanitizeLanguageName(language.nativeName)}
</span>
```

## 📚 最佳实践

### 1. 语言配置管理

```tsx
// 推荐：集中管理语言配置
const LANGUAGE_CONFIG = {
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ','
    }
  }
} as const

// 使用配置
const languages = Object.values(LANGUAGE_CONFIG)
```

### 2. 语言切换状态管理

```tsx
// 推荐：使用 Zustand 管理语言状态
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageState {
  currentLanguage: string
  setLanguage: (language: string) => void
  resetLanguage: () => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'zh',
      setLanguage: (language) => set({ currentLanguage: language }),
      resetLanguage: () => set({ currentLanguage: 'zh' })
    }),
    {
      name: 'language-storage'
    }
  )
)

// 在组件中使用
const { currentLanguage, setLanguage } = useLanguageStore()
```

### 3. 错误处理和回退

```tsx
const handleLanguageChange = async (languageCode: string) => {
  try {
    // 检查语言包是否可用
    const isAvailable = await i18n.hasResourceBundle(languageCode, 'translation')
    
    if (!isAvailable) {
      // 回退到默认语言
      console.warn(`语言包 ${languageCode} 不可用，回退到默认语言`)
      languageCode = 'en'
    }
    
    await i18n.changeLanguage(languageCode)
    onLanguageChange?.(languageCode)
    
  } catch (error) {
    console.error('语言切换失败:', error)
    // 显示错误提示
    showNotification('语言切换失败，请稍后重试', 'error')
  }
}
```

## 🚀 未来改进

### 计划中的功能

1. **智能语言检测**: 基于用户地理位置和偏好自动选择语言
2. **语言包预加载**: 预加载常用语言包提升切换速度
3. **语音识别**: 支持语音切换语言
4. **手势支持**: 支持滑动手势切换语言
5. **语言学习**: 记录用户语言使用习惯

### 技术债务

1. **TypeScript 类型优化**: 改进语言配置的类型定义
2. **测试覆盖率提升**: 增加更多边界情况的测试
3. **性能基准测试**: 建立性能基准和监控
4. **文档完善**: 添加更多使用示例和最佳实践

---

*最后更新: 2024年12月*  
*组件版本: v1.0.0*
