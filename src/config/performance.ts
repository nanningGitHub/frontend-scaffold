/**
 * 性能优化配置
 * 集中管理各种性能优化策略和配置
 */

// 定义 IntersectionObserverInit 类型（如果不存在）
interface IntersectionObserverInit {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export interface PerformanceConfig {
  // 懒加载配置
  lazyLoading: {
    enabled: boolean;
    threshold: number;
    rootMargin: string;
  };
  
  // 预加载配置
  preloading: {
    enabled: boolean;
    criticalPaths: string[];
    delay: number;
  };
  
  // 缓存配置
  caching: {
    enabled: boolean;
    maxAge: number;
    maxSize: number;
  };
  
  // 压缩配置
  compression: {
    enabled: boolean;
    algorithm: 'gzip' | 'brotli';
    level: number;
  };
  
  // 监控配置
  monitoring: {
    enabled: boolean;
    sampleRate: number;
    reportInterval: number;
  };
  
  // 资源优化配置
  resources: {
    imageOptimization: boolean;
    fontDisplay: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    criticalCSS: boolean;
  };
}

/**
 * 默认性能配置
 */
export const defaultPerformanceConfig: PerformanceConfig = {
  lazyLoading: {
    enabled: true,
    threshold: 0.1,
    rootMargin: '50px',
  },
  
  preloading: {
    enabled: true,
    criticalPaths: ['/dashboard', '/profile'],
    delay: 1000,
  },
  
  caching: {
    enabled: true,
    maxAge: 24 * 60 * 60 * 1000, // 24小时
    maxSize: 100, // 最大缓存条目数
  },
  
  compression: {
    enabled: true,
    algorithm: 'gzip',
    level: 6,
  },
  
  monitoring: {
    enabled: true,
    sampleRate: 0.1, // 10%采样率
    reportInterval: 60000, // 1分钟
  },
  
  resources: {
    imageOptimization: true,
    fontDisplay: 'swap',
    criticalCSS: true,
  },
};

/**
 * 性能优化管理器
 */
export class PerformanceManager {
  private static instance: PerformanceManager;
  private config: PerformanceConfig;
  private observers: Map<string, IntersectionObserver> = new Map();
  private performanceEntries: PerformanceEntry[] = [];
  private isMonitoring = false;

  private constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...defaultPerformanceConfig, ...config };
    this.init();
  }

  static getInstance(config?: Partial<PerformanceConfig>): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager(config);
    }
    return PerformanceManager.instance;
  }

  /**
   * 初始化性能管理器
   */
  private init(): void {
    if (this.config.monitoring.enabled) {
      this.startMonitoring();
    }
    
    if (this.config.lazyLoading.enabled) {
      this.setupLazyLoading();
    }
    
    if (this.config.preloading.enabled) {
      this.setupPreloading();
    }
  }

  /**
   * 设置懒加载
   */
  private setupLazyLoading(): void {
    const options: IntersectionObserverInit = {
      threshold: this.config.lazyLoading.threshold,
      rootMargin: this.config.lazyLoading.rootMargin,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          this.loadLazyContent(target);
          observer.unobserve(target);
        }
      });
    }, options);

    this.observers.set('lazy', observer);
  }

  /**
   * 加载懒加载内容
   */
  private loadLazyContent(element: HTMLElement): void {
    const src = element.getAttribute('data-src');
    const srcset = element.getAttribute('data-srcset');
    
    if (src && element instanceof HTMLImageElement) {
      element.src = src;
      element.removeAttribute('data-src');
    }
    
    if (srcset && element instanceof HTMLImageElement) {
      element.srcset = srcset;
      element.removeAttribute('data-srcset');
    }
    
    element.classList.remove('lazy');
    element.classList.add('loaded');
  }

  /**
   * 设置预加载
   */
  private setupPreloading(): void {
    setTimeout(() => {
      this.config.preloading.criticalPaths.forEach((path) => {
        this.preloadRoute(path);
      });
    }, this.config.preloading.delay);
  }

  /**
   * 预加载路由
   */
  private preloadRoute(path: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  }

  /**
   * 开始性能监控
   */
  private startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // 监控页面加载性能
    this.observePageLoad();
    
    // 监控资源加载性能
    this.observeResourceTiming();
    
    // 监控用户交互性能
    this.observeUserInteractions();
    
    // 定期报告性能数据
    setInterval(() => {
      this.reportPerformance();
    }, this.config.monitoring.reportInterval);
  }

  /**
   * 监控页面加载性能
   */
  private observePageLoad(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.performanceEntries.push(entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  /**
   * 监控资源加载性能
   */
  private observeResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.performanceEntries.push(entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * 监控用户交互性能
   */
  private observeUserInteractions(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'interaction') {
            this.performanceEntries.push(entry);
          }
        });
      });
      
      observer.observe({ entryTypes: ['interaction'] });
    }
  }

  /**
   * 报告性能数据
   */
  private reportPerformance(): void {
    if (Math.random() > this.config.monitoring.sampleRate) return;
    
    const metrics = this.calculateMetrics();
    
    // 发送到监控系统
    this.sendMetrics(metrics);
    
    // 清理旧数据
    this.cleanupOldEntries();
  }

  /**
   * 计算性能指标
   */
  private calculateMetrics() {
    const navigationEntries = this.performanceEntries.filter(
      (entry) => entry.entryType === 'navigation'
    );
    
    const resourceEntries = this.performanceEntries.filter(
      (entry) => entry.entryType === 'resource'
    );
    
    return {
      pageLoad: navigationEntries.length > 0 ? {
        dns: this.getAverageTime(navigationEntries, 'domainLookupEnd', 'domainLookupStart'),
        tcp: this.getAverageTime(navigationEntries, 'connectEnd', 'connectStart'),
        ttfb: this.getAverageTime(navigationEntries, 'responseStart', 'requestStart'),
        domContentLoaded: this.getAverageTime(navigationEntries, 'domContentLoadedEventEnd', 'domContentLoadedEventStart'),
        load: this.getAverageTime(navigationEntries, 'loadEventEnd', 'loadEventStart'),
      } : null,
      
      resources: resourceEntries.length > 0 ? {
        count: resourceEntries.length,
        totalSize: this.calculateTotalSize(resourceEntries),
        averageLoadTime: this.getAverageTime(resourceEntries, 'responseEnd', 'fetchStart'),
      } : null,
      
      timestamp: Date.now(),
    };
  }

  /**
   * 计算平均时间
   */
  private getAverageTime(entries: PerformanceEntry[], endKey: string, startKey: string): number {
    const times = entries
      .map((entry) => {
        const end = (entry as any)[endKey];
        const start = (entry as any)[startKey];
        return end && start ? end - start : 0;
      })
      .filter((time) => time > 0);
    
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  /**
   * 计算总大小
   */
  private calculateTotalSize(entries: PerformanceEntry[]): number {
    return entries
      .map((entry) => (entry as any).transferSize || 0)
      .reduce((total, size) => total + size, 0);
  }

  /**
   * 发送性能指标
   */
  private sendMetrics(metrics: any): void {
    // 这里可以集成具体的监控系统
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metrics:', metrics);
    }
    
    // 发送到分析服务
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metrics', metrics);
    }
  }

  /**
   * 清理旧的性能条目
   */
  private cleanupOldEntries(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    this.performanceEntries = this.performanceEntries.filter(
      (entry) => entry.startTime > oneHourAgo
    );
  }

  /**
   * 获取性能配置
   */
  getConfig(): PerformanceConfig {
    return { ...this.config };
  }

  /**
   * 更新性能配置
   */
  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.init();
  }

  /**
   * 手动触发性能报告
   */
  forceReport(): void {
    this.reportPerformance();
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.performanceEntries = [];
    this.isMonitoring = false;
  }
}

/**
 * 性能优化工具函数
 */

/**
 * 防抖函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 异步加载脚本
 */
export function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * 异步加载样式
 */
export function loadStyle(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

/**
 * 预加载图片
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 测量函数执行时间
 */
export function measureTime<T>(fn: () => T, label: string): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${label} took ${end - start}ms`);
  }
  
  return result;
}

/**
 * 异步测量函数执行时间
 */
export async function measureTimeAsync<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${label} took ${end - start}ms`);
  }
  
  return result;
}

// 导出默认实例
export const performanceManager = PerformanceManager.getInstance();
