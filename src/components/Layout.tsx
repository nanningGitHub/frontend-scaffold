import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './Navigation';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import NotificationSystem from './NotificationSystem';
import { logger } from '../utils/logger';

/**
 * 布局组件
 *
 * 功能：
 * 1. 提供应用整体布局
 * 2. 包含导航栏
 * 3. 渲染子路由内容
 * 4. 初始化认证状态
 * 5. 显示通知系统
 */
const Layout = () => {
  const { initializeAuth } = useAuthStore();
  const { addNotification } = useUIStore();

  /**
   * 初始化应用状态
   */
  useEffect(() => {
    const initApp = async () => {
      try {
        // 在开发启用 MSW 时，等待 worker 准备好再初始化认证，避免首个请求未被拦截
        const anyWindow: any = window as any;
        if (
          anyWindow.__mswReady &&
          typeof anyWindow.__mswReady.then === 'function'
        ) {
          await anyWindow.__mswReady;
        }
        // 初始化认证状态
        await initializeAuth();

        // 显示欢迎通知（测试环境不显示，避免 act 警告）
        // 测试环境下不显示欢迎通知
        if (!('JEST_WORKER_ID' in globalThis)) {
          addNotification({
            type: 'success',
            message: '欢迎使用前端脚手架！',
            duration: 3000,
          });
        }
      } catch (error) {
        logger.error('App initialization failed', error);
        addNotification({
          type: 'error',
          message: '应用初始化失败，请刷新页面重试',
          duration: 5000,
        });
      }
    };

    initApp();
  }, [initializeAuth, addNotification]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <Navigation />

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer role="contentinfo" className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} 前端脚手架</span>
          <a href="/about" className="hover:text-gray-700">
            关于
          </a>
        </div>
      </footer>

      {/* 通知系统 */}
      <NotificationSystem />
    </div>
  );
};

export default Layout;
