import { useState } from 'react'

/**
 * API 请求示例组件
 * 
 * 展示如何使用 API 服务进行数据请求
 */
const ApiExample = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 获取用户列表示例
   */
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 模拟 API 调用
      const mockUsers = [
        { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'user' },
        { id: 2, name: '李四', email: 'lisi@example.com', role: 'admin' },
        { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' }
      ]
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(mockUsers)
    } catch (err) {
      setError('获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 创建用户示例
   */
  const createUser = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const newUser = {
        name: '新用户',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user' as const
      }
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟成功响应
      const createdUser = { id: Date.now(), ...newUser }
      setUsers(prev => [...prev, createdUser])
      
      alert('用户创建成功！')
    } catch (err) {
      setError('创建用户失败')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 删除用户示例
   */
  const deleteUser = async (userId: number) => {
    if (!window.confirm('确定要删除这个用户吗？')) return
    
    setLoading(true)
    setError(null)
    
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 模拟成功响应
      setUsers(prev => prev.filter(user => user.id !== userId))
      
      alert('用户删除成功！')
    } catch (err) {
      setError('删除用户失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          API 请求示例
        </h1>
        <p className="text-xl text-gray-600">
          展示如何使用 API 服务进行数据请求和管理
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="btn btn-primary disabled:opacity-50"
        >
          {loading ? '请求中...' : '获取用户列表'}
        </button>
        
        <button
          onClick={createUser}
          disabled={loading}
          className="btn btn-secondary disabled:opacity-50"
        >
          {loading ? '创建中...' : '创建新用户'}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">错误: {error}</p>
        </div>
      )}

      {/* 用户列表 */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">用户列表</h2>
        
        {users.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            暂无用户数据，点击"获取用户列表"按钮加载数据
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">姓名</th>
                  <th className="text-left py-3 px-4">邮箱</th>
                  <th className="text-left py-3 px-4">角色</th>
                  <th className="text-left py-3 px-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{user.id}</td>
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteUser(user.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                      >
                        {loading ? '删除中...' : '删除'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* API 使用说明 */}
      <div className="card mt-6">
        <h2 className="text-xl font-bold mb-4">API 使用说明</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">1. 服务层定义</h3>
            <p className="text-gray-600 mb-2">
              在 <code className="bg-gray-100 px-1 rounded">src/services/</code> 目录下定义 API 服务
            </p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// userService.ts
export const userService = {
  getUsers: (page, limit, search) => 
    request.get('/users', { page, limit, search }),
  
  createUser: (userData) => 
    request.post('/users', userData),
  
  deleteUser: (id) => 
    request.delete(\`/users/\${id}\`)
}`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">2. 自定义 Hook</h3>
            <p className="text-gray-600 mb-2">
              使用自定义 Hook 管理 API 请求状态
            </p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 使用 Hook
const { data, loading, error, execute } = useApi(userService.getUsers)

// 自动请求
const { data, loading, error } = useApiWithParams(
  userService.getUsers, 
  [page, limit, search]
)`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">3. 错误处理</h3>
            <p className="text-gray-600 mb-2">
              统一的错误处理和用户反馈
            </p>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 错误处理
if (error) {
  return <div className="error">错误: {error}</div>
}

// 加载状态
if (loading) {
  return <div className="loading">加载中...</div>
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiExample
