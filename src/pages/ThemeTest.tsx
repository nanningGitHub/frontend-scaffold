import { useEffect, useState } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { logger } from '../utils/logger';

/**
 * 主题测试页面
 * 用于验证主题切换功能是否正常工作
 */
const ThemeTest = () => {
  const { theme, toggleTheme, getCurrentTheme, setTheme, detectSystemTheme } =
    useThemeStore();
  const currentTheme = getCurrentTheme();
  const [debugInfo, setDebugInfo] = useState<string>('');

  // 检测系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      detectSystemTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [detectSystemTheme]);

  // 更新调试信息
  useEffect(() => {
    const updateDebugInfo = () => {
      const htmlElement = document.documentElement;
      const hasDarkClass = htmlElement.classList.contains('dark');
      const computedStyle = window.getComputedStyle(htmlElement);
      const backgroundColor = computedStyle.backgroundColor;

      setDebugInfo(`
        HTML class: ${htmlElement.className}
        hasDarkClass: ${hasDarkClass}
        backgroundColor: ${backgroundColor}
        localStorage theme: ${localStorage.getItem('theme-storage')}
      `);
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [theme, currentTheme]);

  const handleToggleTheme = () => {
    logger.debug('切换主题前:', { theme, currentTheme });
    toggleTheme();
    logger.debug('切换主题后:', { theme: useThemeStore.getState().theme });
  };

  const handleSetTheme = (newTheme: 'light' | 'dark' | 'system') => {
    logger.debug('设置主题前:', { theme, currentTheme });
    setTheme(newTheme);
    logger.debug('设置主题后:', { theme: useThemeStore.getState().theme });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          主题切换测试
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          当前主题: {theme} (实际应用: {currentTheme})
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          HTML class:{' '}
          {document.documentElement.classList.contains('dark')
            ? 'dark'
            : 'light'}
        </p>
      </div>

      {/* 调试信息 */}
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          调试信息
        </h3>
        <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {debugInfo}
        </pre>

        {/* 主题存储状态 */}
        <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-700 rounded">
          <h4 className="font-semibold mb-2">主题存储状态:</h4>
          <p>theme: {theme}</p>
          <p>currentTheme: {currentTheme}</p>
          <p>systemTheme: {useThemeStore.getState().systemTheme}</p>
          <p>localStorage: {localStorage.getItem('theme-storage')}</p>
        </div>
      </div>

      {/* 主题控制按钮 */}
      <div className="text-center mb-8 space-x-4">
        <button
          onClick={handleToggleTheme}
          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-lg font-medium"
        >
          切换主题
        </button>

        <button
          onClick={() => handleSetTheme('light')}
          className="px-6 py-3 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-lg font-medium"
        >
          设置为浅色
        </button>

        <button
          onClick={() => handleSetTheme('dark')}
          className="px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-800 transition-colors text-lg font-medium"
        >
          设置为深色
        </button>

        <button
          onClick={() => handleSetTheme('system')}
          className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-lg font-medium"
        >
          跟随系统
        </button>
      </div>

      {/* 主题预览区域 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 浅色主题预览 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            浅色主题样式
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <p className="text-gray-900 dark:text-white">
                背景色: bg-gray-50
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-gray-900 dark:text-white">背景色: bg-white</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
              <p className="text-blue-900 dark:text-blue-100">
                背景色: bg-blue-50
              </p>
            </div>
          </div>
        </div>

        {/* 深色主题预览 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            深色主题样式
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-800 dark:bg-gray-800 rounded border border-gray-700 dark:border-gray-700">
              <p className="text-white dark:text-white">背景色: bg-gray-800</p>
            </div>
            <div className="p-3 bg-gray-700 dark:bg-gray-700 rounded border border-gray-600 dark:border-gray-600">
              <p className="text-white dark:text-white">背景色: bg-gray-700</p>
            </div>
            <div className="p-3 bg-blue-900/20 dark:bg-blue-900/20 rounded border border-blue-700 dark:border-blue-700">
              <p className="text-blue-100 dark:text-blue-100">
                背景色: bg-blue-900/20
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 文本颜色测试 */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            文本颜色测试
          </h3>
          <div className="space-y-2">
            <p className="text-gray-900 dark:text-white">
              主要文本: text-gray-900 dark:text-white
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              次要文本: text-gray-600 dark:text-gray-300
            </p>
            <p className="text-blue-600 dark:text-blue-400">
              链接文本: text-blue-600 dark:text-blue-400
            </p>
            <p className="text-red-600 dark:text-red-400">
              错误文本: text-red-600 dark:text-red-400
            </p>
          </div>
        </div>
      </div>

      {/* 按钮样式测试 */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            按钮样式测试
          </h3>
          <div className="flex flex-wrap gap-4">
            <button className="btn btn-primary">主要按钮</button>
            <button className="btn btn-secondary">次要按钮</button>
            <button className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors">
              危险按钮
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;
