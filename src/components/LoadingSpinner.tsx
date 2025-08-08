import React from 'react'

/**
 * 加载组件属性接口
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  text?: string
  fullScreen?: boolean
  overlay?: boolean
}

/**
 * 加载组件
 * 
 * 功能：
 * 1. 可配置大小的加载动画
 * 2. 支持不同颜色主题
 * 3. 可选的加载文本
 * 4. 全屏和遮罩模式
 * 
 * 使用方式：
 * <LoadingSpinner size="lg" text="加载中..." />
 * <LoadingSpinner fullScreen overlay />
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  overlay = false,
}) => {
  // 尺寸配置
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  // 颜色配置
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
  }

  // 加载动画组件
  const Spinner = () => (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}>
      <span className="sr-only">加载中...</span>
    </div>
  )

  // 基础加载组件
  const BaseSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Spinner />
      {text && (
        <p className={`text-sm ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  )

  // 全屏模式
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        <BaseSpinner />
      </div>
    )
  }

  // 遮罩模式
  if (overlay) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-white bg-opacity-75">
        <BaseSpinner />
      </div>
    )
  }

  // 默认模式
  return <BaseSpinner />
}

/**
 * 页面加载组件
 */
export const PageLoading: React.FC<{ text?: string }> = ({ text = '页面加载中...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  </div>
)

/**
 * 按钮加载组件
 */
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => (
  <LoadingSpinner size={size} color="white" />
)

/**
 * 卡片加载组件
 */
export const CardLoading: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="animate-pulse space-y-4">
      <div className="flex items-center space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
)

/**
 * 表格加载组件
 */
export const TableLoading: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="animate-pulse">
      {/* 表头 */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      </div>
      
      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 border-b border-gray-100">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default LoadingSpinner
