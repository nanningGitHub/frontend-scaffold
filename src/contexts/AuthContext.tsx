import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { userService, User } from '../services/userService'
import { useLocalStorage } from '../hooks/useLocalStorage'

/**
 * 认证状态类型
 */
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

/**
 * 认证动作类型
 */
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }

/**
 * 认证上下文类型
 */
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (userData: { name: string; email: string; password: string }) => Promise<void>
  logout: () => void
  clearError: () => void
}

/**
 * 认证状态初始值
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

/**
 * 认证状态 reducer
 */
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

/**
 * 创建认证上下文
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * 认证提供者组件
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const [storedToken, setStoredToken] = useLocalStorage('token', null)
  const [storedUser, setStoredUser] = useLocalStorage('user', null)

  /**
   * 初始化认证状态
   */
  useEffect(() => {
    const initializeAuth = async () => {
      if (storedToken && storedUser) {
        try {
          // 验证 token 是否有效
          const currentUser = await userService.getCurrentUser()
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: currentUser, token: storedToken },
          })
        } catch (error) {
          // token 无效，清除存储的数据
          setStoredToken(null)
          setStoredUser(null)
        }
      }
    }

    initializeAuth()
  }, [storedToken, storedUser, setStoredToken, setStoredUser])

  /**
   * 用户登录
   */
  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const { user, token } = await userService.login(email, password)
      
      // 保存到本地存储
      setStoredToken(token)
      setStoredUser(user)
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      })
      throw error
    }
  }

  /**
   * 用户注册
   */
  const register = async (userData: { name: string; email: string; password: string }) => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const { user, token } = await userService.register(userData)
      
      // 保存到本地存储
      setStoredToken(token)
      setStoredUser(user)
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '注册失败'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      })
      throw error
    }
  }

  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      // 调用登出 API
      await userService.logout()
    } catch (error) {
      console.error('登出 API 调用失败:', error)
    } finally {
      // 清除本地存储
      setStoredToken(null)
      setStoredUser(null)
      
      dispatch({ type: 'LOGOUT' })
    }
  }

  /**
   * 清除错误信息
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * 使用认证上下文的 Hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
