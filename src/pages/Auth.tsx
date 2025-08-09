import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

/**
 * 认证页面
 *
 * 功能：
 * 1. 登录表单
 * 2. 注册表单
 * 3. 表单切换
 * 4. 认证状态管理
 */
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuthStore();

  // 如果已经登录，显示用户资料
  if (isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">用户认证</h1>
          <p className="text-xl text-gray-600">
            您已经登录，可以查看和管理您的账户信息
          </p>
        </div>

        {/* 这里可以导入 UserProfile 组件 */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">用户资料</h2>
          <p className="text-gray-600">您已成功登录，可以访问受保护的功能。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">用户认证</h1>
        <p className="text-xl text-gray-600">登录或注册以访问完整功能</p>
      </div>

      {/* 表单切换按钮 */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isLogin
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isLogin
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            注册
          </button>
        </div>
      </div>

      {/* 表单内容 */}
      <div className="flex justify-center">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>

      {/* 功能说明 */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">安全认证</h3>
          <p className="text-gray-600">使用安全的认证机制，保护您的账户安全</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">状态管理</h3>
          <p className="text-gray-600">自动管理登录状态，提供无缝的用户体验</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">快速访问</h3>
          <p className="text-gray-600">登录后可以快速访问所有受保护的功能</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
