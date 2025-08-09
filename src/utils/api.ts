import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { API_CONFIG, STORAGE_KEYS, AUTH_SECURITY } from '../constants';
import { logger } from './logger';

/**
 * API 工具模块
 *
 * 功能：
 * 1. 创建统一的 axios 实例
 * 2. 配置请求和响应拦截器
 * 3. 处理认证和错误
 * 4. 提供常用的请求方法
 * 5. 请求重试机制
 * 6. 性能监控
 *
 * 特性：
 * - 统一的 baseURL 配置
 * - 自动添加认证 token
 * - 统一的错误处理
 * - 请求超时设置
 * - 请求重试
 * - 性能监控
 */

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: AUTH_SECURITY.USE_COOKIES,
});

/**
 * 请求拦截器
 * 在请求发送前自动执行
 */
function getAuthToken(): string | null {
  try {
    // 优先从统一键读取
    const tokenFromKey = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (tokenFromKey) return tokenFromKey;

    // 兼容 Zustand 持久化的 auth-storage
    const persisted = localStorage.getItem('auth-storage');
    if (persisted) {
      const parsed = JSON.parse(persisted);
      if (parsed?.state?.token) return parsed.state.token;
      if (parsed?.token) return parsed.token;
    }

    return null;
  } catch (e) {
    logger.warn('Read token from storage failed', e);
    return null;
  }
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 记录请求开始时间
    const startTime = Date.now();
    (config as any).startTime = startTime;

    // 从 localStorage 获取认证 token
    // Cookie 会话模式下不加 Authorization；否则按 Bearer 添加
    if (!AUTH_SECURITY.USE_COOKIES) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // CSRF: 从 Cookie 读取并设置自定义头
    if (AUTH_SECURITY.USE_COOKIES) {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${AUTH_SECURITY.CSRF_COOKIE_NAME}=`))
        ?.split('=')[1];
      if (csrfToken) {
        (config.headers as any)[AUTH_SECURITY.CSRF_HEADER_NAME] =
          decodeURIComponent(csrfToken);
      }
    }

    // 记录请求日志
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
    });

    return config;
  },
  (error) => {
    logger.error('Request Error', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 在响应返回后自动执行
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 计算请求耗时
    const startTime = (response.config as any).startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    // 记录响应日志
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
      duration: `${duration}ms`,
    });

    // 性能监控
    if (duration > 3000) {
      logger.warn('Slow API Request', {
        url: response.config.url,
        duration: `${duration}ms`,
      });
    }

    // 直接返回响应数据，简化使用
    return response.data;
  },
  async (error) => {
    // 计算请求耗时
    const startTime = (error.config as any)?.startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    // 记录错误日志
    logger.error('API Error', {
      status: error.response?.status,
      url: error.config?.url,
      duration: `${duration}ms`,
      error: error.message,
    });

    // 401 未授权：尝试刷新令牌（非 Cookie 模式且未重试过刷新）
    if (error.response?.status === 401) {
      const originalConfig: any = error.config || {};
      const isCookieMode = AUTH_SECURITY.USE_COOKIES;
      const hasTriedRefresh = originalConfig.__triedRefresh === true;

      if (!isCookieMode && !hasTriedRefresh) {
        originalConfig.__triedRefresh = true;
        try {
          const currentToken = getAuthToken();
          if (currentToken) {
            const refreshResp = await api.post('auth/refresh', undefined, {
              headers: { Authorization: `Bearer ${currentToken}` },
            });
            const newToken = (refreshResp as any)?.token;
            if (newToken) {
              try {
                localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
              } catch (storageError) {
                logger.warn('Persist refreshed token failed', storageError);
              }
              originalConfig.headers = originalConfig.headers || {};
              originalConfig.headers.Authorization = `Bearer ${newToken}`;
              return api(originalConfig);
            }
          }
        } catch (refreshError) {
          logger.warn('Token refresh failed', refreshError);
        }
      }

      // 刷新失败或 Cookie 模式：清理并跳登录
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('token');
      } catch (cleanupError) {
        logger.warn('Cleanup auth storage failed', cleanupError);
      }
      window.location.replace('/login');
    }

    // 简单重试：网络错误/超时/5xx，最多 RETRY_TIMES（指数退避）
    const config: any = error.config || {};
    const shouldRetry =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      (error.response && error.response.status >= 500);
    if (shouldRetry && API_CONFIG.RETRY_TIMES > 0) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < API_CONFIG.RETRY_TIMES) {
        config.__retryCount += 1;
        const delay = API_CONFIG.RETRY_DELAY * config.__retryCount;
        logger.warn('Retrying API request', {
          url: config.url,
          attempt: config.__retryCount,
          delay,
        });
        return new Promise((resolve) =>
          setTimeout(() => resolve(api(config)), delay)
        );
      }
    }

    // 其他错误直接抛出
    return Promise.reject(error);
  }
);

/**
 * 通用请求方法
 */
export const request = {
  // GET 请求
  get: <T = any>(url: string, params?: any): Promise<T> => {
    return api.get(url, { params });
  },

  // POST 请求
  post: <T = any>(url: string, data?: any): Promise<T> => {
    return api.post(url, data);
  },

  // PUT 请求
  put: <T = any>(url: string, data?: any): Promise<T> => {
    return api.put(url, data);
  },

  // DELETE 请求
  delete: <T = any>(url: string): Promise<T> => {
    return api.delete(url);
  },

  // PATCH 请求
  patch: <T = any>(url: string, data?: any): Promise<T> => {
    return api.patch(url, data);
  },
};

export default api;
