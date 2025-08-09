import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 导入翻译文件
import enTranslations from './locales/en.json'
import zhTranslations from './locales/zh.json'

function readViteEnvDevFlag(): boolean {
  try {
    const env = eval('import.meta && import.meta.env') as any
    return !!env?.DEV
  } catch {
    return ((globalThis as any).process?.env?.NODE_ENV) !== 'production'
  }
}

/**
 * i18n 国际化配置
 * 
 * 功能：
 * 1. 多语言支持
 * 2. 自动语言检测
 * 3. 语言切换
 * 4. 翻译管理
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 翻译资源
    resources: {
      en: {
        translation: enTranslations,
      },
      zh: {
        translation: zhTranslations,
      },
    },
    
    // 默认语言由浏览器/本地缓存自动探测
    fallbackLng: 'en',
    
    // 调试模式（兼容 Jest/Node）
    debug: readViteEnvDevFlag(),
    
    // 插值配置
    interpolation: {
      escapeValue: false, // React 已经处理了 XSS
    },
    
    // 语言检测配置
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // 命名空间
    ns: ['translation'],
    defaultNS: 'translation',
    
    // 复数规则
    pluralSeparator: '_',
    contextSeparator: '_',
  })

export default i18n
