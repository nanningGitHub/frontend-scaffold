/**
 * 通用类型定义
 * 用于减少 any 类型的使用，提高类型安全性
 */

import React from 'react';

// 基础类型
export type Primitive = string | number | boolean | null | undefined;

// 通用对象类型
export type GenericObject<T = unknown> = Record<string, T>;

// 函数类型
export type FunctionType<TArgs extends unknown[] = unknown[], TReturn = unknown> = (...args: TArgs) => TReturn;

// 异步函数类型
export type AsyncFunctionType<TArgs extends unknown[] = unknown[], TReturn = unknown> = (...args: TArgs) => Promise<TReturn>;

// 事件处理器类型
export type EventHandler<T = Event> = (event: T) => void;

// 表单事件类型
export type FormEvent = Event & {
  target: HTMLFormElement;
};

// 输入事件类型
export type InputEvent = Event & {
  target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
};

// 网络请求类型
export type RequestConfig = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
};

// 响应类型
export type ApiResponse<T = unknown> = {
  data: T;
  status: number;
  message?: string;
  success: boolean;
};

// 错误类型
export type AppError = {
  message: string;
  code?: string | number;
  details?: unknown;
  timestamp: number;
};

// 日志级别
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// 日志条目类型
export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: GenericObject;
  error?: Error;
};

// 配置类型
export type AppConfig = {
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    [key: string]: boolean;
  };
};

// 用户类型
export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  profile?: GenericObject;
};

// 认证状态类型
export type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: AppError | null;
};

// 微前端应用类型
export type MicroApp = {
  name: string;
  url: string;
  scope: string;
  version: string;
  entry: string;
  dependencies?: string[];
  config?: GenericObject;
};

// 微前端通信消息类型
export type MicroAppMessage = {
  type: string;
  payload: unknown;
  source: string;
  target?: string;
  timestamp: number;
  id: string;
};

// 安全事件类型
export type SecurityEvent = {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: GenericObject;
  timestamp: number;
  source: string;
};

// 性能指标类型
export type PerformanceMetric = {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  context?: GenericObject;
};

// 国际化类型
export type I18nConfig = {
  locale: string;
  fallbackLocale: string;
  messages: Record<string, GenericObject>;
  dateTimeFormats?: Record<string, GenericObject>;
  numberFormats?: Record<string, GenericObject>;
};

// 主题类型
export type Theme = {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    error: string;
    warning: string;
    success: string;
  };
  spacing: Record<string, string>;
  typography: Record<string, GenericObject>;
};

// 路由类型
export type Route = {
  path: string;
  component: React.ComponentType<Record<string, unknown>>;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
  children?: Route[];
  meta?: GenericObject;
};

// 状态管理类型
export type StoreState<T = GenericObject> = T & {
  loading: boolean;
  error: AppError | null;
  lastUpdated: number;
};

// 分页类型
export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

// 排序类型
export type SortOrder = 'asc' | 'desc';

export type SortConfig = {
  field: string;
  order: SortOrder;
};

// 过滤类型
export type FilterConfig = {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn';
  value: unknown;
};

// 查询参数类型
export type QueryParams = {
  search?: string;
  filters?: FilterConfig[];
  sort?: SortConfig[];
  pagination?: Pagination;
  [key: string]: unknown;
};

// 工具类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PickByType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type ExcludeByType<T, U> = {
  [K in keyof T]: T[K] extends U ? never : K;
}[keyof T];
