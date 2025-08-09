/**
 * 日志工具类
 * 
 * 功能：
 * 1. 统一的日志管理
 * 2. 环境相关的日志控制
 * 3. 结构化日志输出
 * 4. 错误追踪
 */

interface LogLevel {
  DEBUG: 0
  INFO: 1
  WARN: 2
  ERROR: 3
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

// 兼容 Vite 与 Jest/Node 环境的 DEV 检测
function readViteEnvDevFlag(): boolean | undefined {
  try {
    // 避免在非 ESM 环境解析 import.meta 语法
    const env = eval('import.meta && import.meta.env') as any
    return env?.DEV
  } catch {
    return undefined
  }
}

class Logger {
  private isDevelopment = readViteEnvDevFlag() ?? ((globalThis as any).process?.env?.NODE_ENV !== 'production')
  private currentLevel = this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR

  private shouldLog(level: number): boolean {
    return level >= this.currentLevel
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level}]`
    
    return `${prefix} ${message}`
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      if (data !== undefined) {
        console.debug(this.formatMessage('DEBUG', message), data)
      } else {
        console.debug(this.formatMessage('DEBUG', message))
      }
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      if (data !== undefined) {
        console.info(this.formatMessage('INFO', message), data)
      } else {
        console.info(this.formatMessage('INFO', message))
      }
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      if (data !== undefined) {
        console.warn(this.formatMessage('WARN', message), data)
      } else {
        console.warn(this.formatMessage('WARN', message))
      }
    }
  }

  error(message: string, error?: Error | any): void {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      if (error !== undefined) {
        console.error(this.formatMessage('ERROR', message), error)
      } else {
        console.error(this.formatMessage('ERROR', message))
      }
      
      // 在生产环境中，可以发送错误到监控服务
      if (!this.isDevelopment && error) {
        this.reportError(message, error)
      }
    }
  }

  private reportError(message: string, error: Error | any): void {
    // 这里可以集成错误监控服务，如 Sentry
    // Sentry.captureException(error, { extra: { message } })
  }

  // 性能监控
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label)
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label)
    }
  }

  // 分组日志
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label)
    }
  }

  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd()
    }
  }
}

export const logger = new Logger()
