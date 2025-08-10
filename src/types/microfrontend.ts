/**
 * 微前端相关类型定义
 */

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
  props?: Record<string, any>;
  loader?: () => Promise<any>;
  errorBoundary?: React.ComponentType<any>;
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
  shared?: Record<string, any>;
}

// 微应用通信消息
export interface MicroAppMessage {
  type: string;
  payload: any;
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
