import { Link } from 'react-router-dom';

/**
 * 404 页面组件
 *
 * 功能：
 * 1. 处理未找到的页面路由
 * 2. 提供返回首页的链接
 * 3. 友好的错误提示
 *
 * 特性：
 * - 居中布局
 * - 清晰的错误信息
 * - 返回首页的导航
 */
const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        {/* 404 错误码 */}
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>

        {/* 错误标题 */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          页面未找到
        </h2>

        {/* 错误描述 */}
        <p className="text-gray-600 mb-8">抱歉，您访问的页面不存在。</p>

        {/* 返回首页按钮 */}
        <Link to="/" className="btn btn-primary">
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
