import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { userService, User } from '../services/userService'
import { logger } from '../utils/logger'
import { ERROR_MESSAGES, AUTH_SECURITY } from '../constants'

/**
 * 认证状态接口
 */
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

/**
 * 认证动作接口
 */
interface AuthActions {
  // 状态更新
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // 认证操作
  login: (email: string, password: string) => Promise<void>
  register: (userData: { name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  
  // 初始化
  initializeAuth: () => Promise<void>
}

/**
 * 认证 Store 类型
 */
type AuthStore = AuthState & AuthActions

/**
 * 创建认证 Store
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // 状态更新方法
      setLoading: (_loading) => set({ loading: _loading }),
      setError: (_error) => set({ error: _error }),
      clearError: () => set({ error: null }),

      // 用户登录
      login: async (_email: string, _password: string) => {
        set({ loading: true, error: null })

        try {
          logger.info('User login attempt', { email: _email })
          const { user, token } = await userService.login(_email, _password)
          
          set({
            user,
            token: AUTH_SECURITY.USE_COOKIES ? null : token,
            isAuthenticated: true,
            loading: false,
            error: null,
          })
          
          logger.info('User login successful', { userId: user.id })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: errorMessage,
          })
          
          logger.error('User login failed', error)
          throw error
        }
      },

      // 用户注册
      register: async (_userData: { name: string; email: string; password: string }) => {
        set({ loading: true, error: null })

        try {
          logger.info('User registration attempt', { email: _userData.email })
          const { user, token } = await userService.register(_userData)
          
          set({
            user,
            token: AUTH_SECURITY.USE_COOKIES ? null : token,
            isAuthenticated: true,
            loading: false,
            error: null,
          })
          
          logger.info('User registration successful', { userId: user.id })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: errorMessage,
          })
          
          logger.error('User registration failed', error)
          throw error
        }
      },

      // 用户登出
      logout: async () => {
        try {
          logger.info('User logout attempt')
          await userService.logout()
          logger.info('User logout successful')
        } catch (error) {
          logger.error('Logout API call failed', error)
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          })
        }
      },

      // 初始化认证状态
      initializeAuth: async () => {
        set({ loading: true })
        try {
          if (AUTH_SECURITY.USE_COOKIES) {
            const currentUser = await userService.getCurrentUser()
            set({ user: currentUser, isAuthenticated: true })
            return
          }
          const { token } = get()
          if (token) {
            const currentUser = await userService.getCurrentUser()
            set({ user: currentUser, isAuthenticated: true })
          }
        } catch {
          set({ user: null, token: null, isAuthenticated: false })
        } finally {
          set({ loading: false })
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage 的键名
      partialize: (state) => ({
        user: state.user,
        token: AUTH_SECURITY.USE_COOKIES ? null : state.token,
      }), // Cookie 模式不持久化 token
    }
  )
)
