import { useAuthStore } from '../stores/authStore';
import { useForm } from '../hooks/useForm';
import { commonValidationRules } from '../utils/validation';
import { logger } from '../utils/logger';

/**
 * 登录表单组件
 *
 * 功能：
 * 1. 用户登录
 * 2. 表单验证
 * 3. 错误处理
 * 4. 加载状态
 */
const LoginForm = () => {
  const { login, error, clearError } = useAuthStore();

  // 使用 useForm Hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: commonValidationRules.email,
      password: commonValidationRules.password,
    },
    onSubmit: async (values) => {
      clearError();
      await login(values.email, values.password);
    },
    onError: (errors) => {
      logger.warn('Login form validation failed', errors);
    },
  });

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          用户登录
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 邮箱输入 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              邮箱地址
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入邮箱地址"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* 密码输入 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              密码
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入密码"
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* 错误信息显示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {isSubmitting ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 注册链接 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            还没有账号？{' '}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              立即注册
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
