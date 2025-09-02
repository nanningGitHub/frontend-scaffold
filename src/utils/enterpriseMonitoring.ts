/**
 * 企业级监控系统
 *
 * 功能：
 * 1. 性能监控 (Web Vitals)
 * 2. 错误追踪
 * 3. 用户行为分析
 * 4. 实时监控面板
 */

import { logger } from './logger';

// 性能指标接口
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

// 错误信息接口
interface ErrorInfo {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

// 用户行为事件接口
interface UserEvent {
  type: string;
  target: string;
  timestamp: number;
  url: string;
  userId?: string;
  sessionId: string;
}

export class EnterpriseMonitoring {
  private static instance: EnterpriseMonitoring;
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorInfo[] = [];
  private events: UserEvent[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initPerformanceMonitoring();
    this.initErrorTracking();
    this.initUserBehaviorTracking();
  }

  static getInstance(): EnterpriseMonitoring {
    if (!EnterpriseMonitoring.instance) {
      EnterpriseMonitoring.instance = new EnterpriseMonitoring();
    }
    return EnterpriseMonitoring.instance;
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 初始化性能监控
   */
  private initPerformanceMonitoring(): void {
    // 监控页面加载性能
    window.addEventListener('load', () => {
      this.measurePageLoadPerformance();
    });

    // 监控用户交互性能
    this.measureInteractionPerformance();

    // 监控资源加载性能
    this.measureResourcePerformance();
  }

  /**
   * 测量页面加载性能
   */
  private measurePageLoadPerformance(): void {
    const navigation = performance.getEntriesByType('navigation')[0];

    if (navigation) {
      this.trackMetric(
        'page_load_time',
        navigation.loadEventEnd - navigation.fetchStart
      );
      this.trackMetric(
        'dom_content_loaded',
        navigation.domContentLoadedEventEnd - navigation.fetchStart
      );
      this.trackMetric('first_paint', this.getFirstPaint());
      this.trackMetric(
        'largest_contentful_paint',
        this.getLargestContentfulPaint()
      );
    }
  }

  /**
   * 获取首次绘制时间
   */
  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(
      (entry) => entry.name === 'first-paint'
    );
    return firstPaint ? firstPaint.startTime : 0;
  }

  /**
   * 获取最大内容绘制时间
   */
  private getLargestContentfulPaint(): number {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }) as unknown as number;
  }

  /**
   * 测量用户交互性能
   */
  private measureInteractionPerformance(): void {
    // 监控点击事件响应时间
    document.addEventListener('click', () => {
      const startTime = performance.now();

      // 使用 requestAnimationFrame 确保在下一帧测量
      requestAnimationFrame(() => {
        const endTime = performance.now();
        this.trackMetric('click_response_time', endTime - startTime);
      });
    });
  }

  /**
   * 测量资源加载性能
   */
  private measureResourcePerformance(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.trackMetric(`resource_${entry.name}`, entry.duration);
        }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * 跟踪性能指标
   */
  trackMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(metric);
    logger.info(`Performance metric tracked: ${name} = ${value}ms`);

    // 发送到监控服务
    this.sendMetricToService(metric);
  }

  /**
   * 发送指标到监控服务
   */
  private sendMetricToService(metric: PerformanceMetric): void {
    // 这里可以集成真实的监控服务，如 Sentry、DataDog 等
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('📊 Performance Metric:', metric);
    }
  }

  /**
   * 初始化错误追踪
   */
  private initErrorTracking(): void {
    // 捕获 JavaScript 错误
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // 捕获 Promise 错误
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });
  }

  /**
   * 跟踪错误
   */
  trackError(errorInfo: ErrorInfo): void {
    this.errors.push(errorInfo);
    logger.error('Error tracked:', errorInfo);

    // 发送到错误监控服务
    this.sendErrorToService(errorInfo);
  }

  /**
   * 发送错误到监控服务
   */
  private sendErrorToService(errorInfo: ErrorInfo): void {
    // 这里可以集成真实的错误监控服务，如 Sentry
    if (import.meta.env.DEV) {
      console.error('🚨 Error tracked:', errorInfo);
    }
  }

  /**
   * 初始化用户行为追踪
   */
  private initUserBehaviorTracking(): void {
    // 追踪页面访问
    this.trackEvent('page_view', window.location.pathname);

    // 追踪用户交互
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target) {
        this.trackEvent('click', this.getElementSelector(target));
      }
    });

    // 追踪表单提交
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (form) {
        this.trackEvent(
          'form_submit',
          form.id || form.className || 'unknown_form'
        );
      }
    });
  }

  /**
   * 跟踪用户事件
   */
  trackEvent(type: string, target: string): void {
    const event: UserEvent = {
      type,
      target,
      timestamp: Date.now(),
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.events.push(event);
    logger.info(`User event tracked: ${type} on ${target}`);

    // 发送到分析服务
    this.sendEventToService(event);
  }

  /**
   * 发送事件到分析服务
   */
  private sendEventToService(event: UserEvent): void {
    // 这里可以集成真实的分析服务，如 Google Analytics
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('👤 User Event:', event);
    }
  }

  /**
   * 获取元素选择器
   */
  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  /**
   * 设置用户ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * 获取监控数据
   */
  getMonitoringData(): {
    metrics: PerformanceMetric[];
    errors: ErrorInfo[];
    events: UserEvent[];
  } {
    return {
      metrics: [...this.metrics],
      errors: [...this.errors],
      events: [...this.events],
    };
  }

  /**
   * 清空监控数据
   */
  clearData(): void {
    this.metrics = [];
    this.errors = [];
    this.events = [];
  }
}

// 导出单例实例
export const monitoring = EnterpriseMonitoring.getInstance();
