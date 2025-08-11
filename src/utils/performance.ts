// import { PERFORMANCE_CONFIG } from '../constants';
// import { logger } from './logger';

// 定义 IntersectionObserverInit 类型（如果不存在）
interface IntersectionObserverInit {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * 性能优化工具函数
 */

/**
 * 防抖函数 - 延迟执行，避免频繁调用
 * @param func 要执行的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * 节流函数 - 限制函数执行频率
 * @param func 要执行的函数
 * @param limit 时间限制（毫秒）
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 懒加载工具 - 使用 Intersection Observer API
 * @param callback 当元素进入视口时执行的回调
 * @param options Intersection Observer 选项
 */
export function createLazyLoader(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, defaultOptions);
}

/**
 * 虚拟滚动工具 - 计算可见项范围
 * @param totalItems 总项目数
 * @param itemHeight 每项高度
 * @param containerHeight 容器高度
 * @param scrollTop 滚动位置
 * @param overscan 预渲染项数
 */
export function calculateVisibleRange(
  totalItems: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number,
  overscan = 5
) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  return {
    startIndex,
    endIndex,
    visibleCount: endIndex - startIndex + 1,
    offsetY: startIndex * itemHeight,
  };
}

/**
 * 内存泄漏检测工具
 * @param componentName 组件名称
 * @param cleanup 清理函数
 */
export function createMemoryLeakDetector(
  componentName: string,
  cleanup: () => void
) {
  const startTime = performance.now();
  const startMemory = performance.memory?.usedJSHeapSize || 0;

  return {
    logMount: () => {
      console.log(
        `[${componentName}] 组件挂载 - 内存使用: ${(
          startMemory /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
    },
    logUnmount: () => {
      const endTime = performance.now();
      const endMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryDiff = endMemory - startMemory;
      const duration = endTime - startTime;

      console.log(
        `[${componentName}] 组件卸载 - 生命周期: ${duration.toFixed(
          2
        )}ms, 内存变化: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB`
      );

      // 执行清理
      cleanup();
    },
  };
}

/**
 * 性能监控工具
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();

  /**
   * 开始计时
   */
  startMeasure(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * 结束计时并记录
   */
  endMeasure(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`性能标记 "${name}" 未找到`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measures.set(name, duration);
    this.marks.delete(name);

    return duration;
  }

  /**
   * 获取性能指标
   */
  getMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  /**
   * 清除所有性能数据
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }

  /**
   * 输出性能报告
   */
  generateReport(): void {
    const measures = this.getMeasures();
    if (Object.keys(measures).length === 0) {
      console.log('暂无性能数据');
      return;
    }

    console.group('🚀 性能报告');
    Object.entries(measures).forEach(([name, duration]) => {
      console.log(`${name}: ${duration.toFixed(2)}ms`);
    });
    console.groupEnd();
  }
}

/**
 * 创建全局性能监控实例
 */
export const globalPerformanceMonitor = new PerformanceMonitor();

/**
 * 性能装饰器 - 用于类方法
 */
export function measurePerformance(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const startTime = performance.now();
    const result = originalMethod.apply(this, args);
    const duration = performance.now() - startTime;

    console.log(
      `[${target.constructor.name}] ${propertyKey} 执行时间: ${duration.toFixed(
        2
      )}ms`
    );

    return result;
  };

  return descriptor;
}

/**
 * 异步性能监控
 */
export async function measureAsyncPerformance<T>(
  name: string,
  asyncFn: () => Promise<T>
): Promise<T> {
  globalPerformanceMonitor.startMeasure(name);

  try {
    const result = await asyncFn();
    return result;
  } finally {
    globalPerformanceMonitor.endMeasure(name);
  }
}

/**
 * 批量操作优化 - 分批处理大量数据
 * @param items 要处理的项目
 * @param batchSize 批次大小
 * @param processor 处理函数
 * @param delay 批次间延迟
 */
export async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R> | R,
  delay = 0
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);

    if (delay > 0 && i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return results;
}

/**
 * 缓存工具 - 带过期时间的缓存
 */
export class Cache<T> {
  private cache = new Map<string, { value: T; expiry: number }>();

  constructor(private defaultTTL = 5 * 60 * 1000) {} // 默认5分钟

  set(key: string, value: T, ttl = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}
