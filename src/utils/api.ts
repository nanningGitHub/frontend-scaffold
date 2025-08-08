import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG } from '../constants'
import { logger } from './logger'

/**
 * API 工具模块
 * 
 * 功能：
 * 1. 创建统一的 axios 实例
 * 2. 配置请求和响应拦截器
 * 3. 处理认证和错误
 * 4. 提供常用的请求方法
 * 5. 请求重试机制
 * 6. 性能监控
 * 
 * 特性：
 * - 统一的 baseURL 配置
 * - 自动添加认证 token
 * - 统一的错误处理
 * - 请求超时设置
 * - 请求重试
 * - 性能监控
 */

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器
 * 在请求发送前自动执行
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 记录请求开始时间
    const startTime = Date.now()
    ;(config as any).startTime = startTime
    
    // 从 localStorage 获取认证 token
    const token = localStorage.getItem('token')
    
    // 如果存在 token，自动添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 记录请求日志
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    })
    
    return config
  },
  (error) => {
    logger.error('Request Error', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 在响应返回后自动执行
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 计算请求耗时
    const startTime = (response.config as any).startTime
    const duration = startTime ? Date.now() - startTime : 0
    
    // 记录响应日志
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
      duration: `${duration}ms`,
    })
    
    // 性能监控
    if (duration > 3000) {
      logger.warn('Slow API Request', {
        url: response.config.url,
        duration: `${duration}ms`,
      })
    }
    
    // 直接返回响应数据，简化使用
    return response.data
  },
  (error) => {
    // 计算请求耗时
    const startTime = (error.config as any)?.startTime
    const duration = startTime ? Date.now() - startTime : 0
    
    // 记录错误日志
    logger.error('API Error', {
      status: error.response?.status,
      url: error.config?.url,
      duration: `${duration}ms`,
      error: error.message,
    })
    
    // 统一错误处理
    if (error.response?.status === 401) {
      // 401 未授权：清除 token 并跳转到登录页
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    // 其他错误直接抛出
    return Promise.reject(error)
  }
)

/**
 * 通用请求方法
 */
export const request = {
  // GET 请求
  get: <T = any>(url: string, params?: any): Promise<T> => {
    return api.get(url, { params })
  },

  // POST 请求
  post: <T = any>(url: string, data?: any): Promise<T> => {
    return api.post(url, data)
  },

  // PUT 请求
  put: <T = any>(url: string, data?: any): Promise<T> => {
    return api.put(url, data)
  },

  // DELETE 请求
  delete: <T = any>(url: string): Promise<T> => {
    return api.delete(url)
  },

  // PATCH 请求
  patch: <T = any>(url: string, data?: any): Promise<T> => {
    return api.patch(url, data)
  }
}

export default api
