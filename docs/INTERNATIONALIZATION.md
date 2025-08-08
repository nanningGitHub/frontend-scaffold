# 国际化 (i18n) 使用指南

## 📋 概述

本项目使用 `react-i18next` 实现国际化支持，支持中英文切换，并提供完整的本地化解决方案。

## 🚀 快速开始

### 1. 基本使用

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
    </div>
  )
}
```

### 2. 语言切换

```tsx
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }
  
  return (
    <div>
      <button onClick={() => changeLanguage('zh')}>中文</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  )
}
```

## 📁 文件结构

```
src/
├── i18n/
│   ├── index.ts              # i18n 配置文件
│   └── locales/
│       ├── zh.json           # 中文翻译
│       └── en.json           # 英文翻译
├── components/
│   └── LanguageSwitcher.tsx  # 语言切换组件
└── hooks/
    └── useI18n.ts           # 国际化工具 Hook
```

## 🎯 功能特性

### 1. 自动语言检测
- 浏览器语言检测
- localStorage 持久化
- 默认语言回退

### 2. 语言切换组件
- 下拉菜单模式
- 按钮模式
- 响应式设计
- 国旗图标

### 3. 格式化工具
- 日期格式化
- 数字格式化
- 货币格式化
- RTL 支持

## 📝 翻译文件结构

### 中文翻译 (zh.json)
```json
{
  "common": {
    "loading": "加载中...",
    "error": "错误",
    "success": "成功"
  },
  "navigation": {
    "home": "首页",
    "about": "关于"
  },
  "home": {
    "title": "欢迎使用前端脚手架",
    "subtitle": "一个现代化的 React + TypeScript + Vite 项目模板"
  }
}
```

### 英文翻译 (en.json)
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  },
  "navigation": {
    "home": "Home",
    "about": "About"
  },
  "home": {
    "title": "Welcome to Frontend Scaffold",
    "subtitle": "A modern React + TypeScript + Vite project template"
  }
}
```

## 🛠️ 高级用法

### 1. 使用 useI18n Hook

```tsx
import { useI18n } from '@/hooks/useI18n'

function MyComponent() {
  const { t, currentLanguage, changeLanguage, formatDate, formatCurrency } = useI18n()
  
  return (
    <div>
      <p>当前语言: {currentLanguage}</p>
      <p>格式化日期: {formatDate(new Date())}</p>
      <p>格式化货币: {formatCurrency(1234.56)}</p>
      <button onClick={() => changeLanguage('en')}>切换到英文</button>
    </div>
  )
}
```

### 2. 插值使用

```tsx
// 翻译文件
{
  "welcome": "欢迎，{{name}}！",
  "items": "您有 {{count}} 个项目"
}

// 组件中使用
const { t } = useTranslation()

return (
  <div>
    <p>{t('welcome', { name: '张三' })}</p>
    <p>{t('items', { count: 5 })}</p>
  </div>
)
```

### 3. 复数支持

```tsx
// 翻译文件
{
  "item_one": "{{count}} 个项目",
  "item_other": "{{count}} 个项目"
}

// 组件中使用
<p>{t('item', { count: 1 })}</p>  // 输出: 1 个项目
<p>{t('item', { count: 5 })}</p>  // 输出: 5 个项目
```

### 4. 条件翻译

```tsx
// 翻译文件
{
  "status": {
    "online": "在线",
    "offline": "离线"
  }
}

// 组件中使用
const status = 'online'
<p>{t(`status.${status}`)}</p>
```

## 🎨 组件使用

### LanguageSwitcher 组件

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher'

// 下拉菜单模式
<LanguageSwitcher variant="dropdown" showLabel={true} />

// 按钮模式
<LanguageSwitcher variant="buttons" showLabel={false} />
```

### Props 说明

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `className` | `string` | `''` | 自定义 CSS 类名 |
| `showLabel` | `boolean` | `true` | 是否显示语言标签 |
| `variant` | `'dropdown' \| 'buttons'` | `'dropdown'` | 显示模式 |

## 🔧 配置选项

### i18n 配置

```typescript
// src/i18n/index.ts
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      zh: { translation: zhTranslations },
    },
    lng: 'zh',                    // 默认语言
    fallbackLng: 'en',            // 回退语言
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })
```

### 语言检测配置

```typescript
detection: {
  // 检测顺序
  order: ['localStorage', 'navigator', 'htmlTag'],
  
  // 缓存位置
  caches: ['localStorage'],
  
  // 查找键名
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  
  // 查询参数
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
}
```

## 📱 响应式设计

### 移动端适配

```tsx
// 在移动端隐藏语言标签
<LanguageSwitcher showLabel={window.innerWidth > 768} />
```

### RTL 支持

```tsx
import { useI18n } from '@/hooks/useI18n'

function MyComponent() {
  const { isRTL, getDirection } = useI18n()
  
  return (
    <div dir={getDirection()}>
      {isRTL() && <p>RTL 布局</p>}
    </div>
  )
}
```

## 🧪 测试

### 翻译测试

```tsx
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'

test('renders translated content', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MyComponent />
    </I18nextProvider>
  )
  
  expect(screen.getByText('Welcome to Frontend Scaffold')).toBeInTheDocument()
})
```

### 语言切换测试

```tsx
test('changes language', () => {
  const { i18n } = useTranslation()
  
  act(() => {
    i18n.changeLanguage('en')
  })
  
  expect(i18n.language).toBe('en')
})
```

## 📚 最佳实践

### 1. 翻译键命名

```typescript
// 推荐：使用点分隔的层级结构
{
  "home": {
    "title": "首页标题",
    "description": "首页描述"
  },
  "auth": {
    "login": "登录",
    "register": "注册"
  }
}

// 不推荐：扁平结构
{
  "homeTitle": "首页标题",
  "homeDescription": "首页描述"
}
```

### 2. 动态内容处理

```tsx
// 推荐：使用插值
const { t } = useTranslation()
const userName = '张三'
<p>{t('welcome', { name: userName })}</p>

// 不推荐：字符串拼接
<p>{t('welcome')} {userName}</p>
```

### 3. 错误处理

```tsx
// 推荐：提供默认值
const { t } = useTranslation()
<p>{t('unknown.key', '默认文本')}</p>

// 推荐：使用命名空间
const { t } = useTranslation('common')
<p>{t('loading')}</p>
```

## 🔄 添加新语言

### 1. 创建翻译文件

```json
// src/i18n/locales/ja.json
{
  "common": {
    "loading": "読み込み中...",
    "error": "エラー",
    "success": "成功"
  }
}
```

### 2. 更新配置

```typescript
// src/i18n/index.ts
import jaTranslations from './locales/ja.json'

i18n.init({
  resources: {
    en: { translation: enTranslations },
    zh: { translation: zhTranslations },
    ja: { translation: jaTranslations }, // 添加新语言
  },
  // ...
})
```

### 3. 更新语言切换器

```tsx
// src/components/LanguageSwitcher.tsx
const languages = [
  { code: 'zh', name: t('languages.zh'), flag: '🇨🇳' },
  { code: 'en', name: t('languages.en'), flag: '🇺🇸' },
  { code: 'ja', name: t('languages.ja'), flag: '🇯🇵' }, // 添加新语言
]
```

## 📊 性能优化

### 1. 懒加载翻译

```typescript
// 按需加载翻译文件
const loadTranslation = async (language: string) => {
  const translation = await import(`./locales/${language}.json`)
  i18n.addResourceBundle(language, 'translation', translation.default)
}
```

### 2. 缓存优化

```typescript
// 缓存翻译结果
const cachedTranslations = new Map()

const getTranslation = (key: string, options?: any) => {
  const cacheKey = `${key}_${JSON.stringify(options)}`
  if (cachedTranslations.has(cacheKey)) {
    return cachedTranslations.get(cacheKey)
  }
  
  const translation = t(key, options)
  cachedTranslations.set(cacheKey, translation)
  return translation
}
```

## 🐛 常见问题

### 1. 翻译不生效

**问题**: 翻译键不存在或路径错误
**解决**: 检查翻译文件结构和键名

### 2. 语言切换后页面不更新

**问题**: 组件没有重新渲染
**解决**: 确保组件使用了 `useTranslation` Hook

### 3. 日期格式化不正确

**问题**: 时区或格式配置问题
**解决**: 检查 `Intl.DateTimeFormat` 配置

## 📖 相关资源

- [react-i18next 官方文档](https://react.i18next.com/)
- [i18next 官方文档](https://www.i18next.com/)
- [国际化最佳实践](https://www.i18next.com/overview/best-practices)
- [日期时间格式化](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
