/// <reference types="vite/client" />

/**
 * Vite 环境变量类型定义
 * 用于 TypeScript 类型检查和 IDE 智能提示
 * 
 * 使用方式：
 * import.meta.env.VITE_API_BASE_URL
 */
// eslint-disable-next-line no-unused-vars
interface ImportMetaEnv {
  /** API 基础URL，用于配置 axios 实例 */
  readonly VITE_API_BASE_URL: string
  /** 应用环境标识 */
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  /** 应用版本号 */
  readonly VITE_APP_VERSION: string
  /** 是否启用调试模式 */
  readonly VITE_DEBUG: string
  // 更多环境变量...
}
