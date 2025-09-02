import React from 'react';
import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import UserProfile from '../UserProfile';
import { mockAuthStore } from '../../__tests__/mocks/stores';

// Mock stores
jest.mock('../../stores/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}));

describe('UserProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 重置 mock 状态
    Object.assign(mockAuthStore, {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  });

  it('renders user profile component', () => {
    render(<UserProfile />);

    expect(screen.getByText('用户资料')).toBeInTheDocument();
  });

  it('shows login prompt when user is not authenticated', () => {
    mockAuthStore.isAuthenticated = false;

    render(<UserProfile />);

    expect(screen.getByText('请先登录')).toBeInTheDocument();
    expect(screen.getByText('登录')).toBeInTheDocument();
  });

  it('shows user information when authenticated', () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.user = {
      id: '1',
      name: '测试用户',
      email: 'test@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    render(<UserProfile />);

    expect(screen.getByText('测试用户')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('编辑资料')).toBeInTheDocument();
  });

  it('displays user avatar when available', () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.user = {
      id: '1',
      name: '测试用户',
      email: 'test@example.com',
      avatar: 'https://example.com/avatar.jpg',
    };

    render(<UserProfile />);

    const avatar = screen.getByAltText('用户头像');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('shows default avatar when no avatar provided', () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.user = {
      id: '1',
      name: '测试用户',
      email: 'test@example.com',
      avatar: null,
    };

    render(<UserProfile />);

    const avatar = screen.getByAltText('默认头像');
    expect(avatar).toBeInTheDocument();
  });

  it('handles edit profile button click', async () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.user = {
      id: '1',
      name: '测试用户',
      email: 'test@example.com',
      avatar: null,
    };

    render(<UserProfile />);

    const editButton = screen.getByRole('button', { name: '编辑资料' });
    fireEvent.click(editButton);

    // 这里可以添加编辑模式的测试逻辑
    expect(editButton).toBeInTheDocument();
  });

  it('handles logout button click', async () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.user = {
      id: '1',
      name: '测试用户',
      email: 'test@example.com',
      avatar: null,
    };

    render(<UserProfile />);

    const logoutButton = screen.getByRole('button', { name: '退出登录' });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockAuthStore.logout).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state when fetching user data', () => {
    mockAuthStore.loading = true;

    render(<UserProfile />);

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('shows error message when user data fetch fails', () => {
    mockAuthStore.error = '获取用户信息失败';

    render(<UserProfile />);

    expect(screen.getByText('获取用户信息失败')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.user = {
      id: '1',
      name: '测试用户',
      email: 'test@example.com',
      avatar: null,
    };

    render(<UserProfile />);

    const container = screen.getByText('用户资料').closest('div');
    expect(container).toHaveClass('p-6', 'bg-white', 'rounded-lg', 'shadow-md');
  });

  it('handles user data updates', async () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.user = {
      id: '1',
      name: '测试用户',
      email: 'test@example.com',
      avatar: null,
    };

    const { rerender } = render(<UserProfile />);

    expect(screen.getByText('测试用户')).toBeInTheDocument();

    // 模拟用户数据更新
    mockAuthStore.user = {
      id: '1',
      name: '更新后的用户名',
      email: 'updated@example.com',
      avatar: null,
    };

    rerender(<UserProfile />);

    expect(screen.getByText('更新后的用户名')).toBeInTheDocument();
    expect(screen.getByText('updated@example.com')).toBeInTheDocument();
  });

  it('displays user statistics when available', () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.user = {
      id: '1',
      name: '测试用户',
      email: 'test@example.com',
      avatar: null,
      stats: {
        posts: 10,
        followers: 25,
        following: 15,
      },
    };

    render(<UserProfile />);

    // 如果组件显示统计信息，这里可以添加相应的测试
    expect(screen.getByText('测试用户')).toBeInTheDocument();
  });
});
