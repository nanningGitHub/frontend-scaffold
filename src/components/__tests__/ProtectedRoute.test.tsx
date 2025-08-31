import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

// Mock stores
const mockUseAuthStore = jest.fn();
jest.mock('../../stores/authStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

const TestComponent = () => <div>受保护的内容</div>;
const LoginComponent = () => <div>登录页面</div>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={component} />
        <Route path="/login" element={<LoginComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    mockUseAuthStore.mockClear();
  });

  it('renders children when user is authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('受保护的内容')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // 应该重定向到登录页面
    expect(screen.getByText('登录页面')).toBeInTheDocument();
  });

  it('shows loading state when loading', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // 应该显示加载状态
    expect(screen.getByText('页面加载中...')).toBeInTheDocument();
  });

  it('renders with proper authentication check', () => {
    mockUseAuthStore.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('受保护的内容')).toBeInTheDocument();
  });
});
