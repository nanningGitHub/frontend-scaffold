import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import enTranslations from './locales/en.json';
import zhTranslations from './locales/zh.json';

function readViteEnvDevFlag(): boolean {
  try {
    // 使用类型安全的方式检查环境
    if (
      typeof (globalThis as any).import !== 'undefined' &&
      (globalThis as any).import?.meta?.env
    ) {
      return (globalThis as any).import.meta.env.DEV === true;
    }
    // 在测试环境中提供默认值
    if (process.env.NODE_ENV === 'test') {
      return true;
    }
    return false;
  } catch {
    return false;
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
  });

export default i18n;
