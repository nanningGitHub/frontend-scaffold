import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './i18n';
import i18n from './i18n';
import * as Sentry from '@sentry/react';
import { onCLS, onFID, onLCP } from 'web-vitals';

// MSW（仅在开发环境并且开启 MOCK 时启动）
// 动态导入并暴露就绪 Promise，避免阻塞初始渲染
if (import.meta.env?.DEV && import.meta.env?.VITE_ENABLE_MSW === 'true') {
  (window as { __mswReady?: Promise<unknown> }).__mswReady = import(
    './mocks/browser'
  ).then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }));
}

/**
 * 初始化主题系统
 */
const initializeTheme = () => {
  try {
    // 简单的主题初始化，避免复杂逻辑
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        if (themeData.state && themeData.state.theme) {
          if (themeData.state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (e) {
        console.warn('Failed to parse theme from localStorage:', e);
      }
    }

    // 检测系统主题偏好
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
      }
    }
  } catch (error) {
    console.warn('Theme initialization failed:', error);
  }
};

// 初始化主题
initializeTheme();

/**
 * 应用入口文件
 *
 * 主要功能：
 * 1. 创建 React 根节点
 * 2. 配置路由系统
 * 3. 挂载应用到 DOM
 * 4. 启用严格模式
 */

// 获取根 DOM 元素
const rootElement = document.getElementById('root');

// 确保根元素存在
if (!rootElement) {
  throw new Error('Root element not found');
}

// 创建 React 根节点
const root = ReactDOM.createRoot(rootElement);

// 根据语言方向设置 html[dir]
document.documentElement.setAttribute('dir', i18n.dir());
i18n.on('languageChanged', () => {
  document.documentElement.setAttribute('dir', i18n.dir());
});

// 初始化 Sentry（如果配置了 DSN）
const sentryDsn = import.meta.env?.VITE_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 0.1,
  });
}

// Web Vitals 上报（仅生产或需要时启用）
const shouldReportVitals = import.meta.env?.VITE_REPORT_WEB_VITALS === 'true';
if (shouldReportVitals && import.meta.env?.PROD) {
  const report = (metric: { name: string; value: number; id: string }) => {
    if ((window as { gtag?: Function }).gtag) {
      (window as { gtag: Function }).gtag('event', metric.name, {
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
    if (Sentry.getCurrentHub().getClient()) {
      Sentry.captureMessage(`WebVital:${metric.name}`, {
        level: 'info',
        extra: metric,
      });
    }
  };
  onCLS(report);
  onFID(report);
  onLCP(report);
}

// 注册 PWA Service Worker（由 vite-plugin-pwa 生成，避免在开发环境静态导入虚拟模块）
if (import.meta.env?.PROD) {
  const pwaModuleId = 'virtual:pwa-register';
  import(/* @vite-ignore */ pwaModuleId).then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}

// 渲染应用
root.render(
  <React.StrictMode>
    {/* 路由配置 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
