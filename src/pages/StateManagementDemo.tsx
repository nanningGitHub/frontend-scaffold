import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'

const StateManagementDemo = () => {
  const { user, isAuthenticated } = useAuthStore()
  const { theme, toggleTheme, addNotification } = useUIStore()

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: '操作成功！',
      error: '操作失败，请重试',
      warning: '请注意这个警告信息',
      info: '这是一条信息提示',
    }

    addNotification({
      type,
      message: messages[type],
      duration: 4000,
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Zustand 状态管理演示
        </h1>
        <p className="text-lg text-gray-600">
          展示前沿状态管理工具的功能和特性
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">认证状态管理</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">当前状态</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">认证状态:</span>
                  <span className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                    {isAuthenticated ? '已认证' : '未认证'}
                  </span>
                </div>
                {user && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">用户名:</span>
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">邮箱:</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">UI 状态管理</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">主题设置</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">当前主题: {theme}</span>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  切换主题
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">通知系统</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => showNotification('success')}
                  className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm"
                >
                  成功通知
                </button>
                <button
                  onClick={() => showNotification('error')}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm"
                >
                  错误通知
                </button>
                <button
                  onClick={() => showNotification('warning')}
                  className="px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors text-sm"
                >
                  警告通知
                </button>
                <button
                  onClick={() => showNotification('info')}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                >
                  信息通知
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Zustand 特性说明</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">轻量级</h3>
            <p className="text-sm text-blue-700">体积小巧，bundle size 仅 1KB，性能优异</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">类型安全</h3>
            <p className="text-sm text-green-700">完整的 TypeScript 支持，提供优秀的开发体验</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">简单易用</h3>
            <p className="text-sm text-purple-700">API 简洁，学习成本低，上手快速</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">持久化</h3>
            <p className="text-sm text-yellow-700">内置持久化中间件，轻松实现状态持久化</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-medium text-red-900 mb-2">模块化</h3>
            <p className="text-sm text-red-700">支持多个 store，便于状态分离和管理</p>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="font-medium text-indigo-900 mb-2">开发工具</h3>
            <p className="text-sm text-indigo-700">支持 Redux DevTools，便于调试和开发</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StateManagementDemo
