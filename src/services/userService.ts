import { request } from '../utils/api'

/**
 * 用户数据类型定义
 */
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

/**
 * 用户列表响应类型
 */
export interface UserListResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

/**
 * 创建用户请求类型
 */
export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

/**
 * 更新用户请求类型
 */
export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: 'admin' | 'user'
}

/**
 * 用户服务模块
 * 
 * 功能：
 * 1. 用户 CRUD 操作
 * 2. 用户认证相关
 * 3. 用户权限管理
 */
export const userService = {
  /**
   * 获取用户列表
   * @param page 页码
   * @param limit 每页数量
   * @param search 搜索关键词
   */
  getUsers: (page = 1, limit = 10, search?: string): Promise<UserListResponse> => {
    return request.get('/users', { page, limit, search })
  },

  /**
   * 获取单个用户信息
   * @param id 用户ID
   */
  getUser: (id: number): Promise<User> => {
    return request.get(`/users/${id}`)
  },

  /**
   * 创建新用户
   * @param userData 用户数据
   */
  createUser: (userData: CreateUserRequest): Promise<User> => {
    return request.post('/users', userData)
  },

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param userData 更新数据
   */
  updateUser: (id: number, userData: UpdateUserRequest): Promise<User> => {
    return request.put(`/users/${id}`, userData)
  },

  /**
   * 删除用户
   * @param id 用户ID
   */
  deleteUser: (id: number): Promise<void> => {
    return request.delete(`/users/${id}`)
  },

  /**
   * 用户登录
   * @param email 邮箱
   * @param password 密码
   */
  login: (email: string, password: string): Promise<{ token: string; user: User }> => {
    return request.post('/auth/login', { email, password })
  },

  /**
   * 用户注册
   * @param userData 用户数据
   */
  register: (userData: CreateUserRequest): Promise<{ token: string; user: User }> => {
    return request.post('/auth/register', userData)
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: (): Promise<User> => {
    return request.get('/auth/me')
  },

  /**
   * 用户登出
   */
  logout: (): Promise<void> => {
    return request.post('/auth/logout')
  }
}
