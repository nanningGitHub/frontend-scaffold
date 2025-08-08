import { create } from 'zustand'

/**
 * UI 状态接口
 */
interface UIState {
  // 侧边栏状态
  sidebarOpen: boolean
  
  // 主题设置
  theme: 'light' | 'dark'
  
  // 通知系统
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>
  
  // 加载状态
  globalLoading: boolean
  
  // 模态框状态
  modals: {
    [key: string]: boolean
  }
}

/**
 * UI 动作接口
 */
interface UIActions {
  // 侧边栏控制
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  // 主题控制
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  
  // 通知系统
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // 全局加载状态
  setGlobalLoading: (loading: boolean) => void
  
  // 模态框控制
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  closeAllModals: () => void
}

/**
 * UI Store 类型
 */
type UIStore = UIState & UIActions

/**
 * 创建 UI Store
 */
export const useUIStore = create<UIStore>((set, get) => ({
  // 初始状态
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  globalLoading: false,
  modals: {},

  // 侧边栏控制
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // 主题控制
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  setTheme: (theme) => set({ theme }),

  // 通知系统
  addNotification: (notification) => {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }))

    // 自动移除通知（如果设置了持续时间）
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(id)
      }, notification.duration)
    }
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] }),

  // 全局加载状态
  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  // 模态框控制
  openModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: true }
  })),
  
  closeModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: false }
  })),
  
  closeAllModals: () => set({ modals: {} }),
}))
