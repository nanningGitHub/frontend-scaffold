import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// 测试包装器接口
interface TestWrapperProps {
  children: React.ReactNode;
}

// 默认测试包装器
const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// 自定义渲染选项
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  route?: string;
}

// 自定义渲染函数
function customRender(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { wrapper: CustomWrapper, route, ...renderOptions } = options;

  // 如果提供了自定义包装器，使用它
  const Wrapper = CustomWrapper || TestWrapper;

  // 如果提供了路由，设置初始路由
  if (route) {
    window.history.pushState({}, 'Test page', route);
  }

  return render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
}

// 重新导出所有 testing-library 函数
export * from '@testing-library/react';

// 导出自定义渲染函数
export { customRender as render };

// 导出测试包装器
export { TestWrapper };

// 导出常用测试工具
export const renderWithRouter = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  return customRender(ui, options);
};

export const renderWithProviders = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  return customRender(ui, options);
};
