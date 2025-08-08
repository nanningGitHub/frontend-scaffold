import { useAuthStore } from '../stores/authStore'

/**
 * 用户个人资料组件
 * 
 * 功能：
 * 1. 显示用户信息
 * 2. 提供编辑功能
 * 3. 显示账户状态
 */
const UserProfile = () => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">请先登录以查看个人资料</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* 页面标题 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">个人资料</h1>
          <p className="text-blue-100 mt-1">管理您的账户信息</p>
        </div>

        <div className="p-6">
          {/* 用户基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱地址
                  </label>
                  <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户ID
                  </label>
                  <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                    <span className="text-gray-900 font-mono text-sm">{user.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 账户状态 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">账户状态</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    认证状态
                  </label>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-700 font-medium">已认证</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    注册时间
                  </label>
                  <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                    <span className="text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最后更新
                  </label>
                  <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                    <span className="text-gray-900">
                      {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('zh-CN') : '未知'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                编辑资料
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                修改密码
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                删除账户
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
