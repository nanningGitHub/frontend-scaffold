import { MicroApp, MicroFrontendConfig } from '../types/microfrontend';

/**
 * 微前端配置
 */

// 微应用配置
export const microApps: MicroApp[] = [
  {
    id: 'remote-app',
    name: 'Remote Application',
    entry: 'http://localhost:3001/assets/remoteEntry.js',
    container: 'remote-app-container',
    activeRule: '/remote',
    props: {
      theme: 'light',
      locale: 'zh-CN',
    },
  },
  {
    id: 'user-module',
    name: 'User Management Module',
    entry: 'http://localhost:3002/assets/remoteEntry.js',
    container: 'user-module-container',
    activeRule: '/users',
    props: {
      apiBaseUrl: '/api/users',
      permissions: ['read', 'write'],
    },
  },
  {
    id: 'admin-module',
    name: 'Admin Management Module',
    entry: 'http://localhost:3003/assets/remoteEntry.js',
    container: 'admin-module-container',
    activeRule: '/admin',
    props: {
      apiBaseUrl: '/api/admin',
      permissions: ['admin', 'super-admin'],
    },
  },
];

// 微前端管理器配置
export const microFrontendConfig: MicroFrontendConfig = {
  apps: microApps,
  lifecycle: {
    beforeLoad: async (app) => {
      console.log(`Loading micro app: ${app.name}`);
      // 可以在这里添加权限检查、预加载等逻辑
    },
    beforeMount: async (app) => {
      console.log(`Mounting micro app: ${app.name}`);
      // 可以在这里添加挂载前的准备工作
    },
    afterMount: async (app) => {
      console.log(`Micro app mounted: ${app.name}`);
      // 可以在这里添加挂载后的初始化工作
    },
    beforeUnmount: async (app) => {
      console.log(`Unmounting micro app: ${app.name}`);
      // 可以在这里添加卸载前的清理工作
    },
    afterUnmount: async (app) => {
      console.log(`Micro app unmounted: ${app.name}`);
      // 可以在这里添加卸载后的清理工作
    },
    onError: (error, app) => {
      console.error(`Error in micro app ${app.name}:`, error);
      // 可以在这里添加错误处理逻辑
    },
  },
  sandbox: true,
  singular: true,
};

// 微应用路由配置
export const microAppRoutes = [
  {
    path: '/remote/*',
    app: 'remote-app',
  },
  {
    path: '/users/*',
    app: 'user-module',
  },
  {
    path: '/admin/*',
    app: 'admin-module',
  },
];

// 微应用通信配置
export const communicationConfig = {
  // 全局事件类型
  events: {
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    THEME_CHANGE: 'theme:change',
    LOCALE_CHANGE: 'locale:change',
    NAVIGATION: 'navigation',
    DATA_UPDATE: 'data:update',
  },

  // 消息超时时间
  messageTimeout: 5000,

  // 重试次数
  maxRetries: 3,
};

// 微应用加载配置
export const loadingConfig = {
  // 加载超时时间
  timeout: 30000,

  // 重试间隔
  retryInterval: 2000,

  // 最大重试次数
  maxRetries: 3,

  // 预加载配置
  preload: {
    enabled: true,
    delay: 1000,
  },
};

// 微应用样式配置
export const styleConfig = {
  // 容器样式
  container: {
    minHeight: '400px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px 0',
  },

  // 加载状态样式
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },

  // 错误状态样式
  error: {
    textAlign: 'center',
    padding: '40px',
    color: '#ef4444',
  },
};
