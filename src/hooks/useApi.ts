import { useState, useEffect, useCallback } from 'react'

/**
 * API 请求状态
 */
export interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * useApi Hook
 * 
 * 功能：
 * 1. 管理 API 请求状态
 * 2. 提供加载、错误、数据状态
 * 3. 自动处理请求生命周期
 * 
 * 使用方式：
 * const { data, loading, error, execute } = useApi(apiFunction)
 */
export function useApi<T>(
  apiFunction: (..._args: any[]) => Promise<T>,
  immediate = false
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  /**
   * 执行 API 请求
   */
  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const data = await apiFunction(...args)
        setState({ data, loading: false, error: null })
        return data
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '请求失败'
        setState({ data: null, loading: false, error: errorMessage })
        throw error
      }
    },
    [apiFunction]
  )

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  /**
   * 立即执行（如果 immediate 为 true）
   */
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return {
    ...state,
    execute,
    reset,
  }
}

/**
 * useApiWithParams Hook
 * 
 * 功能：
 * 1. 带参数的 API 请求
 * 2. 自动重新请求当参数变化时
 * 3. 支持依赖项控制
 * 
 * 使用方式：
 * const { data, loading, error } = useApiWithParams(apiFunction, [param1, param2])
 */
export function useApiWithParams<T, P extends any[]>(
  apiFunction: (..._args: P) => Promise<T>,
  params: P,
  dependencies: any[] = []
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      try {
        const data = await apiFunction(...params)
        if (isMounted) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage = error instanceof Error ? error.message : '请求失败'
          setState({ data: null, loading: false, error: errorMessage })
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [apiFunction, params, dependencies])

  return state
}
