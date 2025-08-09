import '@testing-library/jest-dom'
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
}))

// 全局测试设置
// @ts-ignore
beforeEach(() => {
  // 清理 localStorage
  localStorage.clear()
  
  // 清理 sessionStorage
  sessionStorage.clear()
  
  // 重置所有模拟
  // @ts-ignore
  jest.clearAllMocks()
})

// 模拟 IntersectionObserver
// @ts-ignore
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// 模拟 ResizeObserver
// @ts-ignore
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
