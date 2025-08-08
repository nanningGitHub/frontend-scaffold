import { useState, useEffect, useCallback, useRef } from 'react'



/**
 * 防抖 Hook
 * 
 * 功能：
 * 1. 延迟执行函数，避免频繁调用
 * 2. 自动清理定时器
 * 3. 支持立即执行选项
 * 4. 类型安全的实现
 * 
 * 使用方式：
 * const debouncedValue = useDebounce(value, 500)
 * const debouncedCallback = useDebounceCallback(callback, 300)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 防抖回调 Hook
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: {
    leading?: boolean
    trailing?: boolean
    maxWait?: number
  } = {}
): T {
  const { leading = false, trailing = true, maxWait } = options
  const timeoutRef = useRef<number>()
  const lastCallTimeRef = useRef<number>()
  const lastCallArgsRef = useRef<Parameters<T>>()

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastCall = lastCallTimeRef.current ? now - lastCallTimeRef.current : 0

      // 保存最新的参数
      lastCallArgsRef.current = args

      // 如果是第一次调用且设置了 leading，立即执行
      if (leading && !lastCallTimeRef.current) {
        lastCallTimeRef.current = now
        callback(...args)
        return
      }

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 如果设置了 maxWait 且超过了最大等待时间，立即执行
      if (maxWait && timeSinceLastCall >= maxWait) {
        lastCallTimeRef.current = now
        callback(...args)
        return
      }

      // 设置新的定时器
      timeoutRef.current = setTimeout(() => {
        if (trailing && lastCallArgsRef.current) {
          lastCallTimeRef.current = now
          callback(...lastCallArgsRef.current)
        }
      }, delay)
    },
    [callback, delay, leading, trailing, maxWait]
  ) as T

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}

/**
 * 节流 Hook
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: {
    leading?: boolean
    trailing?: boolean
  } = {}
): T {
  const { leading = true, trailing = true } = options
  const timeoutRef = useRef<number>()
  const lastCallTimeRef = useRef<number>()
  const lastCallArgsRef = useRef<Parameters<T>>()

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeSinceLastCall = lastCallTimeRef.current ? now - lastCallTimeRef.current : 0

      // 保存最新的参数
      lastCallArgsRef.current = args

      // 如果距离上次调用时间小于延迟时间
      if (timeSinceLastCall < delay) {
        // 如果设置了 trailing，在延迟后执行
        if (trailing) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => {
            lastCallTimeRef.current = Date.now()
            callback(...lastCallArgsRef.current!)
          }, delay - timeSinceLastCall)
        }
        return
      }

      // 立即执行
      if (leading) {
        lastCallTimeRef.current = now
        callback(...args)
      }
    },
    [callback, delay, leading, trailing]
  ) as T

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return throttledCallback
}

/**
 * 防抖状态 Hook
 */
export function useDebounceState<T>(
  initialValue: T,
  delay: number
): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return [value, debouncedValue, setValue]
}
