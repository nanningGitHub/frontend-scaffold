import React, { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

/**
 * 主题测试页面
 * 用于验证主题切换功能是否正常工作
 */
const ThemeTest = () => {
  const { theme, toggleTheme, getCurrentTheme, setTheme, detectSystemTheme } =
    useThemeStore();
  const currentTheme = getCurrentTheme();

  // 检测系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-sme: dark)');
    const handleChange = () => {
      detectSystemTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [detectSystemTheme]);

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

      {/* 主题控制按钮 */}
      <div className="text-center mb-8 space-x-4">
        <button
          onClick={toggleTheme}
          className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-lg font-medium"
        >
          切换主题
        </button>

        <button
          onClick={() => setTheme('light')}
          className="px-6 py-3 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-lg font-medium"
        >
          设置为浅色
        </button>

        <button
          onClick={() => setTheme('dark')}
          className="px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-800 transition-colors text-lg font-medium"
        >
          设置为深色
        </button>

        <button
          onClick={() => setTheme('system')}
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
