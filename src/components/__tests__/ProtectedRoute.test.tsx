import React from 'react';
import { screen, render } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { mockAuthStore } from '../../__tests__/mocks/stores';

// Mock stores
jest.mock('../../stores/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => (
    <div data-testid="navigate" data-to={to}>
      Redirecting to {to}
    </div>
  ),
  useLocation: () => ({ pathname: '/protected' }),
}));

const TestComponent = () => <div>受保护的内容</div>;

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();
    // 重置 mock 状态
    Object.assign(mockAuthStore, {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  });

  it('renders children when user is authenticated', () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.loading = false;

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('受保护的内容')).toBeInTheDocument();
  });

  it('shows loading state when loading', () => {
    mockAuthStore.isAuthenticated = false;
    mockAuthStore.loading = true;

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // 应该显示加载状态
    expect(screen.getByText('页面加载中...')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockAuthStore.isAuthenticated = false;
    mockAuthStore.loading = false;

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // 应该显示重定向组件
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  it('renders with proper authentication check', () => {
    mockAuthStore.isAuthenticated = true;
    mockAuthStore.loading = false;

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('受保护的内容')).toBeInTheDocument();
  });
});
