import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">
          前端脚手架
        </h1>
        
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            欢迎使用前端脚手架项目
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            这是一个现代化的前端开发框架，支持主题切换、国际化、状态管理等功能
          </p>
        </div>
        
        {/* 简单的主题测试 */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">主题状态</h2>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              HTML class: {document.documentElement.className}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              当前背景: {document.documentElement.classList.contains('dark') ? '深色' : '浅色'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
