/**
 * 监控工具
 * 提供错误监控、性能监控、用户行为追踪等功能
 */

// 错误监控
export class ErrorMonitor {
  private static instance: ErrorMonitor

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor()
    }
    return ErrorMonitor.instance
  }

  init() {
    // 监听全局错误
    window.addEventListener('error', this.handleError.bind(this))
    
    // 监听未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this))
    
    // 监听 React 错误边界
    window.addEventListener('react-error-boundary', this.handleReactError.bind(this))
  }

  private handleError(event: ErrorEvent) {
    this.reportError({
      type: 'error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: Date.now(),
    })
  }

  private handlePromiseRejection(event: PromiseRejectionEvent) {
    this.reportError({
      type: 'promise-rejection',
      message: event.reason?.message || 'Promise Rejection',
      error: event.reason,
      timestamp: Date.now(),
    })
  }

  private handleReactError(event: CustomEvent) {
    this.reportError({
      type: 'react-error',
      message: event.detail?.message || 'React Error',
      error: event.detail?.error,
      componentStack: event.detail?.componentStack,
      timestamp: Date.now(),
    })
  }

  private reportError(errorInfo: any) {
    // 开发环境打印错误
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Monitor:', errorInfo)
    }

    // 生产环境发送到监控服务
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorInfo)
    }
  }

  private sendToMonitoringService(errorInfo: any) {
    // 这里可以集成 Sentry、LogRocket 等监控服务
    const monitoringUrl = process.env.VITE_SENTRY_DSN
    
    if (monitoringUrl) {
      fetch(monitoringUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo),
      }).catch(() => {
        // 静默处理发送失败
      })
    }
  }
}

// 性能监控
export class PerformanceMonitor {
  private static instance: PerformanceMonitor

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  init() {
    // 监听页面加载性能
    this.measurePageLoad()
    
    // 监听资源加载性能
    this.measureResourceLoad()
    
    // 监听用户交互性能
    this.measureUserInteraction()
  }

  private measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          ttfb: navigation.responseStart - navigation.requestStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          load: navigation.loadEventEnd - navigation.loadEventStart,
          total: navigation.loadEventEnd - navigation.fetchStart,
        }

        this.reportPerformance('page-load', metrics)
      }
    })
  }

  private measureResourceLoad() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming
          this.reportPerformance('resource-load', {
            name: resourceEntry.name,
            duration: resourceEntry.duration,
            size: resourceEntry.transferSize,
            type: resourceEntry.initiatorType,
          })
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })
  }

  private measureUserInteraction() {
    let lastInteraction = Date.now()
    
    const events = ['click', 'input', 'scroll', 'mousemove']
    events.forEach(eventType => {
      document.addEventListener(eventType, () => {
        const now = Date.now()
        const timeSinceLastInteraction = now - lastInteraction
        
        if (timeSinceLastInteraction > 1000) { // 1秒内的交互不重复记录
          this.reportPerformance('user-interaction', {
            type: eventType,
            timestamp: now,
          })
          lastInteraction = now
        }
      }, { passive: true })
    })
  }

  private reportPerformance(type: string, data: any) {
    // 开发环境打印性能数据
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Monitor:', { type, data })
    }

    // 生产环境发送到分析服务
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalyticsService(type, data)
    }
  }

  private sendToAnalyticsService(type: string, data: any) {
    const analyticsUrl = process.env.VITE_GA_TRACKING_ID
    
    if (analyticsUrl) {
      // 这里可以集成 Google Analytics 或其他分析服务
      if (window.gtag) {
        window.gtag('event', type, data)
      }
    }
  }
}

// 用户行为追踪
export class UserTracker {
  private static instance: UserTracker

  static getInstance(): UserTracker {
    if (!UserTracker.instance) {
      UserTracker.instance = new UserTracker()
    }
    return UserTracker.instance
  }

  init() {
    this.trackPageViews()
    this.trackUserActions()
    this.trackCustomEvents()
  }

  private trackPageViews() {
    // 监听路由变化
    window.addEventListener('popstate', () => {
      this.trackEvent('page-view', {
        path: window.location.pathname,
        title: document.title,
      })
    })
  }

  private trackUserActions() {
    // 追踪按钮点击
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        this.trackEvent('button-click', {
          text: target.textContent?.trim(),
          className: target.className,
        })
      }
    })

    // 追踪表单提交
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      this.trackEvent('form-submit', {
        action: form.action,
        method: form.method,
      })
    })
  }

  private trackCustomEvents() {
    // 自定义事件追踪
    window.addEventListener('custom-event', (event: CustomEvent) => {
      this.trackEvent('custom', event.detail)
    })
  }

  trackEvent(eventName: string, data?: any) {
    // 开发环境打印事件
    if (process.env.NODE_ENV === 'development') {
      console.log('User Tracker:', { eventName, data })
    }

    // 生产环境发送到分析服务
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalyticsService(eventName, data)
    }
  }

  private sendToAnalyticsService(eventName: string, data?: any) {
    const analyticsUrl = process.env.VITE_GA_TRACKING_ID
    
    if (analyticsUrl && window.gtag) {
      window.gtag('event', eventName, data)
    }
  }
}

// 初始化所有监控
export function initMonitoring() {
  ErrorMonitor.getInstance().init()
  PerformanceMonitor.getInstance().init()
  UserTracker.getInstance().init()
}

// 导出便捷方法
export const trackEvent = (eventName: string, data?: any) => {
  UserTracker.getInstance().trackEvent(eventName, data)
}

export const reportError = (error: Error, context?: any) => {
  ErrorMonitor.getInstance().reportError({
    type: 'manual',
    message: error.message,
    error,
    context,
    timestamp: Date.now(),
  })
}
