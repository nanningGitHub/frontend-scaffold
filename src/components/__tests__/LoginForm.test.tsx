import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';

// Mock stores
const mockUseAuthStore = jest.fn();
jest.mock('../../stores/authStore', () => ({
  useAuthStore: () => mockUseAuthStore(),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginForm Component', () => {
  beforeEach(() => {
    mockUseAuthStore.mockClear();
    mockUseAuthStore.mockReturnValue({
      login: jest.fn(),
      error: null,
      clearError: jest.fn(),
    });
  });

  it('renders login form', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByText('用户登录')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByLabelText('邮箱地址')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入邮箱地址')).toBeInTheDocument();
  });

  it('renders password input field', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入密码')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  it('renders register link', () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByText('还没有账号？')).toBeInTheDocument();
    expect(screen.getByText('立即注册')).toBeInTheDocument();
  });

  it('handles form input changes', () => {
    renderWithRouter(<LoginForm />);

    const emailInput = screen.getByLabelText('邮箱地址');
    const passwordInput = screen.getByLabelText('密码');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows validation errors for empty fields', async () => {
    renderWithRouter(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: '登录' });
    fireEvent.click(submitButton);

    // 等待验证错误显示
    await waitFor(() => {
      // 检查输入框是否变为红色边框（表示验证失败）
      const emailInput = screen.getByLabelText('邮箱地址');
      const passwordInput = screen.getByLabelText('密码');
      expect(emailInput).toHaveClass('border-red-500');
      expect(passwordInput).toHaveClass('border-red-500');
    });
  });

  it('shows error message when login fails', () => {
    mockUseAuthStore.mockReturnValue({
      login: jest.fn(),
      error: '登录失败，请检查邮箱和密码',
      clearError: jest.fn(),
    });

    renderWithRouter(<LoginForm />);
    expect(screen.getByText('登录失败，请检查邮箱和密码')).toBeInTheDocument();
  });

  it('renders with proper form structure', () => {
    renderWithRouter(<LoginForm />);

    const emailInput = screen.getByLabelText('邮箱地址');
    const passwordInput = screen.getByLabelText('密码');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
