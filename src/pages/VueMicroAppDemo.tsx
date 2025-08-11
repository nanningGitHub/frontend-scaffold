import React from 'react';
import VueMicroAppContainer from '../components/VueMicroAppContainer';

/**
 * Vue微应用演示页面
 * 展示React主应用与Vue微应用的集成和通信
 */
const VueMicroAppDemo: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Vue微应用集成演示
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          展示React主应用与Vue微前端应用的集成和跨应用通信
        </p>
      </div>

      {/* Vue微应用容器 */}
      <VueMicroAppContainer />

      {/* 功能说明 */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            集成方式
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• 使用iframe方式集成Vue微应用</li>
            <li>• 支持跨域消息通信</li>
            <li>• 保持微应用的独立性</li>
            <li>• 可以共享主题和语言设置</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            通信功能
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>• 主题切换指令发送</li>
            <li>• 语言切换指令发送</li>
            <li>• 跨应用事件监听</li>
            <li>• 双向消息传递</li>
          </ul>
        </div>
      </div>

      {/* 技术架构说明 */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          技术架构
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              主应用 (React)
            </h4>
            <p>运行在端口3000，提供整体框架和导航</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              微应用 (Vue)
            </h4>
            <p>运行在端口3004，独立开发和部署</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              通信层
            </h4>
            <p>使用postMessage API实现跨应用通信</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VueMicroAppDemo;
