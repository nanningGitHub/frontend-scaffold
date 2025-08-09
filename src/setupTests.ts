/* eslint-env jest */
import '@testing-library/jest-dom';
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  observe() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  unobserve() {}
}
// @ts-expect-error 注入 jsdom 缺失的 API
globalThis.IntersectionObserver = MockObserver;
// @ts-expect-error 注入 jsdom 缺失的 API
globalThis.ResizeObserver = MockObserver;
