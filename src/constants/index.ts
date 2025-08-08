/**
 * 应用常量配置
 * 
 * 集中管理所有常量，便于维护和修改
 */

// API 相关常量
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000,
  RETRY_TIMES: 3,
  RETRY_DELAY: 1000,
} as const

// 认证相关常量
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth-token',
  USER_KEY: 'auth-user',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24小时
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5分钟
} as const

// 表单验证规则
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: '请输入有效的邮箱地址',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MESSAGE: '密码至少6位',
  },
  NAME: {
    MIN_LENGTH: 2,
    MESSAGE: '姓名至少2个字符',
  },
} as const

// 通知配置
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 3000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
  WARNING_DURATION: 4000,
  INFO_DURATION: 3000,
} as const

// 主题配置
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

// 路由配置
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  API_EXAMPLE: '/api-example',
  STATE_DEMO: '/state-demo',
} as const

// 本地存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  AUTH_USER: 'auth-user',
  THEME: 'app-theme',
  SIDEBAR_STATE: 'sidebar-state',
  NOTIFICATIONS: 'notifications',
} as const

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '没有权限访问此资源',
  NOT_FOUND: '请求的资源不存在',
  VALIDATION_ERROR: '输入数据格式不正确',
  UNKNOWN_ERROR: '发生未知错误，请稍后重试',
} as const

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '已成功登出',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
  SAVE_SUCCESS: '保存成功',
} as const

// 加载状态文本
export const LOADING_MESSAGES = {
  LOGGING_IN: '登录中...',
  REGISTERING: '注册中...',
  LOADING: '加载中...',
  SAVING: '保存中...',
  DELETING: '删除中...',
  UPLOADING: '上传中...',
} as const

// 分页配置
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const

// 文件上传配置
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILES: 10,
} as const

// 性能监控配置
export const PERFORMANCE_CONFIG = {
  SLOW_THRESHOLD: 3000, // 3秒
  VERY_SLOW_THRESHOLD: 10000, // 10秒
} as const
