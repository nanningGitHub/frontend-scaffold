import { useState } from 'react'
import { logger } from '../utils/logger'

/**
 * useLocalStorage Hook
 * 
 * 功能：
 * 1. 在 localStorage 和 React 状态之间同步数据
 * 2. 提供与 useState 相同的 API
 * 3. 自动处理 JSON 序列化和反序列化
 * 
 * 使用方式：
 * const [value, setValue] = useLocalStorage('key', initialValue)
 * 
 * @param key - localStorage 的键名
 * @param initialValue - 初始值
 * @returns [storedValue, setValue] - 与 useState 相同的返回值
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // 获取初始值：从 localStorage 读取或使用默认值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 尝试从 localStorage 读取数据
      const item = window.localStorage.getItem(key)
      
      // 如果存在数据，解析 JSON；否则使用初始值
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // 如果读取失败（如 JSON 解析错误），记录错误并使用初始值
      logger.error(`Error reading localStorage key "${key}"`, error)
      return initialValue
    }
  })

  /**
   * 设置值的函数
   * 支持直接设置值或通过函数更新值（类似 useState）
   */
  const setValue = (value: T | ((_val: T) => T)) => {
    try {
      // 如果传入的是函数，调用函数获取新值；否则直接使用传入的值
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // 更新 React 状态
      setStoredValue(valueToStore)
      
      // 同步到 localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // 如果设置失败，记录错误
      logger.error(`Error setting localStorage key "${key}"`, error)
    }
  }

  // 返回与 useState 相同的 API
  return [storedValue, setValue] as const
}
