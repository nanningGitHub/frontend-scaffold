import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MicroAppState } from '../types/microfrontend';
import { MicroAppCommunication } from '../utils/microAppCommunication';
import ErrorBoundary from './ErrorBoundary';

interface MicroAppContainerProps {
  appId: string;
  containerId: string;
  entry: string;
  module: string;
  props?: Record<string, unknown>;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onUnload?: () => void;
  className?: string;
  style?: React.CSSProperties;
  preload?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * 微应用容器组件
 * 用于在主应用中加载和显示微应用
 */
export const MicroAppContainer: React.FC<MicroAppContainerProps> = ({
  appId,
  containerId,
  entry,
  module,
  onLoad,
  onError,
  onUnload,
  className = '',
  style = {},
  preload = false,
  retryCount = 3,
  retryDelay = 2000,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [appState, setAppState] = useState<MicroAppState>({
    id: appId,
    status: 'unmounted',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // 预加载微应用
  const preloadMicroApp = useCallback(async () => {
    if (preload && !isPreloaded) {
      try {
        await import(/* webpackIgnore: true */ entry);
        setIsPreloaded(true);
      } catch (err) {
        console.warn(`Failed to preload micro app ${appId}:`, err);
      }
    }
  }, [preload, isPreloaded, entry, appId]);

  // 加载微应用
  const loadMicroApp = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // 动态导入远程模块
      const remoteModule = await import(/* webpackIgnore: true */ entry);

      // 获取微应用组件
      const MicroAppComponent = remoteModule.default || remoteModule[module];

      if (!MicroAppComponent) {
        throw new Error(`Failed to load micro app component from ${entry}`);
      }

      // 更新状态为已挂载
      setAppState((prev) => ({ ...prev, status: 'mounted' }));
      setIsLoading(false);

      // 调用加载完成回调
      onLoad?.();

      // 订阅微应用消息
      const communication = MicroAppCommunication.getInstance();
      const unsubscribe = communication.onMessage(appId, (message) => {
        // 处理来自微应用的消息
        // eslint-disable-next-line no-console
        console.log(`Received message from ${appId}:`, message);
      });

      // 清理函数
      return () => {
        unsubscribe();
        if (onUnload) {
          onUnload();
        }
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setAppState((prev) => ({ ...prev, status: 'error', error }));
      setIsLoading(false);
      onError?.(error);

      // 自动重试
      if (retryAttempts < retryCount) {
        setTimeout(() => {
          setRetryAttempts((prev) => prev + 1);
          loadMicroApp();
        }, retryDelay);
      }
    }
  }, [
    appId,
    entry,
    module,
    onLoad,
    onError,
    onUnload,
    retryAttempts,
    retryCount,
    retryDelay,
  ]);

  // 手动重试
  const handleRetry = useCallback(() => {
    setError(null);
    setRetryAttempts(0);
    loadMicroApp();
  }, [loadMicroApp]);

  useEffect(() => {
    let isMounted = true;

    // 预加载
    preloadMicroApp();

    // 加载微应用
    if (isMounted) {
      loadMicroApp();
    }

    return () => {
      isMounted = false;
    };
  }, [preloadMicroApp, loadMicroApp]);

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className={`micro-app-container loading ${className}`} style={style}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading {appId}...</p>
          {retryAttempts > 0 && (
            <p className="retry-info">
              Retry attempt {retryAttempts}/{retryCount}
            </p>
          )}
        </div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className={`micro-app-container error ${className}`} style={style}>
        <div className="error-content">
          <h3>Failed to load {appId}</h3>
          <p>{error.message}</p>
          <div className="error-actions">
            <button
              onClick={handleRetry}
              className="retry-button"
              disabled={retryAttempts >= retryCount}
            >
              {retryAttempts >= retryCount
                ? 'Max retries reached'
                : `Retry (${retryCount - retryAttempts} left)`}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="reload-button"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 渲染微应用容器
  return (
          <ErrorBoundary
        fallback={(error, errorInfo) => (
          <div
            className={`micro-app-container error-boundary ${className}`}
            style={style}
          >
            <div className="error-content">
              <h3>Error Boundary caught error in {appId}</h3>
              <p>{error.message}</p>
              <button onClick={handleRetry} className="retry-button">
                Retry
              </button>
            </div>
          </div>
        )}
      onError={(error) => {
        // eslint-disable-next-line no-console
        console.error(
          `Error boundary caught error in micro app ${appId}:`,
          error
        );
        onError?.(error);
      }}
    >
      <div
        ref={containerRef}
        id={containerId}
        className={`micro-app-container ${className}`}
        style={style}
        data-app-id={appId}
        data-status={appState.status}
        data-preloaded={isPreloaded}
      />
    </ErrorBoundary>
  );
};

export default MicroAppContainer;
