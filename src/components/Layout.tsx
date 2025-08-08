import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navigation from './Navigation'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import NotificationSystem from './NotificationSystem'
import { logger } from '../utils/logger'

/**
 * 布局组件
 * 
 * 功能：
 * 1. 提供应用整体布局
 * 2. 包含导航栏
 * 3. 渲染子路由内容
 * 4. 初始化认证状态
 * 5. 显示通知系统
 */
const Layout = () => {
  const { initializeAuth } = useAuthStore()
  const { addNotification } = useUIStore()

  /**
   * 初始化应用状态
   */
  useEffect(() => {
    const initApp = async () => {
      try {
        // 初始化认证状态
        await initializeAuth()
        
        // 显示欢迎通知
        addNotification({
          type: 'success',
          message: '欢迎使用前端脚手架！',
          duration: 3000,
        })
      } catch (error) {
        logger.error('App initialization failed', error)
        addNotification({
          type: 'error',
          message: '应用初始化失败，请刷新页面重试',
          duration: 5000,
        })
      }
    }

    initApp()
  }, [initializeAuth, addNotification])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <Navigation />
      
      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      {/* 通知系统 */}
      <NotificationSystem />
    </div>
  )
}

export default Layout
