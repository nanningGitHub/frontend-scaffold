import React, { lazy, Suspense, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuthStore, useThemeStore, useI18nStore } from './stores';
import {
  EnterpriseErrorBoundary,
  defaultErrorTypes,
} from './components/EnterpriseErrorBoundary';
import { monitoring } from './utils/monitoring';
import { logger } from './utils/enterpriseLogger';
// import { securityManager } from './utils/securityManager';

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Auth = lazy(() => import('./pages/Auth'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ApiExample = lazy(() => import('./components/ApiExample'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const StateManagementDemo = lazy(() => import('./pages/StateManagementDemo'));
const I18nDemo = lazy(() => import('./pages/I18nDemo'));
const MicroFrontendDemo = lazy(() => import('./pages/MicroFrontendDemo'));
const ThemeTest = lazy(() => import('./pages/ThemeTest'));

// 加载组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// 企业级错误边界配置
const errorBoundaryConfig = {
  errorTypes: {
    ...defaultErrorTypes,
    network: {
      retry: true,
      maxRetries: 5,
      retryDelay: 2000,
      logLevel: 'warn' as const,
    },
  },
  onError: (error: Error, errorInfo: React.ErrorInfo) => {
    // 记录到监控系统
    monitoring.recordError(error, {
      componentStack: errorInfo.componentStack,
      location: window.location.href,
    });

    // 记录到日志系统
    logger.error('React error boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  },
};

function App() {
  const { theme, getCurrentTheme } = useThemeStore();
  const { locale } = useI18nStore();

  // 初始化企业级系统
  useEffect(() => {
    // 初始化监控系统
    monitoring.addObserver((type, data) => {
      logger.info(`Monitoring event: ${type}`, data);
    });

    // 记录应用启动
    logger.info('Application started', {
      theme,
      locale,
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // 记录性能指标
    monitoring.recordMetric('app_startup_time', performance.now(), {
      theme,
      locale,
    });

    // 设置日志上下文
    logger.addContext({
      app: 'main',
      version: '1.0.0',
      environment: process.env.NODE_ENV,
    });

    // 定期清理
    const cleanupInterval = setInterval(() => {
      monitoring.cleanup();
      logger.cleanup();
    }, 5 * 60 * 1000); // 每5分钟清理一次

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [theme, locale]);

  // 应用语言
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // 获取当前实际应用的主题
  const currentTheme = getCurrentTheme();

  return (
    <EnterpriseErrorBoundary {...errorBoundaryConfig}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          currentTheme === 'dark'
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-900'
        }`}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/state-management"
              element={<StateManagementDemo />}
            />
            <Route path="/i18n" element={<I18nDemo />} />
            <Route path="/micro-frontend" element={<MicroFrontendDemo />} />
            <Route path="/api-example" element={<ApiExample />} />
            <Route path="/theme-test" element={<ThemeTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </EnterpriseErrorBoundary>
  );
}

export default App;
