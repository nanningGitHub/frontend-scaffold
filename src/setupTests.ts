import '@testing-library/jest-dom'

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
