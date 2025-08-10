import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useThemeStore } from '../stores/themeStore';
import { logger } from '../utils/logger';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * 导航组件
 *
 * 功能：
 * 1. 响应式导航栏
 * 2. 用户认证状态显示
 * 3. 主题切换
 * 4. 移动端菜单
 */
const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { theme: currentTheme, toggleTheme: toggleAppTheme } = useThemeStore();
  const location = useLocation();

  /**
   * 处理登出
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      logger.error('Navigation logout failed', error);
    }
  };

  /**
   * 检查当前路由是否激活
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  /**
   * 处理主题切换
   */
  const handleThemeToggle = () => {
    toggleAppTheme();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧：Logo 和导航链接 */}
          <div className="flex items-center">
            {/* 移动端菜单按钮 */}
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              前端脚手架
            </Link>

            {/* 桌面端导航链接 */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                首页
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/about')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                关于
              </Link>
              <Link
                to="/state-management"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/state-management')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                状态管理
              </Link>
              <Link
                to="/i18n-demo"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/i18n-demo')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                国际化
              </Link>
              <Link
                to="/micro-frontend"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/micro-frontend')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                微前端
              </Link>
              <Link
                to="/theme-test"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/theme-test')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                主题测试
              </Link>
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  个人中心
                </Link>
              )}
            </div>
          </div>

          {/* 右侧：主题切换和用户菜单 */}
          <div className="flex items-center space-x-4">
            {/* 语言切换器 */}
            <LanguageSwitcher showLabel={false} />

            {/* 主题切换按钮 */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              title={`切换到${currentTheme === 'light' ? '深色' : '浅色'}主题`}
            >
              {currentTheme === 'light' ? (
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* 用户菜单 */}
            {isAuthenticated ? (
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    欢迎，{user?.name || '用户'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    登出
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 text-sm bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded-md transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 移动端侧边栏 */}
      {sidebarOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              首页
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/about')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              关于
            </Link>
            <Link
              to="/state-management"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/state-management')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              状态管理
            </Link>
            <Link
              to="/i18n-demo"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/i18n-demo')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              国际化
            </Link>
            <Link
              to="/micro-frontend"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/micro-frontend')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              微前端
            </Link>
            <Link
              to="/theme-test"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/theme-test')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              主题测试
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/profile')
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                个人中心
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
