/* eslint-env jest */
import '@testing-library/jest-dom';

// 全局测试环境设置
beforeEach(() => {
  // 清理 DOM
  document.body.innerHTML = '';

  // 清理 localStorage 和 sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // 清理所有定时器
  jest.clearAllTimers();

  // 重置所有 mock
  jest.clearAllMocks();
});

// 全局测试后清理
afterEach(() => {
  // 清理所有定时器
  jest.clearAllTimers();
});

// 全局测试环境设置
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});
