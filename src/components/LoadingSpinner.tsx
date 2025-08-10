import React, { memo, useMemo } from 'react';

/**
 * 加载组件属性接口
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * 尺寸配置常量
 */
const SIZE_CLASSES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
} as const;

/**
 * 颜色配置常量
 */
const COLOR_CLASSES = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
  gray: 'text-gray-400',
} as const;

/**
 * 加载动画组件 - 使用 memo 优化渲染性能
 */
const Spinner = memo<{ size: keyof typeof SIZE_CLASSES; color: keyof typeof COLOR_CLASSES }>(
  ({ size, color }) => (
    <div
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${SIZE_CLASSES[size]} ${COLOR_CLASSES[color]}`}
      role="status"
      aria-label="加载中"
    >
      <span className="sr-only">加载中...</span>
    </div>
  )
);

Spinner.displayName = 'Spinner';

/**
 * 基础加载组件 - 使用 memo 优化渲染性能
 */
const BaseSpinner = memo<{ text?: string; color: keyof typeof COLOR_CLASSES }>(
  ({ text, color }) => (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Spinner size="md" color={color} />
      {text && (
        <p className={`text-sm ${COLOR_CLASSES[color]} animate-pulse`} role="status">
          {text}
        </p>
      )}
    </div>
  )
);

BaseSpinner.displayName = 'BaseSpinner';

/**
 * 加载组件
 *
 * 功能：
 * 1. 可配置大小的加载动画
 * 2. 支持不同颜色主题
 * 3. 可选的加载文本
 * 4. 全屏和遮罩模式
 * 5. 优化的渲染性能
 * 6. 增强的可访问性
 *
 * 使用方式：
 * <LoadingSpinner size="lg" text="加载中..." />
 * <LoadingSpinner fullScreen overlay />
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  overlay = false,
  className = '',
  'aria-label': ariaLabel,
}) => {
  // 使用 useMemo 缓存样式类，避免重复计算
  const containerClasses = useMemo(() => {
    if (fullScreen) {
      return 'fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90';
    }
    if (overlay) {
      return 'absolute inset-0 z-40 flex items-center justify-center bg-white bg-opacity-75';
    }
    return '';
  }, [fullScreen, overlay]);

  // 使用 useMemo 缓存 Spinner 组件，避免重复创建
  // const spinnerElement = useMemo(() => (
  //   <Spinner size={size} color={color} />
  // ), [size, color]);

  // 全屏模式
  if (fullScreen) {
    return (
      <div 
        className={`${containerClasses} ${className}`}
        role="dialog"
        aria-label={ariaLabel || '全屏加载'}
        aria-live="polite"
      >
        <BaseSpinner text={text} color={color} />
      </div>
    );
  }

  // 遮罩模式
  if (overlay) {
    return (
      <div 
        className={`${containerClasses} ${className}`}
        role="dialog"
        aria-label={ariaLabel || '遮罩加载'}
        aria-live="polite"
      >
        <BaseSpinner text={text} color={color} />
      </div>
    );
  }

  // 默认模式
  return (
    <div className={className}>
      <BaseSpinner text={text} color={color} />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

/**
 * 页面加载组件 - 使用 memo 优化渲染性能
 */
export const PageLoading: React.FC<{ text?: string; className?: string }> = memo(({
  text = '页面加载中...',
  className = '',
}) => (
  <div className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}>
    <div className="text-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  </div>
));

PageLoading.displayName = 'PageLoading';

/**
 * 按钮加载组件 - 使用 memo 优化渲染性能
 */
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = memo(({
  size = 'sm',
  className = '',
}) => (
  <div className={className}>
    <LoadingSpinner size={size} color="white" />
  </div>
));

ButtonLoading.displayName = 'ButtonLoading';

/**
 * 卡片加载组件 - 使用 memo 优化渲染性能
 */
export const CardLoading: React.FC<{ className?: string }> = memo(({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
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
));

CardLoading.displayName = 'CardLoading';

/**
 * 表格加载组件 - 使用 memo 优化渲染性能
 */
export const TableLoading: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string;
  showHeader?: boolean;
}> = memo(({
  rows = 5,
  columns = 4,
  className = '',
  showHeader = true,
}) => (
  <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
    <div className="animate-pulse">
      {/* 表头 */}
      {showHeader && (
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, index) => (
              <div key={`header-${index}`} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        </div>
      )}

      {/* 表格行 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 bg-gray-200 rounded flex-1"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
));

TableLoading.displayName = 'TableLoading';

export default LoadingSpinner;
