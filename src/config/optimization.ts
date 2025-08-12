/**
 * 代码优化配置
 * 集中管理各种代码优化策略和配置
 */

// 移除未使用的导入

// 懒加载配置
export const LAZY_LOADING_CONFIG = {
  // 是否启用懒加载
  enabled: true,

  // 懒加载阈值
  threshold: 0.1,

  // 根边距
  rootMargin: '50px',

  // 预加载距离
  preloadDistance: 100,
} as const;

// 代码分割配置
export const CODE_SPLITTING_CONFIG = {
  // 是否启用代码分割
  enabled: true,

  // 分割策略
  strategy: 'route' as 'route' | 'component' | 'vendor',

  // 最小块大小 (KB)
  minChunkSize: 10,

  // 最大块大小 (KB)
  maxChunkSize: 500,

  // 缓存组配置
  cacheGroups: {
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      chunks: 'all',
      priority: 10,
    },
    common: {
      name: 'common',
      minChunks: 2,
      chunks: 'all',
      priority: 5,
    },
  },
} as const;

// 缓存配置
export const CACHE_CONFIG = {
  // 是否启用缓存
  enabled: true,

  // 缓存策略
  strategy: 'stale-while-revalidate' as
    | 'cache-first'
    | 'network-first'
    | 'stale-while-revalidate',

  // 最大缓存条目数
  maxEntries: 100,

  // 缓存过期时间 (毫秒)
  maxAge: 24 * 60 * 60 * 1000, // 24小时

  // 缓存键前缀
  prefix: 'app-cache',

  // 版本控制
  version: '1.0.0',
} as const;

// 压缩配置
export const COMPRESSION_CONFIG = {
  // 是否启用压缩
  enabled: true,

  // 压缩算法
  algorithm: 'gzip' as 'gzip' | 'brotli' | 'deflate',

  // 压缩级别 (1-9)
  level: 6,

  // 最小文件大小 (字节)
  minSize: 1024,

  // 压缩文件类型
  fileTypes: ['.js', '.css', '.html', '.json'],
} as const;

// 图片优化配置
export const IMAGE_OPTIMIZATION_CONFIG = {
  // 是否启用图片优化
  enabled: true,

  // 图片格式
  formats: ['webp', 'avif', 'jpeg', 'png'] as const,

  // 质量设置
  quality: {
    webp: 80,
    avif: 80,
    jpeg: 85,
    png: 90,
  },

  // 响应式图片断点
  breakpoints: [320, 640, 768, 1024, 1280, 1920],

  // 懒加载配置
  lazyLoading: {
    enabled: true,
    threshold: 0.1,
    rootMargin: '50px',
  },

  // 预加载配置
  preload: {
    enabled: true,
    criticalImages: ['/logo.png', '/hero.jpg'],
  },
} as const;

// 字体优化配置
export const FONT_OPTIMIZATION_CONFIG = {
  // 是否启用字体优化
  enabled: true,

  // 字体显示策略
  display: 'swap' as 'auto' | 'block' | 'swap' | 'fallback' | 'optional',

  // 字体预加载
  preload: {
    enabled: true,
    fonts: [
      { family: 'Inter', weight: [400, 500, 600, 700] },
      { family: 'Roboto', weight: [300, 400, 500] },
    ],
  },

  // 字体子集化
  subsetting: {
    enabled: true,
    characters: 'latin',
    features: ['liga', 'kern'],
  },
} as const;

// 预加载配置
export const PRELOADING_CONFIG = {
  // 是否启用预加载
  enabled: true,

  // 关键路径预加载
  criticalPaths: ['/dashboard', '/profile', '/settings'],

  // 预加载延迟 (毫秒)
  delay: 1000,

  // 预加载策略
  strategy: 'prefetch' as 'prefetch' | 'preload' | 'prerender',

  // 预加载资源
  resources: ['/api/user', '/api/settings', '/assets/critical.css'],
} as const;

// 监控配置
export const MONITORING_CONFIG = {
  // 是否启用监控
  enabled: true,

  // 采样率 (0-1)
  sampleRate: 0.1,

  // 监控间隔 (毫秒)
  interval: 5000,

  // 监控指标
  metrics: {
    // 性能指标
    performance: true,

    // 错误监控
    errors: true,

    // 用户行为
    userBehavior: true,

    // 资源加载
    resourceLoading: true,

    // 内存使用
    memoryUsage: true,
  },

  // 上报配置
  reporting: {
    // 上报地址
    endpoint: '/api/monitoring',

    // 上报间隔 (毫秒)
    interval: 30000,

    // 批量上报大小
    batchSize: 10,

    // 是否实时上报
    realTime: false,
  },
} as const;

// 优化管理器类
export class OptimizationManager {
  private static instance: OptimizationManager;
  private config: {
    lazyLoading: typeof LAZY_LOADING_CONFIG;
    codeSplitting: typeof CODE_SPLITTING_CONFIG;
    cache: typeof CACHE_CONFIG;
    compression: typeof COMPRESSION_CONFIG;
    imageOptimization: typeof IMAGE_OPTIMIZATION_CONFIG;
    fontOptimization: typeof FONT_OPTIMIZATION_CONFIG;
    preloading: typeof PRELOADING_CONFIG;
    monitoring: typeof MONITORING_CONFIG;
  };

  private constructor() {
    this.config = {
      lazyLoading: LAZY_LOADING_CONFIG,
      codeSplitting: CODE_SPLITTING_CONFIG,
      cache: CACHE_CONFIG,
      compression: COMPRESSION_CONFIG,
      imageOptimization: IMAGE_OPTIMIZATION_CONFIG,
      fontOptimization: FONT_OPTIMIZATION_CONFIG,
      preloading: PRELOADING_CONFIG,
      monitoring: MONITORING_CONFIG,
    };
  }

  static getInstance(): OptimizationManager {
    if (!OptimizationManager.instance) {
      OptimizationManager.instance = new OptimizationManager();
    }
    return OptimizationManager.instance;
  }

  /**
   * 获取配置
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(
    section: keyof typeof this.config,
    updates: Partial<(typeof this.config)[typeof section]>
  ): void {
    this.config[section] = { ...this.config[section], ...updates };
  }

  /**
   * 应用优化策略
   */
  applyOptimizations(): void {
    if (this.config.lazyLoading.enabled) {
      this.setupLazyLoading();
    }

    if (this.config.preloading.enabled) {
      this.setupPreloading();
    }

    if (this.config.imageOptimization.enabled) {
      this.setupImageOptimization();
    }

    if (this.config.fontOptimization.enabled) {
      this.setupFontOptimization();
    }

    if (this.config.monitoring.enabled) {
      this.setupMonitoring();
    }
  }

  /**
   * 设置懒加载
   */
  private setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadLazyContent(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: this.config.lazyLoading.threshold,
          rootMargin: this.config.lazyLoading.rootMargin,
        }
      );

      // 观察所有懒加载元素
      document.querySelectorAll('[data-lazy]').forEach((element) => {
        observer.observe(element);
      });
    }
  }

  /**
   * 加载懒加载内容
   */
  private loadLazyContent(element: Element): void {
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

      this.config.preloading.resources.forEach((resource) => {
        this.preloadResource(resource);
      });
    }, this.config.preloading.delay);
  }

  /**
   * 预加载路由
   */
  private preloadRoute(path: string): void {
    const link = document.createElement('link');
    link.rel = this.config.preloading.strategy;
    link.href = path;
    document.head.appendChild(link);
  }

  /**
   * 预加载资源
   */
  private preloadResource(resource: string): void {
    if (resource.endsWith('.css')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'style';
      document.head.appendChild(link);
    } else if (resource.endsWith('.js')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = 'script';
      document.head.appendChild(link);
    }
  }

  /**
   * 设置图片优化
   */
  private setupImageOptimization(): void {
    // 设置响应式图片
    document.querySelectorAll('img[data-srcset]').forEach((img) => {
      if (img instanceof HTMLImageElement) {
        const srcset = img.getAttribute('data-srcset');
        if (srcset) {
          img.srcset = srcset;
          img.removeAttribute('data-srcset');
        }
      }
    });

    // 设置懒加载
    if (this.config.imageOptimization.lazyLoading.enabled) {
      document.querySelectorAll('img[data-src]').forEach((img) => {
        img.setAttribute('data-lazy', 'true');
      });
    }
  }

  /**
   * 设置字体优化
   */
  private setupFontOptimization(): void {
    // 设置字体显示策略
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      if (
        link.href.includes('fonts.googleapis.com') ||
        link.href.includes('fonts.gstatic.com')
      ) {
        link.setAttribute('font-display', this.config.fontOptimization.display);
      }
    });

    // 预加载关键字体
    if (this.config.fontOptimization.preload.enabled) {
      this.config.fontOptimization.preload.fonts.forEach((font) => {
        font.weight.forEach((weight) => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = `https://fonts.googleapis.com/css2?family=${font.family}:wght@${weight}&display=swap`;
          link.as = 'style';
          document.head.appendChild(link);
        });
      });
    }
  }

  /**
   * 设置监控
   */
  private setupMonitoring(): void {
    // 监控页面性能
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.recordPerformanceMetric('pageLoad', entry.duration);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    }

    // 监控资源加载
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.recordPerformanceMetric('resourceLoad', entry.duration);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * 记录性能指标
   */
  private recordPerformanceMetric(name: string, value: number): void {
    if (Math.random() <= this.config.monitoring.sampleRate) {
      // 这里可以集成具体的监控系统
      console.log(`Performance metric: ${name} = ${value}ms`);
    }
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    // 清理预加载的链接
    document
      .querySelectorAll('link[rel="preload"], link[rel="prefetch"]')
      .forEach((link) => {
        link.remove();
      });
  }
}

// 导出默认实例
export const optimizationManager = OptimizationManager.getInstance();

// 导出优化工具函数
export const optimization = {
  /**
   * 防抖函数
   */
  debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * 节流函数
   */
  throttle<T extends (...args: unknown[]) => unknown>(
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
  },

  /**
   * 异步加载脚本
   */
  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  /**
   * 异步加载样式
   */
  loadStyle(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = reject;
      document.head.appendChild(link);
    });
  },

  /**
   * 预加载图片
   */
  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },

  /**
   * 测量函数执行时间
   */
  measureTime<T>(fn: () => T, label: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`${label} took ${end - start}ms`);
    }

    return result;
  },

  /**
   * 异步测量函数执行时间
   */
  async measureTimeAsync<T>(fn: () => Promise<T>, label: string): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`${label} took ${end - start}ms`);
    }

    return result;
  },
};

// 自动应用优化策略
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    optimizationManager.applyOptimizations();
  });
}
