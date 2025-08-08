import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import ApiExample from './components/ApiExample'
import UserProfile from './components/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'
import StateManagementDemo from './pages/StateManagementDemo'
import I18nDemo from './pages/I18nDemo'

/**
 * 主应用组件
 * 
 * 功能：
 * 1. 配置应用路由
 * 2. 定义页面结构
 * 3. 处理 404 页面
 * 4. 认证状态管理
 * 
 * 路由结构：
 * / - 首页
 * /about - 关于页面
 * /login - 登录页面
 * /register - 注册页面
 * /profile - 个人中心（受保护）
 * /api-example - API 请求示例
 * /* - 404 页面
 */
function App() {
  return (
    <Routes>
      {/* 使用嵌套路由，所有页面共享 Layout 组件 */}
      <Route path="/" element={<Layout />}>
        {/* 首页路由 */}
        <Route index element={<Home />} />
        
        {/* 关于页面路由 */}
        <Route path="about" element={<About />} />
        
        {/* 认证相关路由 */}
        <Route path="login" element={<Auth />} />
        <Route path="register" element={<Auth />} />
        
        {/* 受保护的路由 */}
        <Route path="profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        {/* API 示例页面路由 */}
        <Route path="api-example" element={<ApiExample />} />
        
        {/* 状态管理演示页面路由 */}
        <Route path="state-demo" element={<StateManagementDemo />} />
        
        {/* 国际化演示页面路由 */}
        <Route path="i18n-demo" element={<I18nDemo />} />
        
        {/* 404 页面路由 - 捕获所有未匹配的路径 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
