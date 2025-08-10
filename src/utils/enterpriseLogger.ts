import { monitoring } from './monitoring';

/**
 * 日志级别枚举
 */
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}

/**
 * 日志级别显示名称
 */
const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.TRACE]: 'TRACE',
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
};

/**
 * 日志配置接口
 */
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  batchSize: number;
  batchTimeout: number;
  maxLogs: number;
  enablePerformanceTracking: boolean;
  context?: Record<string, any>;
}

/**
 * 日志条目接口
 */
interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  context: Record<string, any>;
  tags: string[];
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component?: string;
  method?: string;
  duration?: number;
  error?: Error;
  stack?: string;
}

/**
 * 企业级日志管理器
 */
export class EnterpriseLogger {
  private static instance: EnterpriseLogger;
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private batchQueue: LogEntry[] = [];
  private batchTimer?: ReturnType<typeof setTimeout>;
  private sessionId: string;
  private requestId: string;

  private constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableRemote: true,
      batchSize: 50,
      batchTimeout: 5000,
      maxLogs: 10000,
      enablePerformanceTracking: true,
      context: {},
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.requestId = this.generateRequestId();

    // 初始化性能监控
    if (this.config.enablePerformanceTracking) {
      this.initPerformanceTracking();
    }

    // 设置全局错误监听
    this.setupGlobalErrorHandling();
  }

  static getInstance(config?: Partial<LoggerConfig>): EnterpriseLogger {
    if (!EnterpriseLogger.instance) {
      EnterpriseLogger.instance = new EnterpriseLogger(config);
    }
    return EnterpriseLogger.instance;
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成请求ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 初始化性能监控
   */
  private initPerformanceTracking(): void {
    // 监听页面性能指标
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        this.recordPerformanceMetrics();
      });
    }
  }

  /**
   * 设置全局错误处理
   */
  private setupGlobalErrorHandling(): void {
    if (typeof window !== 'undefined') {
      // 监听未捕获的错误
      window.addEventListener('error', (event) => {
        this.error('Uncaught error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        });
      });

      // 监听未处理的 Promise 拒绝
      window.addEventListener('unhandledrejection', (event) => {
        this.error('Unhandled promise rejection', {
          reason: event.reason,
          promise: event.promise,
        });
      });
    }
  }

  /**
   * 记录性能指标
   */
  private recordPerformanceMetrics(): void {
    if (typeof performance !== 'undefined') {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      if (navigation) {
        this.info('Page performance metrics', {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          ttfb: navigation.responseStart - navigation.requestStart,
          domContentLoaded:
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          load: navigation.loadEventEnd - navigation.loadEventStart,
          total: navigation.loadEventEnd - navigation.fetchStart,
        });
      }
    }
  }

  /**
   * 记录日志
   */
  private log(
    level: LogLevel,
    message: string,
    context: Record<string, any> = {}
  ): void {
    if (level < this.config.level) {
      return;
    }

    const logEntry: LogEntry = {
      id: this.generateLogId(),
      level,
      message,
      timestamp: Date.now(),
      context: {
        ...this.config.context,
        ...context,
      },
      tags: this.extractTags(message, context),
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      requestId: this.requestId,
      component: context.component,
      method: context.method,
      duration: context.duration,
      error: context.error,
      stack: context.error?.stack,
    };

    // 添加到日志数组
    this.logs.push(logEntry);

    // 限制日志数量
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(-this.config.maxLogs);
    }

    // 控制台输出
    if (this.config.enableConsole) {
      this.outputToConsole(logEntry);
    }

    // 添加到批处理队列
    this.addToBatch(logEntry);

    // 发送到监控系统
    this.sendToMonitoring(logEntry);
  }

  /**
   * 生成日志ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 提取标签
   */
  private extractTags(message: string, context: Record<string, any>): string[] {
    const tags: string[] = [];

    // 从消息中提取标签
    const tagMatches = message.match(/#\w+/g);
    if (tagMatches) {
      tags.push(...tagMatches.map((tag) => tag.substring(1)));
    }

    // 从上下文中提取标签
    if (context.tags) {
      tags.push(...context.tags);
    }

    // 从组件名称提取标签
    if (context.component) {
      tags.push(`component:${context.component}`);
    }

    return [...new Set(tags)];
  }

  /**
   * 获取当前用户ID
   */
  private getCurrentUserId(): string | undefined {
    // 这里可以从认证状态、localStorage 等获取用户ID
    try {
      const authStore = JSON.parse(localStorage.getItem('auth') || '{}');
      return authStore.userId;
    } catch {
      return undefined;
    }
  }

  /**
   * 控制台输出
   */
  private outputToConsole(logEntry: LogEntry): void {
    const { level, message, context, timestamp, tags } = logEntry;
    const levelName = LOG_LEVEL_NAMES[level];
    const timeStr = new Date(timestamp).toISOString();

    const logData = {
      level: levelName,
      message,
      context,
      tags,
      timestamp: timeStr,
    };

    switch (level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(`[${levelName}] ${message}`, logData);
        break;
      case LogLevel.INFO:
        console.info(`[${levelName}] ${message}`, logData);
        break;
      case LogLevel.WARN:
        console.warn(`[${levelName}] ${message}`, logData);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(`[${levelName}] ${message}`, logData);
        break;
    }
  }

  /**
   * 添加到批处理队列
   */
  private addToBatch(logEntry: LogEntry): void {
    this.batchQueue.push(logEntry);

    // 检查是否达到批处理大小
    if (this.batchQueue.length >= this.config.batchSize) {
      this.flushBatch();
    } else if (!this.batchTimer) {
      // 设置批处理超时
      this.batchTimer = setTimeout(() => {
        this.flushBatch();
      }, this.config.batchTimeout);
    }
  }

  /**
   * 刷新批处理队列
   */
  private flushBatch(): void {
    if (this.batchQueue.length === 0) {
      return;
    }

    const batch = [...this.batchQueue];
    this.batchQueue = [];

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = undefined;
    }

    // 发送到远程服务器
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.sendToRemote(batch);
    }
  }

  /**
   * 发送到远程服务器
   */
  private async sendToRemote(logs: LogEntry[]): Promise<void> {
    try {
      const response = await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs,
          sessionId: this.sessionId,
          requestId: this.requestId,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        console.warn('Failed to send logs to remote server:', response.status);
      }
    } catch (error) {
      console.warn('Error sending logs to remote server:', error);
    }
  }

  /**
   * 发送到监控系统
   */
  private sendToMonitoring(logEntry: LogEntry): void {
    if (logEntry.level >= LogLevel.ERROR) {
      monitoring.recordError(new Error(logEntry.message), {
        logEntry,
        level: LOG_LEVEL_NAMES[logEntry.level],
      });
    }

    // 记录性能指标
    if (logEntry.duration) {
      monitoring.recordMetric('log_duration', logEntry.duration, {
        level: LOG_LEVEL_NAMES[logEntry.level],
        component: logEntry.component,
      });
    }
  }

  /**
   * 设置请求ID
   */
  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string): void {
    // 更新配置上下文
    this.config.context = {
      ...this.config.context,
      userId,
    };
  }

  /**
   * 添加上下文
   */
  addContext(context: Record<string, any>): void {
    this.config.context = {
      ...this.config.context,
      ...context,
    };
  }

  /**
   * 性能追踪装饰器
   */
  withPerformanceTracking<T>(
    component: string,
    method: string,
    fn: () => T
  ): T {
    const startTime = performance.now();

    try {
      const result = fn();

      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - startTime;
          this.debug(`${component}.${method} completed`, {
            duration,
            component,
            method,
          });
        }) as T;
      } else {
        const duration = performance.now() - startTime;
        this.debug(`${component}.${method} completed`, {
          duration,
          component,
          method,
        });
        return result;
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      this.error(`${component}.${method} failed`, {
        duration,
        component,
        method,
        error,
      });
      throw error;
    }
  }

  /**
   * 异步性能追踪
   */
  async withAsyncPerformanceTracking<T>(
    component: string,
    method: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.debug(`${component}.${method} completed`, {
        duration,
        component,
        method,
      });
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.error(`${component}.${method} failed`, {
        duration,
        component,
        method,
        error,
      });
      throw error;
    }
  }

  // 日志级别方法
  trace(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.TRACE, message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  fatal(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context);
  }

  /**
   * 获取日志报告
   */
  getLogReport(): LogReport {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const recentLogs = this.logs.filter((log) => log.timestamp > oneHourAgo);
    const errorLogs = recentLogs.filter((log) => log.level >= LogLevel.ERROR);
    const warningLogs = recentLogs.filter((log) => log.level === LogLevel.WARN);

    return {
      totalLogs: this.logs.length,
      recentLogs: recentLogs.length,
      errorLogs: errorLogs.length,
      warningLogs: warningLogs.length,
      logs: recentLogs.slice(-100), // 最近100条日志
      timestamp: now,
    };
  }

  /**
   * 清理日志
   */
  cleanup(): void {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.logs = this.logs.filter((log) => log.timestamp > oneDayAgo);
  }

  /**
   * 导出日志
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      return this.exportToCSV();
    }

    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 导出为CSV格式
   */
  private exportToCSV(): string {
    const headers = [
      'Timestamp',
      'Level',
      'Message',
      'Component',
      'Method',
      'Duration',
      'Tags',
    ];
    const rows = this.logs.map((log) => [
      new Date(log.timestamp).toISOString(),
      LOG_LEVEL_NAMES[log.level],
      log.message,
      log.component || '',
      log.method || '',
      log.duration || '',
      log.tags.join(', '),
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
  }
}

// 日志报告接口
interface LogReport {
  totalLogs: number;
  recentLogs: number;
  errorLogs: number;
  warningLogs: number;
  logs: LogEntry[];
  timestamp: number;
}

// 导出单例和便捷方法
export const logger = EnterpriseLogger.getInstance();

// 便捷的日志方法
export const trace = (message: string, context?: Record<string, any>) =>
  logger.trace(message, context);
export const debug = (message: string, context?: Record<string, any>) =>
  logger.debug(message, context);
export const info = (message: string, context?: Record<string, any>) =>
  logger.info(message, context);
export const warn = (message: string, context?: Record<string, any>) =>
  logger.warn(message, context);
export const error = (message: string, context?: Record<string, any>) =>
  logger.error(message, context);
export const fatal = (message: string, context?: Record<string, any>) =>
  logger.fatal(message, context);

// 性能追踪装饰器
export const withPerformanceTracking = <T>(
  component: string,
  method: string,
  fn: () => T
): T => logger.withPerformanceTracking(component, method, fn);

export const withAsyncPerformanceTracking = <T>(
  component: string,
  method: string,
  fn: () => Promise<T>
): Promise<T> => logger.withAsyncPerformanceTracking(component, method, fn);
