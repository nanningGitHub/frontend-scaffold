import React, { Component, ErrorInfo, ReactNode } from 'react';
import { monitoring } from '../utils/monitoring';

interface Props {
  children: ReactNode;
  fallback?:
    | ReactNode
    | ((error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  retryCount?: number;
  maxRetries?: number;
  errorTypes?: ErrorTypeConfig;
  context?: Record<string, unknown>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  isRetrying: boolean;
  lastErrorTime: number;
  errorHistory: ErrorRecord[];
}

interface ErrorTypeConfig {
  network?: ErrorHandlingStrategy;
  runtime?: ErrorHandlingStrategy;
  permission?: ErrorHandlingStrategy;
  validation?: ErrorHandlingStrategy;
  default?: ErrorHandlingStrategy;
}

interface ErrorHandlingStrategy {
  retry: boolean;
  maxRetries: number;
  retryDelay: number;
  fallback?: ReactNode;
  logLevel: 'info' | 'warn' | 'error';
}

interface ErrorRecord {
  error: Error;
  timestamp: number;
  retryCount: number;
  resolved: boolean;
}

/**
 * 企业级错误边界组件
 * 提供智能错误分类、自动重试、错误恢复等高级功能
 */
export class EnterpriseErrorBoundary extends Component<Props, State> {
  private retryTimeout?: ReturnType<typeof setTimeout>;
  private errorRecoveryTimer?: ReturnType<typeof setTimeout>;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      isRetrying: false,
      lastErrorTime: 0,
      errorHistory: [],
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, context } = this.props;

    // 记录错误到监控系统
    this.recordError(error, errorInfo, context);

    // 调用自定义错误处理
    onError?.(error, errorInfo);

    // 更新错误历史
    this.updateErrorHistory(error);

    // 尝试自动恢复
    this.attemptAutoRecovery(error);
  }

  componentWillUnmount(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
    if (this.errorRecoveryTimer) {
      clearTimeout(this.errorRecoveryTimer);
    }
  }

  /**
   * 记录错误到监控系统
   */
  private recordError(
    error: Error,
    errorInfo: ErrorInfo,
    context?: Record<string, unknown>
  ): void {
    const errorType = this.classifyError(error);
    const errorContext = {
      ...context,
      errorType,
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount,
    };

    // 发送到监控系统
    monitoring.recordError(error, errorContext);

    // 开发环境打印详细信息
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Enterprise Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Context:', errorContext);
      console.groupEnd();
    }
  }

  /**
   * 错误分类
   */
  private classifyError(error: Error): string {
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    if (
      errorMessage.includes('network') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('timeout')
    ) {
      return 'network';
    }

    if (
      errorMessage.includes('permission') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('forbidden')
    ) {
      return 'permission';
    }

    if (
      errorMessage.includes('validation') ||
      errorMessage.includes('invalid')
    ) {
      return 'validation';
    }

    if (errorName.includes('type') || errorName.includes('reference')) {
      return 'runtime';
    }

    return 'unknown';
  }

  /**
   * 更新错误历史
   */
  private updateErrorHistory(error: Error): void {
    this.setState((prevState) => ({
      errorHistory: [
        ...prevState.errorHistory,
        {
          error,
          timestamp: Date.now(),
          retryCount: prevState.retryCount,
          resolved: false,
        },
      ],
    }));
  }

  /**
   * 尝试自动恢复
   */
  private attemptAutoRecovery(error: Error): void {
    const errorType = this.classifyError(error);
    const strategy = this.getErrorStrategy(errorType);

    if (strategy.retry && this.state.retryCount < strategy.maxRetries) {
      // 延迟自动重试
      this.errorRecoveryTimer = setTimeout(() => {
        this.retry();
      }, strategy.retryDelay);
    }
  }

  /**
   * 获取错误处理策略
   */
  private getErrorStrategy(errorType: string): ErrorHandlingStrategy {
    const { errorTypes } = this.props;
    const defaultStrategy: ErrorHandlingStrategy = {
      retry: true,
      maxRetries: 3,
      retryDelay: 1000,
      logLevel: 'error',
    };

    if (errorTypes?.[errorType as keyof ErrorTypeConfig]) {
      return {
        ...defaultStrategy,
        ...errorTypes[errorType as keyof ErrorTypeConfig],
      };
    }

    return { ...defaultStrategy, ...errorTypes?.default };
  }

  /**
   * 手动重试
   */
  retry = async (): Promise<void> => {
    const { maxRetries = 3 } = this.props;

    if (this.state.retryCount >= maxRetries) {
      this.setState({ isRetrying: false });
      return;
    }

    this.setState({ isRetrying: true });

    try {
      // 延迟重试，避免立即失败
      await new Promise((resolve) => {
        this.retryTimeout = setTimeout(
          resolve,
          1000 * Math.pow(2, this.state.retryCount)
        );
      });

      // 重置错误状态
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        isRetrying: false,
      });

      // 记录成功恢复
      monitoring.recordBusinessMetric('error_recovery_success', 1, {
        errorType: this.state.error?.name,
        retryCount: this.state.retryCount,
      });
    } catch (error) {
      this.setState((prevState) => ({
        retryCount: prevState.retryCount + 1,
        isRetrying: false,
      }));
    }
  };

  /**
   * 渲染错误UI
   */
  renderErrorUI(): ReactNode {
    const { fallback } = this.props;
    const { error, errorInfo, retryCount, isRetrying } = this.state;

    if (!error) return null;

    const errorType = this.classifyError(error);
    const strategy = this.getErrorStrategy(errorType);

    // 自定义错误UI
    if (typeof fallback === 'function' && errorInfo) {
      return fallback(error, errorInfo, this.retry);
    }

    if (fallback) {
      return fallback;
    }

    // 默认错误UI
    return (
      <div className="enterprise-error-boundary">
        <div className="error-header">
          <h3>🚨 系统遇到问题</h3>
          <p className="error-type">
            错误类型: {this.getErrorTypeDisplayName(errorType)}
          </p>
        </div>

        <div className="error-details">
          <details>
            <summary>错误详情</summary>
            <div className="error-message">{error.message}</div>
            {errorInfo && (
              <div className="error-stack">
                <pre>{errorInfo.componentStack}</pre>
              </div>
            )}
          </details>
        </div>

        <div className="error-actions">
          {strategy.retry && retryCount < strategy.maxRetries && (
            <button
              onClick={this.retry}
              disabled={isRetrying}
              className="retry-button"
            >
              {isRetrying
                ? '正在重试...'
                : `重试 (${retryCount + 1}/${strategy.maxRetries})`}
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="reload-button"
          >
            刷新页面
          </button>

          <button
            onClick={() => this.showErrorReport()}
            className="report-button"
          >
            报告问题
          </button>
        </div>

        {this.renderErrorHistory()}
      </div>
    );
  }

  /**
   * 渲染错误历史
   */
  renderErrorHistory(): ReactNode {
    const { errorHistory } = this.state;

    if (errorHistory.length === 0) return null;

    return (
      <div className="error-history">
        <h4>错误历史</h4>
        <div className="error-list">
          {errorHistory.slice(-5).map((record, index) => (
            <div key={index} className="error-record">
              <span className="error-time">
                {new Date(record.timestamp).toLocaleTimeString()}
              </span>
              <span className="error-name">{record.error.name}</span>
              <span className="error-message">{record.error.message}</span>
              <span className="retry-count">重试: {record.retryCount}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /**
   * 显示错误报告
   */
  private showErrorReport(): void {
    const { error, errorInfo, errorHistory } = this.state;

    const report = {
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack,
      },
      errorHistory: errorHistory.map((record) => ({
        name: record.error.name,
        message: record.error.message,
        timestamp: record.timestamp,
        retryCount: record.retryCount,
      })),
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
      },
    };

    // 复制到剪贴板
    navigator.clipboard
      .writeText(JSON.stringify(report, null, 2))
      .then(() => alert('错误报告已复制到剪贴板'))
      .catch(() => {
        // eslint-disable-next-line no-console
        console.log('错误报告:', report);
      });
  }

  /**
   * 获取错误类型显示名称
   */
  private getErrorTypeDisplayName(errorType: string): string {
    const typeNames: Record<string, string> = {
      network: '网络错误',
      permission: '权限错误',
      validation: '验证错误',
      runtime: '运行时错误',
      unknown: '未知错误',
    };

    return typeNames[errorType] || '未知错误';
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderErrorUI();
    }

    return this.props.children;
  }
}

// 便捷的 HOC 包装器
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <EnterpriseErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </EnterpriseErrorBoundary>
    );
  };
}

// 导出默认配置
export const defaultErrorTypes: ErrorTypeConfig = {
  network: {
    retry: true,
    maxRetries: 5,
    retryDelay: 2000,
    logLevel: 'warn',
  },
  permission: {
    retry: false,
    maxRetries: 0,
    retryDelay: 0,
    logLevel: 'error',
  },
  validation: {
    retry: false,
    maxRetries: 0,
    retryDelay: 0,
    logLevel: 'warn',
  },
  runtime: {
    retry: true,
    maxRetries: 2,
    retryDelay: 1000,
    logLevel: 'error',
  },
  default: {
    retry: true,
    maxRetries: 3,
    retryDelay: 1000,
    logLevel: 'error',
  },
};
