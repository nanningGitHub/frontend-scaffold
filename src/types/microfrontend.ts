/**
 * 微前端相关类型定义
 */
import type { ComponentType } from 'react';

// 定义 RequestInit 类型（如果不存在）
interface RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  mode?: RequestMode;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
}

type RequestMode = 'navigate' | 'same-origin' | 'no-cors' | 'cors';
type RequestCredentials = 'omit' | 'same-origin' | 'include';
type RequestCache =
  | 'default'
  | 'no-store'
  | 'reload'
  | 'no-cache'
  | 'force-cache'
  | 'only-if-cached';
type RequestRedirect = 'follow' | 'error' | 'manual';
type ReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';
type HeadersInit = Headers | string[][] | Record<string, string>;
type BodyInit =
  | ReadableStream
  | string
  | FormData
  | URLSearchParams
  | ArrayBuffer
  | ArrayBufferView
  | Blob;

// 远程模块配置
export interface RemoteModule {
  name: string;
  url: string;
  scope: string;
  module: string;
  version?: string;
}

// 微应用配置
export interface MicroApp {
  id: string;
  name: string;
  entry: string;
  container: string;
  activeRule: string | ((location: Location) => boolean);
  props?: Record<string, unknown>;
  loader?: () => Promise<unknown>;
  errorBoundary?: ComponentType<Record<string, unknown>>;
}

// 微应用生命周期
export interface MicroAppLifecycle {
  beforeLoad?: (app: MicroApp) => Promise<void>;
  beforeMount?: (app: MicroApp) => Promise<void>;
  afterMount?: (app: MicroApp) => Promise<void>;
  beforeUnmount?: (app: MicroApp) => Promise<void>;
  afterUnmount?: (app: MicroApp) => Promise<void>;
  onError?: (error: Error, app: MicroApp) => void;
}

// 微应用状态
export interface MicroAppState {
  id: string;
  status: 'loading' | 'mounted' | 'unmounted' | 'error';
  error?: Error;
  container?: HTMLElement;
}

// 微前端管理器配置
export interface MicroFrontendConfig {
  apps: MicroApp[];
  lifecycle?: MicroAppLifecycle;
  sandbox?: boolean;
  singular?: boolean;
  fetch?: (url: string, options?: RequestInit) => Promise<Response>;
}

// 模块联邦类型
export interface ModuleFederationConfig {
  name: string;
  remotes?: Record<string, string>;
  exposes?: Record<string, string>;
  shared?: Record<string, unknown>;
}

// 微应用通信消息
export interface MicroAppMessage {
  id: string;
  type: string;
  payload: unknown;
  source: string;
  target?: string;
  timestamp: number;
}

// 微应用事件
export interface MicroAppEvent {
  id: string;
  type: string;
  payload: unknown;
  source: string;
  target?: string;
  timestamp: number;
}

// 微应用路由配置
export interface MicroAppRoute {
  path: string;
  app: string;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
}
