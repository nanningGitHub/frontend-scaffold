# 微前端架构指南

## 概述

本项目已集成完整的微前端架构支持，基于 Vite 的模块联邦插件实现。微前端架构允许将大型前端应用拆分为多个独立的微应用，每个微应用可以独立开发、部署和维护。

## 架构特性

### 🚀 核心功能

- **模块联邦**: 基于 `@originjs/vite-plugin-federation` 实现
- **动态加载**: 支持微应用的按需加载和卸载
- **生命周期管理**: 完整的微应用生命周期钩子
- **通信系统**: 微应用间的消息传递和事件通信
- **沙箱隔离**: 支持微应用的安全隔离
- **路由集成**: 与 React Router 的深度集成

### 🏗️ 架构组件

- **主应用 (Host App)**: 负责微应用的加载和管理
- **微应用 (Micro Apps)**: 独立的子应用模块
- **通信总线**: 微应用间的消息传递
- **状态管理**: 共享状态和本地状态管理

## 快速开始

### 1. 启动主应用

```bash
# 使用微前端配置启动
npm run dev:micro

# 或者直接使用微前端配置
npx vite --config vite.config.micro.ts
```

### 2. 访问微前端演示

启动后访问 `http://localhost:3000/micro-frontend` 查看微前端功能演示。

### 3. 启动微应用

微应用需要单独启动，每个微应用使用不同的端口：

```bash
# 微应用 1 (端口 3001)
cd remote-app && npm run dev

# 微应用 2 (端口 3002)
cd user-module && npm run dev

# 微应用 3 (端口 3003)
cd admin-module && npm run dev
```

## 配置说明

### 主应用配置 (vite.config.micro.ts)

```typescript
import { federation } from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'host-app',
      remotes: {
        'remote-app': 'http://localhost:3001/assets/remoteEntry.js',
        'user-module': 'http://localhost:3002/assets/remoteEntry.js',
        'admin-module': 'http://localhost:3003/assets/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
        // ... 其他共享依赖
      },
      exposes: {
        './Layout': './src/components/Layout.tsx',
        './Navigation': './src/components/Navigation.tsx',
        // ... 暴露给其他微应用的模块
      },
    }),
  ],
});
```

### 微应用配置

每个微应用需要配置模块联邦：

```typescript
// 微应用的 vite.config.ts
import { federation } from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'remote-app',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
  ],
});
```

## 使用方法

### 1. 微应用容器组件

```tsx
import { MicroAppContainer } from '../components/MicroAppContainer';

function MyPage() {
  return (
    <MicroAppContainer
      appId="user-module"
      containerId="user-container"
      entry="http://localhost:3002/assets/remoteEntry.js"
      module="default"
      props={{ theme: 'light', locale: 'zh-CN' }}
      onLoad={() => console.log('微应用加载完成')}
      onError={(error) => console.error('加载失败:', error)}
    />
  );
}
```

### 2. 微应用通信

```tsx
import { globalCommunication } from '../utils/microAppCommunication';

// 发送消息到特定微应用
globalCommunication.sendToApp('user-module', 'user:login', { userId: 123 });

// 广播消息到所有微应用
globalCommunication.broadcast('theme:change', { theme: 'dark' });

// 订阅消息
const unsubscribe = globalCommunication.subscribe(
  'user:logout',
  (payload, source) => {
    console.log('用户登出:', payload, '来自:', source);
  }
);

// 取消订阅
unsubscribe();
```

### 3. 微前端管理器

```tsx
import { MicroFrontendManager } from '../utils/microFrontendManager';
import { microFrontendConfig } from '../config/microFrontend';

// 创建管理器实例
const manager = new MicroFrontendManager(microFrontendConfig);

// 加载微应用
await manager.loadApp('user-module');

// 卸载微应用
await manager.unloadApp('user-module');

// 获取应用状态
const state = manager.getAppState('user-module');
```

## 微应用开发指南

### 1. 创建新的微应用

```bash
# 创建微应用目录
mkdir my-micro-app
cd my-micro-app

# 初始化项目
npm init -y

# 安装依赖
npm install react react-dom vite @vitejs/plugin-react
npm install @originjs/vite-plugin-federation --save-dev
```

### 2. 配置微应用

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'my-micro-app',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
      },
    }),
  ],
  server: {
    port: 3004, // 使用不同的端口
  },
});
```

### 3. 微应用入口文件

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 微应用独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
}

// 导出微应用组件
export default App;
```

## 最佳实践

### 1. 依赖管理

- 共享依赖使用 `singleton: true` 确保单例
- 版本号保持一致，避免冲突
- 避免在微应用中重复打包共享依赖

### 2. 通信规范

- 定义清晰的消息类型和数据结构
- 使用事件驱动而非直接调用
- 实现错误处理和重试机制

### 3. 样式隔离

- 使用 CSS Modules 或 CSS-in-JS
- 避免全局样式污染
- 考虑使用 Shadow DOM 实现完全隔离

### 4. 性能优化

- 实现微应用的预加载
- 使用代码分割减少包体积
- 监控微应用的加载性能

## 故障排除

### 常见问题

1. **模块加载失败**

   - 检查微应用是否正常启动
   - 验证端口配置和网络连接
   - 查看浏览器控制台错误信息

2. **依赖冲突**

   - 确保共享依赖版本一致
   - 检查 `singleton` 配置
   - 清理缓存重新构建

3. **通信失败**
   - 验证消息格式和类型
   - 检查事件订阅是否正确
   - 确认微应用 ID 匹配

### 调试技巧

```typescript
// 启用详细日志
localStorage.setItem('debug', 'micro-frontend:*');

// 查看微应用状态
console.log(manager.getAllAppStates());

// 监控通信消息
globalCommunication.subscribe('*', (payload, source) => {
  console.log('Message:', { payload, source, timestamp: Date.now() });
});
```

## 部署说明

### 1. 构建配置

```bash
# 主应用构建
npm run build:micro

# 微应用构建
cd micro-app && npm run build
```

### 2. 部署注意事项

- 确保微应用的 `remoteEntry.js` 文件可访问
- 配置正确的 CORS 策略
- 使用 CDN 加速静态资源
- 实现健康检查和监控

### 3. 环境配置

```bash
# 生产环境
VITE_MICRO_APP_BASE_URL=https://your-domain.com
VITE_MICRO_APP_CDN_URL=https://cdn.your-domain.com

# 开发环境
VITE_MICRO_APP_BASE_URL=http://localhost:3000
```

## 扩展功能

### 1. 微应用预加载

```typescript
// 预加载微应用
const preloadApp = async (appId: string) => {
  const app = microApps.find((app) => app.id === appId);
  if (app) {
    await import(/* webpackIgnore: true */ app.entry);
  }
};
```

### 2. 微应用热更新

```typescript
// 监听微应用更新
if (import.meta.hot) {
  import.meta.hot.accept('./remoteEntry.js', () => {
    // 重新加载微应用
    manager.reloadApp(appId);
  });
}
```

### 3. 微应用权限控制

```typescript
// 权限检查
const checkPermission = (appId: string, userPermissions: string[]) => {
  const app = microApps.find((app) => app.id === appId);
  return app?.props?.permissions?.some((p) => userPermissions.includes(p));
};
```

## 总结

微前端架构为大型前端应用提供了灵活性和可维护性。通过合理的配置和最佳实践，可以构建出高性能、可扩展的微前端应用。

如需更多帮助，请参考：

- [Vite 模块联邦文档](https://github.com/originjs/vite-plugin-federation)
- [微前端最佳实践](https://micro-frontends.org/)
- [项目示例代码](./src/pages/MicroFrontendDemo.tsx)
