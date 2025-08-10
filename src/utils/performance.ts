import { PERFORMANCE_CONFIG } from '../constants';
import { logger } from './logger';

/**
 * 性能监控工具
 *
 * 功能：
 * 1. 监控组件渲染性能
 * 2. 监控 API 请求性能
 * 3. 监控用户交互性能
 * 4. 性能数据收集和分析
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private observers: Set<(metric: PerformanceMetric) => void> = new Set();

  /**
   * 开始性能监控
   */
  startTimer(name: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.metrics.set(name, metric);
    logger.debug('Performance timer started', { name, metadata });
  }

  /**
   * 结束性能监控
   */
  endTimer(name: string): PerformanceMetric | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      logger.warn('Performance timer not found', { name });
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // 记录性能数据
    logger.debug('Performance timer ended', {
      name,
      duration: `${metric.duration.toFixed(2)}ms`,
      metadata: metric.metadata,
    });

    // 性能警告
    if (metric.duration > PERFORMANCE_CONFIG.SLOW_THRESHOLD) {
      logger.warn('Slow performance detected', {
        name,
        duration: `${metric.duration.toFixed(2)}ms`,
        threshold: `${PERFORMANCE_CONFIG.SLOW_THRESHOLD}ms`,
      });
    }

    // 通知观察者
    this.notifyObservers(metric);

    this.metrics.delete(name);
    return metric;
  }

  /**
   * 测量函数执行时间
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startTimer(name, metadata);

    try {
      const result = await fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  /**
   * 测量同步函数执行时间
   */
  measureSync<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    this.startTimer(name, metadata);

    try {
      const result = fn();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  /**
   * 添加性能观察者
   */
  addObserver(observer: (metric: PerformanceMetric) => void): void {
    this.observers.add(observer);
  }

  /**
   * 移除性能观察者
   */
  removeObserver(observer: (_metric: PerformanceMetric) => void): void {
    this.observers.delete(observer);
  }

  /**
   * 通知所有观察者
   */
  private notifyObservers(metric: PerformanceMetric): void {
    this.observers.forEach((observer) => {
      try {
        observer(metric);
      } catch (error) {
        logger.error('Performance observer error', error);
      }
    });
  }

  /**
   * 获取所有性能指标
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * 清除所有性能指标
   */
  clearMetrics(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * React 组件性能监控 Hook
 */
export function usePerformanceMonitor(componentName: string) {
  const startRender = () => {
    performanceMonitor.startTimer(`${componentName}-render`);
  };

  const endRender = () => {
    performanceMonitor.endTimer(`${componentName}-render`);
  };

  const measureAsync = <T>(name: string, fn: () => Promise<T>) => {
    return performanceMonitor.measureAsync(`${componentName}-${name}`, fn);
  };

  const measureSync = <T>(name: string, fn: () => T) => {
    return performanceMonitor.measureSync(`${componentName}-${name}`, fn);
  };

  return {
    startRender,
    endRender,
    measureAsync,
    measureSync,
  };
}

/**
 * 装饰器：自动监控函数性能
 */
export function measurePerformance(name?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const methodName = name || `${target.constructor.name}.${propertyKey}`;

      if (originalMethod.constructor.name === 'AsyncFunction') {
        return performanceMonitor.measureAsync(methodName, () =>
          originalMethod.apply(this, args)
        );
      } else {
        return performanceMonitor.measureSync(methodName, () =>
          originalMethod.apply(this, args)
        );
      }
    };

    return descriptor;
  };
}
