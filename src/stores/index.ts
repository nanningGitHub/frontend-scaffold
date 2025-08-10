/**
 * 状态管理统一导出
 *
 * 集中管理所有 Zustand stores
 */

// 导出认证 store
export { useAuthStore } from './authStore';

// 导出 UI store
export { useUIStore } from './uiStore';

// 导出主题 store
export { useThemeStore } from './themeStore';

// 导出国际化 store
export { useI18nStore } from './i18nStore';

// 导出 store 类型（用于 TypeScript 类型推断）
export type { AuthStore } from './authStore';
export type { UIStore } from './uiStore';
export type { ThemeStore } from './themeStore';
export type { I18nStore } from './i18nStore';
