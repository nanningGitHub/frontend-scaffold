/**
 * 企业级错误处理系统
 *
 * 功能：
 * 1. 智能错误分类
 * 2. 自动重试机制
 * 3. 优雅降级策略
 * 4. 错误上报和分析
 * 5. 用户友好的错误提示
 */

import { logger } from './simpleLogger';
import { monitoring } from './enterpriseMonitoring';

// 错误类型枚举
export enum ErrorType {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
}

// 错误严重程度
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// 错误信息接口
export interface ErrorInfo {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string | number;
  stack?: string;
  context?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  url: string;
  userAgent: string;
}

// 重试配置
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
  maxDelay: number;
}

// 错误处理配置
export interface ErrorHandlerConfig {
  enableRetry: boolean;
  enableFallback: boolean;
  enableReporting: boolean;
  retryConfig: RetryConfig;
}

export class EnterpriseErrorHandler {
  private static instance: EnterpriseErrorHandler;
  private config: ErrorHandlerConfig;
  private errorHistory: ErrorInfo[] = [];
  private retryQueue: Map<string, { attempts: number; lastAttempt: number }> =
    new Map();

  constructor(config?: Partial<ErrorHandlerConfig>) {
    this.config = {
      enableRetry: true,
      enableFallback: true,
      enableReporting: true,
      retryConfig: {
        maxAttempts: 3,
        delay: 1000,
        backoffMultiplier: 2,
        maxDelay: 10000,
      },
      ...config,
    };
  }

  static getInstance(
    config?: Partial<ErrorHandlerConfig>
  ): EnterpriseErrorHandler {
    if (!EnterpriseErrorHandler.instance) {
      EnterpriseErrorHandler.instance = new EnterpriseErrorHandler(config);
    }
    return EnterpriseErrorHandler.instance;
  }

  /**
   * 处理错误
   */
  async handleError(
    error: Error,
    context?: Record<string, unknown>
  ): Promise<void> {
    const errorInfo = this.categorizeError(error, context);

    // 记录错误
    this.recordError(errorInfo);

    // 上报错误
    if (this.config.enableReporting) {
      this.reportError(errorInfo);
    }

    // 尝试自动恢复
    if (this.config.enableRetry && this.shouldRetry(errorInfo)) {
      await this.attemptRetry(errorInfo);
    }

    // 优雅降级
    if (this.config.enableFallback) {
      this.attemptFallback(errorInfo);
    }

    // 显示用户友好的错误信息
    this.showUserFriendlyError(errorInfo);
  }

  /**
   * 智能错误分类
   */
  private categorizeError(
    error: Error,
    context?: Record<string, unknown>
  ): ErrorInfo {
    let type = ErrorType.UNKNOWN;
    let severity = ErrorSeverity.MEDIUM;
    let code: string | number | undefined;

    // 根据错误名称和消息进行分类
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      type = ErrorType.NETWORK;
      severity = ErrorSeverity.HIGH;
    } else if (
      error.name === 'ValidationError' ||
      error.message.includes('validation')
    ) {
      type = ErrorType.VALIDATION;
      severity = ErrorSeverity.LOW;
    } else if (
      error.name === 'AuthenticationError' ||
      error.message.includes('unauthorized')
    ) {
      type = ErrorType.AUTHENTICATION;
      severity = ErrorSeverity.HIGH;
    } else if (
      error.name === 'AuthorizationError' ||
      error.message.includes('forbidden')
    ) {
      type = ErrorType.AUTHORIZATION;
      severity = ErrorSeverity.HIGH;
    } else if (error.name === 'ServerError' || error.message.includes('500')) {
      type = ErrorType.SERVER;
      severity = ErrorSeverity.CRITICAL;
    } else if (error.name === 'ClientError' || error.message.includes('400')) {
      type = ErrorType.CLIENT;
      severity = ErrorSeverity.MEDIUM;
    }

    // 根据错误严重程度调整
    if (error.message.includes('critical') || error.message.includes('fatal')) {
      severity = ErrorSeverity.CRITICAL;
    } else if (
      error.message.includes('warning') ||
      error.message.includes('minor')
    ) {
      severity = ErrorSeverity.LOW;
    }

    return {
      type,
      severity,
      message: error.message,
      code,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
  }

  /**
   * 记录错误
   */
  private recordError(errorInfo: ErrorInfo): void {
    this.errorHistory.push(errorInfo);

    // 限制错误历史记录数量
    if (this.errorHistory.length > 100) {
      this.errorHistory = this.errorHistory.slice(-50);
    }

    logger.error(
      `Error recorded: ${errorInfo.type} - ${errorInfo.message}`,
      errorInfo
    );
  }

  /**
   * 上报错误
   */
  private reportError(errorInfo: ErrorInfo): void {
    // 使用监控系统上报错误
    monitoring.trackError({
      message: errorInfo.message,
      stack: errorInfo.stack,
      timestamp: errorInfo.timestamp,
      url: errorInfo.url,
      userAgent: errorInfo.userAgent,
    });

    // 这里可以集成真实的错误监控服务
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('🚨 Error reported:', errorInfo);
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(errorInfo: ErrorInfo): boolean {
    const retryableTypes = [ErrorType.NETWORK, ErrorType.SERVER];
    return (
      retryableTypes.includes(errorInfo.type) &&
      errorInfo.severity !== ErrorSeverity.CRITICAL
    );
  }

  /**
   * 尝试重试
   */
  private async attemptRetry(errorInfo: ErrorInfo): Promise<void> {
    const retryKey = `${errorInfo.type}_${errorInfo.message}`;
    const retryInfo = this.retryQueue.get(retryKey) || {
      attempts: 0,
      lastAttempt: 0,
    };

    if (retryInfo.attempts >= this.config.retryConfig.maxAttempts) {
      logger.warn(`Max retry attempts reached for error: ${errorInfo.message}`);
      return;
    }

    const now = Date.now();
    const delay = Math.min(
      this.config.retryConfig.delay *
        Math.pow(this.config.retryConfig.backoffMultiplier, retryInfo.attempts),
      this.config.retryConfig.maxDelay
    );

    if (now - retryInfo.lastAttempt < delay) {
      return; // 还没到重试时间
    }

    retryInfo.attempts++;
    retryInfo.lastAttempt = now;
    this.retryQueue.set(retryKey, retryInfo);

    logger.info(
      `Retrying error (attempt ${retryInfo.attempts}): ${errorInfo.message}`
    );

    // 这里可以实现具体的重试逻辑
    // 例如重新发送请求、重新初始化组件等
  }

  /**
   * 尝试优雅降级
   */
  private attemptFallback(errorInfo: ErrorInfo): void {
    switch (errorInfo.type) {
      case ErrorType.NETWORK:
        this.showNetworkFallback();
        break;
      case ErrorType.SERVER:
        this.showServerFallback();
        break;
      case ErrorType.AUTHENTICATION:
        this.showAuthFallback();
        break;
      default:
        this.showGenericFallback();
    }
  }

  /**
   * 网络错误降级
   */
  private showNetworkFallback(): void {
    // 显示离线模式或缓存数据
    logger.info('Showing network fallback UI');
  }

  /**
   * 服务器错误降级
   */
  private showServerFallback(): void {
    // 显示维护页面或备用服务
    logger.info('Showing server fallback UI');
  }

  /**
   * 认证错误降级
   */
  private showAuthFallback(): void {
    // 重定向到登录页面
    logger.info('Redirecting to login page');
    window.location.href = '/auth';
  }

  /**
   * 通用错误降级
   */
  private showGenericFallback(): void {
    // 显示通用错误页面
    logger.info('Showing generic fallback UI');
  }

  /**
   * 显示用户友好的错误信息
   */
  private showUserFriendlyError(errorInfo: ErrorInfo): void {
    const userMessage = this.getUserFriendlyMessage(errorInfo);

    // 这里可以显示 toast 通知、模态框等
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('👤 User-friendly error message:', userMessage);
    }
  }

  /**
   * 获取用户友好的错误信息
   */
  private getUserFriendlyMessage(errorInfo: ErrorInfo): string {
    const messages = {
      [ErrorType.NETWORK]: '网络连接异常，请检查网络设置后重试',
      [ErrorType.VALIDATION]: '输入信息有误，请检查后重新提交',
      [ErrorType.AUTHENTICATION]: '登录已过期，请重新登录',
      [ErrorType.AUTHORIZATION]: '权限不足，请联系管理员',
      [ErrorType.SERVER]: '服务器暂时不可用，请稍后重试',
      [ErrorType.CLIENT]: '请求参数有误，请检查后重试',
      [ErrorType.UNKNOWN]: '系统出现异常，请稍后重试',
    };

    return messages[errorInfo.type] || messages[ErrorType.UNKNOWN];
  }

  /**
   * 获取错误统计
   */
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recent: ErrorInfo[];
  } {
    const byType = {} as Record<ErrorType, number>;
    const bySeverity = {} as Record<ErrorSeverity, number>;

    // 初始化计数器
    Object.values(ErrorType).forEach((type) => (byType[type] = 0));
    Object.values(ErrorSeverity).forEach(
      (severity) => (bySeverity[severity] = 0)
    );

    // 统计错误
    this.errorHistory.forEach((error) => {
      byType[error.type]++;
      bySeverity[error.severity]++;
    });

    return {
      total: this.errorHistory.length,
      byType,
      bySeverity,
      recent: this.errorHistory.slice(-10),
    };
  }

  /**
   * 清空错误历史
   */
  clearErrorHistory(): void {
    this.errorHistory = [];
    this.retryQueue.clear();
  }
}

// 导出单例实例
export const errorHandler = EnterpriseErrorHandler.getInstance();
