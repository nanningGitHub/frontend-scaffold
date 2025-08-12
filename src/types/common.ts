/**
 * 通用类型定义
 * 用于替代代码中的 any 类型，提高类型安全性
 */

import React from 'react';

// API 相关类型
export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  code: number;
}

export interface ApiError {
  message: string;
  code: number;
  details?: unknown;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retry?: number;
}

// 事件相关类型
export interface EventData {
  type: string;
  payload: unknown;
  timestamp: number;
  source: string;
}

export interface EventHandler<T = unknown> {
  (event: T): void;
}

// 配置相关类型
export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'production' | 'test';
  debug: boolean;
  version: string;
}

// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  profile?: UserProfile;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  preferences?: Record<string, unknown>;
}

// 主题相关类型
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  dark: boolean;
}

// 国际化相关类型
export interface LocaleConfig {
  code: string;
  name: string;
  flag?: string;
  direction: 'ltr' | 'rtl';
}

// 性能监控相关类型
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface PerformanceObserver {
  (metric: PerformanceMetric): void;
}

// 日志相关类型
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
  context?: Record<string, unknown>;
  error?: Error;
}

export interface LogContext {
  app: string;
  version: string;
  environment: string;
  userId?: string;
  sessionId?: string;
  [key: string]: unknown;
}

// 安全相关类型
export interface SecurityPolicy {
  csp: string;
  hsts: boolean;
  xss: boolean;
  csrf: boolean;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

// 微前端相关类型
export interface MicroAppConfig {
  id: string;
  name: string;
  version: string;
  entry: string;
  container: string;
  permissions: Permission[];
  dependencies: string[];
}

// 工具类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// 函数类型
export type AsyncFunction<T = unknown, R = unknown> = (arg: T) => Promise<R>;
export type SyncFunction<T = unknown, R = unknown> = (arg: T) => R;
export type VoidFunction<T = unknown> = (arg: T) => void;

// 组件相关类型
export interface ComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  [key: string]: unknown;
}

// 表单相关类型
export interface FormField {
  name: string;
  value: unknown;
  error?: string;
  touched: boolean;
  required: boolean;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: unknown;
  message: string;
  validator?: (value: unknown) => boolean | string;
}

// 状态管理相关类型
export interface StoreState {
  loading: boolean;
  error: string | null;
  data: unknown;
  timestamp: number;
}

export interface StoreAction<T = unknown> {
  type: string;
  payload?: T;
  meta?: Record<string, unknown>;
}

// 路由相关类型
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
  permissions?: string[];
}

// 缓存相关类型
export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
}

// 网络相关类型
export interface NetworkRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
  timeout: number;
}

export interface NetworkResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  url: string;
}

// 错误处理相关类型
export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  location?: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// 测试相关类型
export interface TestConfig {
  environment: 'unit' | 'integration' | 'e2e';
  timeout: number;
  retries: number;
  parallel: boolean;
}

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: Error;
  metadata?: Record<string, unknown>;
}
