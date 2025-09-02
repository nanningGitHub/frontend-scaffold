/**
 * 性能优化工具
 *
 * 功能：
 * 1. 代码分割和懒加载
 * 2. 资源预加载
 * 3. 缓存策略
 * 4. 性能监控和分析
 */

import React from 'react';

// 代码分割工具
export const lazyLoadComponent = <T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(importFunc);
};

// 资源预加载
export class ResourcePreloader {
  private preloadedResources = new Set<string>();

  async preloadImage(src: string): Promise<void> {
    if (this.preloadedResources.has(src)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.preloadedResources.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  async preloadScript(src: string): Promise<void> {
    if (this.preloadedResources.has(src)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = src;
      link.onload = () => {
        this.preloadedResources.add(src);
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  async preloadStylesheet(href: string): Promise<void> {
    if (this.preloadedResources.has(href)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = () => {
        this.preloadedResources.add(href);
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
}

// 缓存策略
export class CacheManager {
  private cache = new Map<
    string,
    { data: unknown; timestamp: number; ttl: number }
  >();

  set(key: string, data: unknown, ttl: number = 300000): void {
    // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): unknown | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// 防抖工具
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流工具
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 性能监控
export class PerformanceMonitor {
  private metrics: Array<{
    name: string;
    value: number;
    timestamp: number;
  }> = [];

  measureFunction<T extends (...args: unknown[]) => unknown>(
    name: string,
    func: T
  ): T {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = func(...args);
      const end = performance.now();

      this.recordMetric(name, end - start);
      return result;
    }) as T;
  }

  async measureAsyncFunction<
    T extends (...args: unknown[]) => Promise<unknown>
  >(name: string, func: T): Promise<ReturnType<T>> {
    const start = performance.now();
    const result = await func();
    const end = performance.now();

    this.recordMetric(name, end - start);
    return result;
  }

  recordMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    });

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  getMetrics(): Array<{ name: string; value: number; timestamp: number }> {
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const metricValues = this.metrics
      .filter((m) => m.name === name)
      .map((m) => m.value);

    if (metricValues.length === 0) {
      return 0;
    }

    return (
      metricValues.reduce((sum, value) => sum + value, 0) / metricValues.length
    );
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

// 内存使用监控
export const getMemoryUsage = (): {
  used: number;
  total: number;
  percentage: number;
} => {
  if ('memory' in performance) {
    const memory = (
      performance as {
        memory: { usedJSHeapSize: number; totalJSHeapSize: number };
      }
    ).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }

  return { used: 0, total: 0, percentage: 0 };
};

// 网络状态监控
export const getNetworkInfo = (): {
  effectiveType: string;
  downlink: number;
  rtt: number;
} => {
  if ('connection' in navigator) {
    const connection = (
      navigator as {
        connection: { effectiveType?: string; downlink?: number; rtt?: number };
      }
    ).connection;
    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0,
    };
  }

  return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
};

// 图片懒加载
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: Record<string, unknown> = {}
): IntersectionObserver => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
};

// 虚拟滚动工具
export const calculateVirtualScrollItems = (
  containerHeight: number,
  itemHeight: number,
  scrollTop: number,
  totalItems: number
): {
  startIndex: number;
  endIndex: number;
  offsetY: number;
} => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, totalItems);
  const offsetY = startIndex * itemHeight;

  return { startIndex, endIndex, offsetY };
};

// 导出单例实例
export const resourcePreloader = new ResourcePreloader();
export const cacheManager = new CacheManager();
export const performanceMonitor = new PerformanceMonitor();
