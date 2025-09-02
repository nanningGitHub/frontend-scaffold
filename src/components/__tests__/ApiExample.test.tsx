import React from 'react';
import { screen, fireEvent, render } from '@testing-library/react';
import ApiExample from '../ApiExample';

// Mock API 调用
const mockApiCall = jest.fn();
jest.mock('../../hooks/useApi', () => ({
  useApi: () => ({
    apiCall: mockApiCall,
    loading: false,
    error: null,
    data: null,
  }),
}));

describe('ApiExample Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders API example component', () => {
    render(<ApiExample />);

    expect(screen.getByText('API 请求示例')).toBeInTheDocument();
    expect(screen.getByText('获取用户列表')).toBeInTheDocument();
    expect(screen.getByText('创建新用户')).toBeInTheDocument();
  });

  it('renders GET request button', () => {
    render(<ApiExample />);

    const getButton = screen.getByRole('button', { name: '获取用户列表' });
    expect(getButton).toBeInTheDocument();
    expect(getButton).toHaveClass('btn', 'btn-primary');
  });

  it('renders POST request button', () => {
    render(<ApiExample />);

    const postButton = screen.getByRole('button', { name: '创建新用户' });
    expect(postButton).toBeInTheDocument();
    expect(postButton).toHaveClass('btn', 'btn-secondary');
  });

  it('renders response display area', () => {
    render(<ApiExample />);

    expect(screen.getByText('用户列表')).toBeInTheDocument();
    expect(
      screen.getByText('暂无用户数据，点击"获取用户列表"按钮加载数据')
    ).toBeInTheDocument();
  });

  it('handles GET request button click', async () => {
    render(<ApiExample />);

    const getButton = screen.getByRole('button', { name: '获取用户列表' });
    fireEvent.click(getButton);

    // 检查按钮状态变化
    expect(getButton).toHaveTextContent('请求中...');
  });

  it('handles POST request button click', async () => {
    render(<ApiExample />);

    const postButton = screen.getByRole('button', { name: '创建新用户' });
    fireEvent.click(postButton);

    // 检查按钮状态变化
    expect(postButton).toHaveTextContent('创建中...');
  });

  it('renders component without errors', () => {
    const { container } = render(<ApiExample />);

    // 检查组件是否正确渲染
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays API usage instructions', () => {
    render(<ApiExample />);

    expect(screen.getByText('API 使用说明')).toBeInTheDocument();
    expect(screen.getByText('1. 服务层定义')).toBeInTheDocument();
    expect(screen.getByText('2. 自定义 Hook')).toBeInTheDocument();
    expect(screen.getByText('3. 错误处理')).toBeInTheDocument();
  });
});
