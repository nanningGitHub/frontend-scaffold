import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 首页组件
 *
 * 功能：
 * 1. 展示项目介绍和特性
 * 2. 提供交互式计数器示例
 * 3. 展示技术栈信息
 *
 * 特性：
 * - 响应式网格布局
 * - 状态管理示例
 * - 自定义样式组件
 * - 国际化支持
 */
const Home = () => {
  const { t } = useTranslation();
  // 计数器状态 - 用于演示 React 状态管理
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 页面标题区域 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {t('home.subtitle')}
        </p>
      </div>

      {/* 技术特性展示区域 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* React 18 特性卡片 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            React 18
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            使用最新的 React 18 特性，包括并发渲染和自动批处理
          </p>
        </div>

        {/* TypeScript 特性卡片 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            TypeScript
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            完整的 TypeScript 支持，提供类型安全和更好的开发体验
          </p>
        </div>

        {/* Vite 特性卡片 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Vite
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            极速的开发服务器和构建工具，提供快速的开发体验
          </p>
        </div>

        {/* Tailwind CSS 特性卡片 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Tailwind CSS
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            实用优先的 CSS 框架，快速构建现代化的用户界面
          </p>
        </div>

        {/* React Router 特性卡片 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            React Router
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            声明式路由，轻松管理应用导航和页面状态
          </p>
        </div>

        {/* 测试支持特性卡片 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            测试支持
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            集成 Jest 和 Testing Library，确保代码质量和可靠性
          </p>
        </div>
      </div>

      {/* 交互式计数器示例 */}
      <div className="text-center">
        <div className="card inline-block">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            计数器示例
          </h3>
          <div className="flex items-center justify-center space-x-4">
            {/* 减少按钮 */}
            <button
              onClick={() => setCount(count - 1)}
              className="btn btn-secondary"
            >
              -
            </button>

            {/* 计数器显示 */}
            <span className="text-2xl font-bold text-gray-900 dark:text-white min-w-[3rem]">
              {count}
            </span>

            {/* 增加按钮 */}
            <button
              onClick={() => setCount(count + 1)}
              className="btn btn-primary"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
