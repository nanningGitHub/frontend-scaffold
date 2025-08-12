import { PerformanceMetric } from '../types/common';

// 类型定义
type PerformanceObserver = (metric: PerformanceMetric) => void;

/**
 * 性能监控配置
 * 用于配置应用的性能监控策略
 */

// 性能监控配置
export const PERFORMANCE_CONFIG: PerformanceConfig = {
  // 监控开关
  enabled: true,

  // 采样率 (0-1)
  sampleRate: 0.1,

  // 监控间隔 (毫秒)
  monitorInterval: 5000,

  // 性能阈值配置
  thresholds: {
    // 页面加载时间阈值 (毫秒)
    pageLoad: 3000,

    // API 响应时间阈值 (毫秒)
    apiResponse: 1000,

    // 组件渲染时间阈值 (毫秒)
    componentRender: 100,

    // 内存使用阈值 (MB)
    memoryUsage: 100,

    // 帧率阈值 (FPS)
    frameRate: 30,
  },

  // 监控指标
  metrics: {
    // 核心 Web 指标
    coreWebVitals: true,

    // 自定义指标
    custom: true,

    // 资源加载
    resourceLoading: true,

    // 内存使用
    memoryUsage: true,

    // 错误率
    errorRate: true,
  },

  // 上报配置
  reporting: {
    // 上报地址
    endpoint: '/api/performance',

    // 上报间隔 (毫秒)
    interval: 30000,

    // 批量上报大小
    batchSize: 10,

    // 是否实时上报
    realTime: false,
  },
};

// 性能指标类型
export interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number;
  monitorInterval: number;
  thresholds: {
    pageLoad: number;
    apiResponse: number;
    componentRender: number;
    memoryUsage: number;
    frameRate: number;
  };
  metrics: {
    coreWebVitals: boolean;
    custom: boolean;
    resourceLoading: boolean;
    memoryUsage: boolean;
    errorRate: boolean;
  };
  reporting: {
    endpoint: string;
    interval: number;
    batchSize: number;
    realTime: boolean;
  };
}

// 性能监控器类
export class PerformanceMonitor {
  private observers: Set<PerformanceObserver> = new Set();
  private metrics: PerformanceMetric[] = [];
  private isMonitoring = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private config: PerformanceConfig = PERFORMANCE_CONFIG) {}

  /**
   * 开始性能监控
   */
  start(): void {
    if (this.isMonitoring || !this.config.enabled) return;

    this.isMonitoring = true;
    this.startCoreWebVitalsMonitoring();
    this.startCustomMetricsMonitoring();
    this.startResourceLoadingMonitoring();
    this.startMemoryMonitoring();
    this.startErrorMonitoring();

    // 定期清理和上报
    this.intervalId = setInterval(() => {
      this.cleanup();
      this.report();
    }, this.config.reporting.interval);

    console.log('Performance monitoring started');
  }

  /**
   * 停止性能监控
   */
  stop(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.observers.clear();
    console.log('Performance monitoring stopped');
  }

  /**
   * 添加性能观察者
   */
  addObserver(observer: PerformanceObserver): void {
    this.observers.add(observer);
  }

  /**
   * 移除性能观察者
   */
  removeObserver(observer: PerformanceObserver): void {
    this.observers.delete(observer);
  }

  /**
   * 记录性能指标
   */
  recordMetric(
    name: string,
    value: number,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.config.enabled || Math.random() > this.config.sampleRate) return;

    const metric: PerformanceMetric = {
      name,
      value,
      unit: this.getUnit(name),
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    this.notifyObservers(metric);

    // 检查阈值
    this.checkThresholds(metric);
  }

  /**
   * 获取指标单位
   */
  private getUnit(metricName: string): string {
    const unitMap: Record<string, string> = {
      pageLoad: 'ms',
      apiResponse: 'ms',
      componentRender: 'ms',
      memoryUsage: 'MB',
      frameRate: 'fps',
      duration: 'ms',
      size: 'bytes',
    };

    return unitMap[metricName] || 'units';
  }

  /**
   * 检查性能阈值
   */
  private checkThresholds(metric: PerformanceMetric): void {
    const threshold =
      this.config.thresholds[
        metric.name as keyof typeof this.config.thresholds
      ];

    if (threshold && metric.value > threshold) {
      console.warn(
        `Performance threshold exceeded: ${metric.name} = ${metric.value}${metric.unit} (threshold: ${threshold}${metric.unit})`
      );

      // 可以在这里添加告警逻辑
      this.triggerAlert(metric, threshold);
    }
  }

  /**
   * 触发性能告警
   */
  private triggerAlert(metric: PerformanceMetric, threshold: number): void {
    // 这里可以集成告警系统
    const alert = {
      type: 'performance_threshold_exceeded',
      metric: metric.name,
      value: metric.value,
      threshold,
      timestamp: Date.now(),
    };

    console.warn('Performance alert:', alert);
  }

  /**
   * 通知观察者
   */
  private notifyObservers(metric: PerformanceMetric): void {
    this.observers.forEach((observer) => {
      try {
        observer(metric);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });
  }

  /**
   * 开始核心 Web 指标监控
   */
  private startCoreWebVitalsMonitoring(): void {
    if (!this.config.metrics.coreWebVitals) return;

    // 监控 LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            this.recordMetric('lcp', lastEntry.startTime, {
              entryType: 'largest-contentful-paint',
            });
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('Failed to observe LCP:', error);
      }

      // 监控 FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fidEntry = entry as PerformanceEntry & {
              processingStart?: number;
            };
            if (fidEntry.processingStart) {
              this.recordMetric(
                'fid',
                fidEntry.processingStart - entry.startTime,
                { entryType: 'first-input' }
              );
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('Failed to observe FID:', error);
      }

      // 监控 CLS (Cumulative Layout Shift)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry: PerformanceEntry) => {
            if ('value' in entry) {
              clsValue += entry.value as number;
            }
          });
          this.recordMetric('cls', clsValue, { entryType: 'layout-shift' });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Failed to observe CLS:', error);
      }
    }
  }

  /**
   * 开始自定义指标监控
   */
  private startCustomMetricsMonitoring(): void {
    if (!this.config.metrics.custom) return;

    // 监控页面加载时间
    window.addEventListener('load', () => {
      const loadTime = window.performance.now();
      this.recordMetric('pageLoad', loadTime);
    });

    // 监控 DOM 内容加载时间
    document.addEventListener('DOMContentLoaded', () => {
      const domLoadTime = window.performance.now();
      this.recordMetric('domContentLoaded', domLoadTime);
    });
  }

  /**
   * 开始资源加载监控
   */
  private startResourceLoadingMonitoring(): void {
    if (!this.config.metrics.resourceLoading) return;

    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: PerformanceEntry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              this.recordMetric('resourceLoad', resourceEntry.duration, {
                name: resourceEntry.name,
                type: resourceEntry.initiatorType,
              });
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('Failed to observe resource loading:', error);
      }
    }
  }

  /**
   * 开始内存监控
   */
  private startMemoryMonitoring(): void {
    if (!this.config.metrics.memoryUsage) return;

    // 定期检查内存使用情况
    setInterval(() => {
      if ('memory' in window.performance) {
        const memory = (
          window.performance as Performance & {
            memory: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          }
        ).memory;
        const usedMemoryMB = memory.usedJSHeapSize / (1024 * 1024);
        this.recordMetric('memoryUsage', usedMemoryMB, {
          total: memory.totalJSHeapSize / (1024 * 1024),
          limit: memory.jsHeapSizeLimit / (1024 * 1024),
        });
      }
    }, 10000);
  }

  /**
   * 开始错误监控
   */
  private startErrorMonitoring(): void {
    if (!this.config.metrics.errorRate) return;

    // 监控 JavaScript 错误
    window.addEventListener('error', (event) => {
      this.recordMetric('jsError', 1, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // 监控 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.recordMetric('promiseRejection', 1, {
        reason: event.reason,
      });
    });
  }

  /**
   * 清理旧的指标数据
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5分钟

    this.metrics = this.metrics.filter(
      (metric) => now - metric.timestamp < maxAge
    );
  }

  /**
   * 上报性能指标
   */
  private async report(): Promise<void> {
    if (this.metrics.length === 0) return;

    try {
      const batch = this.metrics.splice(0, this.config.reporting.batchSize);

      const response = await fetch(this.config.reporting.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: batch,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        console.warn('Failed to report performance metrics:', response.status);
      }
    } catch (error) {
      console.error('Error reporting performance metrics:', error);
    }
  }

  /**
   * 获取性能指标摘要
   */
  getSummary(): Record<
    string,
    { count: number; avg: number; min: number; max: number }
  > {
    const summary: Record<
      string,
      { count: number; avg: number; min: number; max: number }
    > = {};

    this.metrics.forEach((metric) => {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          count: 0,
          avg: 0,
          min: Infinity,
          max: -Infinity,
        };
      }

      const stats = summary[metric.name];
      stats.count++;
      stats.min = Math.min(stats.min, metric.value);
      stats.max = Math.max(stats.max, metric.value);
      stats.avg = (stats.avg * (stats.count - 1) + metric.value) / stats.count;
    });

    return summary;
  }

  /**
   * 重置性能监控器
   */
  reset(): void {
    this.metrics = [];
    this.observers.clear();
    console.log('Performance monitor reset');
  }
}

// 创建全局性能监控器实例
export const performanceMonitor = new PerformanceMonitor();

// 导出性能监控工具函数
export const performance = {
  /**
   * 记录性能指标
   */
  recordMetric: (
    name: string,
    value: number,
    metadata?: Record<string, unknown>
  ) => {
    performanceMonitor.recordMetric(name, value, metadata);
  },

  /**
   * 添加性能观察者
   */
  addObserver: (observer: PerformanceObserver) => {
    performanceMonitor.addObserver(observer);
  },

  /**
   * 移除性能观察者
   */
  removeObserver: (observer: PerformanceObserver) => {
    performanceMonitor.removeObserver(observer);
  },

  /**
   * 开始性能监控
   */
  start: () => {
    performanceMonitor.start();
  },

  /**
   * 停止性能监控
   */
  stop: () => {
    performanceMonitor.stop();
  },

  /**
   * 获取性能摘要
   */
  getSummary: () => {
    return performanceMonitor.getSummary();
  },

  /**
   * 重置性能监控
   */
  reset: () => {
    performanceMonitor.reset();
  },
};

// 自动启动性能监控
if (PERFORMANCE_CONFIG.enabled) {
  performance.start();
}
