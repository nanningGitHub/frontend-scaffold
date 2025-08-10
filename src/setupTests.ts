/* eslint-env jest */
import '@testing-library/jest-dom';

// Mock import.meta for Jest environment
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: '/api',
        VITE_AUTH_USE_COOKIES: 'false',
        VITE_CSRF_HEADER_NAME: 'X-CSRF-Token',
        VITE_CSRF_COOKIE_NAME: 'XSRF-TOKEN',
      },
    },
  },
  writable: true,
});
// Mock react-i18next to avoid ESM i18next init in tests
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
      dir: () => 'ltr',
    },
  }),
  initReactI18next: { type: '3rdParty', init: jest.fn() },
  Trans: ({ children }: any) => children,
}));

// 全局测试设置
beforeEach(() => {
  // 清理 localStorage
  localStorage.clear();

  // 清理 sessionStorage
  sessionStorage.clear();

  // 重置所有模拟
  jest.clearAllMocks();
});

// 模拟 IntersectionObserver / ResizeObserver（最小实现）
class MockObserver {
  constructor() {
    // Mock constructor
  }
  disconnect() {
    // Mock disconnect
  }
  observe() {
    // Mock observe
  }
  unobserve() {
    // Mock unobserve
  }
}
// @ts-expect-error 注入 jsdom 缺失的 API
globalThis.IntersectionObserver = MockObserver;
// @ts-expect-error 注入 jsdom 缺失的 API
globalThis.ResizeObserver = MockObserver;
