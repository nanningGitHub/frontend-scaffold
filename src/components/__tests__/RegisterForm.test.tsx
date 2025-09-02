import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from '../RegisterForm';
import { useAuth } from '../../hooks/useAuth';

// Mock the useAuth hook
jest.mock('../../hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('RegisterForm', () => {
  const mockRegister = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form fields', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });

  it('validates password confirmation', async () => {
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'different123');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('validates password strength', async () => {
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, '123');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    expect(
      screen.getByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  it('calls register function with form data on valid submission', async () => {
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows loading state during registration', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
      loading: true,
      error: null,
    });

    render(<RegisterForm />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/registering/i)).toBeInTheDocument();
  });

  it('displays error message from auth context', () => {
    const errorMessage = 'Registration failed';
    mockUseAuth.mockReturnValue({
      user: null,
      login: jest.fn(),
      register: mockRegister,
      logout: jest.fn(),
      loading: false,
      error: errorMessage,
    });

    render(<RegisterForm />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('has link to login page', () => {
    render(<RegisterForm />);

    const loginLink = screen.getByText(/already have an account/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('clears form after successful registration', async () => {
    mockRegister.mockResolvedValueOnce({ success: true });

    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(usernameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(confirmPasswordInput).toHaveValue('');
    });
  });
});
