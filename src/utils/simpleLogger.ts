/**
 * 简化的日志工具
 *
 * 功能：
 * 1. 基础日志输出
 * 2. 环境控制
 * 3. 错误追踪
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const LOG_LEVEL_NAMES = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};

class SimpleLogger {
  private currentLevel: LogLevel;

  constructor() {
    // 根据环境设置日志级别
    this.currentLevel = import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const levelName = LOG_LEVEL_NAMES[level];
    return `[${timestamp}] ${levelName}: ${message}`;
  }

  debug(message: string, ..._args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      // eslint-disable-next-line no-console
      console.log(this.formatMessage(LogLevel.DEBUG, message), ..._args);
    }
  }

  info(message: string, ..._args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message), ..._args);
    }
  }

  warn(message: string, ..._args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message), ..._args);
    }
  }

  error(message: string, error?: Error, ..._args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      // eslint-disable-next-line no-console
      console.error(
        this.formatMessage(LogLevel.ERROR, message),
        error,
        ..._args
      );
    }
  }

  setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }
}

// 导出单例实例
export const logger = new SimpleLogger();

// 导出类型
export type { LogLevel };
